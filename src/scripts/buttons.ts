import xs from "xstream"
import {makeDOMDriver, DOMSource, VNode, div, button} from '@cycle/dom'

interface ActionSources {
    dom: DOMSource
}

interface ActionSinks {
    dom: xs<VNode>
}


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
