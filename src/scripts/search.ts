import xs from "xstream"
import {makeDOMDriver, DOMSource, VNode, div, input, button} from '@cycle/dom'
import {makeHTTPDriver, HTTPSource, RequestOptions} from "@cycle/http"
import { SetUrl, SetTrackList, SetTrack } from  './sc'

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
            let httpReq = { url: "", category: ''}
            return input
                ? httpReq = SetUrl(input, track, next)
                : httpReq = { url: "", category: ''}
        })

    , responseTracks$ = sources.http.select('tracks')
        .flatten()
        .map(res => res.body)
        .startWith(null)
        .map(result => {
            return result === null
                ? result
                : SetTrackList(result.collection, result.next_href)
            })

    , responseSingleTrack$ = sources.http.select('single-track')
        .flatten()
        .map(res => res.body)
        .startWith(null)
        .map(TrackData => {
            return TrackData === null
                ? ""
                : TrackData
            })

    , drawTrack$ = xs.combine(responseSingleTrack$, clickOnPlay$)
            .map(([drawTrack, playStatus]) => {
                return SetTrack(drawTrack, playStatus)
            })

    , vtree$ = xs.combine(typedSearch$, responseTracks$, drawTrack$)
            .map(([typedSearch, trackListDOM, drawTrackDOM]) => {
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
                              , drawTrackDOM
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
