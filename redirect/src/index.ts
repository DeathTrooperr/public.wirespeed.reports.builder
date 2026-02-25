export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		const newUrl = new URL(url.pathname + url.search, "https://wirespeed-report-builder.northernlight.workers.dev");
		
		return Response.redirect(newUrl.toString(), 301);
	},
};
