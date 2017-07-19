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
// 
// interface TrackData extends ScSources{
//     TrackData: any
// }
//?SC.stream
//function Search (sources: SearchSources): SearchSinks {
export function DrawAndStreamTrack(TrackData: any){
    // SC.stream('/tracks/'+TrackData.id).then(function(player: any){
	//   player.play();
	// });
    return div('.track-data',[
          div(".play","[PLAY TRACK]")
        , div(".title",TrackData.title)
        //, div(".description",TrackData.description)
        , div(".created",TrackData.created_at)
        , TrackData.artwork_url ? img(".artwork",{attrs: {src: TrackData.artwork_url.replace("-large.jpg", "-t250x250.jpg")}}) : "[NO IMAGE]"
    ])
}
