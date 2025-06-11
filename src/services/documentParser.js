import mammoth from "mammoth";

class DocumentParser {
  static async parseDocx(arrayBuffer) {
    try {
      const result = await mammoth.convertToHtml({ arrayBuffer });

      if (result.messages.length > 0) {
        console.warn("DOCX parsing warnings:", result.messages);
      }

      return {
        html: result.value,
        messages: result.messages,
        success: true,
      };
    } catch (error) {
      console.error("DOCX parsing error:", error);
      return {
        html: "<p>Error parsing DOCX file. Please try a different format.</p>",
        messages: [error.message],
        success: false,
      };
    }
  }

  static parseText(text) {
    // Convert plain text to HTML with basic formatting
    const html = text
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br>")
      .replace(/^(.*)$/, "<p>$1</p>");

    return {
      html: html,
      messages: [],
      success: true,
    };
  }

  static parseRtf(rtfContent) {
    // Basic RTF to HTML conversion
    // This is a simplified version - for production, use a proper RTF parser
    let html = rtfContent
      .replace(/\\par\s*/g, "</p><p>")
      .replace(/\\b\s*(.*?)\\b0/g, "<strong>$1</strong>")
      .replace(/\\i\s*(.*?)\\i0/g, "<em>$1</em>")
      .replace(/\\u\s*(.*?)\\u0/g, "<u>$1</u>")
      .replace(/\\[a-z]+\d*\s*/g, "") // Remove RTF control words
      .replace(/[{}]/g, "") // Remove RTF braces
      .trim();

    // Wrap in paragraphs
    if (!html.includes("<p>")) {
      html = `<p>${html}</p>`;
    }

    return {
      html: html,
      messages: ["RTF parsing is basic - some formatting may be lost"],
      success: true,
    };
  }

  static async parseDocument(file) {
    const fileExtension = file.name.split(".").pop().toLowerCase();

    try {
      switch (fileExtension) {
        case "docx":
          const arrayBuffer = await file.arrayBuffer();
          return await this.parseDocx(arrayBuffer);

        case "txt":
          const text = await file.text();
          return this.parseText(text);

        case "rtf":
          const rtfText = await file.text();
          return this.parseRtf(rtfText);

        case "doc":
          // DOC files require server-side processing or specialized libraries
          return {
            html: `<h1>Document: ${file.name}</h1>
                   <p>DOC files are not fully supported in the browser. Please convert to DOCX or use a text format.</p>
                   <p>You can still use this editor to create new content with AI assistance.</p>`,
            messages: ["DOC format requires conversion to DOCX"],
            success: false,
          };

        default:
          throw new Error(`Unsupported document format: ${fileExtension}`);
      }
    } catch (error) {
      return {
        html: `<p>Error parsing document: ${error.message}</p>`,
        messages: [error.message],
        success: false,
      };
    }
  }

  static extractPlainText(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }

  static generateHeadings(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");

    return Array.from(headings).map((heading, index) => ({
      id: `heading-${index}`,
      level: parseInt(heading.tagName.charAt(1)),
      text: heading.textContent.trim(),
      element: heading,
    }));
  }

  static sanitizeHtml(html) {
    // Basic HTML sanitization
    const div = document.createElement("div");
    div.innerHTML = html;

    // Remove potentially dangerous elements
    const dangerousElements = div.querySelectorAll(
      "script, iframe, object, embed, form, input"
    );
    dangerousElements.forEach((el) => el.remove());

    // Remove dangerous attributes
    const allElements = div.querySelectorAll("*");
    allElements.forEach((el) => {
      const dangerousAttrs = ["onclick", "onload", "onerror", "onmouseover"];
      dangerousAttrs.forEach((attr) => {
        if (el.hasAttribute(attr)) {
          el.removeAttribute(attr);
        }
      });
    });

    return div.innerHTML;
  }
}

export default DocumentParser;
