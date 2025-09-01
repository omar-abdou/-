
export interface GoldDataPoint {
  date: string; // "YYYY-MM-DD"
  price: number;
}

export interface NewsArticle {
  title: string;
  source: string;
  summary: string;
}

export type Sentiment = 'Positive' | 'Negative' | 'Neutral';
export type ForecastPrediction = 'صعودي' | 'هبوطي' | 'مستقر'; // Bullish, Bearish, Stable in Arabic

export interface Source {
    uri: string;
    title: string;
}

export interface MarketAnalysis {
  globalPriceUSD: number;
  localPriceEGP: number;
  priceChange: {
    change: number;
    changePercent: number;
  };
  marketSentiment: Sentiment;
  geopoliticalSummary: string;
  newsFeed: NewsArticle[];
  forecast: {
    shortTerm: {
      prediction: ForecastPrediction;
      reasoning: string;
    };
    longTerm: {
      prediction: ForecastPrediction;
      reasoning: string;
    };
  };
  chartData: GoldDataPoint[];
  sources?: Source[];
}
