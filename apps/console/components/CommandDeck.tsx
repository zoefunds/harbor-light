"use client";
import {useState} from "react";
import type {CalldataEncodable} from "genlayer-js/types";
import {write} from "../lib/contract";
import type {Voyage} from "../lib/model";
import {DEMO_INPUTS} from "../lib/demo";

export function CommandDeck({voyage,onComplete}:{voyage:Voyage;onComplete:()=>void}){
  const [route,setRoute]=useState(voyage.route_ids[0]||"");
  const [candidate,setCandidate]=useState("");
  const [digest,setDigest]=useState("");
  const [evidence,setEvidence]=useState("");
  const [message,setMessage]=useState("Ready for instruction.");
  const [busy,setBusy]=useState(false);
  async function run(name:string,args:CalldataEncodable[]){
    setBusy(true);setMessage(`Submitting ${name.replaceAll("_"," ")}…`);
    try{const hash=await write(name,args);setMessage(`Finalized · ${hash}`);onComplete()}
    catch(e){setMessage(e instanceof Error?e.message:String(e))}
    finally{setBusy(false)}
  }
  function loadDemo(){setCandidate(DEMO_INPUTS.candidate);setDigest(DEMO_INPUTS.manifestDigest);setEvidence(DEMO_INPUTS.evidence);setMessage("Live candidate manifest and counter-evidence loaded.")}
  return <aside className="command-deck"><div className="deck-title"><span>COMMAND DECK</span><i>FINALIZED READS</i></div><button type="button" className="deck-demo" onClick={loadDemo}>Load live candidate fields</button><div className="deck-grid"><label>Route<select value={route} onChange={e=>setRoute(e.target.value)}>{voyage.route_ids.map(x=><option key={x}>{x}</option>)}</select></label><button disabled={busy||!route||!(voyage.state==="OBSERVING"||voyage.state==="UNCERTAIN"||voyage.state==="DISPUTED")} onClick={()=>run("observe_route",[voyage.id,route])}>Observe route</button><button disabled={busy||!(voyage.state==="OBSERVING"||voyage.state==="UNCERTAIN"||voyage.state==="CLEAR")} onClick={()=>run("derive_readiness",[voyage.id])}>Derive readiness</button><label>Candidate origin<input placeholder="https://preview.example" value={candidate} onChange={e=>setCandidate(e.target.value)}/></label><label>Manifest SHA-256<input placeholder="64 lowercase hex" value={digest} onChange={e=>setDigest(e.target.value)}/></label><button disabled={busy||!candidate||!/^[a-f0-9]{64}$/.test(digest)} onClick={()=>run("bind_candidate",[voyage.id,candidate,digest])}>Bind new generation</button><label>Counter-evidence URL<input placeholder="https://…" value={evidence} onChange={e=>setEvidence(e.target.value)}/></label><button disabled={busy||voyage.state!=="CLEAR"||!route||!evidence} onClick={()=>run("open_dispute",[voyage.id,route,evidence])}>Open public dispute</button><button className="seal" disabled={busy||voyage.state!=="CLEAR"} onClick={()=>run("notarize",[voyage.id])}>Run fresh seal</button></div><output>{message}</output></aside>
}
