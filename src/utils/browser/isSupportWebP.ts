export default () => {
  const elem = document.createElement("canvas");
  return elem.toDataURL("image/webp").indexOf("data:image/webp") === 0;
};
