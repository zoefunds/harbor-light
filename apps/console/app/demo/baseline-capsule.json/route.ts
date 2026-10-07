import {DEMO_CAPSULE} from "../../../lib/demo";
export function GET(){return Response.json(DEMO_CAPSULE,{headers:{"cache-control":"public, max-age=0, must-revalidate"}})}
