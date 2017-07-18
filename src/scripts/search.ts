import xs from "xstream"
import {makeDOMDriver, DOMSource, VNode, div, input, button} from '@cycle/dom'
/////import {makeHTTPDriver, HTTPSource, RequestOptions} from "@cycle/http"
import { GetTracks } from  './sc'

declare const SC: any

interface SearchSources {
    dom: DOMSource
    ///////http: HTTPSource
}

interface SearchSinks {
    dom: xs<VNode>
////    http: xs<RequestOptions>
}

function Search (sources: SearchSources): SearchSinks {

    const clickedInput$ = sources.dom.select(".search-input").events("keyup")
                .map(event => (event.target as HTMLInputElement).value)
                //.filter(input => input !== "")
                .startWith("test").debug()

    const clickedGo$ = sources.dom.select(".search-go").events("click")
            .mapTo(true)
            .startWith(false)


    const getTrack$ = xs.combine(clickedGo$, clickedInput$)
            .map(([clickedGo, clickedInput]) => {

                return div('.search-results-holder',[
                        !clickedGo
                        ?
                          "[Nothing yet]"
                        :
                          div(".search-results",[
                            //////////    getTracks(clickedInput, sources.http)
                              , div(".search-recent","[Recent searchs here]")
                          ])

                    ])
            })

    const vtree$ = xs.from(getTrack$)
            .map((drawSearch) => {
                return div(".search_holder", [
                    div(".search-area",[
                          div('.search-holder',[
                                input('.search-input', "Search")
                              , button('.search-go', "Go")
                          ])
                    ])
                  , drawSearch
                ])
            })



    const sinks = {
            dom: vtree$
    //      , http: sources.http
    }
    return sinks
}
export default Search


// export function RecentSearch (sources: SearchSources): SearchSinks {
//
//     const vtree$ = xs.of(
//         div(".search-recent","[Recent searchs here]")
//
//     )
//     const sinks = {
//         dom: vtree$
//     }
//     return sinks
// }
