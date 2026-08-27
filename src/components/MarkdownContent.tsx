import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./MarkdownContent.css";

const MarkdownContent = ({ content }: { content: string }) => {
  const normalizedContent = content.trim();

  return (
    <div className="markdown-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownContent;