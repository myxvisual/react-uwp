declare module "inline-style-prefix" {
  import * as React from "react";

  export default function prefixAll(styles?: React.CSSProperties): React.CSSProperties;
}

interface PrefixAll {
  (style: React.CSSProperties): React.CSSProperties;
}

declare module "prismjs";
