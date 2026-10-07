import * as core from "@actions/core";
import {createClient} from "genlayer-js";
import {studionet} from "genlayer-js/chains";
import {TransactionHashVariant,type CalldataEncodable} from "genlayer-js/types";
import {assertIdentity,assertState,verifyCommitments,type Identity,type Manifest,type Notarization,type Voyage} from "./check.js";

async function main(){
  const address=core.getInput("contract-address",{required:true}) as `0x${string}`;
  const expectedSource=core.getInput("expected-contract-source-sha256",{required:true});
  const id=Number(core.getInput("voyage-id",{required:true}));
  const expectedRef=core.getInput("expected-release-ref",{required:true});
  if(!/^0x[0-9a-f]{40}$/i.test(address)||!Number.isInteger(id)||id<=0||!/^[a-f0-9]{64}$/i.test(expectedSource))throw new Error("invalid verifier inputs");
  const client=createClient({chain:studionet});
  const read=(functionName:string,args:CalldataEncodable[]=[])=>client.readContract({address,functionName,args,transactionHashVariant:TransactionHashVariant.LATEST_FINAL});
  const [identity,voyage,notarization,deployedSource]=await Promise.all([
    read("get_protocol_identity") as Promise<Identity>,read("get_voyage",[id]) as Promise<Voyage>,
    read("get_notarization",[id]) as Promise<Notarization>,client.getContractCode(address),
  ]);
  assertIdentity(identity,deployedSource,expectedSource);assertState(voyage,notarization,expectedRef);
  const manifestRes=await fetch(voyage.manifest_url,{redirect:"error"});
  if(!manifestRes.ok)throw new Error(`live manifest unavailable: ${manifestRes.status}`);
  const manifest=await manifestRes.json() as Manifest;
  const bodies=new Map<string,Uint8Array>();
  await Promise.all(notarization.seal.routes.map(async route=>{
    const response=await fetch(voyage.candidate_origin+route.path,{redirect:"error"});
    if(!response.ok)throw new Error(`live route unavailable: ${route.path}`);
    const bytes=new Uint8Array(await response.arrayBuffer());
    if(bytes.byteLength>64000)throw new Error(`live route too large: ${route.path}`);
    bodies.set(route.path,bytes);
  }));
  verifyCommitments(voyage,notarization,manifest,bodies);
  core.setOutput("notarization-digest",notarization.notarization_digest);
  core.info(`Harborlight verified ${expectedRef}: source identity, finalized state, live bytes, and commitments match.`);
}
main().catch(error=>core.setFailed(error instanceof Error?error.message:String(error)));
