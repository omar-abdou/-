import React from 'react';
import Card from './Card';
import { MarketAnalysis, Sentiment } from '../types';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, MinusIcon, SparklesIcon } from './Icon';

interface KeyMetricsProps {
  analysis: MarketAnalysis | null;
  isLoading: boolean;
}

const SkeletonLoader: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-9 bg-brand-gray-light rounded-md w-3/4 mb-2"></div>
    <div className="h-4 bg-brand-gray-light rounded-md w-1/2"></div>
  </div>
);

const MetricCard: React.FC<{ title: string; children: React.ReactNode, className?: string }> = ({ title, children, className }) => (
    <Card className={`flex-1 flex flex-col justify-center ${className}`}>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</h3>
      <div className="flex-grow flex items-center">{children}</div>
    </Card>
);

const KeyMetrics: React.FC<KeyMetricsProps> = ({ analysis, isLoading }) => {
  const isPositive = analysis ? analysis.priceChange.change >= 0 : false;
  const priceChange = analysis?.priceChange;
  const sentiment = analysis?.marketSentiment;
  const forecast = analysis?.forecast.shortTerm;

  const sentimentColor = sentiment === 'Positive' ? 'text-green-400' : sentiment === 'Negative' ? 'text-red-400' : 'text-gray-400';

  const sentimentTextMap: Record<Sentiment, string> = {
      Positive: 'إيجابي',
      Negative: 'سلبي',
      Neutral: 'محايد'
  };
  
  const sentimentEmojiMap: Record<Sentiment, string> = {
      Positive: '😊',
      Negative: '😟',
      Neutral: '😐'
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
      <MetricCard title="السعر العالمي (دولار/أونصة)">
        {isLoading || !analysis ? <SkeletonLoader /> : (
            <div>
              <p className="text-3xl md:text-4xl font-bold text-brand-gold font-display tracking-wider">
                ${analysis.globalPriceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
               <div className={`flex items-center text-sm mt-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? <ArrowTrendingUpIcon className="w-4 h-4" aria-hidden="true" /> : <ArrowTrendingDownIcon className="w-4 h-4" aria-hidden="true" />}
                <span className="me-2 font-semibold">{priceChange?.change.toFixed(2)}</span>
                <span className="font-semibold">({priceChange?.changePercent.toFixed(2)}%)</span>
              </div>
            </div>
        )}
      </MetricCard>

      <MetricCard title="السعر المحلي (جنيه/جرام 24)">
        {isLoading || !analysis ? <SkeletonLoader /> : (
            <div>
              <p className="text-3xl md:text-4xl font-bold text-white font-display tracking-wider">
                {analysis.localPriceEGP.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-gray-500 mt-1">جنيه مصري</p>
            </div>
        )}
      </MetricCard>

      <MetricCard title="معنويات السوق">
        {isLoading || !sentiment ? <SkeletonLoader /> : (
            <div className={`flex items-center gap-2 text-xl md:text-2xl font-bold ${sentimentColor}`}>
              <span className="text-2xl md:text-3xl">{sentimentEmojiMap[sentiment]}</span>
              <span>{sentimentTextMap[sentiment]}</span>
            </div>
        )}
      </MetricCard>

      <MetricCard title="توقع قصير الأجل">
        {isLoading || !forecast ? <SkeletonLoader /> : (
            <div className="text-xl md:text-2xl font-bold text-white flex items-center">
                <SparklesIcon className="w-6 h-6 me-3 text-yellow-400" aria-hidden="true" />
                <span>{forecast.prediction}</span>
            </div>
        )}
      </MetricCard>
    </div>
  );
};

export default KeyMetrics;