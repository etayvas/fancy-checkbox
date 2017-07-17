import xs, {Stream} from "xstream"
import {run} from '@cycle/run'
import {makeDOMDriver,DOMSource, VNode, div} from '@cycle/dom'
import App from  './scripts/app'
import Time from  './scripts/time'
import { person } from "./scripts/person"
//import { Search, RecentSearch } from  './scripts/search'
import Search from  './scripts/search'
import Actions from  './scripts/actions'
import Image from  './scripts/image'


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
        , search$ = Search({dom: sources.dom})


        , actions$ = Actions({dom: sources.dom})
        , image$ = Image({dom: sources.dom})
        //, recentSearch$ = RecentSearch({dom: sources.dom})

        , dom$ = xs.combine(app$.dom, timer$.dom, search$.dom, actions$.dom, image$.dom)
            .map(([appDom, timerDom, searchDom, actionsDom, imageDom]) => {
                return div(".main-holder", [
                      appDom
                    , timerDom
                    , searchDom
                    , actionsDom
                    , imageDom
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
