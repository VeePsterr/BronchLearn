import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    table: (props) => <table className="my-4 w-full text-left text-sm" {...props} />,
    th: (props) => <th className="border-b border-line py-1.5 pr-3" {...props} />,
    td: (props) => <td className="border-b border-line py-1.5 pr-3" {...props} />,
    h1: (props) => <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl" {...props} />,
    ...components,
  };
}
