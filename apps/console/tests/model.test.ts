import {describe,expect,it} from "vitest";
import {gateSummary,nextAction,short,type Voyage} from "../lib/model";
import {DEMO_INPUTS} from "../lib/demo";
import {assertStudionet,connectStudionet,requestAccount,STUDIONET_CHAIN_HEX,type InjectedProvider} from "../lib/network";
describe("console state model",()=>{it("communicates the next deterministic action",()=>{expect(nextAction("DISPUTED")).toContain("counterclaim");expect(nextAction("NOTARIZED")).toContain("proceed")});it("never labels a clear voyage as deployed",()=>{const v={state:"CLEAR"} as Voyage;expect(gateSummary(v)).toContain("Review window")});it("formats commitments without losing both ends",()=>{expect(short("abcdef1234567890",4)).toBe("abcd…7890")})});
describe("live demo autofill",()=>{it("uses deployable public evidence instead of placeholders",()=>{expect(DEMO_INPUTS.origin).toBe("https://harbor-light-app.vercel.app");expect(DEMO_INPUTS.indexUrl).toMatch(/^https:\/\//);expect(DEMO_INPUTS.artifact).toMatch(/^https:\/\//);expect(DEMO_INPUTS.indexDigest).toMatch(/^[a-f0-9]{64}$/);expect(DEMO_INPUTS.capsuleDigest).toMatch(/^[a-f0-9]{64}$/);expect(DEMO_INPUTS.manifestDigest).toMatch(/^[a-f0-9]{64}$/);expect(JSON.parse(DEMO_INPUTS.rules)).toHaveLength(1)})});
describe("Studionet wallet guard",()=>{
 const provider=(answers:Record<string,unknown>):InjectedProvider=>({request:async({method})=>answers[method]});
 it("accepts only chain 61999",async()=>{await expect(assertStudionet(provider({eth_chainId:STUDIONET_CHAIN_HEX}))).resolves.toBeUndefined()});
 it("blocks Base Sepolia before submission",async()=>{await expect(assertStudionet(provider({eth_chainId:"0x14a34"}))).rejects.toThrow(/expected GenLayer Studionet/)});
 it("connects before independently verifying the selected chain",async()=>{const order:string[]=[];const p:InjectedProvider={request:async({method})=>{order.push(method);return STUDIONET_CHAIN_HEX}};await connectStudionet(p,async()=>{order.push("connect")});expect(order).toEqual(["connect","eth_chainId"])});
 it("fails closed when wallet switching leaves Base Sepolia selected",async()=>{let connected=false;await expect(connectStudionet(provider({eth_chainId:"0x14a34"}),async()=>{connected=true})).rejects.toThrow(/Transaction was not submitted/);expect(connected).toBe(true)});
 it("requires a valid injected account",async()=>{await expect(requestAccount(provider({eth_requestAccounts:[]}))).rejects.toThrow(/valid account/);await expect(requestAccount(provider({eth_requestAccounts:["0x1111111111111111111111111111111111111111"]}))).resolves.toBe("0x1111111111111111111111111111111111111111")});
});
