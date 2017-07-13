import xs from "xstream"
import {run} from "@cycle/run" //?
import {makeDOMDriver, DOMSource, VNode, div} from '@cycle/dom'

import  './../css//main.scss'

interface AppSources {
    dom: DOMSource
}

interface AppSinks {
    dom: xs<VNode>
}

function App (sources: AppSources): AppSinks {

     const type = "es6"
     setTimeout(() => alert(`${type} enabled!!!`), 300)

    const vtree$ = xs.of(
        div('Cycle.js app')
    )
    const sinks = {
        dom: vtree$
    }
    return sinks
}
export default App
