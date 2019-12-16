import * as createHash from "murmurhash-js/murmurhash3_gc";
import * as createHash2 from "murmurhash-js/murmurhash2_gc";

let testObj: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  textAlign: "left",
  cursor: "default",
  height: "100%",
  width: 200,
  overflow: "hidden",
  wordWrap: "normal",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  position: "relative",
  justifyContent: "space-between",
  background: "none",
  padding: 120
};
let now: number;

now = performance.now();
for (let i = 0; i < 100000; i++) {
  const str = JSON.stringify(testObj);
}
console.log(performance.now() - now);


now = performance.now();
for (let i = 0; i < 100000; i++) {
  const str = JSON.stringify(testObj);
  const hash = createHash(str);
}
console.log(performance.now() - now);

now = performance.now();
for (let i = 0; i < 100000; i++) {
  const str = JSON.stringify(testObj);
  const hash = createHash2(str);
}
console.log(performance.now() - now);
