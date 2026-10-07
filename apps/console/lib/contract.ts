import {createClient} from "genlayer-js";
import {studionet} from "genlayer-js/chains";
import {TransactionHashVariant,TransactionStatus,type CalldataEncodable,type TransactionHash} from "genlayer-js/types";
export const ADDRESS=process.env.NEXT_PUBLIC_HARBORLIGHT_CONTRACT as `0x${string}`|undefined;
export const CHAIN={id:61999,name:"GenLayer Studionet",explorer:"https://explorer-studio.genlayer.com"};
const client=createClient({chain:studionet});
export async function read(functionName:string,args:CalldataEncodable[]=[]){if(!ADDRESS)throw new Error("Contract address is not configured");return client.readContract({address:ADDRESS,functionName,args,transactionHashVariant:TransactionHashVariant.LATEST_FINAL});}
export async function write(functionName:string,args:CalldataEncodable[]){if(!ADDRESS)throw new Error("Contract address is not configured");const provider=(window as unknown as {ethereum?:unknown}).ethereum;if(!provider)throw new Error("Connect an injected wallet to continue");const accounts=await (provider as {request:(x:{method:string})=>Promise<string[]>}).request({method:"eth_requestAccounts"});const wallet=createClient({chain:studionet,account:accounts[0] as `0x${string}`});const hash=await wallet.writeContract({address:ADDRESS,functionName,args,value:0n});await wallet.waitForTransactionReceipt({hash:hash as TransactionHash,status:TransactionStatus.FINALIZED});return hash;}
