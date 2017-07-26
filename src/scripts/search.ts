import xs from 'xstream'
import debounce from 'xstream/extra/debounce'
import { Sources, Sinks } from '../scripts/definitions'
import {makeDOMDriver, DOMSource, VNode, div, input, button} from '@cycle/dom'
import {makeHTTPDriver, HTTPSource, RequestOptions} from "@cycle/http"
import { SetList, SetTrack, StreamTrack} from  './sc'

interface SearchSources extends Sources.dom,Sources.http {}
interface SearchSinks extends Sinks.dom,Sinks.http {}

/*user intended actions*/
function intent(sources: SearchSources) {
  return {
      typedSearch$: sources.dom.select(".search-input").events("keyup")
        .map(event => (event.target as HTMLInputElement).value)
        .compose(debounce(800)) //delay when typing
        .startWith("")
    , clickOnTrack$: sources.dom.select(".track-list div").events("click")
        .map(event => (event.target as HTMLInputElement).id)
        .startWith("")
    , clickOnNext$: sources.dom.select(".button-next").events("click")
        .fold((x) => x + 6, 0)
        .map((count) => {
            return (count+6)
        })
    , clickOnPlay$: sources.dom.select(".stream-status").events("click")
        .fold(prev => !prev, false)
    // , clickOnStreamIcon$: sources.dom.select(".stream-status div").events("click")
    //     //.map(event => (event.currentTarget as HTMLInputElement).getAttribute("data-stream") as string)
    //     .map(event => (event.currentTarget as HTMLInputElement).className)
    //     .startWith("paused")
    };
}

function Search (sources: SearchSources): SearchSinks {
    const actions = intent(sources)
    const cid= "ggX0UomnLs0VmW7qZnCzw"

    , requestTrackList$ = xs.combine(actions.typedSearch$, actions.clickOnNext$)
        // filter if more than 2 chars
        .filter(([input, next]) => input.length > 2)
        .map(([input, next]) => {
        return {
              url: `https://api.soundcloud.com/tracks?format=json&client_id=${cid}&q=${input}&limit=6&linked_partitioning=1&offset=${next > 0 ? next : 0 }`
            , category: "list"
            }
        })
    , requestSingleTrack$ = xs.combine(actions.typedSearch$, actions.clickOnTrack$)
        // filter if more than 2 chars and we have trackId
        .filter(([input, track]) => (input.length > 2 && track !== ""))
        .map(([input, track]) => {
            return {
                  url: `https://api.soundcloud.com/tracks/${track}?format=json&client_id=${cid}`
                , category: "track"
            }
        })
    , http$ = xs.merge(
        requestTrackList$
      , requestSingleTrack$
    )
    , resList$ = sources.http.select('list')
        .flatten()
        .map(res => res.body)
        .startWith(null)
    , list$ = xs.combine(resList$, actions.typedSearch$)
        .map(([list, input]) => {
            return list === null ? null : SetList(list.collection)
        })
    , resTrack$ = sources.http.select('track')
        .flatten()
        .map(res => res.body)
        .startWith(null)

    , stream$ = xs.combine(actions.clickOnTrack$, actions.clickOnPlay$)
        .map(([trackId, clickOnPlay]) => {
          return StreamTrack(trackId, clickOnPlay)
        }).debug("stream$")

      , track$ = xs.combine(resTrack$, actions.clickOnPlay$, stream$)
      //.filter(([trackData, trackClickId, playClick]) => trackClickId !== "" )
      .map(([trackData, playStatus, streamStatus]) => {
          return (trackData)
          ? SetTrack(trackData, playStatus, streamStatus)
          : div()
        })




    , vtree$ = xs.combine(actions.typedSearch$, list$,  track$)
            .map(([typedSearch, listDOM, trackDOM]) => {
                return div(".search-holder",[
                    div('.search-field',[
                          input('.search-input',{attrs: {type: 'text', name: 'search-input', placeholder: 'Type to search', value:'re'}})
                    ])
                    ,div('.search-results',[
                            ...(!typedSearch
                                ? [div()]
                                : [listDOM, trackDOM])
                        ])
                    ])
                })

    , sinks = {
            dom: vtree$
          , http: http$
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
