import React from "react";
import { FileText, Download, Image as ImageIcon } from "lucide-react";

export default function ChatMessage({ role, content, fileUrl, fileType, fileName, timestamp }) {
  const isUser = role === "user";
  const isImage = fileType?.startsWith("image/");
  const isDoc = fileType?.includes("pdf") || fileType?.includes("word") || fileType?.includes("officedocument") || fileName?.endsWith(".doc") || fileName?.endsWith(".docx") || fileName?.endsWith(".pdf");

  return (
    <div
      className={`max-w-[85%] sm:max-w-[70%] break-words p-4 rounded-2xl shadow-sm animate-float-in ${
        isUser 
          ? "bg-gradient-to-br from-mindease-500 to-accent-500 text-white ml-auto rounded-tr-none shadow-mindease-200/20" 
          : "bg-white text-gray-800 mr-auto rounded-tl-none border border-mindease-100 shadow-gray-200/10"
      }`}
    >
      {/* File Attachment */}
      {fileUrl && (
        <div className="mb-2">
          {isImage ? (
            <div className="rounded-lg overflow-hidden border border-white/20 shadow-inner">
              <img 
                src={fileUrl} 
                alt={fileName || "Image attachment"} 
                className="max-w-full h-auto max-h-60 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(fileUrl, '_blank')}
              />
            </div>
          ) : (
            <div className={`flex items-center gap-3 p-3 rounded-xl border ${isUser ? "bg-white/10 border-white/20" : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"}`}>
              <div className={`p-2 rounded-lg ${isUser ? "bg-white/20" : "bg-mindease-100 dark:bg-mindease-900/30 text-mindease-600 dark:text-mindease-400"}`}>
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-grow min-w-0">
                <p className={`text-xs font-semibold truncate ${isUser ? "text-white" : "text-gray-700 dark:text-gray-200"}`}>
                  {fileName || "Document"}
                </p>
                <p className={`text-[10px] ${isUser ? "text-white/70" : "text-gray-500 dark:text-gray-400"}`}>
                  {isDoc ? (fileType?.includes("pdf") ? "PDF Document" : "Word Document") : "File"}
                </p>
              </div>
              <a 
                href={fileUrl} 
                download={fileName}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition ${isUser ? "hover:bg-white/20 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-600 text-mindease-600 dark:text-mindease-400"}`}
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      )}

      {/* Text Content */}
      {content && (
        <p className="text-sm font-body leading-relaxed whitespace-pre-line">
          {content}
        </p>
      )}

      {/* Timestamp */}
      {timestamp && (
        <div className={`text-[10px] mt-1 opacity-70 flex ${isUser ? "justify-end" : "justify-start"}`}>
          {timestamp}
        </div>
      )}
    </div>
  );
}
