---
title: Creating a Custom Kamikotization
versions:
    - 1.21
tags:
    - mineraculous
---

This guide will walk you through the process of creating a custom kamikotization.
See the [Minecraft Wiki](https://minecraft.fandom.com/wiki/Kamikotization) for information on loading [data](https://minecraft.fandom.com/wiki/Tutorial:Installing_a_data_pack) and [resource](https://minecraft.fandom.com/wiki/Tutorial:Loading_a_resource_pack) packs.

## Creating the Models

First, you must create a GeckoLib armor model for the kamikotization.
A tutorial on how to make GeckoLib models can be found [here](https://github.com/bernie-g/geckolib/wiki/Making-Your-Models-(Blockbench)).
You can also find the mod's default models [here](https://github.com/thomasglasser/Mineraculous/tree/models).

The kamikotization can have a glowmask.

You must then choose a namespace for your addon and an ID for your kamikotization.
This ID must be unique and can only contain lowercase letters, numbers, and underscores.
All files related to one kamikotization must share the same ID.

## Creating the Abilities

Abilities are the core feature of kamikotizations.
They allow the kamikotization holder to perform special actions.
You can create abilities [here](https://snapshot-jsons.thomasglasser.dev/mineraculous/ability/).
Select an ability type and fill out the fields.
For more advanced creators, you can use a mod to add to the `mineraculous:ability_serializer` registry for more complex abilities.
Once you have created the ability, save the file in the path `data/<namespace>/mineraculous/abilities/<id>.json`.

## Creating the Kamikotization

Kamikotizations are the main feature of the Butterfly Miraculous.
They are transformations that can be used to power up an unpowered player.
You can create kamikotizations [here](https://snapshot-jsons.thomasglasser.dev/mineraculous/kamikotization/).
Any abilities that you saved to the project will be able to be autofilled in the ability fields.
Fill out the fields and save the file in the path `data/<namespace>/mineraculous/kamikotization/<id>.json`.

### Adding a Lucky Charm Loot Table

It's recommended, but not required, to add a lucky charm loot table to assist in defeating your kamikotization should it be given to the wrong player.
You can create a loot table [here](https://snapshot-jsons.thomasglasser.dev/loot-table/).
You should then add the loot table or a list of items to the kamikotization lucky charms data map with [this generator](https://snapshot-jsons.thomasglasser.dev/mineraculous/data-map-kamikotization-lucky-charms).
This file should be placed in `data/<namespace>/data_maps/mineraculous/kamikotization/lucky_charms.json`.

## Creating the Resource Pack

Once you have created the assets, you must create a resource pack to display them.

### Names

In a language file, you must add translations for kamikotization, abilities, and related fields.

Abilities pull from `ability.<namespace>.<id>`.
Kamikotizations pull from `kamikotization.<namespace>.<id>`.
Tags pull from `tag.<type>.<namespace>.<id>`.

### Models

You must add models for the kamikotization suit.

The kamikotization model must be named `<id>.geo.json` and located in `assets/<namespace>/geo/item/armor/kamikotization/<id>.geo.json`.

### Textures

You must add textures for the kamikotization suit.

The kamikotization textures must be located in the `assets/<namespace>/textures/item/armor/kamikotization` subfolder.
There are 2 texture variants for the kamikotization suit:
- `<id>.png`, the default texture
- `<id>_glowmask.png`, the glowmask texture

### Animations

You can add animations for the kamikotization suit.

The kamikotization animations must be named `<id>.animation.json` located in the `assets/<namespace>/animations/item/armor/kamikotization/<id>.animation.json`.