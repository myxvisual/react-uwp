const elem = document.createElement("canvas");
export default elem.toDataURL("image/webp").indexOf("data:image/webp") === 0;
