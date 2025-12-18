import React from 'react';
import clsx from 'clsx';

interface DiagramContainerProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function DiagramContainer({
  title,
  children,
  className
}: DiagramContainerProps): JSX.Element {
  return (
    <div className={clsx('diagram-container', className)}>
      {title && (
        <h4 style={{ textAlign: 'center', marginBottom: '1rem' }}>
          {title}
        </h4>
      )}
      {children}
    </div>
  );
}
