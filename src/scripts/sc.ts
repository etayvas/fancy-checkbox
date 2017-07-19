import xs from "xstream"
import {makeDOMDriver, DOMSource, VNode, div, input, button} from '@cycle/dom'


declare const SC: any
let offset: any

interface ScSources {
    dom: DOMSource
}

interface ScSinks {
    dom: xs<VNode>
}

function getParameterByName(name: any, url: any): any {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
};


export function SetUrl(query:String) {
    const cid= "ggX0UomnLs0VmW7qZnCzw"
    , limit = 6
    , offset = 0
    return {
        url: "https://api.soundcloud.com/tracks?q="+query+"&limit="+limit+"&linked_partitioning=1&offset="+offset+"&format=json&client_id="+cid,
        category: 'tracks',
        method: 'GET'
    }
}

interface tracksArray {
    type: string
}
//why its working?
export function SetTrack(resCollection:Array<tracksArray>, next_href: string){
    const items = resCollection.map((item:any, index:number) => {
        console.log(item.title)
        return div('.track-'+index, item.title)
    })
    , trackList = div('.track-list',items)
    return trackList
}




// export function Stream (sources: ScSources): ScSinks {
//
//     const vtree$ = xs.of(
//         div(".image-area","[Image here]")
//     )
//     const sinks = {
//         dom: vtree$
//     }
//     return sinks
// }
//
//
// //stream track by id
// function streamSC(id){
// 	SC.stream('/tracks/'+id).then(function(player){
// 	  player.play();
// 	});
// 	console.log('streaming '+ id );
// }
