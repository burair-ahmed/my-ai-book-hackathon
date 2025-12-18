import React from 'react';
import { useLocation } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import clsx from 'clsx';

interface Section {
  id: string;
  title: string;
  path: string;
}

interface ChapterProgressProps {
  sections: Section[];
  currentPath: string;
}

export default function ChapterProgress({
  sections,
  currentPath
}: ChapterProgressProps): JSX.Element {
  const currentIndex = sections.findIndex(section =>
    currentPath.includes(section.path)
  );

  return (
    <nav className="chapter-progress" aria-label="Chapter navigation">
      <ol style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        listStyle: 'none',
        padding: 0,
        margin: 0
      }}>
        {sections.map((section, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <li key={section.id}>
              <Link
                to={section.path}
                className={clsx('chapter-progress-link', {
                  'completed': isCompleted,
                  'current': isCurrent
                })}
                style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: isCurrent ? 'bold' : 'normal',
                  backgroundColor: isCompleted
                    ? 'var(--ifm-color-success-dark)'
                    : isCurrent
                    ? 'var(--ifm-color-primary)'
                    : 'var(--ifm-color-emphasis-200)',
                  color: isCompleted || isCurrent ? 'white' : 'var(--ifm-color-emphasis-800)',
                  border: isCurrent ? '2px solid var(--ifm-color-primary-dark)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {index + 1}. {section.title}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
