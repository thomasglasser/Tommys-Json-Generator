---
title: Creating a Custom Look
versions:
    - 1.21
tags:
    - mineraculous
---

This guide will walk you through the process of creating a custom look.
See the [Minecraft Wiki](https://minecraft.wiki) for information on loading [resource](https://minecraft.wiki/w/Tutorial:Loading_a_resource_pack) packs.

The look JSON generator can be found [here](https://beta-jsons.thomasglasser.dev/mineraculous/look).

### Built-In vs. Loaded Looks
There are two types of looks: built-in and loaded. 
Built-in looks are provided by resource packs that must be on **both** clients viewing the look.
Loaded looks are provided by the server or a single client and synced to everyone viewing the look.
> Note: In order for clients to load loaded looks, the server must enable the config value allowing them to do so.

## Creating a Built-In Look
Creating a built-in look is very straightforward. 
In the look JSON generator, the paths provided must be **fully qualified Resource Locations pointing to the assets**.
For example, a texture located in `assets/textures/item/hidden_butterfly.png` would provide the string `packid:textures/item/hidden_butterfly.png`.
When loaded, the look will simply refer to the viewing client's existing resources to locate the asset.
The generated look JSON should be given an ID and placed in `assets/<pack_id>/mineraculous/looks/<look_id>.json`.
This placement supports subfolders, and things that use default looks might require certain placements.
> For example, default miraculous looks are placed in `assets/<pack_id>/mineraculous/looks/mineraculous/miraculous/<miraculous_id>.json`.

This option is recommended for addons that are required on all clients to avoid syncing unnecessarily.

## Creating a Loaded Look
Creating a loaded look is also straightforward, but a bit different.
A folder or zip file can only contain **one** look.
Looks must be placed in the `mineraculous/looks` folder in the *root game directory*, 
outside any world folders.
Directly inside the look folder or zip file,
you must place the generation JSON file with the name `look.json`.
In the look JSON generator, the paths provided must be **relative paths to the assets from the root of the look folder or zip file**.
For example, a texture located in `textures/butterfly_hidden.png` would provide the string `textures/butterfly_hidden.png`.
When loaded, the look will fetch the asset from the relative path and load it on the viewing client.

This option is recommended for players adding looks themselves or addons adding only looks or that are required only on one device,
whether the server or a single client.
