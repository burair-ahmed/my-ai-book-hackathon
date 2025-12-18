import React, { useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import clsx from 'clsx';

interface CodeExampleProps {
  language: string;
  title?: string;
  children: string;
  showLineNumbers?: boolean;
  executable?: boolean;
  expectedOutput?: string;
}

export default function CodeExample({
  language,
  title,
  children,
  showLineNumbers = true,
  executable = false,
  expectedOutput
}: CodeExampleProps): JSX.Element {
  const [showOutput, setShowOutput] = useState(false);

  return (
    <div className="code-example">
      {title && (
        <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>
          {title}
        </h4>
      )}

      <CodeBlock
        language={language}
        showLineNumbers={showLineNumbers}
      >
        {children}
      </CodeBlock>

      {executable && expectedOutput && (
        <div style={{ marginTop: '1rem' }}>
          <button
            onClick={() => setShowOutput(!showOutput)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--ifm-color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            {showOutput ? 'Hide Expected Output' : 'Show Expected Output'}
          </button>

          {showOutput && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: 'var(--ifm-color-emphasis-100)',
              borderRadius: '4px',
              fontFamily: 'monospace'
            }}>
              <strong>Expected Output:</strong>
              <pre style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>
                {expectedOutput}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
