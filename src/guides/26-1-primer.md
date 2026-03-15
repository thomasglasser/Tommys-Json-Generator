---
title: 1.21.1 -> 26.1 Mod Migration Primer
versions:
    - 26.1
tags:
    - porting
---

This is a high level, non-exhaustive overview on how to migrate your mod from 1.21.1 directly to 26.1. This primer consolidates all changes across the 1.21.x cycle and the jump to 26.1, intentionally omitting intermediate features that were subsequently overwritten or removed by Mojang. This does not look at any specific mod loader, just the changes to the vanilla classes. All provided names use the official mojang mappings.

This primer is licensed under the [Creative Commons Attribution 4.0 International](http://creativecommons.org/licenses/by/4.0/), so feel free to use it as a reference and leave a link so that other readers can consume the primer.

Based on the NeoForge primers found [here](https://github.com/neoforged/.github/tree/main/primers).

This was compiled by Gemini so information may be missing or inaccurate,
but it is correct to the best of my knowledge.

## Java 25 and Deobfuscation

26.1 upgrades the Java Development Kit from 21 to 25. Vanilla makes use of these new features, such as [JEP 447](https://openjdk.org/jeps/447), which allows statements before `super` within constructors. You must update your toolchains and IDEs accordingly (e.g., Eclipse 2025-09+ with Java 25 Support, or IntelliJ IDEA 2025.2+). 

Vanilla has also returned to being deobfuscated. All value types now have the official names provided by Mojang. This mostly affects users or mod loaders who used different value type mapping sets previously.

## The Rename Shuffle (ResourceLocation is Dead)

Many core classes and packages have been heavily shuffled or renamed. The most critical change for any 1.21.1 modder: **`ResourceLocation` has been renamed to `Identifier` universally.**

* `ResourceLocation` -> `Identifier`
* `ResourceLocationException` -> `IdentifierException`
* `ResourceLocationPattern` -> `IdentifierPattern`
* `net.minecraft.advancements.critereon` -> `net.minecraft.advancements.criterion`
* Most utility classes (e.g., `Util`, `BlockUtil`, `FileUtil`) moved to `net.minecraft.util.*`.
* Entity models and entities have been heavily sub-packaged. (e.g., `net.minecraft.world.entity.animal.feline.Cat`, `net.minecraft.client.model.monster.zombie.ZombieModel`). You will need to re-import almost every entity and model class.

## Items, Equipments, and Data Components

The way items are defined, behave, and are rendered has been entirely stripped of legacy OOP class hierarchies in favor of Data Components. Classes like `SwordItem`, `DiggerItem`, `ArmorItem`, `AnimalArmorItem`, `ShieldItem`, and `ElytraItem` have been **completely removed**. 

### Item Instances and Stack Templates
`ItemStack`s now have an immutable counterpart known as an `ItemStackTemplate`. It contains the holder-wrapped `Item`, the count, and a `DataComponentPatch`. 
* Templates are used where immutability is required (advancements, recipes).
* `ItemStackTemplate#create()` turns a template into a mutable `ItemStack`.
* `ItemStackTemplate.fromNonEmptyStack(stack)` creates a template from a stack.
* Both `ItemStack` and `ItemStackTemplate` implement the `ItemInstance` interface, which provides access to `typeHolder()`, `count()`, and `get(DataComponentType)`.

### Weapons, Tools, and Armor
Instead of extending specific classes, use `Item$Properties` and apply the relevant components:
* **`TOOL`:** Defines mining behavior. (Replaces `DiggerItem` / `TieredItem`).
* **`WEAPON`:** Defines durability loss on attack and shield disable duration. (Replaces `SwordItem`).
* **`ARMOR`:** Defines protection. (Replaces `ArmorItem`).
* **`EQUIPPABLE`:** Defines the `EquipmentSlot`, equip sound, model asset, and allowed entities. 
* **`BLOCKS_ATTACKS`:** Defines shield blocking behavior, reduction stats, and bypass tags. (Replaces `ShieldItem`).
* **`GLIDER`:** Acts as the Elytra flag (must be paired with `EQUIPPABLE`).
* **`DYE`:** Specifies the `DyeColor` material for coloring. (Replaces `DyeItem`).

*Note: `Item$Properties` contains helper methods like `.tool()`, `.sword()`, `.pickaxe()`, and `.humanoidArmor()` to rapidly apply these components.*

### New Combat Components (26.1)
Spears and other advanced combat mechanics introduced new components:
* **`ATTACK_RANGE`:** Overrides the default entity interaction range (supports custom creative mode ranges).
* **`MINIMUM_ATTACK_CHARGE`:** A float percentage determining the delay before another attack can be made.
* **`SWING_ANIMATION`:** Defines animation (`NONE`, `WHACK`, `STAB`) and duration.
* **`DAMAGE_TYPE`:** Holds the holder-wrapped `DamageType` applied on hit.
* **`PIERCING_WEAPON`:** Replaces standard swinging with a lunging/stabbing attack that cannot break blocks.
* **`KINETIC_WEAPON`:** A weapon that relies on forward momentum and relative traveling speed to deal damage and knockback.
* **`USE_EFFECTS`:** Defines effects while using the item (e.g., whether the player can sprint, vibration emission, horizontal movement scalar).

### Consumables (Food/Potions)
The `FoodProperties` class is gone. Consumption logic is now consolidated in the `CONSUMABLE` data component.
* A `Consumable` defines consume time, animation, sound, particles, and a list of `ConsumeEffect`s.
* `ConsumeEffect` handles post-consumption logic (e.g., `ApplyStatusEffectsConsumeEffect`, `TeleportRandomlyConsumeEffect`).
* `USE_REMAINDER` component replaces the old container item logic.
* `USE_COOLDOWN` applies cooldowns across defined item groups.

### Data Component Initializers
Data components attached to registry objects (like `Item`s) are now lazily initialized during resource reloads to safely reference tags and other datapack-driven objects.
* Use `Item.Properties().delayedComponent(type, context -> value)` or `delayedHolderComponent(type, key)` to attach data that requires the `HolderLookup.Provider`.

## The NBT Serialization Rewrite (ValueInput / ValueOutput)

Direct access to `CompoundTag`s for serialization/deserialization has been removed from high-level objects (Entities, BlockEntities, etc.). You can no longer modify the `CompoundTag` directly during the save/load pipeline.

Instead, objects now receive `ValueInput` and `ValueOutput` interfaces.
* **Read:** `readAdditionalSaveData(ValueInput in)` / `loadAdditional(ValueInput in)`.
    * Use `in.getIntOr("key", default)`, `in.read("key", CODEC)`.
* **Write:** `addAdditionalSaveData(ValueOutput out)` / `saveAdditional(ValueOutput out)`.
    * Use `out.putInt("key", value)`, `out.storeNullable("key", CODEC, object)`.

### Problem Reporter
When creating inputs/outputs, a `ProblemReporter` is used to collect serialization issues without immediately crashing (depending on context). 
* `ProblemReporter.Collector` is used in data providers.
* `ProblemReporter.ScopedCollector` is used for disk-based objects (Entities, Chunks).

## The Holder Set Transition

Raw registry objects and `TagKey` references have heavily migrated to `HolderSet`s. A `HolderSet` is a dynamically updating list of registry object references.
* **Direct HolderSets:** Created via `HolderSet.direct(...)`. Functions as an in-line list of values. 
* **Named HolderSets:** Obtained via `HolderGetter#getOrThrow(TagKey)`. This is the object representation of a tag.
* *Migration Note:* `Ingredient.of()` now requires a `HolderSet` rather than a `TagKey` directly.

## Registries and Validation

### Loot Type Unrolling
`LootItemFunctionType`, `LootItemConditionType`, `LootPoolEntryType`, and various `ProviderType` wrappers have been removed. Registries now directly accept the `MapCodec` for the object.
* Replace `getType()` with `codec()`, returning your registered `MapCodec`.

### Validation Overhaul
Datapack-driven content validation has moved from disparate validators to the `Validatable` interface (or `CriterionTriggerInstance` for advancements).
* Implement `validate(ValidationContext ctx)`.
* Use `ctx.reportProblem(() -> "Error message")` if validation fails.
* For nested objects, use `ctx.forField("fieldName")` or `ctx.forIndexedField("list", index)` to maintain an accurate stack trace in the error report.

### Tag Providers (Appender Rewrite)
`TagsProvider` no longer provides easy `addTag` methods natively.
* Use `KeyTagProvider` for appending elements via their `ResourceKey` (provides the `tag(TagKey)` method).
* Use `IntrinsicHolderTagsProvider` for built-in registry objects.
* **Block/Item tag copying:** Use `BlockItemTagsProvider`, which takes both the Block Tag and Item Tag and populates both simultaneously.

## Interaction Results and Block Entities

### InteractionResult
`InteractionResultHolder` and `ItemInteractionResult` have been merged into a single `InteractionResult` interface.
* Do not instantiate implementations directly. Use constants: `SUCCESS`, `SUCCESS_SERVER`, `CONSUME`, `FAIL`, `PASS`, `TRY_WITH_EMPTY_HAND`.
* For transforming items, append `.heldItemTransformedTo(stack)` or `.withoutItem()` to a success constant.
* `Entity#interactAt` has been removed. All logic is merged into `Entity#interact(Player, InteractionHand, Vec3 location)`.

### Block Entity Removal
Block entity removal logic is now strictly separated to avoid mutable state bugs.
* `BlockEntity#preRemoveSideEffects`: Handle dropping inventory/items here *before* the block entity is removed from the level.
* `BlockBehaviour#affectNeighborsAfterRemoval` (formerly `onRemove`): Only handle updating surrounding neighbor block states here. Do *not* drop items here.

## The Rendering Pipeline Rework (Abstracting OpenGL)

Direct OpenGL calls have been aggressively abstracted. Almost all calls to the underlying render system now go through `GpuDevice` (obtained via `RenderSystem.getDevice()`).

* **`GpuDevice`:** Creates buffers and textures (`createBuffer`, `createTexture`).
* **`CommandEncoder`:** Creates render passes, clears/writes to textures, and presents to the screen.
* **`GpuTexture` and `GpuSampler`:** Textures are no longer raw integers. They are `GpuTexture`s that must be managed and closed when no longer needed. Sampling is handled by `GpuSampler`, defining address modes (clamp/repeat) and filters (linear/nearest).
* **`RenderPass`:** You must create a `RenderPass` to draw. A pass binds the pipeline, vertex/index buffers, samplers, and uniforms, then executes the draw call.

### RenderPipelines and RenderSetups
Shader JSONs are completely gone. Pipelines are now defined in-code via `RenderPipeline.builder()`.
* A `RenderPipeline` dictates the shaders, vertex format, depth/stencil state, color target state, and uniforms.
* `RenderSetup` configures the pipeline for drawing to a texture (handling textures, lightmaps, overlays, and layering transforms).
* `RenderType` is now simply a named `RenderSetup`. 

## GUI and Screen Overhaul

The GUI system has been split into a two-phase architecture: **Prepare** and **Render**.

1.  **Prepare Phase (`extract*`):** Standard render methods (like `renderBg`) no longer draw to the screen immediately. Instead, they extract their data into a `GuiRenderState` using `submit*` or `add*` methods.
2.  **Render Phase:** The `GuiRenderer` takes the `GuiRenderState`, sorts the elements (using strata, Z-trees, and comparators based on scissor rectangles and pipelines), and renders them back-to-front.

### `GuiGraphics` is now `GuiGraphicsExtractor`
Because elements are extracted rather than drawn immediately, `GuiGraphics` was renamed to `GuiGraphicsExtractor`.
* Methods lost their `draw*` and `render*` prefixes.
* `drawString` -> `text`
* `renderItem` -> `item`
* `fill` / `blit` methods submit `ColoredRectangleRenderState` or `BlitRenderState` to the layer tree.

### Input Handling Consolidation
Raw GLFW values (scancodes, key codes, modifiers) are no longer passed around like hot potatoes. Input handling now uses dedicated event objects.
* **`KeyEvent`:** Contains key, scancode, and modifiers. Replaces parameters in `keyPressed` / `keyReleased`.
* **`MouseButtonEvent`:** Contains the button, modifiers, and XY screen position. Replaces parameters in `mouseClicked`, `mouseReleased`, `mouseDragged`.
* **`CharacterEvent`:** Contains the codepoint and active modifiers.
* All implement `InputWithModifiers`, allowing easy checks like `.hasShiftDown()`.

### Dialogs and Picture-in-Picture
* **Dialogs:** Vanilla now features a generic, JSON-driven dialog system (`DialogBody`, `InputControl`, `Action`) for popups, confirmations, and user input.
* **Picture-in-Picture (PiP):** Allows rendering arbitrary 3D elements (entities, blocks) to a `GpuTexture`, which is then submitted as a 2D GUI blit. Handled via `PictureInPictureRenderer` and `PictureInPictureRenderState`.

## Entity Render States & Feature Submission

Entities and Block Entities no longer render directly in the world context. They use a strict extraction and submission pipeline.

### The Extraction Phase
Renderers (`EntityRenderer`, `BlockEntityRenderer`) must define a `RenderState` (e.g., `LivingEntityRenderState`, `BlockEntityRenderState`). 
* **`extractRenderState`:** Reads data from the live `Entity`/`BlockEntity` and populates the `RenderState`. This is the *only* time you should touch the live game object during rendering.

### The Submission Phase
Instead of taking a `MultiBufferSource`, the `submit` (formerly `render`) method takes the populated `RenderState` and a `SubmitNodeCollector`.
* You call `collector.submitModel()`, `collector.submitBlock()`, `collector.submitHitbox()`, etc.
* `FeatureRenderDispatcher` handles actually drawing everything submitted to the collector, sorting translucent models by distance.

### Entity Model Visibility
`setAllVisible` and boolean toggles for armor/clothing layers are gone.
* Every model part (helmet, chestplate, inner armor) is a separate model.
* Use `PartDefinition#retainExactParts` to strip away cubes from the base mesh that don't belong to the specific layer you are rendering.

## The Model Rework (`BakedModel` is Dead)

The unifying `BakedModel` interface has been eradicated. Models are now explicitly separated into Block, Item, and Fluid representations.

* **`BlockStateModel`:** Replaces the block-side of `BakedModel`. Renders block states in the world. (Internal geometry is now handled by `CuboidModel`).
* **`ItemModel`:** Handles item rendering. It is not a list of quads; it is a class that updates the `ItemStackRenderState`, which then submits the necessary quads or special renderers to the collector.
* **`FluidModel`:** Defines the still/flowing materials and tint source for a fluid. Baked via `FluidStateModelSet`.

### Special Renderers
Block Entities that render as items (Chests, Beds, Banners, Skulls) no longer use `BlockEntityWithoutLevelRenderer`. They use `SpecialModelRenderer`.
* You define an `Unbaked` special model in the item's JSON, which bakes into a renderer that hooks directly into the `SubmitNodeCollector`.

### QuadInstance & Tints
* `BlockColor` is replaced by `BlockTintSource`, providing context-aware tinting (`color`, `colorInWorld`, `colorAsTerrainParticle`).
* `BakedQuad`s no longer hold raw arrays for color and lighting. This data is wrapped in a `QuadInstance` (or `MaterialInfo`), handling brightness, lightmaps, and overlays.
* Vertex uploading for blocks utilizes `BlockQuadOutput` instead of raw `VertexConsumer` calls.

## Particles

Particles have joined the extraction/submission pipeline.
* `ParticleEngine` handles ticking. `ParticleResources` handles texture loading.
* **`SingleQuadParticle`:** Merges older quad/texture sheet particles. You override `tick()` to change sprites from a `SpriteSet`.
* Particles are managed by a `ParticleGroup`, which extracts a `ParticleGroupRenderState`, submitting it to the `SubmitNodeCollector` for batch rendering.

## The Debugging Overhaul & Gizmos

Vanilla has entirely revamped how debug information is synchronized and rendered. The `F3` menu and debug renderers are now modular and accessible to modders.

### Debug Subscriptions
Data needed for rendering debug overlays on the client must now be explicitly synchronized using `DebugSubscription`s.
* **`DebugSubscription`:** Registered to `BuiltInRegistries.DEBUG_SUBSCRIPTION`. Defines the `StreamCodec` and an optional timeout.
* **`DebugValueSource`:** Attach your subscription to a Chunk, Entity, or BlockEntity using `registerDebugValues(ServerLevel, Registration)`. This automatically polls and sends updates to subscribed clients.
* **`DebugRenderer`:** On the client, you create a `SimpleDebugRenderer` and query the synchronized data via `DebugValueAccess`.

### Debug Screens (F3 Menu)
You can now inject your own lines into the F3 menu by creating a `DebugScreenEntry`.
* Register it to `DebugScreenEntries`.
* Use `display(DebugScreenDisplayer...)` to add lines (`addLine`, `addPriorityLine`, or `addToGroup`).
* Toggle states externally using `Minecraft.getInstance().debugEntries.toggleStatus(key)`.

### Gizmos
Gizmos decouple debug rendering from the main render pipeline. They allow you to submit primitives (lines, points, boxes, text) at almost any point in the client tick.
* Implement `Gizmo` and use `emit(GizmoPrimitives, alpha)` to draw shapes.
* Submit via `Gizmos.addGizmo(new MyGizmo())` or helpers like `Gizmos.cuboid()`.
* `GizmoProperties` allow you to persist a drawing for a set number of milliseconds or fade it out, eliminating the need to manually track debug render lifetimes.

## Timelines, Clocks, and Environment Attributes

Hardcoded environmental logic (sky color, fog, day/night cycle, villager schedules) has been replaced by a datapack-driven Timeline system.

* **`WorldClock`:** A ticking timer (e.g., `minecraft:overworld`). Server-side managers can pause, skip, or add ticks to clocks.
* **`EnvironmentAttribute`:** A specific property (e.g., `visual/cloud_height`, `visual/sky_color`). They have default values that can be modified by the Dimension, the Biome, or a Timeline.
* **`Timeline`:** A datapack file that maps keyframes to an `EnvironmentAttribute`. It uses easing functions (e.g., `linear`, `in_out_bounce`) to interpolate arguments over a `period_ticks` (like 24000 for a day).

*Migration Note:* Methods like `Level#getDayTime` or `Level#isDay` are heavily deprecated or removed. You must query the `ClockManager` or the `EnvironmentAttributeSystem` instead.

## The Permission Overhaul

Integer-based OP levels (1-4) are gone. They are replaced by a robust `Permission`, `PermissionSet`, and `PermissionCheck` system.

* **`Permission`:** A registered map codec that defines a state (e.g., `Permissions.COMMANDS_MODERATOR`).
* **`PermissionSet`:** What the user actually has. You query `permissionSet.hasPermission(permission)`.
* **`PermissionCheck`:** Used in commands. Instead of `.requires(source -> source.hasPermission(2))`, you now use `.requires(Commands.hasPermission(PermissionCheck.Require(COMMANDS_MODERATOR)))`.

## Datapack Villager Trades

Villager trades are no longer hardcoded maps of `ItemListing`s. They are fully data-driven via datapacks.

* **`VillagerTrade`:** Defines what a villager `wants`, `additional_wants`, and `gives`. It also supports `merchant_predicate` (e.g., only desert villagers) and `given_item_modifiers` (Loot Item Functions applied to the result, like enchanting a book).
* **`TradeSet`:** Defines a pool of `VillagerTrade`s, the `amount` of offers to generate, and whether it allows duplicates.
* **`VillagerProfession`:** Now maps an integer level directly to a `TradeSet` registry key.

## Game Test Overhaul

Game Tests have been stripped of their annotation-driven (`@GameTest`) magic and moved to a registry-driven system.

* **`TestEnvironmentDefinition`:** Functions like `BeforeBatch` / `AfterBatch`. It sets up the `ServerLevel` (e.g., locking time, changing weather, setting game rules) and tears it down afterward.
* **`TestData`:** Replaces the parameters of the old `@GameTest` annotation (structure location, max ticks, rotation, setup ticks).
* **`GameTestInstance`:** The actual test runner. You register a `MapCodec` for your instance to `TEST_INSTANCE_TYPE`.

## JSON-RPC Management Servers

Minecraft 26.1 includes native support for remote management of dedicated servers via a JSON-RPC websocket (default port 25585).
* **`IncomingRpcMethod` / `OutgoingRpcMethod`:** Registry objects that handle requests to and from the server.
* **`Schema`:** JSON schemas that strictly define the payloads and responses.
* Exposes internal APIs (`MinecraftApi`) for whitelist, banlist, game rules, and server state management.

## File Fixer Upper

Before DataFixers touch NBT, the `FileFixerUpper` handles upgrading the physical file structure of world folders.
* Uses a **Copy-on-Write File System** (`CopyOnWriteFileStore`).
* Performs structural changes: moving files, renaming directories, or regex-based migrations (`FileFixOperation`). 
* Cannot be downgraded. If a world is migrated via FileFixer, it permanently adopts the new folder structure.

## Miscellaneous Architectural Changes

* **Waypoints:** Entities can act as a `WaypointTransmitter`. The `WaypointManager` syncs these locations to clients, rendering scaling HUD elements (e.g., locator bars) using `WaypointStyle` JSONs.
* **Slot Sources:** Loot tables can now pull items directly from container slots or entities using the `slot_source` configuration (e.g., pulling directly from a tagged slot).
* **Audio Device Tracker:** Replaces hardcoded audio polling. Uses system callbacks to detect when an audio device is changed/disconnected and dynamically re-routes audio.
* **IME Support (Input Message Editor):** `GuiEventListener` now supports `preeditUpdated` for complex characters (Chinese, Hindi), rendering temporary OS-level pre-edit text overlays natively in the game UI.

## Specific Logic Changes

* **Game Rules:**
    * Rules no longer have the `RULE_` prefix.
    * Rules now have underscores separating words.
    * The `DO` prefix is removed from rule names (e.g. `RULE_DOENTITYDROPS` -> `ENTITY_DROPS`).
    * The `SPAWNING` suffix has been replaced with the `SPAWN_` prefix.
    * The `DISABLE` prefix is removed, meaning values are inverted.
    * Get values via `GameRules#get` instead of `getBoolean`/`getInteger`.
* **Picture-In-Picture:** Submission calls now take in `0xF000F0` instead of `0x000000` for light coordinates.
* **RegistryDataCollector:** `collectGameRegistries` boolean parameter now handles only updating components from synchronized registries along with tags.
* **Vignette:** `RenderPipelines#VIGNETTE` now blends the alpha with a source of zero and a destination of one.
* **Pack Resources:** `PathPackResources#getResource`, `listPath`, `listResources` resolves the path using the identifier's namespace first.
* **Entity Selectors:** `EntitySelector#CAN_BE_PICKED` can now find entities in spectator mode (assuming `isPickable` is true).
* **Sensors:** `NearestVisibleLivingEntitySensor#requires` is no longer implemented by default.
* **WorldOptions:** `generate_features` field in JSON has been renamed to `generate_structures`.
* **Block Predicates:** `BlockPredicate#ONLY_IN_AIR_PREDICATE` now matches the air tag instead of just the air block.
* **Render States:** `EntityRenderState#lightCoords` now defaults to `0xF000F0`.
* **Container Screens:** `AbstractContainerScreen#keyPressed` no longer returns `true` if the key is not handled by the screen, instead returning `false`.
* **Math:** `Mth#clampedLerp` parameters reordered to (step, original, next).

## New Data Components
* `dye`: Sets the item as a dye material.
* `additional_trade_cost`: A modifier that offsets the trade cost.
* `pig/sound_variant`, `cow/sound_variant`, `chicken/sound_variant`, `cat/sound_variant`, `wolf_sound_variant`: Sounds specific entities should make.
* `zombie_nautilus_variant`, `chicken_variant`, `cow_variant`: Holder-wrapped variants for specific entities.
* `use_effects`, `minimum_attack_charge`, `damage_type`, `piercing_weapon`, `kinetic_weapon`, `swing_animation`, `attack_range`: Combat and weapon usage components.

## Environment Attribute Additions
* `visual/block_light_tint`: Tints the color of the light emitted by a block.
* `visual/night_vision_color`: The color when night vision is active.
* `visual/ambient_light_color`: The color of the ambient light in an environment.

## Tag Changes

### Added / Modified Tags
* `minecraft:block`
    * `bats_spawnable_on`, `pale_oak_logs`, `wooden_shelves`, `copper_chests`, `lightning_rods`, `copper`, `copper_golem_statues`, `incorrect_for_copper_tool`, `chains`, `lanterns`, `bars`
    * Plantable tag shifts: `bamboo_plantable_on` -> `supports_bamboo`, `small_dripleaf_placeable` -> `supports_small_dripleaf`, `dry_vegetation_may_place_on` -> `supports_dry_vegetation`, `snow_layer_cannot_survive_on` -> `cannot_support_snow_layer`, `snow_layer_can_survive_on` -> `support_override_snow_layer`.
    * `plays_ambient_desert_block_sounds` split into `triggers_ambient_desert_sand_block_sounds`, `triggers_ambient_desert_dry_vegetation_block_sounds`.
* `minecraft:entity_type`
    * `boat`, `cannot_be_pushed_onto_boats`, `accepts_iron_golem_gift`, `candidate_for_iron_golem_gift`, `burn_in_daylight`, `can_float_while_ridden`, `can_wear_nautilus_armor`, `nautilus_hostiles`, `cannot_be_age_locked`.
* `minecraft:item`
    * `diamond_tool_materials`, `gold_tool_materials`, `iron_tool_materials`, `netherite_tool_materials`, `wooden_tool_materials`, `copper_tool_materials`.
    * `piglin_safe_armor`, `repairs_leather_armor`, `repairs_chain_armor`, `repairs_iron_armor`, `repairs_gold_armor`, `repairs_diamond_armor`, `repairs_netherite_armor`, `repairs_turtle_helmet`, `repairs_wolf_armor`, `repairs_copper_armor`.
    * `map_invisibility_equipment`, `gaze_disguise_equipment`, `shearable_from_copper_golem`.
    * `spears`, `enchantable/lunge`. (`enchantable/sword` -> `enchantable/melee_weapon`, `enchantable/sweeping`).
* `minecraft:timeline`
    * `universal`, `in_overworld`, `in_nether`, `in_end`.

### Removed Tags
* `minecraft:item`: `tall_flowers`, `flowers`, `trim_templates`, `skeleton_preferred_weapons`, `drowned_preferred_weapons`, `piglin_preferred_weapons`, `pillager_preferred_weapons`, `wither_skeleton_disliked_weapons`, `dyeable` (split into specific dye tags).
* `minecraft:cat_variant` (all removed).
* `minecraft:enchantment`: `trades/desert_special`, `trades/jungle_special`, `trades/plains_special`, `trades/savanna_special`, `trades/snow_special`, `trades/swamp_special`, `trades/taiga_special`.
* `minecraft:biome`: `plays_underwater_music`, `has_closer_water_fog`, `increased_fire_burnout`, `snow_golem_melts`, `without_patrol_spawns`.

## Comprehensive Class & Method Additions

* `com.mojang.blaze3d.GraphicsWorkarounds`: Helper for working around issues with specific graphics hardware (`isAmd`, `isGlOnDx12`).
* `com.mojang.blaze3d.opengl`:
    * `GlConst#GL_POINTS`
    * `GlTimerQuery`
    * `DirectStateAccess#copyBufferSubData`
* `com.mojang.blaze3d.platform`:
    * `InputConstants#MOUSE_BUTTON_*`
* `com.mojang.blaze3d.systems`:
    * `CommandEncoder#timerQueryBegin`, `timerQueryEnd`, `copyToBuffer`
    * `GpuQuery`
* `com.mojang.blaze3d.vertex`:
    * `DefaultVertexFormat#POSITION_COLOR_LINE_WIDTH`, `POSITION_COLOR_NORMAL_LINE_WIDTH`
    * `VertexFormat$Mode#POINTS`
    * `VertexFormatElement#LINE_WIDTH`
* `com.mojang.math.OctahedralGroup`: `BLOCK_ROT_*`, `permutation`
* `com.mojang.math.Quadrant`: `fromXYZAngles`
* `net.minecraft.SharedConstants`: `MAX_CLOUD_DISTANCE`, `DEFAULT_RANDOM_TICK_SPEED`, `RESOURCE_PACK_FORMAT_MINOR`, `DATA_PACK_FORMAT_MINOR`.
* `net.minecraft.advancements.criterion`: `FoodPredicate`, `SpearMobsTrigger`.
* `net.minecraft.client.Minecraft`: `sendLowDiskSpaceWarning`, `isOfflineDevelopedMode`, `canSwitchGameMode`, `playerSkinRenderCache`, `canInterruptScreen`, `packetProcessor`.
* `net.minecraft.client.Options`: `keyDebugLightmapTexture`, `invertMouseX`, `toggleAttack`, `toggleUse`, `sprintWindow`, `saveChatDrafts`, `keySpectatorHotbar`, `keyToggleGui`, `keyToggleSpectatorShaderEffects`, `weatherRadius`, `cutoutLeaves`, `vignette`, `improvedTransparency`, `chunkSectionFadeInTime`, `maxAnisotropyBit`, `maxAnisotropyValue`.
* `net.minecraft.client.gui.ActiveTextCollector`: Helper for rendering text with certain parameters and alignments.
* `net.minecraft.client.gui.components`:
    * `ScrollableLayout#setMinHeight`, `$ReserveStrategy`.
    * `Tooltip#component`, `style`.
    * `Checkbox#adjustWidth`.
    * `EditBox#setInvertHighlightedTextColor`.
    * `StringWidget#setMaxWidth`, `$TextOverflow`.
    * `OptionsList#addHeader`, `resetOption`.
    * `ResettableOptionWidget`
* `net.minecraft.client.gui.components.debug`: `DebugEntryDetailedMemory`, `DebugEntryLookingAtEntityTags`.
* `net.minecraft.client.gui.screens`: `ChatScreen#isDraft`, `exitReason`, `shouldDiscardDraft`. `LevelLoadingScreen#update`. `Screen#panoramaShouldSpin`, `setNarrationSuppressTime`, `isInGameUi`, `isAllowedInPortal`, `canInterruptWithAnotherScreen`. `WorldOptionsScreen`. `ManageServerScreen` (replaces EditServerScreen).
* `net.minecraft.client.renderer`:
    * `LightmapRenderStateExtractor`, `UiLightmap`.
    * `RenderPipelines#LINES_DEPTH_BIAS`, `ENTITY_CUTOUT_DISSOLVE`, `GUI_INVERT`.
    * `TrackingItemRenderState` (tracks model sources used to render an item stack).
* `net.minecraft.core.registries.ConcurrentHolderGetter`: A getter that reads references from a local cache.
* `net.minecraft.data.BlockFamilies`: `END_STONE`.
* `net.minecraft.data.DataGenerator$Uncached`
* `net.minecraft.network.FriendlyByteBuf`: `readLpVec3`, `writeLpVec3`.
* `net.minecraft.network.LpVec3`: A vec3 network handler compressing a vector into at most two bytes and two integers.
* `net.minecraft.server.MinecraftServer`: `DEFAULT_GAME_RULES`, `warnOnLowDiskSpace`, `selectLevelLoadFocusPos`, `getLevelLoadListener`, `getCodeOfConducts`, `enforceGameTypeForPlayers`.
* `net.minecraft.util`:
    * `ARGB`: `srgbToLinearChannel`, `linearToSrgbChannel`, `meanLinear`, `addRgb`, `subtractRgb`, `multiplyAlpha`, `linearLerp`, `white`, `black`, `alphaBlend`, `vector4fFromARGB32`, `gray`.
    * `CompilableString`: Utility for compiling string patterns to objects.
    * `LightCoordsUtil`: Utility for determining light coordinates.
    * `ProblemReporter$MapEntryPathElement`.
* `net.minecraft.world.InteractionHand#STREAM_CODEC`
* `net.minecraft.world.entity`:
    * `Avatar`: Abstract base for players/mannequins.
    * `Entity`: `getHeadLookAngle`, `updateDataBeforeSync`, `computeSpeed`, `getKnownSpeed`, `hasMovedHorizontallyRecently`, `MAX_MOVEMENTS_HANDELED_PER_TICK`, `isInClouds`, `teleportSpectators`, `isFlyingVehicle`, `clearMovementThisTick`.
    * `LivingEntity`: `DEFAULT_KNOCKBACK`, `itemSwapTicker`, `recentKineticEnemies`, `postPiercingAttack`, `causeExtraKnockback`, `wasRecentlyStabbed`, `rememberStabbedEntity`, `stabAttack`, `onAttack`, `getTicksUsingItem`, `getTicksSinceLastKineticHitFeedback`, `shouldTravelInFluid`, `travelInWater`.
* `net.minecraft.world.item`:
    * `ItemInstance`: Typed item instance querying item, size, and components (implemented by `ItemStack` and `ItemStackTemplate`).
    * `ItemStackTemplate`: Immutable representation of an item stack.
* `net.minecraft.world.level.block`: `DriedGhastBlock`, `CopperChestBlock`, `CopperGolemStatueBlock`, `ShelfBlock`, `SideChainPartBlock`, `WeatheringCopperBarsBlock`, `WeatheringCopperChainBlock`, `WeatheringLightningRodBlock`, `WeatheringLanternBlock`.

## Comprehensive Class & Method Changes

* **BlockState / BlockBehaviour:**
    * `$BlockStateBase` now takes an array of `Property`s and `Comparable` values instead of a single value map.
    * `getLightBlock` -> `getLightDampening`
    * `shouldChangedStateKeepBlockEntity` added.
* **Cameras & Math:**
    * JOML Backing Interfaces: All math classes now pass around `*c` interfaces (e.g., `Vector3fc`, `Matrix4fc`, `Quaternionfc`) instead of the mutable implementations.
    * `Camera#setup` -> `update` (now takes `Level` instead of `BlockGetter`).
    * `Camera#getPartialTickTime` is removed.
* **Entities:**
    * `Entity#interactAt` removed; `Entity#interact` now takes a `Vec3` location.
    * `EntityReference` handles UUID vs live entity validation safely.
    * `Player` now extends `Avatar` instead of `LivingEntity`.
    * `Projectile` constructor is now protected. `deflect` takes `EntityReference`.
* **GUI / Rendering:**
    * `GuiGraphics` -> `GuiGraphicsExtractor`. Methods `draw*`/`render*` changed to `extract*` or `text*`.
    * `AbstractContainerScreen` now optionally takes background image width/height. `render` override automatically calls `renderTooltip`.
    * `AbstractWidget#renderWidget` -> `extractWidgetRenderState`.
    * `RenderPipelines` strictly split block and terrain pipelines (e.g. `SOLID_BLOCK` vs `SOLID_TERRAIN`).
    * `ItemBlockRenderTypes` is completely removed. Layer assignment is dynamically derived from `Material` transparency.
* **Networking:**
    * `FriendlyByteBuf#readVec3`, `writeVec3` replaced by `Vec3#STREAM_CODEC`.
    * `ClientPacketListener#getId` removed.
    * `ClientboundSetTimePacket` takes a map of clocks to network states instead of day time.
* **Tags & Data Providers:**
    * `TagsProvider#tag` removed. Replaced by `KeyTagProvider` and `IntrinsicHolderTagsProvider`.
    * `RecipeSerializer` is now a record containing `MapCodec` and `StreamCodec`. Subclasses removed.
    * `DataGenerator` is abstract. Constructor simplified.

## Comprehensive Class & Method Removals

* `com.mojang.blaze3d.opengl.GlStateManager`: `_glUniform1`, `_glUniform2`, `_glUniform3`, `_glUniform4`, `_glUniformMatrix4`, `glActiveTexture`, `_getActiveTexture`.
* `com.mojang.blaze3d.systems.RenderSystem`: `getQuadVertexBuffer`, `setModelOffset`, `resetModelOffset`, `getModelOffset`.
* `com.mojang.blaze3d.vertex.VertexFormat$Mode`: `LINE_STRIP`.
* `net.minecraft.client.Minecraft`: `useFancyGraphics`, `delayCrashRaw`.
* `net.minecraft.client.gui.Font`: `wordWrapHeight`.
* `net.minecraft.client.gui.components`: `StateSwitchingButton`. `AbstractSelectionList#headerHeight`, `setSelectedIndex`, `renderHeader`, `ensureVisible`, `remove`. `StringWidget#alignLeft`, `alignCenter`, `alignRight`.
* `net.minecraft.client.renderer.RenderPipelines`: `DEBUG_STRUCTURE_QUADS`, `DEBUG_SECTION_QUADS`.
* `net.minecraft.client.renderer.rendertype.RenderTypes`: `weather`.
* `net.minecraft.client.resources.SkinManager`: `getInsecureSkin`.
* `net.minecraft.client.resources.model.BlockModelRotation`: `actualRotation`.
* `net.minecraft.gametest.framework.GameTestHelper`: `setNight`, `setDayTime`.
* `net.minecraft.nbt.NbtUtils`: `addCurrentDataVersion`, `prettyPrint`.
* `net.minecraft.server.players.PlayerList`: `getSingleplayerData`.
* `net.minecraft.world.entity.ai.memory.MemoryModuleType`: `INTERACTABLE_DOORS`.
* `net.minecraft.world.item`: `Item#getName()`. `ItemStack#isFramed`, `getFrame`, `setEntityRepresentation`, `getEntityRepresentation`.
* `net.minecraft.world.item.component`: `BundleContents#getItemUnsafe`, `hasSelectedItem`.
* `net.minecraft.world.level.Level`: `disconnect()`.
* `net.minecraft.world.level.border.WorldBorder$Settings`: `toWorldBorder` (use `WorldBorder` constructor instead).
* `net.minecraft.world.level.chunk.storage`: `ChunkStorage`, `RecreatingChunkStorage`.
* `net.minecraft.world.level.levelgen.feature`: `Feature#isStone`, `isDirt`, `isGrassOrDirt`.