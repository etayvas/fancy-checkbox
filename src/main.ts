import xs, {Stream} from "xstream"
import {run} from '@cycle/run'
import {makeDOMDriver,DOMSource, VNode, div} from '@cycle/dom'
import {makeHTTPDriver, HTTPSource, RequestOptions} from "@cycle/http"
import App from  './scripts/app'
import Time from  './scripts/time'
import { person } from "./scripts/person"
//import { Search, RecentSearch } from  './scripts/search'
import Search from  './scripts/search'
import Buttons from  './scripts/buttons'
import Image from  './scripts/image'

namespace Sources {
    export interface dom {
        dom: DOMSource
    }
    export interface http {
        http: HTTPSource
    }
}
namespace Sinks {
    export interface dom {
        dom: xs<VNode>
    }
    export interface http {
        http: xs<RequestOptions>
    }
}

interface MainSources extends Sources.dom, Sources.http{}

type MainSinks = {
       dom: xs<VNode>
       http: Stream<RequestOptions>
}

function main (sources: MainSources): MainSinks {

    console.log(person.firstName + ' ' + person.lastName);

    const app$  = App({dom: sources.dom})
        , timer$ = Time({dom: sources.dom})
        , search$ = Search({dom: sources.dom, http: sources.http})
        , buttons$ = Buttons({dom: sources.dom})
        , image$ = Image({dom: sources.dom})
        //, recentSearch$ = RecentSearch({dom: sources.dom})

        , dom$ = xs.combine(app$.dom, timer$.dom, search$.dom, buttons$.dom, image$.dom, search$.http)
            .map(([appDom, timerDom, searchDom, buttonsDom, imageDom]) => {
                return div(".main-holder", [
                      appDom
                    , timerDom
                    , searchDom
                    , buttonsDom
                    , imageDom
                    ])
                }
            )
        , sinks = {
                   dom: dom$
                 , http: search$.http
          }
    return sinks
}

const drivers = {
    dom: makeDOMDriver('#app')
  , http: makeHTTPDriver()
}

run(main, drivers)
