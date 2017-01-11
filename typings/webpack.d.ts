interface NodeModule { hot: any; }

interface NodeRequire {
	(path: string): any;
	<T>(path: string): T;
	(paths: string[], callback: (...modules: any[]) => void): void;
	ensure: (
		paths: string[],
		callback: (require: <T>(path: string) => T) => void, name?: string
	) => void;
}

interface Process {
	env?: {
		NODE_ENV?: string;
	};
}

declare var __DEV__: boolean;

declare module "*.scss";
declare module "*.sass";
declare module "*.css";
declare module "*.json";
