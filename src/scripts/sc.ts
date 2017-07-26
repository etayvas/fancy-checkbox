import xs from 'xstream'
import { Sources, Sinks } from '../scripts/definitions'
import {makeDOMDriver, DOMSource, VNode, div, img} from '@cycle/dom'

declare const SC: any

interface ScSources extends Sources.dom {}
interface ScSinks extends Sinks.dom {}

let playerExist: any
, currentTrack = ""
,is_playing = false
,player: any

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

export function SetTrack(trackData: TrackData, clickedPlay: boolean, streamStatus: boolean){
  console.log(clickedPlay)
  console.log(streamStatus)
  return div('.track-data',[
                div(".stream-status",[
                    !clickedPlay
                    ? SetIcon("play")
                    : streamStatus ? SetIcon("pause") : SetIcon("play")
              ]
            )
          , div(".title",trackData.title)
          //, div(".description",TrackData.description)
          , div(".created",trackData.created_at)
          , trackData.artwork_url ? img(".artwork",{attrs: {src: trackData.artwork_url.replace("-large.jpg", "-t250x250.jpg")}}) : "[NO IMAGE]"
      ])
}

export function StreamTrack(trackId: any, clickedPlay: boolean){
  ((clickedPlay && player === undefined) || (currentTrack !== trackId))
  ? [
    SC.stream('/tracks/'+trackId).then(function(stream: any){
      player = stream
      currentTrack = trackId
      player.pause()
    })
  ]
  : [(clickedPlay && player !== undefined) ? player.play() : player !== undefined ? player.pause() : ""]

  return ((clickedPlay && player === undefined) || (currentTrack !== trackId))
  ? true
  : (clickedPlay && player !== undefined) ? true : player !== undefined ? false : false
}
