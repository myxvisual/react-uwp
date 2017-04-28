import * as Koa from "koa";
const server = require("koa-static");

const app = new Koa();
const __DEV__ = process.env.NODE_ENV !== "development";
const { outputPath, hostName, port } = require("./config");

app.use(async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		ctx.body = { message: err.message };
		ctx.status = err.status || 500;
	}
});

app.use(async (ctx, next) => {
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

if (__DEV__) {
	const webpack = require("webpack");
	const webpackDevMiddleware = require("koa-webpack-dev-middleware");
	const webpackHotMiddleware = require("koa-webpack-hot-middleware");
	const config = require("./webpack.config");
	const compiler = webpack(config);

	app.use(webpackDevMiddleware(compiler, {
		noInfo: true,
		quiet: false,
		publicPath: config.output.publicPath,
		stats: { colors: true }
	}));
	app.use(webpackHotMiddleware(compiler));
}

app.use(server(`${__dirname}/${outputPath}`));

app.listen(port, (err?: any) => {
	err ? console.error("error is ", err) : console.log(`Server run on http://${hostName}:${port}`);
});
