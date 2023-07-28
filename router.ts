type Handler = (req)=>{}
type Route = Map<string,Handler>
const pathRegex = /\/\w*[?\w+=\w*]*/g

class Router{
    private paths:Set<string>
    private resolvers:Map<string,Handler>;
    private subRouters:Map<string,Router>;
    constructor(){
        this.paths = new Set<string>();
        this.resolvers = new Map<string,Handler>();
        this.subRouters = new Map<string,Router>();
    }
    //Assumption for now is there are no dynamic
    resolveRoute(route:string):Handler|undefined{
        console.log('route to resolve',route);
        let handler = this.resolvers.get(route);
        if(!handler){
            const paths = route.match(pathRegex);
            if(paths == null){
                throw new Error("invalid path")
            }
            paths.shift();
            console.log(paths);
            let subPath = paths.shift();
            if(!subPath){
                return undefined;
            }
            handler = this.subRouters.get(subPath)?.resolveRoute(paths.join(''))
        }
        return handler;
    }
    add(path:string,handler:Handler){
        this.resolvers.set(path,handler);
    }
    bind(path:string,router:Router){
        this.subRouters.set(path,router);
    }
    static isRouter(obj:any){
        return obj && 'resolvePath' in obj && 'paths' in obj && obj.paths.toString() == '[object Set]';
    }
}


const router =new Router();
router.add("/",(req)=>{
    console.log("I'm in /");
    return new Response('asd',{status:200})
})
router.add("/test",()=>{
    console.log("logging in /test")
})
router.add("/test/die",()=>{
    console.log("logging in /test/die");
});

const secondRouter = new Router();
router.add("/",()=>{
    console.log('here in / in aasdasd');
})

router.bind("/aasdasd",secondRouter);

router.resolveRoute("/")
router.resolveRoute("/test");
router.resolveRoute("/test/aasdasd/");
router.resolveRoute("/test/die");