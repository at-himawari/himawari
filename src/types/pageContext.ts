// types/pageContext.ts

import { JSX } from "react";

// types/pageContext.ts

export type PageContext = {
    Page: () => JSX.Element;
    pageProps: Record<string, unknown>;
    urlPathname: string;
    exports: {
      documentProps?: {
        title?: string;
        description?: string;
      };
    };
    content: string;
  
    // 明示的にクライアント用であることを示す
    isClientSide: true;
  };
  
  