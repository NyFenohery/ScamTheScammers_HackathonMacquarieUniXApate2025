import React from 'react';

export function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];
  let inList = false;

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Handle empty lines
    if (!trimmed) {
      if (inList && currentList.length > 0) {
        elements.push(
          <ul key={`list-${index}`} className="list-disc list-inside space-y-1 ml-4 my-2">
            {currentList.map((item, i) => (
              <li key={i} className="text-slate-200">{renderInlineMarkdown(item)}</li>
            ))}
          </ul>
        );
        currentList = [];
        inList = false;
      }
      elements.push(<br key={`br-${index}`} />);
      return;
    }

    // Handle list items
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      inList = true;
      currentList.push(trimmed.substring(2));
      return;
    }

    // Flush list if we hit a non-list item
    if (inList && currentList.length > 0) {
      elements.push(
        <ul key={`list-${index}`} className="list-disc list-inside space-y-1 ml-4 my-2">
          {currentList.map((item, i) => (
            <li key={i} className="text-slate-200">{renderInlineMarkdown(item)}</li>
          ))}
        </ul>
      );
      currentList = [];
      inList = false;
    }

    // Handle headers
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={index} className="text-lg font-semibold text-slate-100 mt-4 mb-2">
          {renderInlineMarkdown(trimmed.substring(3))}
        </h2>
      );
    } else if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={index} className="text-base font-semibold text-slate-100 mt-3 mb-1">
          {renderInlineMarkdown(trimmed.substring(4))}
        </h3>
      );
    } else {
      // Regular paragraph
      elements.push(
        <p key={index} className="text-slate-200 my-1">
          {renderInlineMarkdown(trimmed)}
        </p>
      );
    }
  });

  // Flush any remaining list
  if (inList && currentList.length > 0) {
    elements.push(
      <ul key="list-final" className="list-disc list-inside space-y-1 ml-4 my-2">
        {currentList.map((item, i) => (
          <li key={i} className="text-slate-200">{renderInlineMarkdown(item)}</li>
        ))}
      </ul>
    );
  }

  return <>{elements}</>;
}

function renderInlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;

  // Match bold **text**
  const boldRegex = /\*\*([^*]+)\*\*/g;
  let match;
  let lastIndex = 0;

  while ((match = boldRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    // Add bold text
    parts.push(
      <strong key={`bold-${currentIndex}`} className="font-semibold text-slate-100">
        {match[1]}
      </strong>
    );
    lastIndex = match.index + match[0].length;
    currentIndex++;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  // If no bold found, return original text
  if (parts.length === 0) {
    return text;
  }

  return <>{parts}</>;
}

