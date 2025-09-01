import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import KeyMetrics from './components/KeyMetrics';
import PriceChart from './components/PriceChart';
import NewsFeed from './components/NewsFeed';
import PredictionPanel from './components/PredictionPanel';
import Sources from './components/Sources';
import { MarketAnalysis } from './types';
import { getMarketAnalysis } from './services/geminiService';
import { ArrowPathIcon } from './components/Icon';
import Card from './components/Card';

const App: React.FC = () => {
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const fetchDataAndAnalyze = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getMarketAnalysis();
      setMarketAnalysis(result);
    } catch (err) {
      console.error(err);
      let specificError = 'يرجى المحاولة مرة أخرى لاحقًا.';
      if (err instanceof Error) {
          if (err.message.includes("API_KEY")) {
              specificError = 'يرجى التحقق من تكوين مفتاح API الخاص بك.';
          } else if (err.message.includes("invalid format")) {
              specificError = 'تم استلام رد بتنسيق غير صالح من خدمة الذكاء الاصطناعي.';
          } else {
            specificError = 'حدث خطأ غير متوقع أثناء معالجة البيانات.';
          }
      }
      setError(`فشل في جلب تحليل السوق. ${specificError}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDataAndAnalyze();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return (
    <div className="bg-brand-dark min-h-screen text-gray-200 font-sans">
      <Header isScrolled={isScrolled} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">لوحة المعلومات</h1>
          <button
            onClick={fetchDataAndAnalyze}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-brand-gray-medium hover:bg-brand-gray-light border border-brand-gray-light rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={isLoading ? 'جاري تحديث تحليل السوق' : 'تحديث تحليل السوق'}
          >
            <ArrowPathIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
            <span>{isLoading ? 'جاري التحليل...' : 'تحديث التحليل'}</span>
          </button>
        </div>

        {error && (
            <Card className="bg-red-900 border-red-700 mb-6" role="alert">
              <p className="text-white text-center font-semibold">{error}</p>
            </Card>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" aria-live="polite" aria-busy={isLoading}>
          {/* Main Content */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <KeyMetrics analysis={marketAnalysis} isLoading={isLoading} />
            <PriceChart data={marketAnalysis?.chartData} isLoading={isLoading} />
            <NewsFeed articles={marketAnalysis?.newsFeed} isLoading={isLoading} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <PredictionPanel analysis={marketAnalysis} isLoading={isLoading} />
            <Sources sources={marketAnalysis?.sources} />
          </div>
        </div>
      </main>
      <footer className="text-center p-6 mt-10 border-t border-brand-gray-light text-gray-600 text-xs">
        <p>محلل الذهب الجيو-سياسي. البيانات لأغراض العرض فقط والأسعار قد لا تكون دقيقة.</p>
      </footer>
    </div>
  );
};

export default App;