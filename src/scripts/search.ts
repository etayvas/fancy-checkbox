import xs from "xstream"
import {makeDOMDriver, DOMSource, VNode, div, input, button} from '@cycle/dom'
import {makeHTTPDriver, HTTPSource, RequestOptions} from "@cycle/http"
import { SetUrl, SetTrackList, DrawAndStreamTrack  } from  './sc'

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
    , clickOnTrack$ = sources.dom.select(".track-list div").events("click")
        .map(event => (event.target as HTMLInputElement).id)
        .startWith("")
    , clickOnNext$ = sources.dom.select(".button-next").events("click")
        .mapTo(true)
        .startWith(false)

    , clickOnPlay$ = sources.dom.select(".play").events("click")
        .mapTo(true)
        .startWith(false)

    , request$ = xs.combine(typedSearch$, clickOnTrack$, clickOnNext$)
        .map(([input, track, next]) => {
            // let httpReq = {}
            // input
            // ? httpReq = SetUrl(input, track, next)
            // : httpReq = { url: "", category: '', method: ''}
            // return httpReq

            let httpReq = { url: "", category: ''}
            if(input){
                return httpReq = SetUrl(input, track, next)
            } else{
                //default
                return httpReq
            }
        })

    , responseTracks$ = sources.http.select('tracks')
        .flatten()
        .map(res => res.body)
        .startWith(null)
        .map(result => {
            return result === null
                ? null
                : SetTrackList(result.collection, result.next_href)
            })

    , responseSingleTrack$ = sources.http.select('single-track')
        .flatten()
        .map(res => res.body)
        .startWith(null)
        .map(TrackData => {
            return TrackData === null
                ? null
                : DrawAndStreamTrack(TrackData)
            })

    , vtree$ = xs.combine(typedSearch$, responseTracks$, responseSingleTrack$)
            .map(([typedSearch, trackListDOM, trackDataDOM]) => {
                return div(".search-holder",[
                    div('.search-field',[
                          input('.search-input',{attrs: {type: 'text', name: 'search-input', placeholder: 'Type to search'}})
                    ])
                    ,div('.search-results',[
                            !typedSearch
                            ?
                              "[Nothing typed yet]"
                            :
                                trackListDOM
                              , trackDataDOM
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
