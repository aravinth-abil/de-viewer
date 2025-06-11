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
        // Add smooth scroll behavior
        heading.style.scrollMarginTop = "120px"; // Account for header height
      });
    };

    // Add IDs after a short delay to ensure content is rendered
    const timeoutId = setTimeout(addIdsToHeadings, 100);
    return () => clearTimeout(timeoutId);
  }, [content]);

  const scrollToHeading = useCallback(
    (headingId) => {
      // Enhanced scroll function with better positioning
      const scrollToElement = (element) => {
        if (!element) return false;

        // Get the editor container for better scroll calculation
        const editorContent = document.querySelector(".editor-content");
        const appMain = document.querySelector(".app-main");

        if (editorContent && appMain) {
          // Calculate positions relative to editor container
          const editorRect = editorContent.getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();

          // Calculate scroll position within the editor
          const scrollTop = editorContent.scrollTop;
          const targetPosition =
            scrollTop + (elementRect.top - editorRect.top) - 20; // 20px offset

          // Smooth scroll within the editor container
          editorContent.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: "smooth",
          });
        } else {
          // Fallback to window scroll
          const headerHeight = 140; // Header + padding
          const elementPosition = element.offsetTop;
          const offsetPosition = elementPosition - headerHeight;

          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: "smooth",
          });
        }

        return true;
      };

      // First try to find the element by ID
      let element = document.getElementById(headingId);

      if (element) {
        const scrolled = scrollToElement(element);
        if (scrolled) {
          setActiveHeading(headingId);

          // Visual feedback - highlight the heading
          element.style.transition = "background-color 0.3s ease";
          element.style.backgroundColor = "rgba(25, 118, 210, 0.15)";
          element.style.borderLeft = "4px solid var(--primary-color)";
          element.style.paddingLeft = "16px";

          setTimeout(() => {
            element.style.backgroundColor = "";
            element.style.borderLeft = "";
            element.style.paddingLeft = "";
          }, 2000);

          return;
        }
      }

      // If direct ID lookup fails, try to find by heading index
      const headingIndex = parseInt(headingId.replace("heading-", ""));
      const editorContent = document.querySelector(".editor-content");

      if (editorContent && !isNaN(headingIndex)) {
        const headings = editorContent.querySelectorAll(
          "h1, h2, h3, h4, h5, h6"
        );
        element = headings[headingIndex];

        if (element) {
          // Ensure it has the correct ID
          element.id = headingId;

          const scrolled = scrollToElement(element);
          if (scrolled) {
            setActiveHeading(headingId);

            // Visual feedback
            element.style.transition =
              "background-color 0.3s ease, border-left 0.3s ease, padding-left 0.3s ease";
            element.style.backgroundColor = "rgba(25, 118, 210, 0.15)";
            element.style.borderLeft = "4px solid var(--primary-color)";
            element.style.paddingLeft = "16px";

            setTimeout(() => {
              element.style.backgroundColor = "";
              element.style.borderLeft = "";
              element.style.paddingLeft = "";
            }, 2000);
          }
        }
      }

      // If still not found, try to scroll to approximate position
      if (!element && tocItems.length > 0) {
        const targetIndex = parseInt(headingId.replace("heading-", ""));
        if (!isNaN(targetIndex) && targetIndex < tocItems.length) {
          const editorContent = document.querySelector(".editor-content");
          if (editorContent) {
            // Estimate position based on content length and target index
            const contentHeight = editorContent.scrollHeight;
            const estimatedPosition =
              (targetIndex / tocItems.length) * contentHeight;

            editorContent.scrollTo({
              top: estimatedPosition,
              behavior: "smooth",
            });

            setActiveHeading(headingId);
          }
        }
      }
    },
    [tocItems]
  );

  // Track active heading based on scroll position (enhanced)
  useEffect(() => {
    const handleScroll = debounce(() => {
      const editorContent = document.querySelector(".editor-content");
      if (!editorContent) return;

      const headingElements = tocItems
        .map((item) => document.getElementById(item.id))
        .filter(Boolean);

      if (headingElements.length === 0) return;

      // Get scroll position relative to editor content
      const scrollTop = editorContent.scrollTop;
      const editorRect = editorContent.getBoundingClientRect();

      // Find the heading that's currently most visible
      let activeElement = null;
      let minDistance = Infinity;

      headingElements.forEach((element) => {
        const elementRect = element.getBoundingClientRect();
        const distanceFromTop = Math.abs(elementRect.top - editorRect.top - 50); // 50px offset

        if (distanceFromTop < minDistance) {
          minDistance = distanceFromTop;
          activeElement = element;
        }
      });

      if (activeElement) {
        setActiveHeading(activeElement.id);
      }
    }, 100);

    // Listen to scroll events on both editor content and window
    const editorContent = document.querySelector(".editor-content");

    if (editorContent) {
      editorContent.addEventListener("scroll", handleScroll);
    }
    window.addEventListener("scroll", handleScroll);

    return () => {
      if (editorContent) {
        editorContent.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, [tocItems]);

  return {
    tocItems,
    activeHeading,
    scrollToHeading,
    generateTOC,
  };
};
