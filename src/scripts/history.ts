import xs from "xstream"
import delay from 'xstream/extra/delay'
import { Sources, Sinks } from '../scripts/definitions'
import {makeDOMDriver, DOMSource, VNode, div, button} from '@cycle/dom'

interface SHistorySources extends Sources.dom {}
interface SHistorySinks extends Sinks.dom {}

let   LSStatus = false
    , prevInput = ""
function SHistory (sources: SHistorySources): SHistorySinks {

    const input$ = sources.dom.select(".search-input").events("input")
        .map(event =>  (event.target as HTMLInputElement).value )
        .startWith("")

    , clickOnTrack$ = sources.dom.select(".track-list div").events("click")
        .map(event =>  {
            LSStatus = true
            return true
        }
    )
    .startWith(false)

    , updateLS$ = xs.combine(clickOnTrack$, input$)
        .map(([track, input]) => {

            if(LSStatus && prevInput !== input && input.length > 2){

                let history:string[] = [] ;
                localStorage
                ? [
                    localStorage.getItem('history') && input !== "" ? history = JSON.parse(localStorage.getItem('history') as string) : ""
                    , history.length === 5 ? [history.shift() , history = [...history, input] ]: history = [...history, input]
                    , localStorage.setItem('history', JSON.stringify(history))
                    , console.log(localStorage.getItem('history'))
                ]
                :   alert("can't use localStorage") //optimally needs to add fallbacks

                LSStatus = false
                prevInput = input
            }
        })


    , history = localStorage.getItem('history')
    , historyDOM$ = xs.of(
        div(".search-history",
            history
            ? (JSON.parse(history) as string[])
                .map((item) => {
                    return div({dataset: {item: item}}, item)
                })
            : div()
        )
    )

    , vtree$ = xs.combine(historyDOM$, updateLS$)
            .map(([v2, update]) => {
                return v2
                })

    const sinks = {
        dom: vtree$
    }
    return sinks
}
export default SHistory
