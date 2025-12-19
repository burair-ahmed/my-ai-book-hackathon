import { useState, useEffect } from 'react';

export const useSelection = () => {
  const [selection, setSelection] = useState<string>('');

  useEffect(() => {
    const handleSelection = () => {
      const selectedText = window.getSelection()?.toString() || '';
      if (selectedText.length > 5) { // Minimum length to avoid noise
        setSelection(selectedText);
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  const clearSelection = () => setSelection('');

  return { selection, clearSelection };
};
