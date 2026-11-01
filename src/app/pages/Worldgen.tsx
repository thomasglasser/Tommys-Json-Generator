import { Footer, GeneratorCard, GeneratorList, ToolGroup } from '../components/index.js'
import { useLocale, useTitle } from '../contexts/index.js'

interface Props {
	path?: string
}
export function Worldgen({}: Props) {
	const { locale } = useLocale()
	useTitle(locale('title.worldgen'))

	return <main>
		<div class="legacy-container worldgen">
			<div class="card-group">
				<ToolGroup title={locale('generators.popular')}>
					<GeneratorCard minimal id="dimension" />
					<GeneratorCard minimal id="worldgen/biome" />
					<GeneratorCard minimal id="worldgen/noise_settings" />
					<GeneratorCard minimal id="worldgen/configured_feature" />
					<GeneratorCard minimal id="worldgen/placed_feature" />
				</ToolGroup>
			</div>
			<GeneratorList predicate={gen => gen.tags?.includes('worldgen')} />
		</div>
		<Footer />
	</main>
}
