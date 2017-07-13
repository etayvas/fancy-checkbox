import xs, {Stream} from "xstream"
import {run} from '@cycle/run'
import {makeDOMDriver,DOMSource, VNode, div} from '@cycle/dom'
import App from  './scripts/app'
import Time from  './scripts/time'
import { person } from "./scripts/person";

namespace Sources {
    export interface dom {
        dom: DOMSource
    }
}
namespace Sinks {
    export interface dom {
        dom: xs<VNode>
    }
}

interface MainSources extends Sources.dom{}

type MainSinks = {
       dom: xs<VNode>
}


function main (sources: MainSources): MainSinks {

    console.log(person.firstName + ' ' + person.lastName);

    const app$  = App({dom: sources.dom})
        , timer$ = Time({dom: sources.dom})
        //, dom$ = app.dom
            // .mapTo(app.dom)
            // .startWith(app.dom)
            // .flatten()
            //
        , dom$ = xs.combine(app$.dom, timer$.dom)
            .map(([appDom, timerDom]) => {
                return div(".bla", [
                      appDom
                    , timerDom
                    ])
                }
            )
        , sinks = {
                 dom: dom$
          }
    return sinks
}

const drivers = {
  dom: makeDOMDriver('#app')
}

run(main, drivers)
