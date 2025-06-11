import { useState, useCallback, useRef } from "react";
import MistralAPI from "../services/mistralAPI";
import { validateTextSelection } from "../utils/validation";

export const useAI = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [currentAction, setCurrentAction] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const abortController = useRef(null);

  const processText = useCallback(async (text, action, options = {}) => {
    // Validate input
    const validation = validateTextSelection(text);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    setIsProcessing(true);
    setError(null);
    setCurrentAction(action);

    // Cancel any ongoing request
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

    try {
      let result = "";
      const context = options.context || "";

      switch (action) {
        case "improve":
          result = await MistralAPI.improveText(text, context);
          break;
        case "summarize":
          result = await MistralAPI.summarizeText(text, options.maxLength);
          break;
        case "expand":
          result = await MistralAPI.expandText(text, context);
          break;
        case "translate":
          result = await MistralAPI.translateText(text, options.targetLanguage);
          break;
        case "custom":
          result = await MistralAPI.customPrompt(text, options.prompt, context);
          break;
        default:
          throw new Error(`Unknown action: ${action}`);
      }

      setSuggestion(result);
      return result;
    } catch (err) {
      if (err.name === "AbortError") {
        return null; // Request was cancelled
      }

      setError(err.message);
      throw err;
    } finally {
      setIsProcessing(false);
      setCurrentAction("");
      abortController.current = null;
    }
  }, []);

  const cancelProcessing = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
    }
  }, []);

  const clearSuggestion = useCallback(() => {
    setSuggestion("");
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    processText,
    isProcessing,
    error,
    currentAction,
    suggestion,
    cancelProcessing,
    clearSuggestion,
    clearError,
  };
};
