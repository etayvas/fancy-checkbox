import xs from "xstream"
import debounce from 'xstream/extra/debounce'
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


/*user intended actions*/
function intent(sources: SearchSources) {
  return {
      typedSearch$: sources.dom.select(".search-input").events("keyup")
        .map(event => (event.target as HTMLInputElement).value)
        .compose(debounce(800)) //delay when typing
        .startWith("")

    //need to remember the previous id and if differ we should simulate a click on clickOnPlay$
    , clickOnTrack$: sources.dom.select(".track-list div").events("click")
        .map(event => (event.target as HTMLInputElement).id)
        .startWith("")

    //need to reset the counter once the typedSearch$ pressed
    , clickOnNext$: sources.dom.select(".button-next").events("click")
        .fold((x) => x + 6, 0)
        .map((count) => {
            return (count+6)
        })
    , clickOnPlay$: sources.dom.select(".play").events("click")
        .fold(prev => !prev, false)
        // .mapTo(true)
        // .startWith(false)
    };
}



function Search (sources: SearchSources): SearchSinks {


    const actions = intent(sources)

    , request$ = xs.combine(actions.typedSearch$, actions.clickOnTrack$, actions.clickOnNext$)
            .filter(([input, track, next]) => input.length > 2) // filter if more than 2 chars
            .map(([input, track, next]) => {
                return SetUrl(input, track, next)
            })

    , responseTrackList$ = sources.http.select('tracks-list')
        .flatten()
        .map(res => res.body)
        .startWith(null)
        .map(result => {
            return result === null ? result : SetTrackList(result.collection)
            })

    , responseSingleTrack$ = sources.http.select('single-track')
        .flatten()
        .map(res => res.body)
        .startWith(null)
        .map(TrackData => {
            return TrackData === null ? "" : TrackData
            })

    , drawTrack$ = xs.combine(responseSingleTrack$, actions.clickOnPlay$)
            .map(([drawTrack, playStatus]) => {
                return SetTrack(drawTrack, playStatus)
            })

    , vtree$ = xs.combine(actions.typedSearch$, responseTrackList$, drawTrack$)
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
