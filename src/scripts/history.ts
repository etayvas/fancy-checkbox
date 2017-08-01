import xs from "xstream"
import { Sources, Sinks } from '../scripts/definitions'
import {makeDOMDriver, DOMSource, VNode, div, button} from '@cycle/dom'

interface SHistorySources extends Sources.dom {}
interface SHistorySinks extends Sinks.dom {}

function SHistory (sources: SHistorySources): SHistorySinks {
    const history = localStorage.getItem('history')

    // const clickOnTrack$ = sources.dom.select(".track-list div").events("input")
    //     .map(event => {
    //         (event.target as HTMLInputElement).id
    //         let history:string[] = [] ;
    //         localStorage
    //         ? [
    //             localStorage.getItem('history') ? history = JSON.parse(localStorage.getItem('history') as string) : console.log('nothing in history (yet)')
    //             , history.length === 5 ? [history.shift() , history = [...history, input] ]: history = [...history, input]
    //             , localStorage.setItem('history', JSON.stringify(history))
    //             , console.log(localStorage.getItem('history'))
    //         ]
    //         :   alert("can't use localStorage") //optimally needs to add fallbacks
    //     })



    // const clickOnTrack$ = sources.dom.select(".track-list div").events("click")
    //     .map(event => {
    //         return (event.target as HTMLInputElement).id
    //     })

    // const requestSingleTrack$ = xs.combine(clickOnTrack$, actions.clickOnTrack$)
    //     // filter if more than 2 chars and we have trackId
    //     //.filter(([input, track]) => (input.length > 2 && track !== ""))
    //     .map(([input, track]) => {
    //         return {
    //               url: `https://api.soundcloud.com/tracks/${track}?format=json&client_id=${cid}`
    //             , category: "track"
    //         }
    //     })

    const vtree$ = xs.of(
        div(".search-history",
            history
            ? (JSON.parse(history) as string[])
                .map((item) => {
                    return div({dataset: {item: item}}, item)
                })
            : div()
        )
    )

    const sinks = {
        dom: vtree$
    }
    return sinks
}
export default SHistory
