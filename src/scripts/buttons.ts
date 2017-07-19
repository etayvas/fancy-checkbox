import xs from "xstream"
import {makeDOMDriver, DOMSource, VNode, div, button} from '@cycle/dom'

interface ActionSources {
    dom: DOMSource
}

interface ActionSinks {
    dom: xs<VNode>
}


function Action (sources: ActionSources): ActionSinks {

    const vtree$ = xs.of(
        div(".actions-area",[
                button('.action-next',"Next")
              , button('.action-list',"List")
              , button('.action-tile',"Tile")
        ])
    )
    const sinks = {
        dom: vtree$
    }
    return sinks
}
export default Action
