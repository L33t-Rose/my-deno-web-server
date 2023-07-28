# My Own Web Server
Built in Deno

This is a basic project where I explore how web servers work. 
What I hope to learn:
* Ins and Outs of HTTP
  - What are the various HTTP Headers and how do I use them
  - How do I use HTTP
* Understanding what a web server is and it how serves data to users
  - How do I server content through different paths
  - What is inside a request body and how do I react accordingly to that request body?
* What it's like to work in Deno

How to run web server(in terminal):
```
deno task dev
```

Running server with router
```
deno task dev:server
```

# Update 7/28/2023
Implemented my own basic router. Check out `router.ts`.
Currently I do not support the ability to have dynamic routes but I plan on fixing that later.

What I have so far:
* The ability to set handlers for pre-determined routes
* The ability to bind subrouters to specific paths
* Automatic Query Param parsing thanks to `URLSearchParams`

What I want to add:
* Support for dynamic routes (i.e. '/:id')
  - I'd most likely change the params object to have slugs **and** the queryParams

