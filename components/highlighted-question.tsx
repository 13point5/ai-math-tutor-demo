import React from "react";

interface HighlightedQuestionProps {
  text: string;
  segments: string[];
  className?: string;
}

export const HighlightedQuestion: React.FC<HighlightedQuestionProps> = ({
  text,
  segments,
  className = "rounded-xl p-4 text-center select-none",
}) => {
  // If no segments to highlight, just return the text
  if (!segments.length) {
    return (
      <div className={className}>
        <p className="text-xl font-medium text-purple-800">{text}</p>
      </div>
    );
  }

  // Find all segments in the text and create a highlightable version
  const parts: { text: string; highlight: boolean }[] = [];

  // Create a working copy of the text
  let remainingText = text;

  // Process each segment
  while (remainingText.length > 0) {
    let earliestMatch = {
      segment: "",
      index: Infinity,
    };

    // Find the earliest occurring segment
    segments.forEach((segment) => {
      const index = remainingText.indexOf(segment);
      if (index !== -1 && index < earliestMatch.index) {
        earliestMatch = { segment, index };
      }
    });

    if (earliestMatch.index === Infinity) {
      // No more segments found
      parts.push({ text: remainingText, highlight: false });
      break;
    }

    // Add text before the segment
    if (earliestMatch.index > 0) {
      parts.push({
        text: remainingText.substring(0, earliestMatch.index),
        highlight: false,
      });
    }

    // Add the highlighted segment
    parts.push({
      text: earliestMatch.segment,
      highlight: true,
    });

    // Update the remaining text
    remainingText = remainingText.substring(
      earliestMatch.index + earliestMatch.segment.length
    );
  }

  return (
    <div className={className}>
      <p className="text-xl font-medium text-purple-800">
        {parts.map((part, index) =>
          part.highlight ? (
            <span
              key={index}
              className="font-bold text-purple-900 bg-yellow-200 px-1 rounded"
            >
              {part.text}
            </span>
          ) : (
            <span key={index}>{part.text}</span>
          )
        )}
      </p>
    </div>
  );
};
