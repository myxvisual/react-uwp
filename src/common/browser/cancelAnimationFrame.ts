import vendors from "./vendors";

let cancelAnimationFrame = window.cancelAnimationFrame;

if (!cancelAnimationFrame) {
  for (const vendor of vendors) {
    const cancelAnimationFrameName = `${vendor}RequestAnimationFrame`;
    if (window[cancelAnimationFrameName]) {
      cancelAnimationFrame = window[cancelAnimationFrameName];
      break;
    }
  }
}

export default cancelAnimationFrame || ((id: number) => {
  clearTimeout(id);
});
