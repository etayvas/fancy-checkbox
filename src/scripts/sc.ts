import xs from 'xstream'
import { Sources, Sinks } from '../scripts/definitions'
import {makeDOMDriver, DOMSource, VNode, div, img} from '@cycle/dom'

declare const SC: any

interface ScSources extends Sources.dom {}
interface ScSinks extends Sinks.dom {}

let playerExist: any
, currentTrack = ""
function TrackStream(TrackId: string){
    SC.stream('/tracks/'+TrackId).then(function(player: any){
            playerExist=player
            currentTrack = TrackId
        });
}

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
        ? div(".paused",img(".stream-status",{attrs: {src: icon_play}}))
        : div(".playing",img(".stream-status",{attrs: {src: icon_pause}}))
}

//is TrackData ok when partly
function TrackDom(TrackData: TrackData, isStreaming: boolean){

    return div('.track-data',[
              div(".play",[
                  !isStreaming
                  ? SetIcon("play")
                  : SetIcon("pause")
            ]
          )
        , div(".title",TrackData.title)
        //, div(".description",TrackData.description)
        , div(".created",TrackData.created_at)
        , TrackData.artwork_url ? img(".artwork",{attrs: {src: TrackData.artwork_url.replace("-large.jpg", "-t250x250.jpg")}}) : "[NO IMAGE]"
    ])
}

export function SetList(resCollection: Item[]){
    const items = resCollection.map((item, index: Number) => {
        return div('.track-'+index, {attrs: {id: item.id}}, item.title)
    })
    , trackList = div('.track-list',items)
     return trackList
}

export function SetTrack(trackData: any, clickPlayStatus: boolean, trackClickId: string){
    //??can currentTrack be used with remember()?
    ( (playerExist === undefined && clickPlayStatus) || (currentTrack !== trackData.id) )
    ? TrackStream(trackData.id) //stream/restream if play
    : (clickPlayStatus ? playerExist.play() : playerExist.pause())

    return TrackDom(trackData, clickPlayStatus)
}
