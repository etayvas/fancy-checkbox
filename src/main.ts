import xs from 'xstream'
import {run} from '@cycle/run'
import { Sources, Sinks } from './scripts/definitions'
import {makeDOMDriver,DOMSource, VNode, div} from '@cycle/dom'
import {makeHTTPDriver, HTTPSource, RequestOptions} from '@cycle/http'
import Search from  './scripts/search'
import Buttons from  './scripts/buttons'
import Checkbox from "./scripts/Checkbox"
import './css/main.scss'

interface MainSources extends Sources.dom, Sources.http{}
interface MainSinks extends Sinks.dom,Sinks.http {}

function main (sources: MainSources): MainSinks {

    const cb_all = Checkbox({dom: sources.dom, checked$: xs.of(false), caption$: xs.of("All")})
        , cb_pending = Checkbox({dom: sources.dom, checked$: cb_all.checked$, caption$: xs.of("Pending")})
        , cb_active = Checkbox({dom: sources.dom, checked$: cb_all.checked$, caption$: xs.of("Active")})
        , cb_released = Checkbox({dom: sources.dom, checked$: cb_all.checked$, caption$: xs.of("Released")})
        , cb_deleted = Checkbox({dom: sources.dom, checked$: cb_all.checked$, caption$: xs.of("Deleted")})
        , cb_expired = Checkbox({dom: sources.dom, checked$: cb_all.checked$, caption$: xs.of("Expired")})

        , cbDom$ = xs.combine(cb_all.dom, cb_pending.dom, cb_active.dom, cb_released.dom, cb_deleted.dom, cb_expired.dom)
             .map(childrenDom => div(".checkboxes_holder", childrenDom))

    const search$ = Search({dom: sources.dom, http: sources.http})
        , buttons$ = Buttons({dom: sources.dom})
        , dom$ = xs.combine(search$.dom, buttons$.dom, cbDom$)
            .map(([searchDOM, buttonsDOM, cbDOM]) => {
                return div(".main-holder", [
                    , div('SC CycleJS')
                    , cbDOM
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
