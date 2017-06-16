const paths = location.pathname.split("/");
const versionPattern = /v\d{1,2}.\d{1,2}.\d{1,2}-?\w*\.?\d{0,2}/;

export default function getCurrVersion() {
  const rootPath = paths[1];
  if (versionPattern.test(rootPath)) {
    return rootPath;
  } else {
    return "HEAD";
  }
}
