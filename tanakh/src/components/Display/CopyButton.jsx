import React, { useState } from 'react';

function CopyButton({ text, label = "העתק" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  return (
    <button
      className={`copy-button ${copied ? 'copy-success' : ''}`}
      onClick={handleCopy}
      title={copied ? 'הועתק!' : 'העתק לזיכרון'}
    >
      {copied ? '✓ הועתק!' : `📋 ${label}`}
    </button>
  );
}

export default CopyButton;
