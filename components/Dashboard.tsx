import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, MessageSquare, Zap, Cpu } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { I18N } from '../constants';

const data = [
  { name: 'Mon', requests: 40 },
  { name: 'Tue', requests: 30 },
  { name: 'Wed', requests: 20 },
  { name: 'Thu', requests: 27 },
  { name: 'Fri', requests: 18 },
  { name: 'Sat', requests: 23 },
  { name: 'Sun', requests: 34 },
];

export const Dashboard: React.FC = () => {
  const { theme, language } = useTheme();
  const t = I18N[language];

  return (
    <div className="p-6 space-y-8 h-full overflow-y-auto custom-scrollbar">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{t.dashboard}</h2>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Requests" 
          value="1,284" 
          icon={<MessageSquare className="text-white" size={24} />} 
          color={theme.primary} 
          trend="+12%"
        />
        <MetricCard 
          title="Avg Latency" 
          value="0.8s" 
          icon={<Zap className="text-white" size={24} />} 
          color={theme.accent}
          trend="-5%"
        />
        <MetricCard 
          title="Tokens Used" 
          value="450K" 
          icon={<Activity className="text-white" size={24} />} 
          color={theme.primary}
          trend="+8%" 
        />
        <MetricCard 
          title="Active Model" 
          value="Gemini 2.5" 
          icon={<Cpu className="text-white" size={24} />} 
          color={theme.accent} 
        />
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-6">Weekly Request Volume</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.secondary} vertical={false} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: theme.secondary, opacity: 0.4}}
                  contentStyle={{ backgroundColor: theme.backgroundLight, borderColor: theme.primary, borderRadius: '8px' }}
                />
                <Bar dataKey="requests" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={theme.primary} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
           <div>
             <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-2">System Status</h3>
             <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Operational metrics and health check.</p>
           </div>

           <div className="space-y-4">
             <StatusRow label="API Gateway" status="Operational" />
             <StatusRow label="Gemini 2.5 Flash" status="Operational" />
             <StatusRow label="Prompt Engine" status="Operational" />
             <StatusRow label="Vector DB" status="Idle" />
           </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{title: string, value: string, icon: React.ReactNode, color: string, trend?: string}> = ({title, value, icon, color, trend}) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
        <h4 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{value}</h4>
        {trend && <p className={`text-xs font-bold mt-2 ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{trend} vs last week</p>}
      </div>
      <div className="p-3 rounded-xl shadow-lg transform group-hover:scale-110 transition-transform" style={{ backgroundColor: color }}>
        {icon}
      </div>
    </div>
  </div>
);

const StatusRow: React.FC<{label: string, status: string}> = ({label, status}) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
    <span className="text-gray-700 dark:text-gray-300 font-medium">{label}</span>
    <span className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-bold">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      {status}
    </span>
  </div>
);