export function dataURI2blob(dataURI: string) {
  const byteChars = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const arrayBf = new ArrayBuffer(byteChars.length);
  const intArr = new Uint8Array(arrayBf);

  for (let i = 0; i < byteChars.length; i++) {
      intArr[i] = byteChars.charCodeAt(i);
  }
  const blob = new Blob([arrayBf], { type: mimeString });

  return blob;
}
