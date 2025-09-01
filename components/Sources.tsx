import React from 'react';
import Card from './Card';
import { Source } from '../types';
import { ExternalLinkIcon } from './Icon';

interface SourcesProps {
  sources: Source[] | undefined;
}

const Sources: React.FC<SourcesProps> = ({ sources }) => {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <Card>
      <h2 className="text-xl font-bold text-white mb-2">المصادر</h2>
      <p className="text-sm text-gray-500 mb-4">تم إنشاء التحليل باستخدام المعلومات من المصادر التالية:</p>
      <ul className="space-y-2">
        {sources.map((source, index) => (
          <li key={index}>
            <a 
              href={source.uri} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 text-gray-400 hover:text-brand-gold group transition-colors"
              aria-label={`${source.title || source.uri} (يفتح في نافذة جديدة)`}
              title={source.uri}
            >
              <span className="truncate flex-1">
                {source.title || source.uri}
              </span>
              <ExternalLinkIcon className="w-4 h-4 flex-shrink-0 text-gray-500 group-hover:text-brand-gold transition-colors" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default Sources;