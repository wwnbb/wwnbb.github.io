import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { storage } from "../../services/FirebaseStorage";
import { ref, getBytes } from "firebase/storage";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight, solarizedDarkAtom } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Markdown from "react-markdown";
import { Components } from 'react-markdown/src/ast-to-react';
import ContentCopy from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';

function Post() {
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    var file = ref(storage, `posts/${id}.md`);
    getBytes(file).then((content) => {
      const text = new TextDecoder("utf-8").decode(content);
      setMarkdown(text);
    }).catch((_) => {
      setMarkdown("Failed to load post");
    });

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleDarkModeToggle = (e) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addListener(handleDarkModeToggle);

    return () => {
      darkModeMediaQuery.removeListener(handleDarkModeToggle);
    };
  }, [id]);

  const copyToClipboard = (str) => {
    navigator.clipboard.writeText(str).then(() => { });
  };

  const components: Components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const content = String(children).replace(/\n$/, '');
      return !inline && match ? (
        <div style={{ position: 'inherit' }}>
          <SyntaxHighlighter
            style={isDarkMode ? solarizedDarkAtom : solarizedlight}
            language={match[1]}
            PreTag="div"
            {...props}
          >
            {content}
          </SyntaxHighlighter>
          <IconButton
            onClick={() => copyToClipboard(content)}
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              backdropFilter: 'blur(10px)',
              background: 'transparent'
            }}
          >
            <ContentCopy style={{ color: '#859900' }} />
          </IconButton>
        </div >
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <div className="sm:mx-10 hyphens-auto break-words markdown-text pb-96 lg:flex lg:flex-col lg:max-w-[60rem] lg:mx-auto">
      {markdown ? <Markdown components={components}>{markdown}</Markdown> : "Loading..."}
    </div>
  );
}

export default Post;
