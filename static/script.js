
async function grabHTML(){
    const req = new Request("./template/thing.html",{
        method:'GET',
        
    });
    console.log(req);
    // req.destination="document";
    const res = await fetch("./template/thing.html",{
        method:'GET',
        headers:{
            'Content-Type':'text/html',
            'sec-fetch-dest':'document',
            'Accept':'text/html'
        }
    });
    const data = await res.text();
    console.log(data); 
}

document.querySelector("#test").addEventListener('click',(e)=>{
    // grabHTML();
    const parser = new DOMParser();
    const string = "<p>Hi!</p>\n<b>I'm trying out something</b>";
    const parsedDOM = parser.parseFromString(string,"text/html");
    console.log(parsedDOM);
    console.log(parsedDOM.body.childNodes);
    console.log('length',parsedDOM.body.childNodes.length);
    const fragment = new DocumentFragment();
    for(let i=0;i<parsedDOM.body.childNodes.length;i++){
        const domElem = parsedDOM.body.childNodes[i];
        console.log(domElem);
        fragment.append(domElem);
    }
    console.log(fragment);
    document.body.appendChild(fragment);
});