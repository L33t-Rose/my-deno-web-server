import {serve} from './deps.ts';
console.log('running here!')

const port = 8080;
const STATIC_PATH = '/static';
async function showHTML(path:string){
    if(!path.includes(".")){
       path = path.concat('index.html');
    }
    return await Deno.readTextFileSync(`.${STATIC_PATH}${path}`)
}

type SEC_FETCH_TYPE = "audio" | "audioworklet" | "document" | "embed" | "empty" | "font" | "frame" | "iframe" | "image" | "manifest" | "object" | "paintworklet" | "report" | "script" | "serviceworker" | "sharedworker" | "style" | "track" 
| "video" | "worker" | "xslt";

function getPathFromURL(fullURL:string,host:string):string{
    const pathIndex = fullURL.indexOf(host)+host.length;
    return fullURL.slice(pathIndex);
}

serve(async (req)=>{
    console.log(req);
    const HOST = req.headers.get("host");
    const reqType = req.headers.get("Sec-Fetch-Dest") as SEC_FETCH_TYPE;
    if(reqType == null || HOST == null){
        return new Response(null,{status:500})
    }
    const path = getPathFromURL(req.url,HOST);
    if(reqType == "document" || reqType == "iframe"){
        return new Response(await showHTML(path),{headers:{
            'Content-Type':'text/html',
        }})
    }else if(reqType == "style"){
        return new Response(await Deno.readTextFileSync(`.${STATIC_PATH}${path}`),{
            headers:{
                'Content-Type':'text/css'
            }
        } )
    }
    else if(reqType=="script"){
        return new Response(Deno.readTextFileSync(`.${STATIC_PATH}${path}`),{
            headers:{
                'Content-Type':'text/javascript'
            }
        })
    }
    else if(reqType == "image"){
        return Response.redirect("https://placehold.co/600x400?text=We%20don%27t%20support%20images%20:)%20\n%20Use%20a%20dedicated%20media%20server%20:)",302)
    }
    return new Response('not implemented',{status:501})
},{port})