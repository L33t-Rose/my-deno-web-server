import { serve } from "./deps.ts";
import { Router } from "./router.ts";
import { getPathFromURL} from './util/index.ts';
import type { Handler } from "./router.ts";
import type { SEC_FETCH_TYPE} from './util/index.ts';


const port = 8081;

const router = new Router();
router.add("/", "GET", function (req, param) {
	return new Response(null, {
		status: 302,
		headers: {
			Location: "https://google.com",
		},
	});
});

router.add("/json", "GET", function (req, params) {
    console.log(req);
	if (!params.get("q")) {
		return new Response(JSON.stringify({ message: "q not provided" }), {
			status: 400,
            headers:{
                'Content-Type':'application/json'
            }
		});
	}
	console.log(params.get("q"));
	return new Response(
		JSON.stringify({ message: "hello world from the server" }),
		{
			status: 200,
		}
	);
});
router.get("/api/v1", () => {
	return new Response(JSON.stringify({ message: "root of api/v1" }));
});
router.get("/api/v1/", () => {
	return new Response(null, {
		status: 302,
		headers: {
			Location: "/api/v1",
		},
	});
});

const error = ((_, __) => {
	return new Response("DOES NOT EXIST", {
		status: 404,
		headers: {
			"Content-Type": "application/json",
		},
	});
}) satisfies Handler;
serve(
	(req) => {
		const reqType = req.headers.get(
			"Sec-Fetch-Dest"
		) as SEC_FETCH_TYPE | null;
		const HOST = req.headers.get("host");
		if (reqType == null || HOST == null) {
			return new Response("Invalid Request", {
				status: 400,
				headers: {
					"Content-Type": "text/plain",
					"Access-Control-Allow-Origin": "*",
				},
			});
		}
		const URL = req.url;
		if (reqType !== "document") {
			return new Response("", {
				status: 404,
				headers: {
					"Content-Type": "image/png",
					"Access-Control-Allow-Origin": "*",
				},
			});
		}
		const path = getPathFromURL(URL, HOST);
		const hasQueryParams = path.indexOf("?") != -1;
		const queryParams = hasQueryParams ? path.slice(path.indexOf("?")) : "";
		const escapedPath = path.slice(
			0,
			hasQueryParams ? path.indexOf("?") : path.length
		);
		console.log(escapedPath);
		console.log(req.url);
		// console.log(req.method);
		let handler = router.resolveRoute(escapedPath, req.method);
		if (!handler) {
			handler = error;
		}
		const response = handler(req, new URLSearchParams(queryParams));
		response.headers.set("Access-Control-Allow-Origin", "*");
		return response;
	},
	{ port }
);
