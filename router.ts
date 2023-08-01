export type Handler = (req: Request, params: URLSearchParams) => Response;
const pathRegex = /\/\w*[?\w+=\w*]*/g;
// const SUPPORTED_METHODS = ["POST", "GET", "DELETE", "UPDATE"] as const;
export class Router {
	private resolvers: Map<string, Handler>;
	/**
	 * @depecrated Won't be used soon
	 */
	private subRouters: Map<string, Router>;
	constructor() {
		this.resolvers = new Map<string, Handler>();
		this.subRouters = new Map<string, Router>();
	}
	//Assumption for now is there are no dynamic
	resolveRoute(route: string, method: string): Handler | undefined {
		const key = method + "_" + route;
		console.log(this.resolvers);
		console.log("route to resolve here", route);
		let handler = this.resolvers.get(key);
		if (!handler) {
			let potentialRouter = this.subRouters.get(key)
			if(!potentialRouter){
				const paths = route.match(pathRegex);
				if (paths == null) {
					throw new Error("invalid path");
				}
				paths.shift();
				console.log(paths);
				const subPath = paths.shift();
				if (!subPath) {
					return undefined;
				}
				handler = this.subRouters
					.get(subPath)
					?.resolveRoute(method + "_" + paths.join(""), method);
			}
		}
		return handler;
	}
	add(path: string, method: string, handler: Handler) {
		this.resolvers.set(method + "_" + path, handler);
	}
	get(path: string, handler: Handler) {
		this.add(path, "GET", handler);
	}
	put(path: string, handler: Handler) {
		this.add(path, "PUT", handler);
	}
	post(path: string, handler: Handler) {
		this.add(path, "POST", handler);
	}
	delete(path: string, handler: Handler) {
		this.add(path, "DELETE", handler);
	}
	/**
	 * @deprecated Planning to migrate to flatBind. flatBind will be the new bind
	 * @param path 
	 * @param router 
	 */
	bind(path: string, router: Router) {
		this.subRouters.set(path, router);
	}
	flatBind(path:string,router:Router){
		if(router == null || !Router.isRouter(router)){
			return;
		}
		for(const key of router.resolvers.keys()){
			console.log(key);
			const beginPathIndex = key.indexOf("/");
			const METHOD = key.slice(0,key.indexOf("_"));
			const ROUTE = key.slice(beginPathIndex);
			this.resolvers.set(METHOD+"_"+path+ROUTE,router.resolvers.get(key)!);
		}
	}
	static isRouter(obj: any) {
		return (
			obj &&
			"resolvePath" in obj &&
			"paths" in obj &&
			obj.paths.toString() == "[object Set]"
		);
	}
	static Router() {
		return new Router();
	}
	toString(){
		console.log(this.resolvers);
	}
}
// const r = new Router();
// r.get("/", () => {
// 	return new Response();
// });
// r.post("/test", () => {
// 	return new Response();
// });

// const sub = new Router();
// sub.get("/", () => {
// 	return new Response();
// });
// sub.get("/test", () => {
// 	return new Response();
// });

// r.flatBind("/api/v1",sub);

// r.toString();

// const v2 = Router.Router();
// v2.get("/", () => {
// 	return new Response();
// });