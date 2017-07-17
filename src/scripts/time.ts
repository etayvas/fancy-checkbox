import xs from 'xstream'
import {makeDOMDriver, DOMSource, VNode, div, h1} from '@cycle/dom'

interface TimeSources {
    dom: DOMSource
}

interface TimeSinks {
    dom: xs<VNode>
}


function Time(sources: TimeSources): TimeSinks {
  const sinks = {
    dom: xs.periodic(1000).map(i =>
      h1('' + i + ' seconds elapsed')
    )
  };
  return sinks;
}

export default Time
