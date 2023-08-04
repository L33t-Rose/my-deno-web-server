export type Handler = (
	req: Request,
	data: { slug: Record<string, string>; params: URLSearchParams }
) => Response;
const CATCH_ALL_REGEX = /:(\w+|\d+)/gm;
const CATCH_ALL_STRING = "(\\w+|\\d+)";

export class Router {
	private resolvers: Map<string, Handler>;
	private dynamicRoutes: [RegExp, string][];
	constructor() {
		this.resolvers = new Map<string, Handler>();
		this.dynamicRoutes = [];
	}
	resolveRoute(
		route: string,
		method: string
	): [Handler | undefined, Record<string, string>] {
		const key = method + "_" + route;
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
				const splitHandler = dynamic[1].split("/");
				for (let i = 1; i < splitHandler.length; i++) {
					if (splitHandler[i].includes(":")) {
						slug[splitHandler[i].substring(1)] = splitRoute[i];
					}
				}
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
	
	bind(path: string, router: Router) {
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
