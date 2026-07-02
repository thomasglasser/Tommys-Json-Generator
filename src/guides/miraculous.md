---
title: Creating a Miraculous
versions:
    - 1.21
tags:
    - mineraculous
---

This guide walks you through creating a complete custom Miraculous in **Mineraculous**, from configuring abilities and customization settings to setting up 3D models, kwamis, and data maps.

You can create and configure your Miraculous using the [Miraculous Generator](https://beta-jsons.thomasglasser.dev/mineraculous/miraculous/).

---

## Creating the Miraculous File

Miraculouses are core items that players wear to transform, gain buffs, and activate special powers. When creating a miraculous in the generator, you will configure several key systems:

### Core Properties & Tool
- **Color**: Set your miraculous's theme color using either an RGB hex code or a built-in text color.
- **Acceptable Slot**: The Curios slot ID where the miraculous can be equipped (e.g., `necklace`, `ring`, `bracelet`).
- **Tool**: Configure the weapon or tool granted upon transforming (e.g., cane, yo-yo, staff). You can specify a single item and an optional tool slot.

### Inline Abilities
- **Active Ability**: Configure the primary activated power (`active_ability`). Each ability instance includes a unique `id`, trigger `conditions`, branching logic (`branches`), executed `actions` (like status effects, damage, or teleportation), and sound/timer settings.
- **Passive Abilities**: Optionally add a list of passive ability instances (`passive_abilities`) that run continuously while transformed.

### Customization Settings
The `customization_settings` block allows you to define default parameters and sounds for your miraculous:
- **Name**: Default display name (`mineraculous:name`).
- **Transformation Frames**: Duration of animation frames (`mineraculous:transformation_frames`).
- **Audio**: Custom sound events for transforming (`mineraculous:transform_sound`), detransforming (`mineraculous:detransform_sound`), timer warnings (`mineraculous:timer_warning_sound`), and timer expiration (`mineraculous:timer_end_sound`).

Once completed, save your file to your data pack at:
`data/<namespace>/mineraculous/miraculous/<id>.json`

---

## Enhancing with Data Maps

Mineraculous uses **Data Maps** to link extra gameplay mechanics to your miraculous without cluttering the main definition file. You can generate these using the **Data Maps** generators on the site.

### Lucky Charms Data Map
To assist players in defeating an opponent using your miraculous, you should configure Lucky Charm drops using **Data Maps**.
- Generator: [Miraculous Lucky Charms Data Map](https://beta-jsons.thomasglasser.dev/mineraculous/data-map-miraculous-lucky-charms/)
- **Items vs. Loot Table**: You can map your miraculous directly to a **List of Items** (no need to make a separate loot table file!) or point to a full Minecraft **Loot Table**.
- File Path: `data/<namespace>/data_maps/mineraculous/miraculous/lucky_charms.json`

### Effects & Attribute Modifiers Data Maps
- **Miraculous Effects**: Map status effects (like Speed or Strength) to your miraculous with custom amplifiers and toggleable rules using the [Miraculous Effects Data Map](https://beta-jsons.thomasglasser.dev/mineraculous/data-map-miraculous-effects/) (`data/<namespace>/data_maps/mineraculous/miraculous/effects.json`).
- **Attribute Modifiers**: Map attribute bonuses (like armor or attack damage) using the [Miraculous Attribute Modifiers Data Map](https://beta-jsons.thomasglasser.dev/mineraculous/data-map-miraculous-attribute-modifiers/) (`data/<namespace>/data_maps/mineraculous/miraculous/attribute_modifiers.json`).

---

## Tags & Curios Integration

### Kwami Dietary Tags
Kwamis require food to recharge their energy. You define their diets using item tags:
- **Preferred Foods**: `data/<namespace>/tags/item/kwami_preferred_foods/<id>.json`
- **Treats**: `data/<namespace>/tags/item/kwami_treats/<id>.json`

### Mod & Curios Tags
- If your miraculous grants a weapon that requires custom permissions, add your miraculous or item to the appropriate mod tags (e.g., `mineraculous:can_use_butterfly_cane`).
- If you are adding your miraculous to a custom Curios slot, ensure the slot tag includes `mineraculous:miraculous` and `mineraculous:fake_miraculous`. Refer to the [Curios Wiki](https://docs.illusivesoulworks.com/category/slots) for slot registration details.

---

## Visuals & Resource Pack Setup

To make your miraculous look amazing in-game, you must create a Resource Pack containing its 3D models, textures, translations, and **Default Look**.

### Translations
In your language file (e.g., `assets/<namespace>/lang/en_us.json`), add translations for:
- Miraculous Name: `miraculous.<namespace>.<id>`
- Ability Names: `ability.<namespace>.<miraculous_id>.<ability_id>`
- Dietary Tags: `tag.item.<namespace>.kwami_preferred_foods.<id>` and `tag.item.<namespace>.kwami_treats.<id>`
- Customization Settings: If adding custom settings, translate them using `customization_setting.<namespace>.<miraculous_id>.<ability_id>.<setting_id>`

### 3D Models & Kwami Assets
Create GeckoLib models using [Blockbench](https://www.blockbench.net/) and the [Mineraculous Templates](https://github.com/Mineraculous/Templates).
- **Kwami Model**: `assets/<namespace>/geo/entity/miraculous/<id>.geo.json`
- **Kwami Textures**: Normal texture at `assets/<namespace>/textures/entity/miraculous/<id>.png` and hungry texture at `assets/<namespace>/textures/entity/miraculous/<id>_hungry.png`.
- **Kwami Animations**: Optional animation file at `assets/<namespace>/animations/entity/miraculous/<id>.animation.json` (supports `misc.idle`, `move.fly`, `misc.eat`, `misc.hold`, `misc.sit`, and `misc.sit_eat`).

### Setting Up the Default Look
Every miraculous requires a **Default Look** JSON file to link your suit and item textures/models to the item.
- File Path: `assets/<namespace>/mineraculous/looks/mineraculous/miraculous/<id>.json`
- Use the [Look Generator](https://beta-jsons.thomasglasser.dev/mineraculous/look/) and configure at least the following required contexts with GeckoLib models and textures:
  1. `mineraculous:hidden_miraculous` (when worn normally)
  2. `mineraculous:powered_miraculous` (when charged/active)
  3. `mineraculous:miraculous_suit` (the transformed armor)
  4. `mineraculous:miraculous_tool` (if your tool is look-based)

> [IMPORTANT]
> In your Default Look (and any alternative custom looks), add a metadata block with **`mineraculous:valid_miraculouses`** containing your miraculous. This prevents other miraculouses from accidentally using your visuals!

> [WARNING]
> If your tool is a custom look-based item, your Java class **must** implement `MiraculousBackedItem` and provide your miraculous key for the default look, otherwise the game will crash when rendering it.
