'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Download, Calendar } from 'lucide-react';

interface AnalyticsData {
  revenue: number;
  totalOrders: number;
  b2cOrders: number;
  b2bOrders: number;
  avgOrderValue: number;
  topProducts: Array<{
    id: string;
    name: string;
    orders: number;
    units: number;
  }>;
  inventoryTurnover: Array<{
    name: string;
    currentStock: number;
    totalOrdered: number;
    rate: number;
  }>;
  revenueByMonth: Record<string, number>;
  ordersByStatus: Record<string, number>;
}

interface AnalyticsClientProps {
  data: AnalyticsData;
}

export default function AnalyticsClient({ data }: AnalyticsClientProps) {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  const handleExport = () => {
    const csvContent = [
      ['Metric', 'Value'],
      ['Total Revenue', `$${data.revenue.toFixed(2)}`],
      ['Total Orders', data.totalOrders.toString()],
      ['B2C Orders', data.b2cOrders.toString()],
      ['B2B Orders', data.b2bOrders.toString()],
      ['Average Order Value', `$${data.avgOrderValue.toFixed(2)}`],
      [''],
      ['Top Products', ''],
      ['Product Name', 'Orders', 'Units Sold'],
      ...data.topProducts.map(p => [p.name, p.orders.toString(), p.units.toString()]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Calculate percentage for B2C/B2B
  const b2cPercentage = data.totalOrders > 0 ? (data.b2cOrders / data.totalOrders) * 100 : 0;
  const b2bPercentage = data.totalOrders > 0 ? (data.b2bOrders / data.totalOrders) * 100 : 0;

  // Get max values for chart scaling
  const maxRevenue = Math.max(...Object.values(data.revenueByMonth), 1);
  const months = Object.keys(data.revenueByMonth).sort();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-luxury-charcoal">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 font-light mt-1">
            Revenue, orders, and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date Range Filter */}
          <div className="flex items-center gap-2 bg-white rounded-sm border border-gray-200 p-1">
            <Calendar className="w-4 h-4 text-gray-400 ml-2" strokeWidth={1.5} />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="text-xs font-sans border-none focus:outline-none focus:ring-0 bg-transparent"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <button
            onClick={handleExport}
            className="btn-outline inline-flex items-center gap-2 text-xs"
          >
            <Download className="w-4 h-4" strokeWidth={1.5} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="card-luxury p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-luxury-forest-green/5 rounded-full -mr-10 -mt-10" />
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-sans tracking-wider uppercase text-gray-500">Total Revenue</p>
            <DollarSign className="w-5 h-5 text-luxury-forest-green" strokeWidth={1.5} />
          </div>
          <p className="text-3xl font-serif font-bold text-luxury-forest-green">${data.revenue.toFixed(2)}</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3 text-green-600" strokeWidth={2} />
            <span className="text-xs text-green-600 font-medium">All time</span>
          </div>
        </div>

        <div className="card-luxury p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-luxury-windsor-oak/5 rounded-full -mr-10 -mt-10" />
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-sans tracking-wider uppercase text-gray-500">Total Orders</p>
            <ShoppingCart className="w-5 h-5 text-luxury-windsor-oak" strokeWidth={1.5} />
          </div>
          <p className="text-3xl font-serif font-bold text-luxury-charcoal">{data.totalOrders}</p>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs text-gray-500 font-light">
              {data.b2cOrders} B2C • {data.b2bOrders} B2B
            </span>
          </div>
        </div>

        <div className="card-luxury p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full -mr-10 -mt-10" />
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-sans tracking-wider uppercase text-gray-500">Avg. Order Value</p>
            <Package className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
          </div>
          <p className="text-3xl font-serif font-bold text-luxury-charcoal">${data.avgOrderValue.toFixed(2)}</p>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs text-gray-500 font-light">Per order</span>
          </div>
        </div>

        <div className="card-luxury p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full -mr-10 -mt-10" />
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-sans tracking-wider uppercase text-gray-500">Customer Split</p>
            <Users className="w-5 h-5 text-purple-600" strokeWidth={1.5} />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-serif font-bold text-luxury-charcoal">{b2cPercentage.toFixed(0)}%</span>
            <span className="text-xs text-gray-400 mb-1">B2C</span>
            <span className="text-gray-300 mx-1 mb-1">/</span>
            <span className="text-2xl font-serif font-bold text-luxury-charcoal">{b2bPercentage.toFixed(0)}%</span>
            <span className="text-xs text-gray-400 mb-1">B2B</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Revenue Trend Chart */}
        <div className="card-luxury p-6">
          <h2 className="text-lg font-serif font-bold text-luxury-charcoal mb-6">Revenue Trend</h2>
          
          {months.length > 0 ? (
            <div className="space-y-3">
              {months.slice(-6).map((month) => {
                const revenue = data.revenueByMonth[month];
                const percentage = (revenue / maxRevenue) * 100;
                return (
                  <div key={month}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-sans text-gray-600">{month}</span>
                      <span className="text-xs font-sans font-semibold text-luxury-forest-green">
                        ${revenue.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-luxury-forest-green to-luxury-garden-lime h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 font-light text-center py-8">No revenue data yet</p>
          )}
        </div>

        {/* Customer Demographics */}
        <div className="card-luxury p-6">
          <h2 className="text-lg font-serif font-bold text-luxury-charcoal mb-6">Customer Demographics</h2>
          
          {data.totalOrders > 0 ? (
            <div className="space-y-6">
              {/* Pie Chart Visualization */}
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    {/* B2C Segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#2D5F3F"
                      strokeWidth="20"
                      strokeDasharray={`${b2cPercentage * 2.51} ${251 - b2cPercentage * 2.51}`}
                      className="transition-all duration-500"
                    />
                    {/* B2B Segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#8B6F47"
                      strokeWidth="20"
                      strokeDasharray={`${b2bPercentage * 2.51} ${251 - b2bPercentage * 2.51}`}
                      strokeDashoffset={`-${b2cPercentage * 2.51}`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-serif font-bold text-luxury-charcoal">{data.totalOrders}</p>
                      <p className="text-[10px] text-gray-400 font-sans tracking-wider uppercase">Orders</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-luxury-forest-green/5 rounded-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-luxury-forest-green rounded-full" />
                    <span className="text-sm font-sans text-gray-600">Individual (B2C)</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-sans font-semibold text-luxury-charcoal">{data.b2cOrders}</p>
                    <p className="text-xs text-gray-400">{b2cPercentage.toFixed(1)}%</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-luxury-windsor-oak/5 rounded-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-luxury-windsor-oak rounded-full" />
                    <span className="text-sm font-sans text-gray-600">Business (B2B)</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-sans font-semibold text-luxury-charcoal">{data.b2bOrders}</p>
                    <p className="text-xs text-gray-400">{b2bPercentage.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 font-light text-center py-8">No order data yet</p>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="card-luxury p-6 mb-10">
        <h2 className="text-lg font-serif font-bold text-luxury-charcoal mb-6">Top Selling Products</h2>
        
        {data.topProducts.length === 0 ? (
          <p className="text-gray-400 font-light text-center py-8">No sales data yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {data.topProducts.map((product, idx) => (
              <div key={product.id} className="p-4 bg-luxury-cream rounded-sm border border-gray-100 hover:border-luxury-forest-green transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 bg-luxury-forest-green text-white rounded-full flex items-center justify-center text-xs font-serif font-bold">
                    #{idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans font-medium text-sm text-luxury-charcoal truncate">{product.name}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Orders:</span>
                    <span className="font-semibold text-luxury-charcoal">{product.orders}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Units:</span>
                    <span className="font-semibold text-luxury-forest-green">{product.units}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inventory Turnover */}
      <div className="card-luxury p-6">
        <h2 className="text-lg font-serif font-bold text-luxury-charcoal mb-6">Inventory Turnover</h2>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product / Variant</th>
                <th>Current Stock</th>
                <th>Total Ordered</th>
                <th>Turnover Rate</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {data.inventoryTurnover.slice(0, 10).map((item, idx) => (
                <tr key={idx}>
                  <td className="font-sans font-medium text-luxury-charcoal">{item.name}</td>
                  <td className="font-sans">{item.currentStock}</td>
                  <td className="font-sans">{item.totalOrdered}</td>
                  <td>
                    <span className={`font-sans font-semibold ${
                      item.rate > 1 ? 'text-luxury-garden-lime' : item.rate > 0.5 ? 'text-amber-500' : 'text-gray-400'
                    }`}>
                      {item.rate.toFixed(2)}x
                    </span>
                  </td>
                  <td>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          item.rate > 1 ? 'bg-luxury-garden-lime' : item.rate > 0.5 ? 'bg-amber-500' : 'bg-gray-300'
                        }`}
                        style={{ width: `${Math.min(item.rate * 50, 100)}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.inventoryTurnover.length === 0 && (
          <p className="text-gray-400 font-light text-center py-8">No inventory data yet</p>
        )}
      </div>
    </div>
  );
}
