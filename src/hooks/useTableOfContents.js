import { useState, useEffect, useCallback } from "react";
import { debounce } from "../utils/helpers";

export const useTableOfContents = (content) => {
  const [tocItems, setTocItems] = useState([]);
  const [activeHeading, setActiveHeading] = useState("");

  const generateTOC = useCallback((htmlContent) => {
    if (!htmlContent) {
      setTocItems([]);
      return;
    }

    // Create a temporary div to parse the HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const headings = tempDiv.querySelectorAll("h1, h2, h3, h4, h5, h6");

    const items = Array.from(headings).map((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent.trim();
      const id = `heading-${index}`;

      return {
        id,
        level,
        text,
        index,
      };
    });

    setTocItems(items);
  }, []);

  // Fixed: Use useCallback properly with dependencies
  const debouncedGenerateTOC = useCallback(
    (content) => {
      const debouncedFn = debounce(() => generateTOC(content), 500);
      debouncedFn();
    },
    [generateTOC]
  );

  useEffect(() => {
    debouncedGenerateTOC(content);
  }, [content, debouncedGenerateTOC]);

  // Add IDs to headings in the actual DOM when content changes
  useEffect(() => {
    const addIdsToHeadings = () => {
      const editorContent = document.querySelector(".editor-content");
      if (!editorContent) return;

      const headings = editorContent.querySelectorAll("h1, h2, h3, h4, h5, h6");
      headings.forEach((heading, index) => {
        heading.id = `heading-${index}`;
      });
    };

    // Add IDs after a short delay to ensure content is rendered
    const timeoutId = setTimeout(addIdsToHeadings, 100);
    return () => clearTimeout(timeoutId);
  }, [content]);

  const scrollToHeading = useCallback((headingId) => {
    // First try to find the element
    let element = document.getElementById(headingId);

    if (!element) {
      // If not found, try to find by heading index
      const headingIndex = headingId.replace("heading-", "");
      const editorContent = document.querySelector(".editor-content");
      if (editorContent) {
        const headings = editorContent.querySelectorAll(
          "h1, h2, h3, h4, h5, h6"
        );
        element = headings[parseInt(headingIndex)];
        if (element) {
          element.id = headingId; // Ensure it has the correct ID
        }
      }
    }

    if (element) {
      // Calculate offset to account for header
      const headerHeight = 120; // Approximate header height
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setActiveHeading(headingId);

      // Highlight the heading briefly
      element.style.backgroundColor = "rgba(25, 118, 210, 0.1)";
      element.style.transition = "background-color 0.3s ease";
      setTimeout(() => {
        element.style.backgroundColor = "";
      }, 1000);
    }
  }, []);

  // Track active heading based on scroll position
  useEffect(() => {
    const handleScroll = debounce(() => {
      const headingElements = tocItems
        .map((item) => document.getElementById(item.id))
        .filter(Boolean);

      if (headingElements.length === 0) return;

      const scrollPosition = window.scrollY + 150; // Offset for better UX

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i];
        if (element.offsetTop <= scrollPosition) {
          setActiveHeading(element.id);
          break;
        }
      }
    }, 100);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tocItems]);

  return {
    tocItems,
    activeHeading,
    scrollToHeading,
    generateTOC,
  };
};
