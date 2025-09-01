import React from 'react';
import { NewsArticle } from '../types';
import Card from './Card';

interface NewsFeedProps {
  articles: NewsArticle[] | undefined;
  isLoading: boolean;
}

const NewsItem: React.FC<{ article: NewsArticle }> = ({ article }) => (
    <div className="p-4 transition-all duration-200 hover:bg-brand-gray-dark/50 rounded-lg -mx-4">
        <h4 className="font-semibold text-gray-200 group-hover:text-brand-gold transition-colors">
            {article.title}
        </h4>
        <p className="text-sm text-gray-400 mt-1 leading-relaxed">{article.summary}</p>
        <p className="text-xs text-gray-500 mt-2">{article.source}</p>
    </div>
);

const SkeletonLoader: React.FC = () => (
    <div className="py-4">
        <div className="h-4 bg-brand-gray-light rounded w-3/4 mb-2 animate-pulse"></div>
        <div className="h-3 bg-brand-gray-light rounded w-full mb-3 animate-pulse"></div>
        <div className="h-3 bg-brand-gray-light rounded w-1/4 animate-pulse"></div>
    </div>
);

const NewsFeed: React.FC<NewsFeedProps> = ({ articles, isLoading }) => {
  return (
    <Card>
      <h2 className="text-xl font-bold text-white mb-2">أبرز الأخبار الجيو-سياسية</h2>
      <div className="divide-y divide-brand-gray-light">
        {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonLoader key={i} />)
            : articles?.map((article, index) => (
                <NewsItem key={index} article={article} />
            ))
        }
      </div>
    </Card>
  );
};

export default NewsFeed;