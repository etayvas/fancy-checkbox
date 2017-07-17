import xs from "xstream"
import {makeDOMDriver, DOMSource, VNode, div, input, button} from '@cycle/dom'

import { GetTracks } from  './sc'

declare const SC: any


interface SearchSources {
    dom: DOMSource
}

interface SearchSinks {
    dom: xs<VNode>
}

function getTracks(query: string) : VNode{

     return SC.get('/tracks',{
            q: query
            , limit: 1// sources.limit,
            , linked_partitioning: 1
            , offset: false ? 0 + 4: 4
        })
        .then(function(tracks: any) {

            //get next set only when clicked the next button
            // if(sources.next){
            //     //get the correct offset // seems a bit weird you need to do it like this or I missed something
            //     offset = parseInt(getParameterByName('offset',tracks.next_href));
            // }
            //
            console.log(tracks.collection[0].artwork_url)
            //create list according to received tracks from SC
            // $('.search-results ul').html('');
            // $.each(tracks.collection, function(index, value) {
            //     appendTrackDom('.search-results ul','<li>',value.artwork_url,value.title, value.id);
            // })
            return div(".bla", tracks.collection[0].artwork_url)
        });
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
                                getTracks(clickedInput)
                              , div(".search-recent","[Recent searchs here]")
                          ])

                    ])
            })

    const vtree$ = xs.from(getTrack$)
            .map((getTracks) => {
                return div(".search_holder", [
                    div(".search-area",[
                          div('.search-holder',[
                                input('.search-input', "Search")
                              , button('.search-go', "Go")
                          ])
                    ])
                  , getTracks
                ])
            })



    const sinks = {
          dom: vtree$
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
