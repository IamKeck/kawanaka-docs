import gfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import ReactMarkDown from "react-markdown";
import React, { useEffect, useState } from "react";
import rehypeRaw from "rehype-raw";

const article = (props: { md: string }) => {
  return (
    <>
      <ReactMarkDown
        remarkPlugins={[gfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={darcula}
                language={match[1]}
                PreTag="div"
                children={String(children).replace(/\n$/, "")}
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {props.md}
      </ReactMarkDown>
      <GoTop />
    </>
  );
};
export default article;
const GoTop = () => {
  const [scroll, setScroll] = useState<number>(0);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(document.documentElement.scrollTop);
    });
  }, []);
  const show = scroll > 80;

  const onClick = () => {
    window.scrollTo(0, 0);
  };
  return (
    <div
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: "5%",
        right: "10%",
        borderRadius: "50%",
        fontSize: "4.5em",
        opacity: show ? "0.8" : "0",
        transition: "all",
        transitionDuration: "0.6s",
      }}
    >
      {"⬆️"}
    </div>
  );
};
