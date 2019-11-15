import IS_ELECTRON_ENV from "../electron/IS_ELECTRON_ENV";

const IS_NODE_ENV = global && global.process && !IS_ELECTRON_ENV;

export default IS_NODE_ENV;
