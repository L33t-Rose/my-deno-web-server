
async function grabHTML(){
    const a = new XMLHttpRequest();
}

document.querySelector("#test").addEventListener('click',(e)=>{
    // grabHTML();
    const parser = new DOMParser();
    const string = `<p>Hi!</p>
    <b>I'm trying out something</b>`;
    console.log(string);
    const parsedDOM = parser.parseFromString(string,"text/html");
    console.log('here again',parsedDOM);
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
