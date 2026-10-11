export const STATES=["DRAFT","CHARTED","OBSERVING","CLEAR","HELD","UNCERTAIN","DISPUTED","NOTARIZED"] as const;
export type State=typeof STATES[number];
export type Voyage={id:number;title:string;owner:string;state:State;generation:number;release_ref:string;candidate_origin:string;manifest_digest:string;route_index_digest:string;inventory_digest:string;route_ids:string[];review_deadline:number;aggregate:string;open_dispute:number};
export type Route={route_id:string;path:string;rules:{id:string;question:string;allowed_changes:string}[];frozen:boolean};
export type Observation={route_result?:"CLEAR"|"HELD"|"UNCERTAIN";counterclaim_status?:string;probe_digest?:string;observation_digest?:string;findings?:{rule_id:string;status:string}[]};
export const short=(v:string,n=8)=>v?`${v.slice(0,n)}…${v.slice(-4)}`:"—";
export function nextAction(state:State){return ({DRAFT:"Discover and anchor",CHARTED:"Bind candidate",OBSERVING:"Observe every route",UNCERTAIN:"Resolve missing evidence",CLEAR:"Review window active",DISPUTED:"Resolve counterclaim",HELD:"Bind a corrected candidate",NOTARIZED:"Release may proceed"} as const)[state]}
export function gateSummary(v:Voyage){return v.state==="NOTARIZED"?"Notarization is ready for independent CI verification.":`${nextAction(v.state)} before deployment can proceed.`}
