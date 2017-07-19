import xs from "xstream"
import {makeDOMDriver, DOMSource, VNode, div, input, button} from '@cycle/dom'
import {makeHTTPDriver, HTTPSource, RequestOptions} from "@cycle/http"
import { SetUrl, SetTrack  } from  './sc'

declare const SC: any

interface SearchSources {
    dom: DOMSource
    http: HTTPSource
}

interface SearchSinks {
    dom: xs<VNode>
    http: xs<RequestOptions>
}


function Search (sources: SearchSources): SearchSinks {

    const typedSearch$ = sources.dom.select(".search-input").events("keyup")
                .map(event => (event.target as HTMLInputElement).value)
                .startWith("")

    , request$ = xs.from(typedSearch$)
        .map((input) => {
            // let httpReq = {}
            // input
            // ? httpReq = SetUrl(input)
            // : httpReq = { url: "", category: '', method: ''}
            // return httpReq

            let httpReq = { url: "", category: '', method: ''}
            if(input){
                return httpReq = SetUrl(input)
            } else{
                //default
                return httpReq
            }
        })

    , response$ = sources.http.select('tracks')
        .flatten()
        .map(res => res.body).debug('res.body')
        .startWith(null)
        .map(result => {
                return div('.response', [
                  result === null
                  ? null
                  : div('.track-list', [
                      SetTrack(result.collection, result.next_href)
                    ])
                ])
            })

    , vtree$ = xs.combine(typedSearch$, response$)
            .map(([typedSearch, responseDOM]) => {
                return div("main-search",[
                    div(".search_holder", [
                        div(".search-area",[
                              div('.search-holder',[
                                    input('.search-input',{attrs: {type: 'text', name: 'search-input', placeholder: 'Type to search'}}, "Search")
                              ])
                        ])
                    ])
                    ,div('.search-results-holder',[
                            !typedSearch
                            ?
                              "[Nothing yet]"
                            :
                              div(".search-results",[
                                    responseDOM
                                  , div(".search-recent","[Recent searchs here]")
                              ])
                        ])
                    ])
                })

    , sinks = {
            dom: vtree$
          , http: request$
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
