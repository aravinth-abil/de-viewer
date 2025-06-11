import React, { useState, useRef, useEffect, useCallback } from "react";

const DocumentEditor = ({ content, onChange, onTextSelection, theme }) => {
  const [editorContent, setEditorContent] = useState(content);
  const [focused, setFocused] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const editorRef = useRef(null);

  const updateWordCount = useCallback((text) => {
    const plainText = text.replace(/<[^>]*>/g, "");
    const words = plainText
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    setWordCount(words.length);
    setCharacterCount(plainText.length);
  }, []);

  useEffect(() => {
    setEditorContent(content);
    updateWordCount(content);
  }, [content, updateWordCount]);

  const handleInput = useCallback(
    (e) => {
      const newContent = e.target.innerHTML;
      setEditorContent(newContent);

      // Debounced update
      const timeoutId = setTimeout(() => {
        onChange(newContent);
        updateWordCount(newContent);
      }, 300);

      return () => clearTimeout(timeoutId);
    },
    [onChange, updateWordCount]
  );

  const handleSelectionChange = useCallback(() => {
    try {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const selectedText = selection.toString().trim();

      if (selectedText && editorRef.current?.contains(selection.anchorNode)) {
        onTextSelection(selectedText);
      }
    } catch (error) {
      console.warn("Selection change error:", error);
    }
  }, [onTextSelection]);

  useEffect(() => {
    const handleMouseUp = () => {
      setTimeout(handleSelectionChange, 10);
    };

    const handleKeyUp = () => {
      setTimeout(handleSelectionChange, 10);
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleSelectionChange]);

  const formatText = useCallback(
    (command, value = null) => {
      try {
        document.execCommand(command, false, value);
        editorRef.current?.focus();

        setTimeout(() => {
          if (editorRef.current) {
            const newContent = editorRef.current.innerHTML;
            setEditorContent(newContent);
            onChange(newContent);
          }
        }, 0);
      } catch (error) {
        console.warn("Format command error:", error);
      }
    },
    [onChange]
  );

  const insertHeading = useCallback(
    (level) => {
      formatText("formatBlock", `h${level}`);
    },
    [formatText]
  );

  const insertList = useCallback(
    (type) => {
      formatText(
        type === "ordered" ? "insertOrderedList" : "insertUnorderedList"
      );
    },
    [formatText]
  );

  const toolbarButtons = [
    { command: "bold", icon: "B", title: "Bold (Ctrl+B)" },
    { command: "italic", icon: "I", title: "Italic (Ctrl+I)" },
    { command: "underline", icon: "U", title: "Underline (Ctrl+U)" },
    { command: "strikeThrough", icon: "S", title: "Strikethrough" },
    { type: "separator" },
    { type: "heading", level: 1, icon: "H1", title: "Heading 1" },
    { type: "heading", level: 2, icon: "H2", title: "Heading 2" },
    { type: "heading", level: 3, icon: "H3", title: "Heading 3" },
    { type: "separator" },
    { type: "list", listType: "unordered", icon: "•", title: "Bullet List" },
    { type: "list", listType: "ordered", icon: "1.", title: "Numbered List" },
    { type: "separator" },
    { command: "indent", icon: "→", title: "Indent" },
    { command: "outdent", icon: "←", title: "Outdent" },
    { type: "separator" },
    { command: "justifyLeft", icon: "⚊", title: "Align Left" },
    { command: "justifyCenter", icon: "⚌", title: "Align Center" },
    { command: "justifyRight", icon: "⚋", title: "Align Right" },
  ];

  const handleKeyDown = useCallback(
    (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault();
            formatText("bold");
            break;
          case "i":
            e.preventDefault();
            formatText("italic");
            break;
          case "u":
            e.preventDefault();
            formatText("underline");
            break;
          case "z":
            if (e.shiftKey) {
              e.preventDefault();
              formatText("redo");
            } else {
              e.preventDefault();
              formatText("undo");
            }
            break;
          default:
            break;
        }
      }
    },
    [formatText]
  );

  const editorStyle = {
    flex: 1,
    minHeight: "400px",
    padding: "20px",
    border: `2px solid ${focused ? theme?.primary || "#1976d2" : "#ddd"}`,
    borderRadius: "8px",
    fontSize: "16px",
    lineHeight: "1.6",
    outline: "none",
    backgroundColor: theme?.background?.paper || "#ffffff",
    color: theme?.text?.primary || "#333333",
    transition: "border-color 0.3s ease",
    overflowY: "auto",
    maxHeight: "calc(100vh - 300px)",
  };

  return (
    <div
      className="document-editor"
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <div className="editor-header">
        <h3>📝 Document Editor</h3>
        <div className="editor-stats">
          <span>{wordCount} words</span>
          <span>{characterCount} characters</span>
        </div>
      </div>

      {/* Formatting Toolbar */}
      <div className="editor-toolbar">
        {toolbarButtons.map((button, index) => {
          if (button.type === "separator") {
            return <div key={index} className="toolbar-separator" />;
          }

          if (button.type === "heading") {
            return (
              <button
                key={index}
                className="toolbar-btn"
                onClick={() => insertHeading(button.level)}
                title={button.title}
              >
                {button.icon}
              </button>
            );
          }

          if (button.type === "list") {
            return (
              <button
                key={index}
                className="toolbar-btn"
                onClick={() => insertList(button.listType)}
                title={button.title}
              >
                {button.icon}
              </button>
            );
          }

          return (
            <button
              key={index}
              className="toolbar-btn"
              onClick={() => formatText(button.command)}
              title={button.title}
            >
              {button.icon}
            </button>
          );
        })}
      </div>

      {/* Editor Content */}
      <div
        ref={editorRef}
        className={`editor-content ${focused ? "focused" : ""}`}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={handleKeyDown}
        dangerouslySetInnerHTML={{ __html: editorContent }}
        style={editorStyle}
      />

      {/* Editor Footer */}
      <div className="editor-footer">
        <div className="editor-tips">
          <span>💡 Tip: Select text to use AI features</span>
        </div>
        <div className="editor-shortcuts">
          <small>
            Ctrl+B: Bold | Ctrl+I: Italic | Ctrl+U: Underline | Ctrl+Z: Undo
          </small>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;
