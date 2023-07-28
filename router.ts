export type Handler = (req:Request,params:URLSearchParams)=>Response
const pathRegex = /\/\w*[?\w+=\w*]*/g

export class Router{
    private resolvers:Map<string,Handler>;
    private subRouters:Map<string,Router>;
    constructor(){
        this.resolvers = new Map<string,Handler>();
        this.subRouters = new Map<string,Router>();
    }
    //Assumption for now is there are no dynamic
    resolveRoute(route:string):Handler|undefined{
        console.log('route to resolve here',route);
        let handler = this.resolvers.get(route);
        if(!handler){
            const paths = route.match(pathRegex);
            if(paths == null){
                throw new Error("invalid path")
            }
            paths.shift();
            console.log(paths);
            const subPath = paths.shift();
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