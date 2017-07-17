import xs from "xstream"
import {makeDOMDriver, DOMSource, VNode, div} from '@cycle/dom'

interface ActionSources {
    dom: DOMSource
}

interface ActionSinks {
    dom: xs<VNode>
}


function Action (sources: ActionSources): ActionSinks {

    const vtree$ = xs.of(
        div(".actions-area",[
                div('.action-next',"Next")
              , div('.action-list',"List")
              , div('.action-tile',"Tile")
        ])
    )
    const sinks = {
        dom: vtree$
    }
    return sinks
}
export default Action
