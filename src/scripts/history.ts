import xs from "xstream"
import { Sources, Sinks } from '../scripts/definitions'
import {makeDOMDriver, DOMSource, VNode, div, button} from '@cycle/dom'

interface SHistorySources extends Sources.dom {}
interface SHistorySinks extends Sinks.dom {}

function SHistory (sources: SHistorySources): SHistorySinks {
    const history = localStorage.getItem('history')
    const vtree$ = xs.of(
        div(".search-history",
            history
            ? (JSON.parse(history) as string[])
                .map((item) => {
                    return div({dataset: {item: item}}, item)
                })
            : div()
        )
    )

    const sinks = {
        dom: vtree$
    }
    return sinks
}
export default SHistory
