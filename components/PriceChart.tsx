import React from 'react';
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { GoldDataPoint } from '../types';
import Card from './Card';

interface PriceChartProps {
  data: GoldDataPoint[] | undefined;
  isLoading: boolean;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-brand-gray-dark/80 backdrop-blur-sm border border-brand-gray-light p-3 rounded-lg shadow-xl text-right" role="tooltip">
        <p className="label text-sm text-gray-300">{`${label}`}</p>
        <p className="intro text-lg text-brand-gold font-bold">{`السعر: $${payload[0].value.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</p>
      </div>
    );
  }
  return null;
};

const SkeletonLoader: React.FC = () => (
    <div className="animate-pulse w-full h-[400px] bg-brand-gray-light rounded-lg"></div>
);

const PriceChart: React.FC<PriceChartProps> = ({ data, isLoading }) => {
  return (
    <Card>
      <h2 id="price-chart-title" className="text-xl font-bold text-white mb-4">تاريخ الأسعار العالمي (آخر 30 يومًا)</h2>
      {isLoading ? <SkeletonLoader /> : (
        <div style={{ width: '100%', height: 400 }} role="figure" aria-labelledby="price-chart-title">
          <ResponsiveContainer>
            <AreaChart
              data={data}
              margin={{
                top: 5,
                right: 20,
                left: 30,
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFD700" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
              <XAxis dataKey="date" stroke="#8b949e" tick={{ fill: '#8b949e', fontSize: 12 }} reversed={true} />
              <YAxis 
                stroke="#8b949e" 
                tick={{ fill: '#8b949e', fontSize: 12 }}
                domain={['dataMin - 20', 'dataMax + 20']}
                tickFormatter={(value) => `$${Number(value).toFixed(0)}`}
                orientation="right"
                width={70}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#8b949e' }} />
              <Area type="monotone" dataKey="price" stroke="transparent" fill="url(#priceGradient)" />
              <Line type="monotone" dataKey="price" stroke="#FFD700" strokeWidth={2.5} dot={false} name="السعر" activeDot={{ r: 8, fill: '#FFD700', stroke: '#FFF' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};

export default PriceChart;