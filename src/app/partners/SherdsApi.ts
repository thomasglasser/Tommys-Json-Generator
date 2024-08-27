import type {CollectionRegistry, SchemaRegistry} from '@mcschema/core';
import {Opt} from '@mcschema/core'
import {Mod, ObjectNode} from '@mcschema/core'
import {StringNode as RawStringNode} from '@mcschema/core/lib/nodes/StringNode.js'
import {Reference as RawReference} from '@mcschema/core/lib/nodes/Reference.js'

const ID = 'sherdsapi'

export function initSherdsApi(schemas: SchemaRegistry, collections: CollectionRegistry) {
	const StringNode = RawStringNode.bind(undefined, collections)
	const Reference = RawReference.bind(undefined, schemas)

	schemas.register(`${ID}:sherd`, Mod(ObjectNode({
		ingredient: Reference('recipe_ingredient_object'),
		// @ts-ignore
		pattern: Opt(StringNode({ validator: 'resource', params: { pool: '$decorated_pot_pattern' } })),
	}, {context: `${ID}:sherd`}), {
	}))
}
