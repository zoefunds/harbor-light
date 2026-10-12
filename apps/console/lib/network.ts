export const STUDIONET_CHAIN_ID=61999;
export const STUDIONET_CHAIN_HEX=`0x${STUDIONET_CHAIN_ID.toString(16)}`;

export type InjectedProvider={
 request:(request:{method:string;params?:unknown})=>Promise<unknown>;
};

export function injectedProvider():InjectedProvider{
 const provider=(window as unknown as {ethereum?:InjectedProvider}).ethereum;
 if(!provider)throw new Error("MetaMask with the GenLayer wallet Snap is required to submit Studionet transactions.");
 return provider;
}

export async function requestAccount(provider:InjectedProvider):Promise<`0x${string}`>{
 const accounts=await provider.request({method:"eth_requestAccounts"});
 if(!Array.isArray(accounts)||typeof accounts[0]!=="string"||!/^0x[0-9a-f]{40}$/i.test(accounts[0]))throw new Error("MetaMask did not return a valid account.");
 return accounts[0] as `0x${string}`;
}

export async function assertStudionet(provider:InjectedProvider):Promise<void>{
 const chainId=await provider.request({method:"eth_chainId"});
 let numeric=-1n;
 try{if(typeof chainId==="string"&&/^0x[0-9a-f]+$/i.test(chainId))numeric=BigInt(chainId)}catch{}
 if(numeric!==BigInt(STUDIONET_CHAIN_ID))throw new Error(`Wallet network is ${String(chainId)}, expected GenLayer Studionet ${STUDIONET_CHAIN_HEX}. Transaction was not submitted.`);
}

export async function connectStudionet(provider:InjectedProvider,connect:()=>Promise<unknown>):Promise<void>{
 await connect();
 await assertStudionet(provider);
}
