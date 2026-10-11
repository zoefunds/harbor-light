import {DEMO_INVENTORY} from "../../../lib/demo";
export function GET(){return Response.json(DEMO_INVENTORY,{headers:{"cache-control":"public, max-age=0, must-revalidate"}})}
