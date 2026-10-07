import {describe,expect,it} from "vitest";
import {gateSummary,nextAction,short,type Voyage} from "../lib/model";
describe("console state model",()=>{it("communicates the next deterministic action",()=>{expect(nextAction("DISPUTED")).toContain("counterclaim");expect(nextAction("NOTARIZED")).toContain("proceed")});it("never labels a clear voyage as deployed",()=>{const v={state:"CLEAR"} as Voyage;expect(gateSummary(v)).toContain("Review window")});it("formats commitments without losing both ends",()=>{expect(short("abcdef1234567890",4)).toBe("abcd…7890")})});
