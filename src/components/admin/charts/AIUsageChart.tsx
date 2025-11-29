import React, { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';

interface AIUsageChartProps {
  data: Array<{
    name: string;
    requests: number;
    errors: number;
    cost: number;
  }>;
  height?: number;
}

const AIUsageChart: React.FC<AIUsageChartProps> = React.memo(({ data, height = 300 }) => {
  const memoizedData = useMemo(() => data, [data]);
  return (
    <div className="contain-layout contain-style">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={memoizedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="name" 
            stroke="#cbd5e1" 
            fontSize={12}
          />
          <YAxis 
            stroke="#cbd5e1" 
            fontSize={12}
          />
          <Tooltip 
            animationDuration={150}
            contentStyle={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.8)', 
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: '#fff',
              transition: 'all 0.15s ease'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="requests" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            isAnimationActive={false}
            connectNulls={false}
          />
          <Line 
            type="monotone" 
            dataKey="errors" 
            stroke="#ef4444" 
            strokeWidth={2}
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
            isAnimationActive={false}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

AIUsageChart.displayName = 'AIUsageChart';

export default AIUsageChart;