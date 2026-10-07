import Link from "next/link";
import {VoyageDashboard} from "../../../components/VoyageDashboard";
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;return <main><nav><Link className="brand" href="/"><span>H</span>HARBORLIGHT</Link><div><b>OPERATIONS</b><Link href="/">Overview</Link></div></nav><VoyageDashboard id={Number(id)}/><footer><span>FINALIZED STATE · STUDIONET 61999</span><span>Consensus observes. Determinism decides.</span></footer></main>}
