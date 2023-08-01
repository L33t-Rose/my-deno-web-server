type SEC_FETCH_TYPE = "audio" | "audioworklet" | "document" | "embed" | "empty" | "font" | "frame" | "iframe" | "image" | "manifest" | "object" | "paintworklet" | "report" | "script" | "serviceworker" | "sharedworker" | "style" | "track" 
| "video" | "worker" | "xslt";


function getPathFromURL(fullURL:string,host:string):string{
    const pathIndex = fullURL.indexOf(host)+host.length;
    return fullURL.slice(pathIndex);
}