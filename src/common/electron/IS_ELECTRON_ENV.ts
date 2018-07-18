const userAgent = typeof navigator === "undefined" ? "" : navigator.userAgent.toLowerCase();
const isElectronEnv = userAgent.includes(" electron/");

export default isElectronEnv;
