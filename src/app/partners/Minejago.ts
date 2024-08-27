import {CollectionRegistry, MapNode, SchemaRegistry} from '@mcschema/core'
import {BooleanNode, Case, ListNode, Mod, NumberNode, ObjectNode, Opt, Switch} from '@mcschema/core'
import {Reference as RawReference} from '@mcschema/core/lib/nodes/Reference.js'
import {StringNode as RawStringNode} from '@mcschema/core/lib/nodes/StringNode.js'
import {initTextComponentSchemas} from '@mcschema/java-1.19.4/lib/schemas/TextComponent.js';
import {TextColorKeys} from "../components/TextComponent.js";

const ID = 'minejago'

export function initMinejago(schemas: SchemaRegistry, collections: CollectionRegistry) {
	const Reference = RawReference.bind(undefined, schemas)
	const StringNode = RawStringNode.bind(undefined, collections)

	initTextComponentSchemas(schemas, collections)

	schemas.register(`${ID}:minejago_recipe`, Mod(ObjectNode({
		type: StringNode({ validator: 'resource', params: { pool: 'recipe_serializer' } }),
		[Switch]: [{ push: 'type' }],
		[Case]: {
			'minejago:teapot_brewing': {
				group: Opt(StringNode()),
				base: StringNode({ validator: 'resource', params: { pool: 'potion' } }),
				ingredient: Reference('recipe_ingredient_object'),
				result: StringNode({ validator: 'resource', params: { pool: 'potion' } }),
				experience: Opt(NumberNode()),
				cookingtime: Opt(NumberNode({ integer: true })),
			},
		},
	}, { context: `${ID}:minejago_recipe`, disableSwitchContext: true }), {
		default: () => ({
			type: 'minejago:teapot_brewing',
			base: 'minecraft:water',
			result: 'minejago:milk',
		}),
	}))

	schemas.register('display', Mod(ObjectNode({
		lore: Opt(Reference('text_component')),
		description: Opt(Reference('text_component')),
	}, {context: 'display'}), {
	}))

	schemas.register('vector_3f', Mod(ListNode(
		NumberNode({integer: true}),
		{minLength: 3, maxLength: 3}
	), {
		default: () => [0, 0, 0],
	}))

	schemas.register(`${ID}:power`, Mod(ObjectNode({
		id: StringNode(),
		power_color: Opt(StringNode({ enum: TextColorKeys, additional: true })),
		tagline: Opt(Reference('text_component')),
		main_spinjitzu_color: Opt(Reference('vector_3f')),
		alt_spinjitzu_color: Opt(Reference('vector_3f')),
		// @ts-ignore
		border_particle: Opt(StringNode({ validator: 'resource', params: { pool: '$particle_type' } })),
		has_sets: Opt(BooleanNode()),
		display: Opt(Reference('display')),
		is_special: Opt(BooleanNode()),
	}, { context: `${ID}:power` }), {
		default: () => ({
		}),
	}))

	schemas.register(`${ID}:focus_modifier_blockstate`, Mod(ObjectNode({
		state: Opt(Reference('block_state')),
		block: Opt(StringNode({ validator: 'resource', params: { pool: 'block' } })),
		modifier: NumberNode({ integer: false }),
		operation: StringNode({ enum: ['addition', 'subtraction', 'multiplication', 'division'] }),
	}, { context: `${ID}:focus_modifier_blockstate` }), {
		default: () => ({
		}),
	}))

	schemas.register(`${ID}:focus_modifier_entity`, Mod(ObjectNode({
		entity_type: StringNode({ validator: 'resource', params: { pool: 'entity_type' } }),
		nbt: Opt(MapNode(
			StringNode(),
			StringNode(),
		)),
		modifier: NumberNode({ integer: false }),
		operation: StringNode({ enum: ['addition', 'subtraction', 'multiplication', 'division'] }),
	}, { context: `${ID}:focus_modifier_entity` }), {
		default: () => ({
		}),
	}))

	// schemas.register(`${ID}:focus_modifier_itemstack`, Mod(ObjectNode({
	// 	stack: Opt(Reference('item_stack')),
	// 	item: Opt(StringNode({ validator: 'resource', params: { pool: 'item' } })),
	// 	modifier: NumberNode({ integer: false }),
	// 	operation: StringNode({ enum: ['addition', 'subtraction', 'multiplication', 'division'] }),
	// }, { context: `${ID}:focus_modifier_itemstack` }), {
	// 	default: () => ({
	// 	}),
	// }))
}
