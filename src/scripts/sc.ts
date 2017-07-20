import xs from "xstream"
import {makeDOMDriver, DOMSource, VNode, div, img} from '@cycle/dom'


declare const SC: any
let offset: any

interface ScSources {
    dom: DOMSource
}

interface ScSinks {
    dom: xs<VNode>
}
//
// function getParameterByName(name: any, url: any): any {
// 	if (!url) url = window.location.href;
// 	name = name.replace(/[\[\]]/g, "\\$&");
// 	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
// 		results = regex.exec(url);
// 	if (!results) return null;
// 	if (!results[2]) return '';
// 	return decodeURIComponent(results[2].replace(/\+/g, " "));
// };

export function SetUrl(query:String, trackId: String, next: boolean) {
    let cid= "ggX0UomnLs0VmW7qZnCzw"
    , limit = 6
    , offset = 0
    , endPoint = "tracks"
    , category = "tracks"
    , urlParams = "&q="+query+"&limit="+limit+"&linked_partitioning=1&offset="+offset

    if(next){
          offset = 6 //need to extract from url or sum the previous +6
        , urlParams = "&q="+query+"&limit="+limit+"&linked_partitioning=1&offset="+offset
    }
    if(trackId !== ""){
        endPoint = endPoint+"/"+trackId
        category = "single-track"
        urlParams = ""
    }
    return {
          url: "https://api.soundcloud.com/"+endPoint+"?format=json&client_id="+cid+urlParams
        , category: category
        //, method: 'GET' //default
    }
}

interface tracksArray {
    type: string
}

//why its working? String or string?
export function SetTrackList(resCollection:Array<tracksArray>, next_href: string){
    const items = resCollection.map((item:any, index:number) => {
        return div('.track-'+index, {attrs: {id: item.id}}, item.title)
    })
    , trackList = div('.track-list',items)
     return trackList
}

function TrackStream(TrackId: string){
    SC.stream('/tracks/'+TrackId).then(function(player: any){
	  player.play();
	});
}
interface TrackData {
    id: string
    title: string
    created_at: string
    artwork_url: string
    streamStatus: boolean
}
function TrackDom(TrackData: TrackData, isStreaming:boolean){
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

export function SetTrack(TrackData: any, streamStatus: boolean){
    streamStatus
    ? TrackStream(TrackData.id)
    : ""

    return TrackData === ""
        ? div()
        : TrackDom(TrackData, streamStatus)

}
