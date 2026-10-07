import {DEMO_HTML} from "../../../lib/demo";
export function GET(){return new Response(DEMO_HTML,{headers:{"content-type":"text/html; charset=utf-8","cache-control":"public, max-age=0, must-revalidate"}})}
