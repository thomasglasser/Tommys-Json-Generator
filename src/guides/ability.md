---
title: Creating an Ability
versions:
    - 1.21
tags:
    - mineraculous
---

This guide will walk you through creating a custom **Ability** in **Mineraculous**. Abilities are reusable, data-driven behaviors that grant special powers to Miraculouses and Kamikotizations.

You can create and configure your Ability using the [Ability Generator](https://beta-jsons.thomasglasser.dev/mineraculous/ability/).

---

## Creating the Ability File

When creating an ability file in the generator, you will configure its root properties, customization setting definitions, global conditions, and branching logic.

### Ability Properties
Abilities support several optional properties configured at the root level:
- **`continuous_ticks`**: An integer defining how many ticks the ability continues executing after activation.
- **`start_sound`**: The sound played when continuous execution begins. Can be specified directly as a Sound Event ID (e.g., `"minecraft:entity.warden.sonic_boom"`) or as a key referencing a customization setting definition.
- **`stop_sound`**: The sound played when continuous execution ends. Can be specified directly as a Sound Event ID or as a key referencing a customization setting definition.

### Customization Setting Definitions vs. Customization Settings
It is important to understand the distinction between **Setting Definitions** and **Settings (Values)**:
- **Customization Setting Definitions (`customization_setting_definitions`)**: These are unbaked schemas/blueprints declared on the Ability. They define *what* parameters can be customized, including their `type` (e.g., Sound Event, String, Integer, Resource Location, Particle), whether they are `optional`, and an optional `default_value`. Conditions, actions, and root sound properties reference these definition keys by name.
- **Customization Settings (`customization_settings`)**: These are the concrete *values* assigned to baked settings at runtime or configured as defaults in a parent Miraculous or Kamikotization. When an ability executes, it queries the player's active customization settings to resolve the current value for each definition.

When an ability is assigned to a Miraculous or Kamikotization, its definitions are baked into unique settings namespaced under that container (e.g., `<namespace>:<miraculous_id>/<ability_name>/<setting_key>`), allowing players to customize them in the customization screen!

### Conditions
You can specify a list of global `conditions` that must pass for the ability to run at all. Conditions can also reference customization setting definitions to compare dynamic setting values.

### Branches
The core logic of the ability is defined in `branches`. When the ability is performed, it iterates through its branches in order:
- **Conditions**: Each branch can have its own specific conditions.
- **Actions**: If a branch's conditions pass, its list of `actions` will be executed (e.g., applying status effects, dealing damage, spawning entities).
- If an action succeeds and triggers a `stop` signal, the ability stops executing subsequent actions and branches.

Once configured, save your file to your data pack at:
`data/<namespace>/mineraculous/ability/<id>.json`

---

## Using Abilities (Ability Instances)

Once your `Ability` is created, it must be assigned to a Miraculous or Kamikotization using an **Ability Instance**.

An Ability Instance links to your ability and allows you to override properties or supply additional setting definitions.

### Either Codec Formatting
Ability Instances are designed to be concise:
- **String Format**: If your instance uses all the defaults of the ability and needs no overrides, you can just supply the ability's ID as a shorthand string (e.g., `"mineraculous:venom"`).
- **Object Format**: If you need to supply overrides, provide it as an object with `ability` along with overridden properties (`continuous_ticks`, `start_sound`, `stop_sound`) and/or extra `customization_setting_definitions`.

> [NOTE]
> When declaring `customization_setting_definitions` on an Ability or Ability Instance, ensure every defined key corresponds to a property used by the underlying `Ability`, its conditions, or its actions. Unused customization setting definitions will generate a warning during data loading.

## Translations
In your language file (e.g., `assets/<namespace>/lang/en_us.json`), add translations for:
- Ability Names: `ability.<namespace>.<ability_id>`
- Customization Settings: `customization_setting.<namespace>.<ability_id>.<setting_id>` (for standalone ability definitions) or `customization_setting.<namespace>.<container_id>.<ability_id>.<setting_id>` (when baked within a Miraculous or Kamikotization)
