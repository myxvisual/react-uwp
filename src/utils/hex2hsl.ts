import hex2rgb from "./hex2rgb";
import rgb2hsl from "./rgb2hsl";

export default function(hex = "#000", opacity: number, resultIsArray = false) {
  const rgb = hex2rgb(hex, true) as number[];
  let resultArray: any = rgb2hsl(rgb[0], rgb[1], rgb[2], true);
  resultArray = resultArray.concat(opacity);

  return resultIsArray ? resultArray : (() => {
    resultArray[1] = `${resultArray[1]}%`;
    resultArray[2] = `${resultArray[2]}%`;
    return `hsla(${resultArray.join(", ")})`;
  })();
}
