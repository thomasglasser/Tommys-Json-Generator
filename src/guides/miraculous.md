---
title: Creating a Miraculous
versions:
    - 1.21
tags:
    - mineraculous
---

This guide will walk you through the process of creating a custom miraculous.
See the [Minecraft Wiki](https://minecraft.wiki) for information on loading [data](https://minecraft.wiki/w/Tutorial:Installing_a_data_pack) and [resource](https://minecraft.wiki/w/Tutorial:Loading_a_resource_pack) packs.

## Creating the Models

First, you must create a GeckoLib armor model for the suit,
a GeckoLib item model for the miraculous,
and a GeckoLib entity model for the kwami.
A tutorial on how to make GeckoLib models can be found [here](https://github.com/bernie-g/geckolib/wiki/Making-Your-Models-(Blockbench)).
You can also find the mod's templates [here](https://github.com/Mineraculous/Templates).

The suit must have a model and texture and can have a glowmask, transformation frames, and animations.
The miraculous must have a model, texture, and countdown textures, and can have a glowmask and item transforms.
The kwami must have a model, texture, and hungry texture, and can have animations.

You must then choose a namespace for your addon and an ID for your miraculous.
This ID must be unique and can only contain lowercase letters, numbers, and underscores.
All files related to one miraculous must share the same ID.

## Creating the Abilities

Abilities are the core feature of miraculouses.
They allow the miraculous holder to perform special actions.
You can create abilities [here](https://beta-jsons.thomasglasser.dev/mineraculous/ability/).
Select an ability type and fill out the fields.
Once you have created the ability, save the file in the path `data/<namespace>/mineraculous/abilities/<id>.json`.
For more advanced addons, you can use a Java mod to add to the `mineraculous:ability_serializer` registry for more complex abilities and use [Data Generation](https://docs.neoforged.net/docs/resources/#data-generation) to create the JSON files.

## Creating the Miraculous

Miraculouses are the main feature of the mod.
They are items that can be worn and can be used to grant buffs and abilities.
You can create miraculouses [here](https://beta-jsons.thomasglasser.dev/mineraculous/miraculous/).
Any abilities that you saved to the project will be able to be autofilled in the ability fields.
Fill out the fields and save the file in the path `data/<namespace>/mineraculous/miraculous/<id>.json`.

### Tags

Tags for kwami preferred foods and treats are automatically loaded from `data/<namespace>/tags/kwami_preferred_foods/<id>.json` and `data/<namespace>/tags/kwami_treats/<id>.json` respectively.
You can create these tags [here](https://beta-jsons.thomasglasser.dev/tags/item/).

Tags for miraculouses and abilities are also supported.
You can create these tags [here](https://beta-jsons.thomasglasser.dev/partners/).
Mod tags, such as the `mineraculous:can_use_butterfly_cane` miraculous tag, can be added to so the miraculous holder can use the tool with your custom miraculous.

### Curios

If you're adding a miraculous and/or tool to a Curios slot that's not already used by the mod,
you'll need to register it if it exists or create it if it doesn't.
See the [Curios Wiki](https://docs.illusivesoulworks.com/category/slots) for information on how to do this.
One difference is that you must add `mineraculous:miraculous` and `mineraculous:fake_miraculous` to the item tag for the slot.

### Adding a Lucky Charm Loot Table

It's recommended (but not required) to add a lucky charm loot table to assist in defeating a holder of your miraculous should it fall into the wrong hands.
You can create a loot table [here](https://beta-jsons.thomasglasser.dev/loot-table/).
You should then add the loot table or a list of items to the miraculous lucky charms data map with [this generator](https://beta-jsons.thomasglasser.dev/mineraculous/data-map-miraculous-lucky-charms).
*Note: At this time, to generate a lucky charm loot table,
you must use a preset to set the "type" field to "mineraculous:lucky_charm".
Searching the presets for "lucky_charm" will yield valid results.*
This file should be placed in `data/<namespace>/data_maps/mineraculous/miraculous/lucky_charms.json`.

## Creating the Resource Pack

Once you have created the assets, you must create a resource pack to display them.

### Names

In a language file, you must add translations for miraculous, abilities, and related fields.

Abilities pull from `ability.<namespace>.<id>`.
Kwamis pull from `entity.mineraculous.kwami.<namespace>.<id>`.
Miraculouses pull from `miraculous.<namespace>.<id>`.
Kwami Tags pull from `tag.item.<namespace>.kwami_preferred_foods.<id>` and `tag.item.<namespace>.kwami_treats.<id>`.
Other Tags pull from `tag.<type>.<namespace>.<id>`.

### Default Look

You must add a default look for the miraculous.
It must be named `<id>.json` and located in `assets/<namespace>/mineraculous/looks/mineraculous/miraculous/<id>.json`.
The guide for looks can be found [here](https://beta-jsons.thomasglasser.dev/guides/looks/).

The default miraculous look requires the following contexts to have *at least* a GeckoLib model and texture:
- Hidden Miraculous
- Powered Miraculous
- Miraculous Suit
- Miraculous Tool (if look-based)

Refer to the existing miraculous looks for reference on what else you can provide.

You should also specify your miraculous in the `mineraculous:allowed_miraculouses` metadata to ensure it can't be equipped for other miraculouses.

> **Warning**
> If your tool is a custom look-based item, it **must** implement `MiraculousBackedItem` and provide your miraculous key for the default look, otherwise it will crash.

### Other Looks

If you want to offer alternative visuals, you can add other looks with the generator.
Make sure you add the `mineraculous:allowed_miraculouses` metadata to limit the look to your miraculous.

### Models

You must add a model for the kwami, named `<id>.geo.json` and located in `assets/<namespace>/geo/entity/miraculous/<id>.geo.json`.

### Textures

You must add 2 textures for the kwami.
The normal kwami texture must be named `<id>.png` and located in `assets/<namespace>/textures/entity/miraculous/<id>.png`.
The hungry kwami texture must be named `<id>_hungry.png` and located in `assets/<namespace>/textures/entity/miraculous/<id>_hungry.png`.

### Animations

You can add animations for the kwami, named `<id>.animation.json` located in the `assets/<namespace>/animations/entity/miraculous/<id>.animation.json`.
The supported kwami animations are `misc.idle`, `move.fly`, `misc.eat`, `misc.hold`, `misc.sit`, and `misc.sit_eat`.
If not provided, kwamis will use the default animations.
