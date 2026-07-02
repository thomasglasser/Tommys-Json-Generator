---
title: Creating a Look
versions:
    - 1.21
tags:
    - mineraculous
---

This guide will walk you through creating custom visual presentations, known as **Looks**, for Miraculouses, Kamikotizations, tools, and suits in **Mineraculous**.

The Look JSON generator can be found [here](https://beta-jsons.thomasglasser.dev/mineraculous/look/).

## How Looks Work

In Mineraculous, visuals are decoupled from gameplay logic. A **Look** is a configuration file that maps specific visual situations (**Contexts**) to 3D models, textures, and animations (**Assets**). This allows you to completely customize the aesthetics of any miraculous or transformation without altering its core stats or abilities!

---

## Look Contexts & Assets

When generating a look, you organize your visuals by **Contexts** (`mineraculous:look_context`). Each context represents an item state or armor piece:
- **Miraculous Contexts**: `mineraculous:hidden_miraculous`, `mineraculous:powered_miraculous`, `mineraculous:miraculous_suit`, `mineraculous:miraculous_tool`
- **Kamikotization Contexts**: `mineraculous:kamikotization_suit`, `mineraculous:kamikotization_tool`

### Assigning Assets
For each context, you assign **Assets** (`mineraculous:look_asset_type`). You can select asset types from the generator's dropdown:
- **`mineraculous:texture`**: Standard 2D or armor texture path.
- **`mineraculous:geckolib_model`**: Path to a GeckoLib `.geo.json` model file.
- **`mineraculous:geckolib_animations`**: Path to a GeckoLib `.animation.json` file.
- **`mineraculous:item_transforms`**: Custom third-person/first-person item transform formatting.
- **`mineraculous:transformation_textures`** & **`mineraculous:countdown_textures`**: Multi-frame texture sequences for transformations and timers.

### Shorthand vs. Full Contexts (Conditional Overrides)
When configuring a context, you can choose between two modes:
1. **Assets (Shorthand)**: Directly map asset types to paths for a static visual.
2. **Full (With Overrides)**: Specify default `assets` along with an optional list of conditional `overrides`. Overrides allow you to change models or textures dynamically when specific gameplay predicates are met! Common predicates include:
   - `mineraculous:active`: When a miraculous or ability is currently active.
   - `mineraculous:missing_pieces`: When suit armor pieces are missing.
   - `mode`, `thrown`, `storing`: For dynamic weapon/tool states.

---

## Restricting Looks with Metadata

To prevent players from equipping a look onto the wrong miraculous or kamikotization, you should add a `metadata` block to your look JSON.

- Use **`mineraculous:valid_miraculouses`** to specify an array of Miraculouses that can use this look.
- Use **`mineraculous:valid_kamikotizations`** to specify an array of Kamikotizations that can use this look.

---

## Built-In vs. Loaded Looks

There are two distinct ways to install and distribute looks in Minecraft:

### 1. Built-In Looks (Recommended for Resource Packs)
Built-in looks are bundled inside a standard Minecraft Resource Pack and must be installed on **all** viewing clients.
- **File Location**: Save your generated look JSON inside your resource pack at `assets/<namespace>/mineraculous/looks/<look_id>.json`.
  - *Note*: Default looks require specific subfolder paths. For example, a default miraculous look goes in `assets/<namespace>/mineraculous/looks/mineraculous/miraculous/<id>.json`.
- **Asset Paths**: All asset paths inside the JSON must be **fully qualified Resource Locations** pointing to resource pack assets (e.g., `<namespace>:textures/item/hidden_butterfly.png` or `<namespace>:geo/item/butterfly_cane.geo.json`).
- **Why use Built-In?**: Offers the best performance and zero network overhead, making it ideal for full modpacks or official server resource packs.

### 2. Loaded Looks (Server-Synced / Standalone)
Loaded looks are placed directly into a special folder on the server or client and can be dynamically loaded and synced to players without needing a traditional resource pack!
- **File Location**: Place your look JSON and all associated texture/model files directly inside the `mineraculous/looks` directory located in your **root Minecraft game directory** (outside of any world folders).
- **Asset Paths**: Asset paths inside the JSON must be **relative file paths** from the root of your look archive/folder (e.g., `textures/butterfly_hidden.png` or `models/suit.geo.json`).
- **Why use Loaded Looks?**: Perfect for players adding custom skins locally or servers that want to distribute custom cosmetics automatically to joining players without forcing a resource pack download.

> [NOTE]
> For clients to see server-provided Loaded Looks, the server administrator must enable the corresponding config setting allowing loaded look syncing.
