import React from 'react';
import { MarketAnalysis, ForecastPrediction } from '../types';
import Card from './Card';
import { SparklesIcon } from './Icon';

interface PredictionPanelProps {
  analysis: MarketAnalysis | null;
  isLoading: boolean;
}

const SkeletonLoader: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div className="animate-pulse space-y-3">
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className={`h-4 bg-brand-gray-light rounded ${i === 0 ? 'w-3/4' : 'w-full'}`}></div>
    ))}
  </div>
);

const PredictionSection: React.FC<{ title: string; data: { prediction: ForecastPrediction; reasoning: string; } | undefined }> = ({ title, data }) => {
    return (
        <div>
            <h4 className="font-semibold text-gray-300">{title}</h4>
            <p className="text-lg font-bold text-white mt-1">{data?.prediction || '...'}</p>
            <p className="text-sm text-gray-400 mt-1">{data?.reasoning || '...'}</p>
        </div>
    );
};

const PredictionPanel: React.FC<PredictionPanelProps> = ({ analysis, isLoading }) => {
  return (
    <Card className="h-full flex flex-col bg-brand-gray-dark border-brand-gold/20">
      <div className="flex items-center gap-3 mb-4">
        <SparklesIcon className="w-7 h-7 text-brand-gold" aria-hidden="true" />
        <h2 className="text-xl font-bold text-white">تحليل وتوقعات الذكاء الاصطناعي</h2>
      </div>
      
      <div className="space-y-6 flex-grow">
        <div>
          <h3 className="text-md font-semibold text-brand-gold mb-2">ملخص الوضع الجيوسياسي</h3>
          {isLoading ? <SkeletonLoader lines={4} /> : (
            <blockquote className="border-r-4 border-brand-gold/50 pr-4">
                <p className="text-sm text-gray-300 leading-relaxed italic">{analysis?.geopoliticalSummary}</p>
            </blockquote>
          )}
        </div>
        
        <div className="border-t border-brand-gray-light my-4"></div>

        <div>
            <h3 className="text-md font-semibold text-brand-gold mb-4">توقعات الأسعار</h3>
            <div className="space-y-5">
                {isLoading ? (
                    <>
                        <SkeletonLoader lines={2} />
                        <SkeletonLoader lines={3} />
                    </>
                ) : (
                    <>
                       <PredictionSection title="المدى القصير (7 أيام)" data={analysis?.forecast?.shortTerm} />
                       <PredictionSection title="المدى الطويل (3 أشهر)" data={analysis?.forecast?.longTerm} />
                    </>
                )}
            </div>
        </div>
      </div>
    </Card>
  );
};

export default PredictionPanel;