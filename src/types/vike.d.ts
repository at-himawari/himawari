declare global {
  namespace Vike {
    interface PageContext {
      data?: {
        title?: string;
        description?: string;
        coverImage?: string;
      };
    }
    interface PageContextServer {
        data?: {
          title?: string;
          description?: string;
          coverImage?: string;
        };
      }
  }
}
export {};
