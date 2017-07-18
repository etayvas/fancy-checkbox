import xs, {Stream} from "xstream"
import {run} from '@cycle/run'
import {makeDOMDriver,DOMSource, VNode, div} from '@cycle/dom'
import {makeHTTPDriver, HTTPSource, RequestOptions} from "@cycle/http"
import App from  './scripts/app'
import Time from  './scripts/time'
import { person } from "./scripts/person"
//import { Search, RecentSearch } from  './scripts/search'
import Search from  './scripts/search'
import Actions from  './scripts/actions'
import Image from  './scripts/image'

declare const SC: any

namespace Sources {
    export interface dom {
        dom: DOMSource
    }
    export interface http {
        http: HTTPSource
    }
}
namespace Sinks {
    export interface dom {
        dom: xs<VNode>
    }
    export interface http {
        http: xs<RequestOptions>
    }
}

interface MainSources extends Sources.dom, Sources.http{}

type MainSinks = {
       dom: xs<VNode>

}

function main (sources: MainSources): MainSinks {

    console.log(person.firstName + ' ' + person.lastName);


    const request$ = sources.dom.select('.search-go').events('click')
      .map(() => {
        //   const setupURL = SC.get('/tracks',{
        //               q: "britney"
        //               , limit: 1// sources.limit,
        //               , linked_partitioning: 1
        //               , offset: false ? 0 + 4: 4
        //           })
        //           console.debug(setupURL._result)
        return {
          url: "https://api.soundcloud.com/tracks?q=asd&limit=6&linked_partitioning=1&offset=6&format=json&client_id=ggX0UomnLs0VmW7qZnCzw",
          category: 'tracks',
          method: 'GET'
        };
      });

      const vtreeHttp$ = sources.http.select('tracks')
        .flatten()
        .map(res => res.body).debug('123')
        .startWith(null)
        .map(result =>
          div([
            //h2('.label', `Random number from server: ${result.number}`)
            console.dir(result)
        ])
    )

    const app$  = App({dom: sources.dom})
        , timer$ = Time({dom: sources.dom})
        , search$ = Search({dom: sources.dom})
        , actions$ = Actions({dom: sources.dom})
        , image$ = Image({dom: sources.dom})
        //, recentSearch$ = RecentSearch({dom: sources.dom})

        , dom$ = xs.combine(app$.dom, timer$.dom, search$.dom, actions$.dom, image$.dom, vtreeHttp$)
            .map(([appDom, timerDom, searchDom, actionsDom, imageDom, vtreeHttp]) => {
                return div(".main-holder", [
                      appDom
                    , timerDom
                    , searchDom
                    , actionsDom
                    , imageDom
                    , vtreeHttp
                    ])
                }
            )
        , sinks = {
                   dom: dom$
                 , http: request$
          }
    return sinks
}

const drivers = {
    dom: makeDOMDriver('#app')
  , http: makeHTTPDriver()
}

run(main, drivers)
