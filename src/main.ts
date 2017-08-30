import xs from 'xstream'
import {run} from '@cycle/run'
import isolate from "@cycle/isolate"
import {Sources, Sinks} from './scripts/definitions'
import {makeDOMDriver,DOMSource, VNode, div} from '@cycle/dom'
import {makeHTTPDriver, HTTPSource, RequestOptions} from '@cycle/http'
import Checkbox from "./scripts/Checkbox"
import './css/main.scss'

interface MainSources extends Sources.dom {}
interface MainSinks extends Sinks.dom {}

function main (sources: MainSources): MainSinks {

    const CB_ALL = isolate(Checkbox) as typeof Checkbox
    , cb_all = CB_ALL({dom: sources.dom, checked$: xs.of(false), caption$: xs.of("All")})
    , CB_CAT = isolate(Checkbox) as typeof Checkbox
    , cb_cat = CB_CAT({dom: sources.dom, checked$: cb_all.checked$, caption$: xs.of("Cat")})
    , CB_DOG = isolate(Checkbox) as typeof Checkbox
    , cb_dog = CB_DOG({dom: sources.dom, checked$: cb_all.checked$, caption$: xs.of("Dog")})
    , CB_FISH = isolate(Checkbox) as typeof Checkbox
    , cb_fish = CB_FISH({dom: sources.dom, checked$: cb_all.checked$, caption$: xs.of("Fish")})
    , CB_BULL = isolate(Checkbox) as typeof Checkbox
    , cb_bull = CB_BULL({dom: sources.dom, checked$: cb_all.checked$, caption$: xs.of("Bull")})
    , CB_COW = isolate(Checkbox) as typeof Checkbox
    , cb_cow = CB_COW({dom: sources.dom, checked$: cb_all.checked$, caption$: xs.of("Cow")})


    , cbDom$ = xs.combine(cb_all.dom, cb_cat.dom, cb_dog.dom, cb_fish.dom, cb_bull.dom, cb_cow.dom)
         .map(childrenDom => div(".checkboxes_holder", childrenDom))

    const dom$ = xs.combine(cbDom$)
            .map(([cbDOM]) => {
                return div(".main-holder", [
                    , div('Fancy Task')
                    , cbDOM
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
