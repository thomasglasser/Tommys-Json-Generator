---
title: Using the Generators and Making an Addon
---

Welcome to the JSON Generator site! This guide will walk you through the process of using the generators, creating custom addons for Minecraft and supported mods (like **Mineraculous**), and loading them into your game.

## Using the Generators

The generator suite provides intuitive, schema-validated web interfaces for creating JSON files for both vanilla Minecraft and mod content.

1. **Choose a Generator**: Browse or search for the feature you want to create (e.g., *Kamikotization*, *Miraculous*, *Look*, *Loot Table*).
2. **Start from Scratch or Use Presets**: You can build your file from an empty template, or choose a pre-configured template using the **Preset** dropdown in the top right. Presets are a great way to quickly set up common structures!
3. **Autocompletion & Dynamic Dropdowns**: As you type in text fields or add keys, the generator will automatically suggest valid Minecraft registry IDs, tags, and mod symbols. Many fields feature dynamic dropdowns that adapt based on your selected options.
4. **Validation**: The editor highlights invalid formatting or missing required fields in real time so your files work seamlessly in-game.

## Working with Projects

Instead of downloading files one by one, you can use the built-in **Project System** to manage an entire addon directly in your browser.

- **Toggle Project Menu**: Click the book icon in the bottom left to show or hide your project panel.
- **Creating & Saving**: To save your current file to the active project, press `CTRL + S` (or use the save button in the top right) and assign it an ID. If you don't have an active project open, files will be saved into a local `Drafts` folder.
- **Cross-Referencing**: When working within a project, custom files you create (such as abilities, looks, or tags) can be autocompleted and referenced by other files in the same project!

## Saving Individual Files

If you only need a single file (for instance, to tweak an existing data pack or resource pack):
- Click the **Download** button in the bottom right corner of the editor to download the `.json` file.
- Click the **Copy** button to copy the formatted JSON string directly to your clipboard.

## Exporting & Loading in Game

Once your addon is ready, you can export your project as a standard Minecraft Data Pack:
1. In the top right of the project panel, click the menu dropdown and select **Download Data Pack**.
2. This downloads a `.zip` archive structured with the correct directories (`data/<namespace>/...`).
3. Place this `.zip` file (or extracted folder) into your world's `datapacks` folder. If your addon includes visual assets (like **Looks**, textures, or models), place your asset files into a standard Resource Pack in your `resourcepacks` folder.

For official tutorials on setting up and installing packs, refer to the [Minecraft Wiki for Data Packs](https://minecraft.wiki/w/Tutorial:Installing_a_data_pack) and [Resource Packs](https://minecraft.wiki/w/Tutorial:Loading_a_resource_pack).