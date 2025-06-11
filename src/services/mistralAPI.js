const MISTRAL_API_KEY = process.env.REACT_APP_MISTRAL_API_KEY;
const MISTRAL_ENDPOINT = process.env.REACT_APP_MISTRAL_ENDPOINT;

class MistralAPI {
  static async makeRequest(messages, options = {}) {
    if (!MISTRAL_API_KEY) {
      throw new Error("Mistral API key is not configured");
    }

    const { maxTokens, ...rest } = options;
    const requestBody = {
      model: options.model || "mistral-small-latest",
      messages: messages,
      max_tokens: maxTokens || 500,
      temperature: options.temperature || 0.7,
      stream: false,
      ...rest,
    };

    try {
      const response = await fetch(MISTRAL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MISTRAL_API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("API Error Response:", errorData);

        if (response.status === 401) {
          throw new Error(
            "Invalid API key. Please check your Mistral AI API key."
          );
        } else if (response.status === 422) {
          throw new Error(
            "Invalid request format. Please try with shorter text."
          );
        } else if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again later.");
        } else {
          throw new Error(
            `API request failed: ${response.status} ${response.statusText}`
          );
        }
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "No response received";
    } catch (error) {
      console.error("Mistral API error:", error);
      throw error;
    }
  }

  static async improveText(text, context = "") {
    const messages = [
      {
        role: "system",
        content:
          "You are a professional editor. Improve the given text for clarity, grammar, and readability while maintaining the original meaning. Keep the response concise.",
      },
      {
        role: "user",
        content: `Please improve this text: "${text}"${
          context ? `\n\nContext: ${context.substring(0, 500)}` : ""
        }`,
      },
    ];

    return await this.makeRequest(messages, { maxTokens: 300 });
  }

  static async summarizeText(text, maxLength = 100) {
    const messages = [
      {
        role: "system",
        content: `You are a summarization expert. Create a concise summary of the given text in approximately ${maxLength} words or less.`,
      },
      {
        role: "user",
        content: `Please summarize this text: "${text}"`,
      },
    ];

    return await this.makeRequest(messages, {
      maxTokens: Math.ceil(maxLength * 2),
    });
  }

  static async expandText(text, context = "") {
    const messages = [
      {
        role: "system",
        content:
          "You are a content writer. Expand the given text with additional relevant details, examples, and context while maintaining coherence.",
      },
      {
        role: "user",
        content: `Please expand this text with more detail: "${text}"${
          context ? `\n\nContext: ${context.substring(0, 500)}` : ""
        }`,
      },
    ];

    return await this.makeRequest(messages, { maxTokens: 600 });
  }

  static async translateText(text, targetLanguage = "Spanish") {
    const messages = [
      {
        role: "system",
        content: `You are a professional translator. Translate the given text to ${targetLanguage} while maintaining the original tone and meaning.`,
      },
      {
        role: "user",
        content: `Please translate this text to ${targetLanguage}: "${text}"`,
      },
    ];

    return await this.makeRequest(messages, { maxTokens: 400 });
  }

  static async customPrompt(text, prompt, context = "") {
    const messages = [
      {
        role: "system",
        content: prompt,
      },
      {
        role: "user",
        content: `Text: "${text}"${
          context ? `\n\nContext: ${context.substring(0, 500)}` : ""
        }`,
      },
    ];

    return await this.makeRequest(messages, { maxTokens: 500 });
  }
}

export default MistralAPI;
