/* eslint-disable @typescript-eslint/no-explicit-any */
// Markdownの表示カスタマイズ
export const markdownComponents = {
  // Existing Markdown elements
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
  h5: (props: any) => (
    <h5 className="text-lg mt-3 mb-2 font-semibold" {...props} />
  ),
  h6: (props: any) => (
    <h6 className="text-base mt-3 mb-2 font-semibold" {...props} />
  ),
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

  // HTML elements styling
  div: (props: any) => (
    <div className={`mb-4 ${props.className || ""}`} {...props} />
  ),
  span: (props: any) => <span className={props.className || ""} {...props} />,
  br: (props: any) => <br {...props} />,
  strong: (props: any) => <strong className="font-bold" {...props} />,
  em: (props: any) => <em className="italic" {...props} />,
  u: (props: any) => <u className="underline" {...props} />,
  blockquote: (props: any) => (
    <blockquote
      className="border-l-4 border-gray-300 pl-4 py-2 mb-4 italic text-gray-700 bg-gray-50 rounded-r"
      {...props}
    />
  ),
  code: (props: any) => (
    <code
      className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono"
      {...props}
    />
  ),
  pre: (props: any) => (
    <pre
      className="bg-gray-100 text-gray-800 p-4 rounded mb-4 overflow-x-auto text-sm font-mono"
      {...props}
    />
  ),

  // Media elements
  img: (props: any) => (
    <img
      className={`max-w-full h-auto rounded shadow-md mb-4 ${
        props.className || ""
      }`}
      loading="lazy"
      {...props}
    />
  ),
  video: (props: any) => (
    <video
      className={`max-w-full h-auto rounded shadow-md mb-4 ${
        props.className || ""
      }`}
      controls
      {...props}
    />
  ),
  audio: (props: any) => (
    <audio
      className={`w-full mb-4 ${props.className || ""}`}
      controls
      {...props}
    />
  ),
  iframe: (props: any) => (
    <iframe
      className={`w-full rounded shadow-md mb-4 ${props.className || ""}`}
      style={{ aspectRatio: "16/9", minHeight: "300px" }}
      {...props}
    />
  ),

  // Table elements
  table: (props: any) => (
    <div className="overflow-x-auto mb-4">
      <table
        className={`min-w-full border-collapse border border-gray-300 ${
          props.className || ""
        }`}
        {...props}
      />
    </div>
  ),
  thead: (props: any) => <thead className="bg-gray-50" {...props} />,
  tbody: (props: any) => <tbody {...props} />,
  tr: (props: any) => (
    <tr className="border-b border-gray-200 hover:bg-gray-50" {...props} />
  ),
  th: (props: any) => (
    <th
      className="border border-gray-300 px-4 py-2 text-left font-semibold bg-gray-100"
      {...props}
    />
  ),
  td: (props: any) => (
    <td className="border border-gray-300 px-4 py-2" {...props} />
  ),

  // Interactive elements
  button: (props: any) => (
    <button
      className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors mb-4 ${
        props.className || ""
      }`}
      {...props}
    />
  ),
};
