---
title: Creating a Custom Miraculous
versions:
    - 1.21
tags:
    - mineraculous
    - miraculous
---

This guide will walk you through the process of creating a custom miraculous.
See the [Minecraft Wiki](https://minecraft.wiki) for information on loading [data](https://minecraft.wiki/w/Tutorial:Installing_a_data_pack) and [resource](https://minecraft.wiki/w/Tutorial:Loading_a_resource_pack) packs.

## Creating the Models

First, you must create a GeckoLib armor model for the suit, 
a GeckoLib item model for the miraculous, 
and a GeckoLib entity model for the kwami.
A tutorial on how to make GeckoLib models can be found [here](https://github.com/bernie-g/geckolib/wiki/Making-Your-Models-(Blockbench)).
You can also find the mod's default models [here](https://github.com/thomasglasser/Mineraculous/tree/models).

The suit can have a glowmask and transformation frames.
The miraculous can have a glowmask and item transforms.

You must then choose a namespace for your addon and an ID for your miraculous.
This ID must be unique and can only contain lowercase letters, numbers, and underscores.
All files related to one miraculous must share the same ID.

## Creating the Abilities

Abilities are the core feature of miraculous.
They allow the miraculous holder to perform special actions.
You can create abilities [here](https://snapshot-jsons.thomasglasser.dev/mineraculous/ability/).
Select an ability type and fill out the fields.
For more advanced creators, you can use a mod to add to the `mineraculous:ability_serializer` registry for more complex abilities.
Once you have created the ability, save the file in the path `data/<namespace>/mineraculous/abilities/<id>.json`.

## Creating the Miraculous

Miraculous are the main feature of the mod.
They are items that can be worn and can be used to grant buffs and abilities.
You can create miraculous [here](https://snapshot-jsons.thomasglasser.dev/mineraculous/miraculous/).
Any abilities that you saved to the project will be able to be autofilled in the ability fields.
Fill out the fields and save the file in the path `data/<namespace>/mineraculous/miraculous/<id>.json`.

### Tags

Tags for kwami food and treats are automatically loaded from `data/mineraculous/tags/kwami_foods/<id>.json` and `data/mineraculous/tags/kwami_treats/<id>.json` respectively.
You can create these tags [here](https://snapshot-jsons.thomasglasser.dev/tags/item/).

Tags for miraculous and abilities are also supported.
You can create these tags [here](https://snapshot-jsons.thomasglasser.dev/partners/).
Mod tags, such as the `mineraculous:can_use_butterfly_cane` miraculous tag, can be added to in order to allow the miraculous holder to use the tool with your custom miraculous.

### Curios

If you're adding a miraculous and/or tool to a Curios slot that's not already used by the mod,
you'll need to register it if it exists or create it if it doesn't.
See the [Curios Wiki](https://docs.illusivesoulworks.com/category/slots) for information on how to do this.
One difference is that you must add `mineraculous:miraculous` to the item tag for the slot.

## Creating the Resource Pack

Once you have created the assets, you must create a resource pack to display them.

### Names

In a language file, you must add translations for miraculous, abilities, and related fields.

Abilities pull from `ability.<namespace>.<id>`.
Kwamis pull from `entity.mineraculous.kwami.<namespace>.<id>`.
Miraculous pull from `miraculous.<namespace>.<id>`.
Kwami Tags pull from `tag.item.<namespace>.kwami_foods.<id>` and `tag.item.<namespace>.kwami_treats.<id>`.
Other Tags pull from `tag.<type>.<namespace>.<id>`.

### Models

You must add models for the miraculous, suit, and kwami.

The miraculous model must be named `<id>.geo.json` and located in `assets/<namespace>/geo/item/miraculous/<id>.geo.json`.
The transforms for the miraculous must be named `<id>.json` and located in `assets/<namespace>/models/item/miraculous/<id>.json`.
The suit model must be named `<id>.geo.json` and located in `assets/<namespace>/geo/item/armor/miraculous/<id>.geo.json`.
The kwami model must be named `<id>.geo.json` and located in `assets/<namespace>/geo/entity/miraculous/<id>.geo.json`.

### Textures

You must add textures for the miraculous, suit, and kwami.

The miraculous textures must be located in the `assets/<namespace>/textures/item/miraculous/<id>` subfolder.
There are 7 textures for the miraculous:
- `hidden.png`, the default hidden texture
- `powered.png`, the powered texture
- `powered_0.png`, the powered texture with less than 1 minute left
- `powered_1.png`, the powered texture with less than 2 minutes left
- `powered_2.png`, the powered texture with less than 3 minutes left
- `powered_3.png`, the powered texture with less than 4 minutes left
- `powered_4.png`, the powered texture with less than 5 minutes left

The suit textures must be located in the `assets/<namespace>/textures/item/armor/miraculous` subfolder.
There are 4 texture variants for the suit:
- `<id>.png`, the default texture
- `<id>_glowmask.png`, the glowmask texture
- `<id>_<frame>.png`, the transformation frame texture
- `<id>_<frame>_glowmask.png`, the glowmask transformation frame texture

The normal kwami texture must be named `<id>.png` and located in `assets/<namespace>/textures/entity/miraculous/<id>.png`.
The hungry kwami texture must be named `<id>_hungry.png` and located in `assets/<namespace>/textures/entity/miraculous/<id>_hungry.png`.

### Animations

You can add animations for the miraculous, suit, and kwami.

The miraculous animations must be named `<id>.animation.json` located in the `assets/<namespace>/animations/item/miraculous/<id>.animation.json`.
The suit animations must be named `<id>.animation.json` located in the `assets/<namespace>/animations/item/armor/miraculous/<id>.animation.json`.
The kwami animations must be named `<id>.animation.json` located in the `assets/<namespace>/animations/entity/miraculous/<id>.animation.json`.