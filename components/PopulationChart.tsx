import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea, Label } from 'recharts';
import { GapminderData } from '../types';

interface PopulationChartProps {
  data: GapminderData[];
  country: string;
  lastHistoricalYear?: number;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    return (
      <div className="p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
        <p className="font-bold text-indigo-400">{`Year: ${label}`}</p>
        <p className="text-white">{`Population: ${payload[0].value.toLocaleString()}`}</p>
        {dataPoint.predicted && <p className="text-xs text-purple-400">Predicted</p>}
      </div>
    );
  }
  return null;
};

const CustomizedDot: React.FC<any> = (props) => {
    const { cx, cy, payload } = props;
    if (payload.predicted) {
        // Special dot for predicted values
        return <circle cx={cx} cy={cy} r={5} stroke="#a78bfa" strokeWidth={2} fill="#4338ca" />;
    }
    // Default dot for historical values
    return <circle cx={cx} cy={cy} r={4} fill='#818CF8' />;
};

const PopulationChart: React.FC<PopulationChartProps> = ({ data, country, lastHistoricalYear }) => {
  const formatYAxisTick = (tick: number) => {
    if (tick >= 1_000_000_000) {
      return `${(tick / 1_000_000_000).toFixed(1)}B`;
    }
    if (tick >= 1_000_000) {
      return `${(tick / 1_000_000).toFixed(1)}M`;
    }
    if (tick >= 1_000) {
      return `${(tick / 1_000).toFixed(1)}K`;
    }
    return tick.toString();
  };

  return (
    <div className="w-full h-96 md:h-[500px] bg-gray-800 p-4 rounded-lg shadow-2xl border border-gray-700">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: 30,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis 
            dataKey="year" 
            stroke="#A0AEC0" 
            tick={{ fill: '#A0AEC0' }}
            dy={10}
            domain={['dataMin', 'dataMax']}
            allowDuplicatedCategory={false}
          />
          <YAxis 
            stroke="#A0AEC0" 
            tick={{ fill: '#A0AEC0' }} 
            tickFormatter={formatYAxisTick}
            dx={-10}
            domain={['dataMin', 'dataMax']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: '#E2E8F0' }} />
           {lastHistoricalYear && data.some(d => d.predicted) && (
            <ReferenceArea 
              x1={lastHistoricalYear} 
              x2={2026} // Give a little extra space
              stroke="none"
              fill="#4338ca" 
              fillOpacity={0.2}
            >
                <Label value="Prediction" offset={10} position="insideTopRight" fill="#a5b4fc" />
            </ReferenceArea>
          )}
          <Line 
            type="monotone" 
            dataKey="pop" 
            stroke="#6366F1" 
            strokeWidth={3} 
            name={`Population of ${country}`}
            dot={<CustomizedDot />}
            activeDot={{ r: 8, stroke: '#4F46E5', strokeWidth: 2 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PopulationChart;