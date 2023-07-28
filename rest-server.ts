import {serve} from './deps.ts'
import {Router} from './router.ts';
import type {Handler} from './router.ts';

const port = 8081;
type SEC_FETCH_TYPE = "audio" | "audioworklet" | "document" | "embed" | "empty" | "font" | "frame" | "iframe" | "image" | "manifest" | "object" | "paintworklet" | "report" | "script" | "serviceworker" | "sharedworker" | "style" | "track" 
| "video" | "worker" | "xslt";

function getPathFromURL(fullURL:string,host:string):string{
    const pathIndex = fullURL.indexOf(host)+host.length;
    return fullURL.slice(pathIndex);
}
const router = new Router();
router.add("/",function(req,param){
    return new Response(null,{
        status:302,
        headers:{
            'Location':'https://google.com'
        }
    })
});

router.add("/json",function(req,params){
    return new Response(JSON.stringify({message:'hello world from the server'}),{
        status:200
    })
})

const error = ((_,__)=>{
    return new Response('DOES NOT EXIST',{
        status:404,
        headers:{
            'Content-Type':'application/json'
        }
    })
}) satisfies Handler;
serve((req)=>{
    const reqType = req.headers.get("Sec-Fetch-Dest") as SEC_FETCH_TYPE | null;
    const HOST = req.headers.get("host");
    if(reqType==null || HOST == null){
        return new Response('Invalid Request',{
            status:400,
            headers:{
                'Content-Type':'text/plain',
                'Access-Control-Allow-Origin':'*'
            }
        })
    }
    const URL = req.url;
    if(reqType !== 'document' ){
        return new Response('',{
            status:404,
            headers:{
                'Content-Type':'image/png',
                'Access-Control-Allow-Origin':'*'
            }
        })
    }
    const path = getPathFromURL(URL,HOST);
    const hasQueryParams = path.indexOf("?") != -1;
    const queryParams = hasQueryParams ? path.slice(path.indexOf('?')):"";
    const escapedPath = path.slice(0,hasQueryParams ? path.indexOf('?') : path.length);
    let handler = router.resolveRoute(escapedPath);
    if(!handler){
        handler = error;
    }
    const response = handler(req,new URLSearchParams(queryParams));
    response.headers.set('Access-Control-Allow-Origin','*')
    return response;
},{port})