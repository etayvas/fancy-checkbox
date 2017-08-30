import xs from 'xstream'
import {DOMSource, VNode} from '@cycle/dom'

export namespace Sources {
    export interface dom {
        dom: DOMSource
    }
}
export namespace Sinks {
    export interface dom {
        dom: xs<VNode>
    }
}
