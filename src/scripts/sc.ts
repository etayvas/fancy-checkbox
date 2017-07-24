import xs from 'xstream'
import { Sources, Sinks } from '../scripts/definitions'
import {makeDOMDriver, DOMSource, VNode, div, img} from '@cycle/dom'

declare const SC: any

interface ScSources extends Sources.dom {}
interface ScSinks extends Sinks.dom {}

interface TrackData {
    id: string
    title: string
    created_at: string
    artwork_url: string
    streamStatus: boolean
}

let playerExist: any
, currentTrack = ""
function TrackStream(TrackId: string){
    SC.stream('/tracks/'+TrackId).then(function(player: any){
            playerExist=player
            currentTrack = TrackId
        });
}

function TrackDom(TrackData: TrackData, isStreaming: Boolean){
    let   icon_play =  "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-play-128.png"
        , icon_pause = "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-pause-128.png"

    return div('.track-data',[
          div(".play",[
              !isStreaming
              ? div(".paused",img(".stream-status",{attrs: {src: icon_play}}))
              : div(".playing",img(".stream-status",{attrs: {src: icon_pause}}))
        ]
      )
        , div(".title",TrackData.title)
        //, div(".description",TrackData.description)
        , div(".created",TrackData.created_at)
        , TrackData.artwork_url ? img(".artwork",{attrs: {src: TrackData.artwork_url.replace("-large.jpg", "-t250x250.jpg")}}) : "[NO IMAGE]"
    ])
}

export function SetUrl(query:string, trackId: string, next: number) {
    let cid= "ggX0UomnLs0VmW7qZnCzw"
    , limit = 6
    , endPoint = trackId === "" ? "tracks/" : ("tracks/"+trackId)
    , category = trackId === "" ? "tracks-list" : "single-track"
    , offset = next > 0 ? next : 0
    , urlParams = trackId === "" ? `&q=${query}&limit=${limit}&linked_partitioning=1&offset=${offset}` : ""

    return {
          url: "https://api.soundcloud.com/"+endPoint+"?format=json&client_id="+cid+urlParams
        , category: category
    }
}

interface tracksArray {
    type: string
}
//why its working (any)? String or string?
export function SetTrackList(resCollection: Array<tracksArray>){
    const items = resCollection.map((item: any, index: Number) => {
        return div('.track-'+index, {attrs: {id: item.id}}, item.title)
    })
    , trackList = div('.track-list',items)
     return trackList
}

export function SetTrack(TrackData: any, clickStatus: boolean){

    (playerExist === undefined || currentTrack !== TrackData.id)
    ? TrackStream(TrackData.id)
    : (clickStatus ? playerExist.play() : playerExist.pause())

    return TrackData === null
        ? div()
        : TrackDom(TrackData, clickStatus)
}
