// types/pageContext.ts

import { JSX } from "react";
import { Post } from "./Post";


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
    posts: Post[];
    // 明示的にクライアント用であることを示す
    isClientSide: true;
  };
  
  