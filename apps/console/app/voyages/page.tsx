import Link from "next/link";
import {VoyageIndex} from "../../components/VoyageIndex";
export default function Page(){return <main><nav><Link className="brand" href="/"><span>H</span>HARBORLIGHT</Link><div><Link href="/voyages/new">Launch</Link><b>VOYAGES</b></div></nav><VoyageIndex/><footer><span>FINALIZED READS · STUDIONET 61999</span><span>Wallet-free public verification.</span></footer></main>}
