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

function TrackStream(TrackId: String){
    SC.stream('/tracks/'+TrackId).then(function(player: any){
	  player.play();
	});
}

function TrackDom(TrackData: TrackData, isStreaming: Boolean){
    return div('.track-data',[
          div(".play",[
              !isStreaming
              ? "[PLAY TRACK]"
              : img(".playing-gif",{attrs: {src: "http://1.bp.blogspot.com/-EzUl5CilcRo/VSWnuef153I/AAAAAAAAEBQ/7SuEWA_-Obg/s600/dj-music-mix-BenjaminMadeira-com.gif"}}, "[PLAYING TRACK]")
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

export function SetTrack(TrackData: any, streamStatus: Boolean){
    streamStatus
    ? TrackStream(TrackData.id)
    : ""

    return TrackData === ""
        ? div()
        : TrackDom(TrackData, streamStatus)
}
