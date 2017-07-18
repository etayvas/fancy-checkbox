import xs from "xstream"
import {makeDOMDriver, DOMSource, VNode, div, input, button} from '@cycle/dom'
import {makeHTTPDriver, HTTPSource, RequestOptions} from "@cycle/http"
import { GetTracks } from  './sc'

declare const SC: any

interface SearchSources {
    dom: DOMSource
    http: HTTPSource
}

interface SearchSinks {
    dom: xs<VNode>
    http: xs<RequestOptions>
}

function setTrack(res: any){
    const items = res.map((item:any, index:number) => {
        console.log(item.title)
        return div('.track-'+index, item.title)
    })
    , trackList = div('.track-list',items)
    return trackList
}

function setUrl(query:String) {
    return {
        url: "https://api.soundcloud.com/tracks?q="+query+"&limit=6&linked_partitioning=1&offset=6&format=json&client_id=ggX0UomnLs0VmW7qZnCzw",
        category: 'tracks',
        method: 'GET'
    }
}

function Search (sources: SearchSources): SearchSinks {

    const clickedInput$ = sources.dom.select(".search-input").events("keyup")
                .map(event => (event.target as HTMLInputElement).value)
                //.filter(input => input !== "")
                .startWith("")

    , clickedGo$ = sources.dom.select(".search-go").events("click")
            .mapTo(true)
            .startWith(false)

    , request$ = xs.combine(clickedGo$, clickedInput$)
        .map(([click,input]) => {
            // click
            // ? ( setUrl(input))
            // : ( setUrl(input) )

            if(click){
                return setUrl(input)
            } else{
                return setUrl(input)
            }

        })

    // , request2$ = clickedGo$
    //     .map(() => {
    //         return {
    //             url: "https://api.soundcloud.com/tracks?q=asd&limit=6&linked_partitioning=1&offset=6&format=json&client_id=ggX0UomnLs0VmW7qZnCzw",
    //             category: 'tracks',
    //             method: 'GET'
    //         };
    //     })

    , response$ = sources.http.select('tracks')
        .flatten()
        .map(res => res.body.collection).debug('res.body.collection')
        .startWith(null)
        .map(result => {
                return div('.response', [
                  result === null
                  ? null
                  : div('.track-list', [
                      setTrack(result)
                    ])
                ])
            })

    , vtree$ = xs.combine(clickedGo$, clickedInput$, response$)
            .map(([clickedGo, clickedInput, responseDOM]) => {
                return div("main-search",[
                    div(".search_holder", [
                        div(".search-area",[
                              div('.search-holder',[
                                    input('.search-input', "Search")
                                  , button('.search-go', "Go")
                              ])
                        ])
                    ])
                    ,div('.search-results-holder',[
                            !clickedGo
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
