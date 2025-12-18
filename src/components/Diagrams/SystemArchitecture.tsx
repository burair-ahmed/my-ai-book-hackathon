import React, { useEffect, useRef } from 'react';
import DiagramContainer from './DiagramContainer';

interface SystemArchitectureProps {
  diagramId: string;
  title?: string;
  definition: string;
}

export default function SystemArchitecture({
  diagramId,
  title,
  definition
}: SystemArchitectureProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Mermaid diagram when component mounts
    if (containerRef.current && window.mermaid) {
      window.mermaid.init(undefined, containerRef.current);
    }
  }, [definition]);

  return (
    <DiagramContainer title={title}>
      <div
        ref={containerRef}
        className="mermaid"
        data-diagram-id={diagramId}
      >
        {definition}
      </div>
    </DiagramContainer>
  );
}
