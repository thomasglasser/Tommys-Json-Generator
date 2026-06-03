---
title: Creating a Look
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

> **Note**
> In order for clients to load and see loaded looks, the server must enable the config value allowing them to do so.

## Creating a Built-In Look
Creating a built-in look is very straightforward. 
In the look JSON generator, the paths provided must be **fully qualified Resource Locations pointing to the assets**.
For example, a texture located in `assets/<namespace>/textures/item/hidden_butterfly.png` would provide the string `<namespace>:textures/item/hidden_butterfly.png`.
When loaded, the look will simply refer to the viewing client's existing resources to locate the asset.
The generated look JSON should be given an ID and placed in `assets/<namespace>/mineraculous/looks/<look_id>.json`.
This placement supports subfolders, and things that use default looks might require certain placements.
> For example, default miraculous looks are placed in `assets/<namespace>/mineraculous/looks/mineraculous/miraculous/<miraculous_id>.json`.

This option is much better for performance and recommended for addons that are required on all clients to avoid unnecessary file processing and syncing.

## Creating a Loaded Look
Creating a loaded look is also straightforward, but a bit different.
Looks must be placed in the `mineraculous/looks` folder in the *root game directory*,
outside any world folders.
You must place all look JSON files directly inside the root of the folder or zip file.
In the look JSON generator, the paths provided must be **relative paths to the assets from the root of the folder or zip file**.
For example, a texture located in `textures/butterfly_hidden.png` would provide the string `textures/butterfly_hidden.png`.
When loaded, the look will fetch the asset from the relative path and load it on the viewing client.

This option is worse for performance but only required on one client, so it is recommended for players adding looks themselves or addons adding only looks or that are required only on one device,
whether the server or a single client.
> Servers are able to provide loaded looks for all clients that join without sending them a resource pack.
