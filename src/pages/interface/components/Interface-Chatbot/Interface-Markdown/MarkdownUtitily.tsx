/* eslint-disable */
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneIcon from "@mui/icons-material/Done";
import { Typography } from "@mui/material";
import copy from "copy-to-clipboard";
import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

export const Code = ({
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
    }, 1500);
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
            <ContentCopyIcon
              fontSize="inherit"
              sx={{ height: 20 }}
              className="mr-1"
            />
            <Typography variant="body2">Copy code</Typography>
          </>
        ) : (
          <>
            <DoneIcon
              fontSize="inherit"
              sx={{ height: 20, width: 20 }}
              className="mr-1"
              color="success"
            />
            <Typography variant="body2">Copied!</Typography>
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

export const Anchor = ({ href, children, ...props }) => {
  return (
    <a href={href} target="_blank" rel="noreferrer" {...props}>
      {children}
    </a>
  );
};
