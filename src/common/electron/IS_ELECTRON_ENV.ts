const userAgent = navigator.userAgent.toLowerCase();
const isElectronEnv = userAgent.includes(" electron/");

export default isElectronEnv;
