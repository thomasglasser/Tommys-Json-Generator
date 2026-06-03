---
title: Creating a Kamikotization
versions:
    - 1.21
tags:
    - mineraculous
---

This guide will walk you through the process of creating a custom kamikotization.
See the [Minecraft Wiki](https://minecraft.wiki) for information on loading [data](https://minecraft.wiki/w/Tutorial:Installing_a_data_pack) and [resource](https://minecraft.wiki/w/Tutorial:Loading_a_resource_pack) packs.

## Creating the Models

First, you must create a GeckoLib armor model for the suit.
A tutorial on how to make GeckoLib models can be found [here](https://github.com/bernie-g/geckolib/wiki/Making-Your-Models-(Blockbench)).
You can also find the mod's templates [here](https://github.com/Mineraculous/Templates).

The suit must have a model and texture and can have a glowmask and animations.

You must then choose a namespace for your addon and an ID for your kamikotization.
This ID must be unique and can only contain lowercase letters, numbers, and underscores.
All files related to one kamikotization must share the same ID.

## Creating the Abilities

Abilities are the core feature of kamikotizations.
They allow the kamikotization holder to perform special actions.
You can create abilities [here](https://beta-jsons.thomasglasser.dev/mineraculous/ability/).
Select an ability type and fill out the fields.
Once you have created the ability, save the file in the path `data/<namespace>/mineraculous/abilities/<id>.json`.
For more advanced addons, you can use a Java mod to add to the `mineraculous:ability_serializer` registry for more complex abilities and use [Data Generation](https://docs.neoforged.net/docs/resources/#data-generation) to create the JSON files.

## Creating the Kamikotization

Kamikotizations are the main feature of the Butterfly Miraculous.
They are transformations that can be used to power up an unpowered player.
You can create kamikotizations [here](https://beta-jsons.thomasglasser.dev/mineraculous/kamikotization/).
Any abilities that you saved to the project will be able to be autofilled in the ability fields.
Fill out the fields and save the file in the path `data/<namespace>/mineraculous/kamikotization/<id>.json`.

### Adding a Lucky Charm Loot Table

It's recommended (but not required) to add a lucky charm loot table to assist in defeating a wielder of your kamikotization should it be bestowed upon the wrong hands.
You can create a loot table [here](https://beta-jsons.thomasglasser.dev/loot-table/).
*Note: At this time, to generate a lucky charm loot table,
you must use a preset to set the "type" field to "mineraculous:lucky_charm".
Searching the presets for "lucky_charm" will yield valid results.*
You should then add the loot table or a list of items to the kamikotization lucky charms data map with [this generator](https://beta-jsons.thomasglasser.dev/mineraculous/data-map-kamikotization-lucky-charms).
This file should be placed in `data/<namespace>/data_maps/mineraculous/kamikotization/lucky_charms.json`.

## Creating the Resource Pack

Once you have created the assets, you must create a resource pack to display them.

### Names

In a language file, you must add translations for the kamikotization, abilities, and related fields.

Abilities pull from `ability.<namespace>.<id>`.
Kamikotizations pull from `kamikotization.<namespace>.<id>`.
Tags pull from `tag.<type>.<namespace>.<id>`.

### Default Look

You must add a default look for the kamikotization.
It must be named `<id>.json` and located in `assets/<namespace>/mineraculous/looks/mineraculous/kamikotization/<id>.json`.
The guide for looks can be found [here](https://beta-jsons.thomasglasser.dev/guides/looks/).

The default kamikotization look requires the following contexts to have *at least* a GeckoLib model and texture:
- Kamikotization Suit
- Kamikotization Tool (if look-based)

Refer to the existing kamikotization looks for reference on what else you can provide.

You should also specify your kamikotization in the `mineraculous:allowed_kamikotizations` metadata to ensure it can't be equipped for other kamikotizations.

> **Warning**
> If your tool is a custom look-based item, it **must** implement `KamikotizationBackedItem` and provide your miraculous key for the default look, otherwise it will crash.

### Other Looks

If you want to offer alternative visuals, you can add other looks with the generator.
Make sure you add the `mineraculous:allowed_kamikotizations` metadata to limit the look to your kamikotization.
