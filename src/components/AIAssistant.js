import React, { useState } from "react";
import { useAI } from "../hooks/useAI";
import { validateTextSelection } from "../utils/validation";
import { copyToClipboard } from "../utils/helpers";

const AIAssistant = ({ selectedText, onModification, fullContent, theme }) => {
  const [targetLanguage, setTargetLanguage] = useState("Spanish");
  const [customPrompt, setCustomPrompt] = useState("");
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const {
    processText,
    isProcessing,
    error,
    currentAction,
    suggestion,
    cancelProcessing,
    clearSuggestion,
    clearError,
  } = useAI();

  const handleAction = async (action, options = {}) => {
    clearError();

    const validation = validateTextSelection(selectedText);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    try {
      await processText(selectedText, action, {
        context: fullContent.substring(0, 1000), // Provide context
        ...options,
      });
    } catch (err) {
      console.error("AI processing error:", err);
    }
  };

  const handleCustomPrompt = async () => {
    if (!customPrompt.trim()) {
      alert("Please enter a custom prompt");
      return;
    }

    await handleAction("custom", { prompt: customPrompt });
    setShowCustomPrompt(false);
  };

  const applyModification = () => {
    if (suggestion && selectedText) {
      const modifiedContent = fullContent.replace(selectedText, suggestion);
      onModification(modifiedContent);
      clearSuggestion();
    }
  };

  const handleCopySuggestion = async () => {
    const success = await copyToClipboard(suggestion);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const actionButtons = [
    {
      action: "improve",
      label: "Improve Text",
      icon: "✨",
      description: "Enhance grammar and clarity",
    },
    {
      action: "summarize",
      label: "Summarize",
      icon: "📝",
      description: "Create a concise summary",
    },
    {
      action: "expand",
      label: "Expand",
      icon: "📈",
      description: "Add more detail and context",
    },
    {
      action: "translate",
      label: "Translate",
      icon: "🌐",
      description: "Translate to another language",
    },
  ];

  return (
    <div className="ai-assistant">
      <div className="ai-header">
        <h3>✨ AI Assistant</h3>
        {isProcessing && (
          <button
            onClick={cancelProcessing}
            className="btn btn-small btn-secondary"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="selected-text">
        <div className="selected-text-label">Selected Text:</div>
        <div className="selected-text-content">
          "{selectedText.substring(0, 100)}
          {selectedText.length > 100 ? "..." : ""}"
        </div>
        <div className="selected-text-info">
          {selectedText.length} characters
        </div>
      </div>

      {error && (
        <div className="ai-error">
          <p>{error}</p>
          <button onClick={clearError} className="btn btn-small">
            Dismiss
          </button>
        </div>
      )}

      <div className="ai-actions">
        {actionButtons.map(({ action, label, icon, description }) => (
          <div key={action} className="ai-action-item">
            <button
              onClick={() => {
                if (action === "translate") {
                  handleAction(action, { targetLanguage });
                } else {
                  handleAction(action);
                }
              }}
              disabled={isProcessing}
              className={`ai-action-btn ${
                isProcessing && currentAction === action ? "processing" : ""
              }`}
            >
              <span className="action-icon">{icon}</span>
              <div className="action-content">
                <div className="action-label">
                  {isProcessing && currentAction === action
                    ? "Processing..."
                    : label}
                </div>
                <div className="action-description">{description}</div>
              </div>
            </button>

            {action === "translate" && (
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="language-select"
                disabled={isProcessing}
              >
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Italian">Italian</option>
                <option value="Portuguese">Portuguese</option>
                <option value="Japanese">Japanese</option>
                <option value="Chinese">Chinese</option>
                <option value="Arabic">Arabic</option>
              </select>
            )}
          </div>
        ))}

        <div className="ai-action-item">
          <button
            onClick={() => setShowCustomPrompt(!showCustomPrompt)}
            className="ai-action-btn"
            disabled={isProcessing}
          >
            <span className="action-icon">🎯</span>
            <div className="action-content">
              <div className="action-label">Custom Prompt</div>
              <div className="action-description">
                Use your own AI instruction
              </div>
            </div>
          </button>

          {showCustomPrompt && (
            <div className="custom-prompt-form">
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Enter your custom prompt (e.g., 'Rewrite this in a more formal tone')"
                className="custom-prompt-input"
                rows={3}
              />
              <div className="custom-prompt-actions">
                <button
                  onClick={handleCustomPrompt}
                  disabled={isProcessing || !customPrompt.trim()}
                  className="btn btn-primary btn-small"
                >
                  Apply
                </button>
                <button
                  onClick={() => setShowCustomPrompt(false)}
                  className="btn btn-secondary btn-small"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isProcessing && (
        <div className="ai-processing">
          <div className="processing-indicator">
            <div className="spinner"></div>
            <span>AI is processing your request...</span>
          </div>
        </div>
      )}

      {suggestion && (
        <div className="ai-suggestion">
          <div className="suggestion-header">
            <h4>AI Suggestion:</h4>
            <div className="suggestion-actions">
              <button
                onClick={handleCopySuggestion}
                className="btn btn-small btn-secondary"
                title="Copy to clipboard"
              >
                {copySuccess ? "✅" : "📋"}
              </button>
              <button
                onClick={clearSuggestion}
                className="btn btn-small btn-secondary"
                title="Clear suggestion"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="suggestion-content">{suggestion}</div>

          <div className="suggestion-footer">
            <button onClick={applyModification} className="btn btn-primary">
              Apply Changes
            </button>
            <button onClick={clearSuggestion} className="btn btn-secondary">
              Discard
            </button>
          </div>
        </div>
      )}

      <div className="ai-tips">
        <h4>💡 Tips:</h4>
        <ul>
          <li>Select specific text for better AI results</li>
          <li>Try different actions to see various suggestions</li>
          <li>Use custom prompts for specialized tasks</li>
          <li>Copy suggestions before applying changes</li>
        </ul>
      </div>
    </div>
  );
};

export default AIAssistant;
