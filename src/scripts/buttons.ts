import xs from "xstream"
import { Sources, Sinks } from '../scripts/definitions'
import {makeDOMDriver, DOMSource, VNode, div, button} from '@cycle/dom'

interface ActionSources extends Sources.dom {}
interface ActionSinks extends Sinks.dom {}

function Button (sources: ActionSources): ActionSinks {

    const vtree$ = xs.of(
        div(".buttons-area",[
                button('.button-next',"Next")
              , button('.button-list',"List")
              , button('.button-tile',"Tile")
        ])
    )
    const sinks = {
        dom: vtree$
    }
    return sinks
}
export default Button
