// types/pageContext.ts

import { JSX } from "react";
import { PostInfo } from "./PostInfo";

// types/pageContext.ts


export type PageContextPost = {
    Page: () => JSX.Element;
    pageProps: Record<string, unknown>;
    urlPathname: string;
    exports: {
      documentProps?: {
        title?: string;
        description?: string;
      };
    };
    posts: PostInfo[];
    // 明示的にクライアント用であることを示す
    isClientSide: true;
  };
  
  