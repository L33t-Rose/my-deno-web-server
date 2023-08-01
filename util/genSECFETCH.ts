let data = await Deno.readTextFile('./thing.txt');
data = data.replaceAll('Sec-Fetch-Dest:','').replaceAll('\r\n','|').replaceAll(" ","\"").replaceAll("|","\" | ");
console.log(data+"\"");

