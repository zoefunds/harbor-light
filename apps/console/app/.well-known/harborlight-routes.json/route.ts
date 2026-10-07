import {DEMO_INDEX} from "../../../lib/demo";
export function GET(){return Response.json(DEMO_INDEX,{headers:{"cache-control":"public, max-age=0, must-revalidate"}})}
