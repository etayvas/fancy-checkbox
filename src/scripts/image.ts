import xs from "xstream"
import {makeDOMDriver, DOMSource, VNode, div} from '@cycle/dom'

interface ImageSources {
    dom: DOMSource
}

interface ImageSinks {
    dom: xs<VNode>
}


function Image (sources: ImageSources): ImageSinks {

    const vtree$ = xs.of(
        div(".image-area","[Image here]")
    )
    const sinks = {
        dom: vtree$
    }
    return sinks
}
export default Image
