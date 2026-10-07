"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {ADDRESS,read} from "../lib/contract";
import {nextAction,short,type Voyage} from "../lib/model";
export function VoyageIndex(){
 const [voyages,setVoyages]=useState<Voyage[]>([]),[error,setError]=useState(""),[loading,setLoading]=useState(true);
 useEffect(()=>{(async()=>{try{setVoyages(await read("list_voyages",[0,50]) as Voyage[])}catch(e){setError(e instanceof Error?e.message:String(e))}finally{setLoading(false)}})()},[]);
 return <section className="fleet"><header><span className="kicker">FINALIZED VOYAGE INDEX</span><h1>Release signals.</h1><p>Read every voyage without connecting a wallet. Writes remain owner-signed.</p></header>{loading&&<div className="empty">Reading finalized voyages…</div>}{error&&<div className="empty"><b>Index waiting for deployment</b><p>{error}</p><code>{ADDRESS||"NEXT_PUBLIC_HARBORLIGHT_CONTRACT is not configured"}</code></div>}{!loading&&!error&&voyages.length===0&&<div className="empty"><b>No voyages yet</b><p>Chart the first release to establish the public evidence index.</p><Link className="button-link" href="/voyages/new">Open launchpad</Link></div>}{voyages.length>0&&<div className="fleet-list">{voyages.map(v=><Link href={`/voyages/${v.id}`} className="fleet-row" key={v.id}><span>{String(v.id).padStart(3,"0")}</span><div><h2>{v.title}</h2><small>{nextAction(v.state)}</small></div><code>{short(v.release_ref,10)}</code><b className={v.state.toLowerCase()}>{v.state}</b><i>↗</i></Link>)}</div>}</section>
}
