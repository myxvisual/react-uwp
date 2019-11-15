function createMergeFuncs(staticFunc = () => {}) {
  function mergeFuncs(...funcs: Function[]) {
    let { cacheFuncs, cacheStaticFunc } = mergeFuncs as any;
    cacheFuncs = cacheFuncs || [];
    cacheStaticFunc = cacheStaticFunc || (() => {});
    for (const originFunc of funcs) {
      const func: any = originFunc;
      if (func.isMergedFunc) {
        for (const cacheFuncItem of func.cacheFuncs) {
          let isSameFunc = false;
          for (const cacheFunc of cacheFuncs) {
            if (cacheFunc === cacheFuncItem) {
              isSameFunc = true;
              break;
            }
          }
          if (!isSameFunc) {
            cacheFuncs = cacheFuncs.concat(cacheFuncItem);
          }
        }
      } else {
        cacheFuncs = cacheFuncs.concat(func);
      }
    }
    (mergeFuncs as any)["cacheFuncs"] = cacheFuncs;
    (mergeFuncs as any)["cacheStaticFunc"] = cacheStaticFunc;

    function resultFunc(...args: any[]) {
      for (const func of cacheFuncs) {
        func(...args);
      }
      cacheStaticFunc(...args);
    }
    (resultFunc as any)["isMergedFunc"] = true;
    (resultFunc as any)["cacheFuncs"] = cacheFuncs;
    (resultFunc as any)["cacheStaticFunc"] = cacheStaticFunc;
    return resultFunc;
  }

  if ((staticFunc as any)["isMergedFunc"]) {
    (mergeFuncs as any).cacheStaticFunc = (staticFunc as any)["cacheStaticFunc"];
    (mergeFuncs as any).cacheFuncs = (staticFunc as any)["cacheFuncs"];
  } else if (!(mergeFuncs as any).cacheStaticFunc) {
    (mergeFuncs as any).cacheStaticFunc = staticFunc;
  }
  return mergeFuncs;
}

export default createMergeFuncs;

const mergeFuncs = createMergeFuncs(staticFunc);

function staticFunc() { console.log("static", arguments[0]); }
let resultFunc = mergeFuncs((numb: any) =>  {console.log(numb + 1); });
resultFunc = mergeFuncs(resultFunc, (numb: any) =>  {console.log(numb + 2); });
resultFunc = mergeFuncs((numb: any) =>  {console.log(numb + 3); });
resultFunc = mergeFuncs(resultFunc);
resultFunc(0);
