import {createClient} from "genlayer-js";
import {studionet} from "genlayer-js/chains";
import {TransactionHashVariant,TransactionStatus,type CalldataEncodable,type TransactionHash} from "genlayer-js/types";
export const ADDRESS=process.env.NEXT_PUBLIC_HARBORLIGHT_CONTRACT as `0x${string}`|undefined;
export const CHAIN={id:61999,name:"GenLayer Studionet",explorer:"https://explorer-studio.genlayer.com"};
const client=createClient({chain:studionet});
export async function read(functionName:string,args:CalldataEncodable[]=[]){if(!ADDRESS)throw new Error("Contract address is not configured");return client.readContract({address:ADDRESS,functionName,args,transactionHashVariant:TransactionHashVariant.LATEST_FINAL});}
type Snapshot={count?:number;generation?:number;attempt?:number};
type VoyageState={id:number;title:string;baseline_origin:string;state:string;generation:number;observed_generation:number;aggregate:string;route_index_digest:string;candidate_origin:string;manifest_digest:string;open_dispute:number};
type RouteState={path:string;frozen:boolean;baseline_digest:string};
type ObservationState={generation?:number;attempt?:number};
async function beforeWrite(name:string,args:CalldataEncodable[]):Promise<Snapshot>{
 if(name==="open_voyage")return {count:Number(await read("get_voyage_count"))};
 const id=Number(args[0]);if(!id)return {};
 const voyage=await read("get_voyage",[id]) as VoyageState;
 if(name==="observe_route"){const observation=await read("get_observation",[id,voyage.generation,String(args[1])]) as ObservationState;return {generation:voyage.generation,attempt:Number(observation.attempt||0)}}
 return {generation:voyage.generation};
}
async function postcondition(name:string,args:CalldataEncodable[],before:Snapshot):Promise<boolean>{
 const id=name==="open_voyage"?Number(before.count||0)+1:Number(args[0]);
 if(name==="open_voyage"){const count=Number(await read("get_voyage_count"));if(count!==id)return false;const v=await read("get_voyage",[id]) as VoyageState;return v.title===String(args[0])&&v.baseline_origin===String(args[1]).replace(/\/$/,"")}
 if(name==="add_route"){const r=await read("get_route",[id,String(args[1])]) as RouteState;return r.path===String(args[2])}
 if(name==="anchor_baseline"){const r=await read("get_route",[id,String(args[1])]) as RouteState;return r.frozen===true&&r.baseline_digest===String(args[3])}
 const v=await read("get_voyage",[id]) as VoyageState;
 if(name==="discover_chart")return v.route_index_digest===String(args[1]);
 if(name==="seal_chart")return v.state==="CHARTED";
 if(name==="bind_candidate")return v.state==="OBSERVING"&&v.generation===Number(before.generation||0)+1&&v.candidate_origin===String(args[1]).replace(/\/$/,"")&&v.manifest_digest===String(args[2]);
 if(name==="observe_route"){const o=await read("get_observation",[id,Number(before.generation),String(args[1])]) as ObservationState;return o.generation===before.generation&&Number(o.attempt||0)>Number(before.attempt||0)}
 if(name==="derive_readiness")return v.observed_generation===v.generation&&v.aggregate===v.state;
 if(name==="open_dispute")return v.state==="DISPUTED"&&v.open_dispute>0;
 if(name==="notarize"){const n=await read("get_notarization",[id]) as {notarization_digest?:string};return v.state==="NOTARIZED"&&Boolean(n.notarization_digest)}
 throw new Error(`No authoritative state verifier for ${name}`);
}
async function verifyFinalizedState(name:string,args:CalldataEncodable[],before:Snapshot){for(let attempt=0;attempt<8;attempt++){try{if(await postcondition(name,args,before))return}catch{}await new Promise(resolve=>setTimeout(resolve,1000))}throw new Error(`Transaction finalized but ${name} did not produce the required authoritative contract state`)}
export async function write(functionName:string,args:CalldataEncodable[]){if(!ADDRESS)throw new Error("Contract address is not configured");const provider=(window as unknown as {ethereum?:unknown}).ethereum;if(!provider)throw new Error("Connect an injected wallet to continue");const before=await beforeWrite(functionName,args);const accounts=await (provider as {request:(x:{method:string})=>Promise<string[]>}).request({method:"eth_requestAccounts"});const wallet=createClient({chain:studionet,account:accounts[0] as `0x${string}`});const hash=await wallet.writeContract({address:ADDRESS,functionName,args,value:0n});await wallet.waitForTransactionReceipt({hash:hash as TransactionHash,status:TransactionStatus.FINALIZED});await verifyFinalizedState(functionName,args,before);return hash;}
