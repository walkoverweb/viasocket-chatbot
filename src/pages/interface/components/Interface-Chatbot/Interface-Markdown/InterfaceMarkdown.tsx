/* eslint-disable */
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneIcon from "@mui/icons-material/Done";
import copy from "copy-to-clipboard";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";

const Code = ({
  inline,
  className,
  children,
  ...props
}: {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}) => {
  const [tipForCopy, setTipForCopy] = useState(false);

  const handlecopyfunction = (text: any) => {
    copy(text);
    setTipForCopy(true);
    setTimeout(() => {
      setTipForCopy(false);
    }, 800);
  };
  const match = /language-(\w+)/.exec(className || "");
  return !inline && match ? (
    <div className="m-0">
      <p
        className="m-0 flex-end-center cursor-pointer p-1 pr-2"
        style={{
          backgroundColor: "#DCDCDC",
          borderTopRightRadius: 8,
          borderTopLeftRadius: 8,
        }}
        onClick={() => handlecopyfunction(children)}
      >
        {!tipForCopy ? (
          <>
            {" "}
            <ContentCopyIcon
              fontSize="inherit"
              sx={{ height: 20 }}
              className="mr-1"
            />
            copy
          </>
        ) : (
          <>
            <DoneIcon fontSize="inherit" sx={{ height: 20 }} className="mr-1" />
            copied!
          </>
        )}
      </p>
      <SyntaxHighlighter
        // style={vs}
        className="bg-white outline-none border-0 m-0"
        language={match[1]}
        wrapLongLines={true} // Enable word wrapping
        codeTagProps={{ style: { whiteSpace: "pre-wrap" } }} // Ensure word wrapping
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

const Anchor = ({ href, children, ...props }) => {
  return (
    <a href={href} target="_blank" rel="noreferrer" {...props}>
      {children}
    </a>
  );
};

function InterfaceMarkdown({ props }: any) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code: Code,
        a: Anchor,
      }}
    >
      {props?.children ||
        props?.text ||
        props?.content ||
        `I'm a markdown component.`}
    </ReactMarkdown>
  );
}

export default InterfaceMarkdown;
