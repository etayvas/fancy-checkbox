import xs from "xstream"
import {DOMSource, VNode, div} from "@cycle/dom"
import { Sources, Sinks } from '../scripts/definitions'
//import isolate from "@cycle/isolate"


function classList (elem: HTMLElement): string[] {
    return elem.className.split(" ")
}

function hasClass (elem: HTMLElement, className: string): boolean {
    return classList(elem).indexOf(className) !== -1
}

interface CheckboxSources extends Sources.dom {
    caption$: xs<string>
    checked$: xs<boolean>
}

interface CheckboxSinks extends Sinks.dom {
    checked$: xs<boolean>
}

export default function Checkbox (sources: CheckboxSources): CheckboxSinks {
    const userChecked$ = sources.dom.select(".checkbox").events("click")
            .map(event => !hasClass(event.currentTarget as HTMLDivElement, "checked"))
        , checked$ = xs.merge(userChecked$, sources.checked$)
            .remember()
        , dom$ = xs.combine(checked$, sources.caption$ )
            .map(([checked, caption]) => {
                return div(".checkbox", {class: {checked}}, [
                    div(".checkbox_input")
                  , div(".checkbox_caption", caption)
                ])
            })
    return {
        dom: dom$
      , checked$
    }
}

// export default sources => (isolate(Checkbox) as typeof Checkbox)(sources)
