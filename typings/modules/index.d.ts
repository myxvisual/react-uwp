declare module "inline-style-prefixer" {
  export interface PrefixerOptions {
    userAgent?: string;
    keepUnprefixed?: string;
  }

  export default class Prefixer {
    constructor(options?: PrefixerOptions);
    _userAgent: string;
    _keepUnprefixed: string;
    _metaData: {
      browserVersion: any;
      browserName: string;
      cssPrefix: any;
      jsPrefix: any;
      keepUnprefixed: string;
      requiresPrefix: any;
    }
    
    prefix: (styles?: React.CSSProperties) => React.CSSProperties;
  }
}

interface PrefixAll {
  (style: React.CSSProperties): React.CSSProperties;
}
