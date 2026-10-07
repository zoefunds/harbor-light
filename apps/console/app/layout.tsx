import type {Metadata} from "next";
import "./style.css";
export const metadata:Metadata={title:"Harborlight — Release Notary",description:"Public-evidence release notarization on GenLayer"};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
