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
                    console.log(item)
                    return div('.aaa', item)
                })
            : div()
        )
    )

    const sinks = {
        dom: vtree$.debug()
    }
    return sinks
}
export default SHistory
