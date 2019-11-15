export function spreadObject(obj: any, keys: string[]) {
  const primaryObject: any = {};
  const secondaryObject: any = {};
  const canCheckObjectSymbol = obj !== null && typeof Object.getOwnPropertySymbols === "function";
  const symbols = canCheckObjectSymbol ? Object.getOwnPropertySymbols(obj) : null;
  const symbolsSize = canCheckObjectSymbol ? symbols.length : 0;

  for (let property in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, property) && keys.indexOf(property) < 0) {
      primaryObject[property] = obj[property];
    } else {
      secondaryObject[property] = obj[property];
    }
    if (canCheckObjectSymbol) {
      for (let i = 0; i < symbolsSize; i++) {
        if (keys.indexOf(symbols[i] as any) < 0) {
          primaryObject[property[i]] = obj[property[i]];
        } else {
          secondaryObject[property[i]] = obj[property[i]];
        }
      }
    }
  }

  return { primaryObject, secondaryObject };
}

export default spreadObject;
