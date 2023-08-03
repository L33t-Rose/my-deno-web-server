export type Handler = (
	req: Request,
	data: { slug: Record<string, string>; params: URLSearchParams }
) => Response;
const pathRegex = /\/\w*[?\w+=\w*]*/g;
const CATCH_ALL_REGEX = /:(\w+|\d+)/gm;
const CATCH_ALL_STRING = "\\w+|\\d+";
// const SUPPORTED_METHODS = ["POST", "GET", "DELETE", "UPDATE"] as const;
export class Router {
	private resolvers: Map<string, Handler>;
	/**
	 * @depecrated Won't be used soon
	 */
	private subRouters: Map<string, Router>;
	private dynamicRoutes: [RegExp, string][];
	constructor() {
		this.resolvers = new Map<string, Handler>();
		this.subRouters = new Map<string, Router>();
		this.dynamicRoutes = [];
	}
	//Assumption for now is there are no dynamic
	resolveRoute(
		route: string,
		method: string
	): [Handler | undefined, Record<string, string>] {
		const key = method + "_" + route;
		// console.log(this.resolvers);
		// console.log("route to resolve here", route);
		let handler = this.resolvers.get(key);
		const slug: Record<string, string> = {};
		if (!handler) {
			for (const dynamic of this.dynamicRoutes) {
				const hasMatch = dynamic[0].test(key);
				if (!hasMatch) {
					continue;
				}
				handler = this.resolvers.get(dynamic[1]);
				const splitRoute = route.split("/");
				// splitRoute.shift();
				const splitHandler = dynamic[1].split("/");
				// splitHandler.shift();
				console.log("passed in router", splitRoute);
				console.log("mapped route that matches", splitHandler);
				for (let i = 1; i < splitHandler.length; i++) {
					if (splitHandler[i].includes(":")) {
						slug[splitHandler[i].substring(1)] = splitRoute[i];
					}
				}
				console.log("slug", slug);
			}
		}
		return [handler, slug];
	}

	add(path: string, method: string, handler: Handler) {
		this.resolvers.set(method + "_" + path, handler);
		if (path.includes(":")) {
			this.dynamicRoutes.push([
				Router.toDynamicPathRegex(path, method),
				method + "_" + path,
			]);
		}
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
	flatBind(path: string, router: Router) {
		if (router == null || !Router.isRouter(router)) {
			return;
		}
		for (const key of router.resolvers.keys()) {
			console.log(key);
			const beginPathIndex = key.indexOf("/");
			const METHOD = key.slice(0, key.indexOf("_"));
			const ROUTE = key.slice(beginPathIndex);
			this.resolvers.set(
				METHOD + "_" + path + ROUTE,
				router.resolvers.get(key)!
			);
		}
	}
	static toDynamicPathRegex(path: string, method: string) {
		let str = path.replaceAll(CATCH_ALL_REGEX, CATCH_ALL_STRING);
		str = "^(" + method + "_" + str + ")$";
		return new RegExp(str);
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
	toString() {
		console.log(this.resolvers);
		console.log(this.dynamicRoutes);
	}
}
// route
const r = new Router();
r.get("/", () => {
	return new Response();
});
r.get("/:id", (req,data) => {
	return new Response();
});
r.get("/api/v1/:id", () => {
	return new Response();
});
// r.toString();
console.log("route", r.resolveRoute("/api/v1/asd", "GET"));
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

// console.log("/b/:id".replaceAll(/:(\w+|\d+)/gm, "dynamic"));
// let string = "/b/:id".replaceAll(/:(\w+|\d+)/gm, "\\w+|\\d+");
// string = "^(" + string + ")$";
// const reg = new RegExp(string);
// console.log(reg);
// const reg = new RegExp("/b/:id".replaceAll());
// console.log(reg);
// console.log(reg.test("/b/asd"));
// console.log(reg.test("/r/dynamic"));
// console.log(reg.test("/b/dynamic"));
