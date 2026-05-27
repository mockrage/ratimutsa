'use client';

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

export interface OrderFilters {
  search: string;
  status: string;
  customerType: string;
  startDate: string;
  endDate: string;
}

interface OrderFiltersProps {
  filters: OrderFilters;
  onFiltersChange: (filters: OrderFilters) => void;
  onReset: () => void;
}

export default function OrderFiltersComponent({ filters, onFiltersChange, onReset }: OrderFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleChange = (key: keyof OrderFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = filters.search || filters.status || filters.customerType || filters.startDate || filters.endDate;

  return (
    <div className="mb-6">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Search by customer name, phone, or order ID..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-outline inline-flex items-center gap-2 ${showFilters ? 'bg-luxury-forest-green text-white border-luxury-forest-green' : ''}`}
        >
          <Filter className="w-4 h-4" strokeWidth={1.5} />
          Filters
          {hasActiveFilters && !showFilters && (
            <span className="w-2 h-2 bg-luxury-forest-green rounded-full" />
          )}
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="card-luxury p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-sans font-semibold tracking-wider uppercase text-luxury-charcoal">
              Advanced Filters
            </h3>
            {hasActiveFilters && (
              <button
                onClick={onReset}
                className="text-xs text-luxury-forest-green hover:text-luxury-windsor-oak transition-colors inline-flex items-center gap-1"
              >
                <X className="w-3 h-3" strokeWidth={2} />
                Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-xs font-sans font-semibold tracking-wider uppercase text-luxury-charcoal mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="input-field"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PROCESSING">Processing</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {/* Customer Type Filter */}
            <div>
              <label className="block text-xs font-sans font-semibold tracking-wider uppercase text-luxury-charcoal mb-2">
                Customer Type
              </label>
              <select
                value={filters.customerType}
                onChange={(e) => handleChange('customerType', e.target.value)}
                className="input-field"
              >
                <option value="">All Types</option>
                <option value="B2C">B2C (Individual)</option>
                <option value="B2B">B2B (Business)</option>
              </select>
            </div>

            {/* Start Date Filter */}
            <div>
              <label className="block text-xs font-sans font-semibold tracking-wider uppercase text-luxury-charcoal mb-2">
                From Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className="input-field"
              />
            </div>

            {/* End Date Filter */}
            <div>
              <label className="block text-xs font-sans font-semibold tracking-wider uppercase text-luxury-charcoal mb-2">
                To Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 font-sans mb-2">Active Filters:</p>
              <div className="flex flex-wrap gap-2">
                {filters.search && (
                  <span className="badge-green text-xs inline-flex items-center gap-1">
                    Search: {filters.search}
                    <button onClick={() => handleChange('search', '')} className="hover:text-luxury-forest-green">
                      <X className="w-3 h-3" strokeWidth={2} />
                    </button>
                  </span>
                )}
                {filters.status && (
                  <span className="badge-blue text-xs inline-flex items-center gap-1">
                    Status: {filters.status}
                    <button onClick={() => handleChange('status', '')} className="hover:text-blue-700">
                      <X className="w-3 h-3" strokeWidth={2} />
                    </button>
                  </span>
                )}
                {filters.customerType && (
                  <span className="badge-gold text-xs inline-flex items-center gap-1">
                    Type: {filters.customerType}
                    <button onClick={() => handleChange('customerType', '')} className="hover:text-luxury-windsor-oak">
                      <X className="w-3 h-3" strokeWidth={2} />
                    </button>
                  </span>
                )}
                {filters.startDate && (
                  <span className="badge text-xs inline-flex items-center gap-1">
                    From: {new Date(filters.startDate).toLocaleDateString()}
                    <button onClick={() => handleChange('startDate', '')} className="hover:text-gray-700">
                      <X className="w-3 h-3" strokeWidth={2} />
                    </button>
                  </span>
                )}
                {filters.endDate && (
                  <span className="badge text-xs inline-flex items-center gap-1">
                    To: {new Date(filters.endDate).toLocaleDateString()}
                    <button onClick={() => handleChange('endDate', '')} className="hover:text-gray-700">
                      <X className="w-3 h-3" strokeWidth={2} />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
