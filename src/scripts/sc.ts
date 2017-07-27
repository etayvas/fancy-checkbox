import xs from 'xstream'
import { Sources, Sinks } from '../scripts/definitions'
import {makeDOMDriver, DOMSource, VNode, div, img} from '@cycle/dom'

declare const SC: any

interface ScSources extends Sources.dom {}
interface ScSinks extends Sinks.dom {}

let playerExist: any
let currentTrack = ""
let player: any

interface TrackData {
    id: string
    title: string
    created_at: string
    artwork_url: string
    streamStatus: boolean
}
interface Item {
    id: number
    title: string
}

function SetIcon(type:string){
    let   icon_play =  "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-play-128.png"
        , icon_pause = "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-pause-128.png"

    return type === "play"
        ? div(".paused",img({attrs: {src: icon_play}}))
        : div(".playing",img({attrs: {src: icon_pause}}))
}

export function SetList(resCollection: Item[]){
    const items = resCollection.map((item, index: Number) => {
        return div('.track-'+index, {attrs: {id: item.id}}, item.title)
    })
    , trackList = div('.track-list',items)
     return trackList
}

let streaming = false
let toggleStream
export function SetTrack(trackData: TrackData){

  (player === undefined || currentTrack !== trackData.id)
  ? [
      SC.stream('/tracks/'+trackData.id).then(function(stream: any){
       player = stream
       currentTrack = trackData.id
       console.log("new file")
       player.play()
     })
  ]
  : console.log("nope")

  return div('.track-data',[
    //   div(".stream-status",[
    //                 !streaming
    //                 ? SetIcon("play")
    //                 : SetIcon("pause")
    //           ]
    //         )
    //       ,
        div(".title",trackData.title)
      //, div(".description",TrackData.description)
      , div(".created",trackData.created_at)
      , trackData.artwork_url ? img(".artwork",{attrs: {src: trackData.artwork_url.replace("-large.jpg", "-t250x250.jpg")}}) : "[NO IMAGE]"
     // ,div('.controls',SetIcon("pause"))
  ])

}
