import type {CollectionRegistry, SchemaRegistry} from '@mcschema/core'
import { MapNode} from '@mcschema/core'
import {BooleanNode, Case, Mod, NumberNode, ObjectNode, Opt, Switch} from '@mcschema/core'
import {Reference as RawReference} from '@mcschema/core/lib/nodes/Reference.js'
import {StringNode as RawStringNode} from '@mcschema/core/lib/nodes/StringNode.js'
import {TextColorKeys} from '../components/TextComponent.js'

export function initMinejago(schemas: SchemaRegistry, collections: CollectionRegistry) {
	const Reference = RawReference.bind(undefined, schemas)
	const StringNode = RawStringNode.bind(undefined, collections)

	const modRecipeTypes = ['minejago:teapot_brewing'];

	schemas.register('minejago:mod_recipe', Mod(ObjectNode({
		type: StringNode({ validator: 'resource', params: { pool: modRecipeTypes } }),
		[Switch]: [{ push: 'type' }],
		[Case]: {
			'minejago:teapot_brewing': {
				group: Opt(StringNode()),
				base: StringNode({ validator: 'resource', params: { pool: 'potion' } }),
				ingredient: Reference('recipe_ingredient_object'),
				result: StringNode({ validator: 'resource', params: { pool: 'potion' } }),
				experience: Opt(NumberNode()),
				brewing_time: Opt(Reference('int_provider')),
			},
		},
	}, { context: 'minejago:mod_recipe', disableSwitchContext: true }), {
		default: () => ({
		}),
	}))

	schemas.register('display', Mod(ObjectNode({
		lore: Opt(Reference('text_component')),
		description: Opt(Reference('text_component')),
	}, {context: 'display'}), {
	}))

	schemas.register('minejago:power', Mod(ObjectNode({
		id: StringNode(),
		power_color: Opt(StringNode({ enum: TextColorKeys, additional: true })),
		tagline: Opt(Reference('text_component')),
		// @ts-ignore
		border_particle: Opt(StringNode({ validator: 'resource', params: { pool: '$particle_type' } })),
		has_sets: Opt(BooleanNode()),
		display: Opt(Reference('display')),
		is_special: Opt(BooleanNode()),
	}, { context: 'minejago:power' }), {
		default: () => ({
		}),
	}))

	schemas.register('minejago:focus_modifier_blockstate', Mod(ObjectNode({
		state: Opt(Reference('block_state')),
		block: Opt(StringNode({ validator: 'resource', params: { pool: 'block' } })),
		modifier: NumberNode({ integer: false }),
		operation: StringNode({ enum: ['addition', 'subtraction', 'multiplication', 'division'] }),
	}, { context: 'minejago:focus_modifier_blockstate' }), {
		default: () => ({
		}),
	}))

	schemas.register('minejago:focus_modifier_entity', Mod(ObjectNode({
		entity_type: StringNode({ validator: 'resource', params: { pool: 'entity_type' } }),
		nbt: Opt(MapNode(
			StringNode(),
			StringNode(),
		)),
		modifier: NumberNode({ integer: false }),
		operation: StringNode({ enum: ['addition', 'subtraction', 'multiplication', 'division'] }),
	}, { context: 'minejago:focus_modifier_entity' }), {
		default: () => ({
		}),
	}))

	schemas.register('minejago:focus_modifier_itemstack', Mod(ObjectNode({
		stack: Opt(Reference('item_stack')),
		item: Opt(StringNode({ validator: 'resource', params: { pool: 'item' } })),
		modifier: NumberNode({ integer: false }),
		operation: StringNode({ enum: ['addition', 'subtraction', 'multiplication', 'division'] }),
	}, { context: 'minejago:focus_modifier_itemstack' }), {
		default: () => ({
		}),
	}))

	schemas.register('minejago:focus_modifier_biome', Mod(ObjectNode({
		key: StringNode({ validator: 'resource', params: { pool: '$worldgen/biome' } }),
		modifier: NumberNode({ integer: false }),
		operation: StringNode({ enum: ['addition', 'subtraction', 'multiplication', 'division'] }),
	}, { context: 'minejago:focus_modifier_biome' }), {
		default: () => ({
		}),
	}))

	schemas.register('minejago:focus_modifier_dimension', Mod(ObjectNode({
		key: StringNode({ validator: 'resource', params: { pool: '$dimension' } }),
		modifier: NumberNode({ integer: false }),
		operation: StringNode({ enum: ['addition', 'subtraction', 'multiplication', 'division'] }),
	}, { context: 'minejago:focus_modifier_dimension' }), {
		default: () => ({
		}),
	}))

	schemas.register('minejago:focus_modifier_mob_effect', Mod(ObjectNode({
		key: StringNode({ validator: 'resource', params: { pool: 'mob_effect' } }),
		modifier: NumberNode({ integer: false }),
		operation: StringNode({ enum: ['addition', 'subtraction', 'multiplication', 'division'] }),
	}, { context: 'minejago:focus_modifier_mob_effect' }), {
		default: () => ({
		}),
	}))

	schemas.register('minejago:focus_modifier_structure', Mod(ObjectNode({
		key: StringNode({ validator: 'resource', params: { pool: '$structure' } }),
		modifier: NumberNode({ integer: false }),
		operation: StringNode({ enum: ['addition', 'subtraction', 'multiplication', 'division'] }),
	}, { context: 'minejago:focus_modifier_structure' }), {
		default: () => ({
		}),
	}))

	schemas.register('minejago:focus_modifier_world', Mod(ObjectNode({
		day_time: Opt(Reference('int_provider')),
		weather: Opt(StringNode({ enum: ['clear', 'rain', 'thunder_rain', 'snow', 'thunder_snow'] })),
		y: Opt(Reference('int_provider')),
		temperature: Opt(Reference('int_provider')),
		modifier: NumberNode({ integer: false }),
		operation: StringNode({ enum: ['addition', 'subtraction', 'multiplication', 'division'] }),
	}, { context: 'minejago:focus_modifier_world' }), {
		default: () => ({
		}),
	}))
}
