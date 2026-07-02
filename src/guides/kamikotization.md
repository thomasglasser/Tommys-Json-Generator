---
title: Creating a Kamikotization
versions:
    - 1.21
tags:
    - mineraculous
---

This guide will walk you through creating a custom **Kamikotization** in **Mineraculous**. Kamikotizations are powerful, specialized transformations created by the Butterfly Miraculous to empower players.

You can create and configure your Kamikotization using the [Kamikotization Generator](https://beta-jsons.thomasglasser.dev/mineraculous/kamikotization/).

---

## Creating the Kamikotization File

When creating a kamikotization file in the generator, you will configure its triggering conditions, power source, inline abilities, and customization settings.

### Power Source (Items vs. Abilities)
Every kamikotization requires a `power_source` that fuels or triggers the transformation. You can choose between two power source types:
- **Item**: An item (such as a specific token, weapon, or charged object) that grants the transformation abilities.
- **Ability**: An ability that grants the transformation abilities.

### Abilities
- **Passive Abilities**: Add a list of passive abilities (`passive_abilities`) that remain active while the target is transformed. Each ability includes a unique `id`, trigger `conditions`, branching logic (`branches`), executed `actions` (such as status effects or stat boosts), and audio settings.

### Conditions & Customization Settings
- **Conditions**: Optional rules (`conditions`) that must be met for a target to be kamikotized (e.g., item checks or health thresholds).
- **Customization Settings**: Define defaults such as the display name (`mineraculous:name`) or custom data values.

Once configured, save your file to your data pack at:
`data/<namespace>/mineraculous/kamikotization/<id>.json`

---

## Enhancing with Data Maps

### Lucky Charms Data Map
To assist players in defeating an opponent who has been bestowed your kamikotization, you should configure Lucky Charm drops using **Data Maps**.
- Generator: [Kamikotization Lucky Charms Data Map](https://beta-jsons.thomasglasser.dev/mineraculous/data-map-kamikotization-lucky-charms/)
- **Items vs. Loot Table**: You can map your kamikotization directly to a **List of Items** or tags (no separate loot table file required!) or point to a full Minecraft **Loot Table**.
- File Path: `data/<namespace>/data_maps/mineraculous/kamikotization/lucky_charms.json`

---

## Visuals & Resource Pack Setup

To display your kamikotization suit and tool in-game, you must create a Resource Pack containing your GeckoLib armor/tool models, textures, translations, and a **Default Look**.

### 3D Models
Create GeckoLib armor models for the suit and items using [Blockbench](https://www.blockbench.net/) and the [Mineraculous Templates](https://github.com/Mineraculous/Templates). Your suit requires a `.geo.json` model and texture, and can optionally feature emissive glowmasks and custom animations.

### Translations
In your language file (e.g., `assets/<namespace>/lang/en_us.json`), add translations for:
- Kamikotization Name: `kamikotization.<namespace>.<id>`
- Ability Names: `ability.<namespace>.<kamikotization_id>.<ability_id>`
- Tags: `tag.<type>.<namespace>.<id>`
- Customization Settings: If adding custom settings, translate them using `customization_setting.<namespace>.<kamikotization_id>.<ability_id>.<setting_id>`

### Setting Up the Default Look
Every kamikotization must have a **Default Look** JSON file that links your suit models and textures to the transformation.
- File Path: `assets/<namespace>/mineraculous/looks/mineraculous/kamikotization/<id>.json`
- Use the [Look Generator](https://beta-jsons.thomasglasser.dev/mineraculous/look/) and configure at least the following required contexts with GeckoLib models and textures:
  1. `mineraculous:kamikotization_suit` (the suit armor)
  2. `mineraculous:kamikotization_tool` (if your tool is look-based)

> [IMPORTANT]
> In your Default Look (and any alternative looks you create), include a metadata block with **`mineraculous:valid_kamikotizations`** containing your kamikotization. This ensures your custom suit aesthetics cannot be equipped onto other transformations!

> [WARNING]
> If your tool is a custom look-based item, your Java class **must** implement `KamikotizationBackedItem` and provide your kamikotization key for the default look, otherwise the game will crash when rendering it.
