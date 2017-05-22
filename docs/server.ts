import * as path from "path";
import * as fs from "fs";
import * as express from "express";
import * as webpack from "webpack";
import * as http from "http";
import { exec } from "child_process";
const cors = require<any>("cors");
const serveStatic = require<any>("serve-static");
const compression = require<any>("compression");
const bodyParser = require<any>("body-parser");
const morgan = require<any>("morgan");

const __DEV__ = process.env.NODE_ENV !== "production";
const joinDirname = (...paths: string[]) => path.join(__dirname, "./", ...paths);

let { outputPath, publicPath, hostName, port }: {
  outputPath: string;
  publicPath: string;
  hostName: string;
  port: number;
} = require<any>(joinDirname("./config"));
// if (!__DEV__) port += 1;
const entries: {
  route: string;
  name: string;
  title: string;
}[] = require<any>(joinDirname("./config")).entries;
const app = express();

app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
if (__DEV__) {
  app.use(morgan("dev"));

  const webpackDevMiddleware = require<any>("webpack-dev-middleware");
  const webpackHotMiddleware = require<any>("webpack-hot-middleware");
  const config = require<any>(joinDirname("./webpack.config"));
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    noInfo: true,
    quiet: false,
    watchOptions: {
      ignored: /node_modules/,
      poll: true
    },
    stats: {
      colors: true,
      assets: true,
      version: false,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false
    }
  }));
  app.use(webpackHotMiddleware(compiler));
} else {
  app.use(cors({
    origin: [`http://${hostName}:${port}`],
    methods: ["Get", "Post"],
    allowedHeaders: ["Content-type", "Authorization"]
  }));

  const FileStreamRoator = require<any>("file-stream-rotator");
  const logDirectory = joinDirname("log");
  if (!fs.existsSync(logDirectory)) fs.mkdirSync(logDirectory);
  const stream = FileStreamRoator.getStream({
    date_format: "YYYYMMDD",
    filename: `${logDirectory}/access-%DATE%.log`,
    frequency: "daily",
    verbose: false
  });
  app.use(morgan("combined", { stream }));
}
app.use("/", serveStatic(joinDirname(outputPath)));


app.use("/", (req: express.Request, res: express.Response) => {
  res.sendFile(joinDirname(`./${outputPath}/index.html`));
});

http.createServer(app)
  .listen(port, hostName, (err: Error) => {
    // tslint:disable-next-line:no-console
    err ? console.error("error is ", err) : console.log(`${__DEV__ ? "Dev" : "Prod"}Server run on http://${hostName}:${port}`);
  });
