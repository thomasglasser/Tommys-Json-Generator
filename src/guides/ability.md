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

When creating an ability file in the generator, you will configure its global conditions, branching logic, and the customization settings it exposes. 

### Customization Settings
Abilities use `customization_settings` as a schema to define customizable parameters like sounds, durations, or visual colors. 
- You define the `type` (e.g., Sound Event, String, Integer) and an optional `default_value`.
- When an ability is used by a Miraculous via an **Ability Instance**, the instance can provide its own `customization_settings` block to override these defaults!

### Conditions
You can specify a list of global `conditions` that must pass for the ability to run at all. Conditions also contain properties that map to the customization settings.

### Branches
The core logic of the ability is defined in `branches`. When the ability is performed, it iterates through its branches in order.
- **Conditions**: Each branch can have its own specific conditions.
- **Actions**: If a branch's conditions pass, its list of `actions` will be executed (e.g., applying status effects, dealing damage, spawning entities).
- If an action succeeds and triggers a `stop` signal, the ability stops executing subsequent actions and branches.

Once configured, save your file to your data pack at:
`data/<namespace>/mineraculous/ability/<id>.json`

---

## Using Abilities (Ability Instances)

Once your `Ability` is created, it must be assigned to a Miraculous or Kamikotization using an **Ability Instance**.

An Ability Instance links to your ability and allows you to override default settings (like supplying a specific sound event for the start sound).

### Either Codec Formatting
Ability Instances are designed to be concise:
- **String Format**: If your instance uses all the default settings of the ability and has no overrides, you can just supply the ability's ID as a string! (e.g., `"mineraculous:venom"`)
- **Object Format**: If you need to supply `customization_settings`, `continuous_ticks`, or sound overrides, provide it as an object with `ability` and `customization_settings`.

> [NOTE]
> When providing `customization_settings` on an Ability Instance, ensure every setting ID corresponds to a required or optional property defined by the underlying `Ability` and its actions. Unused extra customization settings will generate a warning during data loading.

## Translations
In your language file (e.g., `assets/<namespace>/lang/en_us.json`), add translations for:
- Ability Names: `ability.<namespace>.<ability_id>`
- Customization Settings: `customization_setting.<namespace>.<ability_id>.<setting_id>`
