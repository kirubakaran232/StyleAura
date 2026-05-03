import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import Sidebar from '../../components/admin/Sidebar';
import { getAnalytics } from '../../services/api';

export default function Analytics() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics-full'],
    queryFn: () => getAnalytics(),
    select: d => d.data
  });

  return (
    <>
      <Helmet><title>Analytics - StyleAura Admin</title></Helmet>
      <Sidebar />

      <main className="pl-64 min-h-screen bg-stone-50 dark:bg-neutral-950 p-8">
        <div className="max-w-6xl mx-auto">
          
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
            <p className="text-gray-500">Deep dive into your traffic and affiliate performance.</p>
          </div>

          {isLoading ? (
            <div className="space-y-8">
              <div className="card h-[400px] skeleton" />
              <div className="card h-[400px] skeleton" />
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* Product Clicks Chart */}
              <div className="card p-6">
                <h2 className="font-semibold text-lg mb-6">Product Clicks (Last 30 Days)</h2>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.charts?.clicksPerDay || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="_id" 
                        tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                        labelFormatter={(val) => new Date(val).toLocaleDateString()}
                      />
                      <Bar dataKey="count" name="Clicks" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Blog Views Chart */}
              <div className="card p-6">
                <h2 className="font-semibold text-lg mb-6">Blog Post Views (Last 30 Days)</h2>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data?.charts?.viewsPerDay || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="_id" 
                        tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                        labelFormatter={(val) => new Date(val).toLocaleDateString()}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        name="Views" 
                        stroke="#f43f5e" 
                        strokeWidth={3} 
                        dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                        activeDot={{ r: 6, strokeWidth: 0 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>
    </>
  );
}
