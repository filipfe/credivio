import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: ({ children, ...props }) => (
      <h1
        {...props}
        className="text-4xl lg:text-5xl lg:leading-tight leading-tight text-foreground font-bold mb-3 max-w-3xl lg:max-w-none"
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2
        {...props}
        className="text-3xl lg:text-4xl lg:leading-tight leading-tight text-foreground font-bold mt-6"
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        {...props}
        className="text-xl lg:text-2xl lg:leading-tight leading-snug text-foreground font-bold mt-6"
      >
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4
        {...props}
        className="text-lg lg:text-xl lg:leading-tight leading-tight text-foreground font-bold mt-6 mb-2"
      >
        {children}
      </h4>
    ),
    a: ({ children, ...props }) => (
      <a {...props} className="text-blue-600 font-medium">
        {children}
      </a>
    ),
    strong: ({ children, ...props }) => (
      <strong className="font-bold" {...props}>
        {children}
      </strong>
    ),
    ol: ({ children, ...props }) => (
      <ol className="list-decimal pl-5 sm:pl-6 flex flex-col gap-2" {...props}>
        {children}
      </ol>
    ),
    ul: ({ children, ...props }) => (
      <ul className="list-disc pl-5 sm:pl-6 flex flex-col gap-2" {...props}>
        {children}
      </ul>
    ),
    img: (props) => (
      <Image
        width={1280}
        height={800}
        className="rounded-md object-cover my-3 max-w-3xl"
        {...(props as ImageProps)}
      />
    ),
    // li: ({ children, ...props }) => (
    //   <li className="font-medium" {...props}>
    //     {children}
    //   </li>
    // ),
  };
}
