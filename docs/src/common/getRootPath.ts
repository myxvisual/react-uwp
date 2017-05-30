export default function getRootPath() {
  const paths = location.pathname.split("/");
  const versionPattern = /v\d{1,2}.\d{1,2}.\d{1,2}-?\w*\.?\d{0,2}/;

  let rightRootPath = "";
  const rootPath = paths[1];
  const isDocVersionPath = versionPattern.test(rootPath);
  if (isDocVersionPath) {
    rightRootPath = `/${rootPath}`;
  }

  return rightRootPath;
}
