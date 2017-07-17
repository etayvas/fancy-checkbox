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

interface GetTracksSources {
    dom: DOMSource
    query: any
    // limit: number
    // next: boolean
    // offset: number
 }

interface GetTracksSinks {
    dom: xs<VNode>
    query: any
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

//get track list
//query,lm,ns,os
export function GetTracks (sources: GetTracksSources): GetTracksSinks {
    console.log('in')
    SC.get('/tracks',{
        q: sources.query
        , limit: 1// sources.limit,
        , linked_partitioning: 1
        , offset: false ? 0 + 4: 4
    })
    .then(function(tracks: any) {

        //get next set only when clicked the next button
        // if(sources.next){
        //     //get the correct offset // seems a bit weird you need to do it like this or I missed something
        //     offset = parseInt(getParameterByName('offset',tracks.next_href));
        // }
        console.dir(tracks)
        //create list according to received tracks from SC
        // $('.search-results ul').html('');
        // $.each(tracks.collection, function(index, value) {
        //     appendTrackDom('.search-results ul','<li>',value.artwork_url,value.title, value.id);
        // })
    });

    const vtree$ = xs.of(
        div(".image-area","[Image here]")
    )
    const sinks = {
          dom: vtree$
        , query: sources.query
    }
    return sinks
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
