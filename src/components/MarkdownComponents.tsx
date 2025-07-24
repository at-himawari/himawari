/* eslint-disable @typescript-eslint/no-explicit-any */
// Markdownの表示カスタマイズ
export const markdownComponents = {
  h1: (props: any) => (
    <h1
      className="text-3xl font-bold mt-8 mb-4 underline decoration-slate-300"
      {...props}
    />
  ),
  h2: (props: any) => (
    <h2
      className="text-2xl font-bold mt-6 mb-3 underline decoration-slate-300"
      {...props}
    />
  ),
  h3: (props: any) => (
    <h3
      className="text-xl font-bold mt-4 mb-2 underline decoration-slate-300"
      {...props}
    />
  ),
  h4: (props: any) => <h4 className="text-xl mt-4 mb-2" {...props} />,
  p: (props: any) => (
    <p className="text-base leading-relaxed mb-4" {...props} />
  ),
  ol: (props: any) => <ol className="list-decimal pl-6 mb-4" {...props} />,
  li: (props: any) => (
    <li className="mb-2 text-base leading-relaxed" {...props} />
  ),
  ul: (props: any) => <ul className="list-disc pl-6 mb-4" {...props} />,
  a: (props: any) => (
    <a
      className="text-blue-600 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
};
