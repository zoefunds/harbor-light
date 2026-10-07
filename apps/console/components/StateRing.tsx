import type {State} from "../lib/model";
const order=["DRAFT","CHARTED","OBSERVING","CLEAR","NOTARIZED"];
export function StateRing({state}:{state:State}){const progress=Math.max(0,order.indexOf(state));return <div className={`state-ring ${state.toLowerCase()}`}><div><small>VOYAGE STATE</small><strong>{state}</strong><span>{state==="NOTARIZED"?"seal complete":`${progress}/4 stages`}</span></div></div>}
