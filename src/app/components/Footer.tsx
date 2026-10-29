import { useLocale } from '../contexts/index.js'
import { SOURCE_REPO_URL } from '../Utils.js'
import { Octicon } from './index.js'

interface Props {
	donate?: boolean,
}
export function Footer({ donate }: Props) {
	const { locale } = useLocale()

	return <footer>
		<div>
			<p>
				<span>{locale('developed_by')} <a href="https://github.com/misode" target="_blank" rel="noreferrer">Misode</a></span>
			</p>
			{donate !== false && <p class="donate">
				{Octicon.heart}
				<a href="https://ko-fi.com/misode" target="_blank" rel="noreferrer">{locale('donate_misode')}</a>
			</p>}
		</div>
		<div>
			<p>
				{Octicon.mark_github}
				<span>{locale('source_code_on')} <a href={SOURCE_REPO_URL} target="_blank" rel="noreferrer">{locale('github')}</a></span>
			</p>
			{donate !== false && <p className="donate">
				{Octicon.heart}
				<a href="https://buymeacoffee.com/thomasglasser" target="_blank" rel="noreferrer">{locale('donate_tommy')}</a>
			</p>}
		</div>
	</footer>
}
