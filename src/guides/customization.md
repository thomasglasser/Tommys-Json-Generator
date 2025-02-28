---
title: Creating and Loading Customizations
versions:
    - 1.21
tags:
    - mineraculous
---

For advanced personalization, you can create custom suits, hidden miraculous, and kamikotizations and load them into the game, either for yourself or for the entire server.

## Creating a Customization

First, you must create a GeckoLib model.
A tutorial on how to make GeckoLib models can be found [here](https://github.com/bernie-g/geckolib/wiki/Making-Your-Models-(Blockbench)).
You can also find the mod's default models [here](https://github.com/thomasglasser/Mineraculous/tree/models).

You must then choose an ID for your look.
This ID must be unique and can only contain lowercase letters and underscores.
All files related to one look must share the same ID.

### Suits

Custom suits must be created as GeckoLib armor models.
Each suit look must provide a texture with the name `<id>.png`.
Each suit look can also provide a model with the name `<id>.geo.json`.
Each suit look can also provide a glowmask with the name `<id>_glowmask.png`.
Each suit look can also provide transformation frames with the name `<id>_<frame>.png`, starting at 1,
and glowmask transformation frames with the name `<id>_<frame>_glowmask.png`, starting at 1.
Each suit look can also provide animations with the name `<id>.animation.json`.
The supported suit animations are `move.fly`, `move.swim`, `move.run`, `move.walk`, and `misc.idle`.

### Hidden Miraculous

Custom hidden miraculous must be created as GeckoLib item models.
Each hidden miraculous look must provide a texture with the name `<id>.png`.
Each hidden miraculous look can also provide a model with the name `<id>.geo.json`.
Each hidden miraculous look can also provide a glowmask with the name `<id>_glowmask.png`.
Each hidden miraculous look can also provide item transforms with the name `<id>.json`.
This file should *only* contain the `display` field, all other fields will be ignored.

### Kamikotizations

Custom kamikotizations must be created as GeckoLib armor models.
Each kamikotization look must provide a texture with the name `<id>.png`.
Each kamikotization look can also provide a model with the name `<id>.geo.json`.
Each kamikotization look can also provide a glowmask with the name `<id>_glowmask.png`.

## Loading a Customization

To load a custom look for just yourself, you must place the files in the appropriate `miraculouslooks` subfolder in your Minecraft directory.
To load a custom look for the entire server, you must place the files in the `miraculouslooks` subfolder in the server directory.
For suits, this is the `suits` subfolder.
For hidden miraculous, this is the `miraculous` subfolder.
For kamikotizations, this is the `kamikotizations` subfolder.
You must then create subfolders for the ID of the miraculous the look is for.
For example, if you have a hidden miraculous for the `mineraculous:butterfly`, you must place the files in the `miraculouslooks/miraculous/mineraculous/butterfly` folder.

## Using a Customization

### Suits and Hidden Miraculous

Once the files are in place, restart your Minecraft instance or the server and the custom looks will be loaded.
For client-side customizations, you will now be able to switch to your custom look *only if allowed by the server config*.
For server-side customizations, anyone on the server will be able to use your custom look.
To switch to your custom look, use the `/miraculous <miraculous> customize` command to open the look customization screen.

### Kamikotizations

Kamikotizations are automatically loaded and applied when kamikotization is attempted.
This look will be visible to the kamikotizing player when the kamikotization selection occurs and will be applied to the player when they are kamikotized.
To overwrite a kamikotization, 
you must place the files with the same ID as the kamikotization in a subfolder for the namespace of the kamikotization,
such as `kamikotizations/mineraculous/stormy_weather.png`.
