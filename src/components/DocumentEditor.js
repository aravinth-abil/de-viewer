import React, { useState, useRef, useEffect, useCallback } from "react";

const DocumentEditor = ({ content, onChange, onTextSelection, theme }) => {
  const [editorContent, setEditorContent] = useState(content);
  const [focused, setFocused] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);

  // Custom undo/redo system
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [currentStateIndex, setCurrentStateIndex] = useState(-1);

  const editorRef = useRef(null);
  const timeoutRef = useRef(null);
  const isUndoRedoAction = useRef(false);
  const lastSavedSelection = useRef(null);

  const updateWordCount = useCallback((text) => {
    const plainText = text.replace(/<[^>]*>/g, "");
    const words = plainText
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    setWordCount(words.length);
    setCharacterCount(plainText.length);
  }, []);

  // Save current selection
  const saveSelection = useCallback(() => {
    try {
      const selection = window.getSelection();
      if (
        selection.rangeCount > 0 &&
        editorRef.current?.contains(selection.anchorNode)
      ) {
        const range = selection.getRangeAt(0);
        lastSavedSelection.current = {
          startContainer: range.startContainer,
          startOffset: range.startOffset,
          endContainer: range.endContainer,
          endOffset: range.endOffset,
        };
      }
    } catch (error) {
      console.warn("Error saving selection:", error);
    }
  }, []);

  // Restore selection
  const restoreSelection = useCallback(() => {
    try {
      if (lastSavedSelection.current && editorRef.current) {
        const selection = window.getSelection();
        const range = document.createRange();

        // Check if nodes still exist in the DOM
        if (
          editorRef.current.contains(
            lastSavedSelection.current.startContainer
          ) &&
          editorRef.current.contains(lastSavedSelection.current.endContainer)
        ) {
          range.setStart(
            lastSavedSelection.current.startContainer,
            lastSavedSelection.current.startOffset
          );
          range.setEnd(
            lastSavedSelection.current.endContainer,
            lastSavedSelection.current.endOffset
          );

          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    } catch (error) {
      console.warn("Error restoring selection:", error);
    }
  }, []);

  // Initialize undo system
  useEffect(() => {
    if (content && undoStack.length === 0) {
      setUndoStack([content]);
      setCurrentStateIndex(0);
      setEditorContent(content);
      updateWordCount(content);

      if (editorRef.current && editorRef.current.innerHTML !== content) {
        editorRef.current.innerHTML = content;
      }
    }
  }, [content, undoStack.length, updateWordCount]);

  // Save state to undo stack
  const saveToUndoStack = useCallback(
    (newContent) => {
      if (isUndoRedoAction.current) return;

      setUndoStack((prevStack) => {
        const newStack = [...prevStack];

        // If we're not at the end of the stack, remove everything after current position
        if (currentStateIndex < newStack.length - 1) {
          newStack.splice(currentStateIndex + 1);
        }

        // Only add if content is different from current state
        if (newStack[newStack.length - 1] !== newContent) {
          newStack.push(newContent);

          // Limit stack size to prevent memory issues
          if (newStack.length > 50) {
            newStack.shift();
            setCurrentStateIndex((prev) => Math.max(0, prev - 1));
          } else {
            setCurrentStateIndex(newStack.length - 1);
          }
        }

        return newStack;
      });

      // Clear redo stack when new content is added
      setRedoStack([]);
    },
    [currentStateIndex]
  );

  const handleInput = useCallback(
    (e) => {
      if (isUndoRedoAction.current) return;

      const newContent = e.target.innerHTML;
      setEditorContent(newContent);

      // Save selection before any changes
      saveSelection();

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Debounced save to undo stack and parent update
      timeoutRef.current = setTimeout(() => {
        saveToUndoStack(newContent);
        onChange(newContent);
        updateWordCount(newContent);
      }, 500); // Increased timeout for better grouping of changes
    },
    [onChange, updateWordCount, saveToUndoStack, saveSelection]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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

    const handleKeyUp = (e) => {
      // Don't trigger selection change for undo/redo keys
      if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "y")) {
        return;
      }
      setTimeout(handleSelectionChange, 10);
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleSelectionChange]);

  // Undo function
  const handleUndo = useCallback(() => {
    if (currentStateIndex > 0) {
      isUndoRedoAction.current = true;

      const previousContent = undoStack[currentStateIndex - 1];
      setCurrentStateIndex((prev) => prev - 1);
      setEditorContent(previousContent);

      if (editorRef.current) {
        editorRef.current.innerHTML = previousContent;
        editorRef.current.focus();

        // Try to restore selection after a brief delay
        setTimeout(() => {
          restoreSelection();
          isUndoRedoAction.current = false;
        }, 10);
      }

      onChange(previousContent);
      updateWordCount(previousContent);

      console.log(
        "Undo - Current index:",
        currentStateIndex - 1,
        "Stack length:",
        undoStack.length
      );
    }
  }, [
    currentStateIndex,
    undoStack,
    onChange,
    updateWordCount,
    restoreSelection,
  ]);

  // Redo function
  const handleRedo = useCallback(() => {
    if (currentStateIndex < undoStack.length - 1) {
      isUndoRedoAction.current = true;

      const nextContent = undoStack[currentStateIndex + 1];
      setCurrentStateIndex((prev) => prev + 1);
      setEditorContent(nextContent);

      if (editorRef.current) {
        editorRef.current.innerHTML = nextContent;
        editorRef.current.focus();

        // Try to restore selection after a brief delay
        setTimeout(() => {
          restoreSelection();
          isUndoRedoAction.current = false;
        }, 10);
      }

      onChange(nextContent);
      updateWordCount(nextContent);

      console.log(
        "Redo - Current index:",
        currentStateIndex + 1,
        "Stack length:",
        undoStack.length
      );
    }
  }, [
    currentStateIndex,
    undoStack,
    onChange,
    updateWordCount,
    restoreSelection,
  ]);

  const formatText = useCallback(
    (command, value = null) => {
      try {
        if (editorRef.current) {
          // Save current state before formatting
          saveToUndoStack(editorContent);

          editorRef.current.focus();
          saveSelection();

          // Apply formatting
          const success = document.execCommand(command, false, value);

          if (success) {
            // Update state after formatting
            setTimeout(() => {
              if (editorRef.current) {
                const newContent = editorRef.current.innerHTML;
                setEditorContent(newContent);
                onChange(newContent);
                restoreSelection();
              }
            }, 10);
          }
        }
      } catch (error) {
        console.warn("Format command error:", error);
      }
    },
    [editorContent, onChange, saveToUndoStack, saveSelection, restoreSelection]
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
    { type: "separator" },
    { type: "undo", icon: "↶", title: "Undo (Ctrl+Z)" },
    { type: "redo", icon: "↷", title: "Redo (Ctrl+Y)" },
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
            e.preventDefault();
            if (e.shiftKey) {
              handleRedo();
            } else {
              handleUndo();
            }
            break;
          case "y":
            e.preventDefault();
            handleRedo();
            break;
          default:
            break;
        }
      }
    },
    [formatText, handleUndo, handleRedo]
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

  // Debug info
  const canUndo = currentStateIndex > 0;
  const canRedo = currentStateIndex < undoStack.length - 1;

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
          <span style={{ fontSize: "12px", opacity: 0.7 }}>
            History: {currentStateIndex + 1}/{undoStack.length}
          </span>
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

          if (button.type === "undo") {
            return (
              <button
                key={index}
                className="toolbar-btn"
                onClick={handleUndo}
                disabled={!canUndo}
                title={button.title}
                style={{
                  opacity: canUndo ? 1 : 0.5,
                  cursor: canUndo ? "pointer" : "not-allowed",
                }}
              >
                {button.icon}
              </button>
            );
          }

          if (button.type === "redo") {
            return (
              <button
                key={index}
                className="toolbar-btn"
                onClick={handleRedo}
                disabled={!canRedo}
                title={button.title}
                style={{
                  opacity: canRedo ? 1 : 0.5,
                  cursor: canRedo ? "pointer" : "not-allowed",
                }}
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
            Ctrl+B: Bold | Ctrl+I: Italic | Ctrl+U: Underline | Ctrl+Z: Undo |
            Ctrl+Shift+Z: Redo
          </small>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;
