---
title: Creating a Custom Power
versions:
  - 1.21
tags:
  - minejago
---

This guide will walk you through the process of creating a custom power.
See the [Minecraft Wiki](https://minecraft.wiki) for information on loading [data](https://minecraft.wiki/w/Tutorial:Installing_a_data_pack) and [resource](https://minecraft.wiki/w/Tutorial:Loading_a_resource_pack) packs.

You must first choose a namespace for your addon and an ID for your power.
This ID must be unique and can only contain lowercase letters, numbers, and underscores.
All files related to one power must share the same ID.

## Creating the Models

First, you must create simple 2D item models for your suit in-hand with the name `<id>_trainee_gi_<slot>.json` for the hood, jacket, pants, and boots.
You must then create a texture for the trainee gi armor matching the model and 2D item textures for in-hand rendering (these are referred to in the above model files).
The mod's gi models can be found [here](https://github.com/thomasglasser/Minejago/tree/models/).

## Creating the Power

Powers are the main feature of the mod.
They can be given by Master Wu and currently grant custom gi and spinjitzu.
You can create power [here](https://snapshot-jsons.thomasglasser.dev/minejago/power/).
The display is only used if power choosing is enabled.
The tagline is said by Wu when granting the power.
Fill out the fields and save the file in the path `data/<namespace>/minejago/power/<id>.json`.

## Tags

Tags for powers are supported.
You can create these tags [here](https://snapshot-jsons.thomasglasser.dev/partners/).
Mod tags, such as the `minejago:can_use_scythe_of_quakes` power tag, can be added to in order to allow the elemental master to tame the Earth Dragon and use the Scythe of Quakes.

## Creating the Resource Pack

Once you have created the assets, you must create a resource pack to display them.

### Names

In a language file, you must add translations for powers and their displays.

Powers pull from `power.<namespace>.<id>`.
Displays pull from the keys you provided,
which are recommended to follow the path `power.<namespace>.<id>.<type>` (i.e. `power.minejago.earth.tagline`).

### Textures

You must add textures for the power and gi.

The power texture must be located at `assets/<namespace>/textures/power/<id>.png`.

The gi armor texture must be located at `assets/<namespace>/textures/entity/equipment/humanoid/gi/<type>_<id>.png` (i.e. `assets/minejago/textures/entity/equipment/humanoid/gi/trainee_earth.png`).
The gi item texture must be located wherever you defined the item texture in the model,
which is recommended to follow the path `assets/<namespace>/textures/item/<id>_<type>_gi_<slot>.png` (i.e. `assets/minejago/textures/item/earth_trainee_gi_pants.png`).
