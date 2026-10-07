import {DEMO_MANIFEST} from "../../../lib/demo";
export function GET(){return Response.json(DEMO_MANIFEST,{headers:{"cache-control":"public, max-age=0, must-revalidate"}})}
