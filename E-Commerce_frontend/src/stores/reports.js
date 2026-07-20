import { reactive } from 'vue';
import api from '@/api/axios';

const state = reactive({
  activeTab: 'daily',
  loading: false,
  error: null,

  dailySales: {
    date: null,
    total_sales: 0,
    total_revenue: 0,
    average_order: 0,
    hourly_distribution: [],
    status_breakdown: [],
  },

  monthlySales: {
    month: null,
    total_sales: 0,
    total_revenue: 0,
    average_order: 0,
    daily_distribution: [],
    status_breakdown: [],
    previous_month: null,
    revenue_growth: 0,
    sales_growth: 0,
  },

  revenue: {
    period: null,
    total_revenue: 0,
    total_sales: 0,
    average_order: 0,
    completed_revenue: 0,
    pending_revenue: 0,
    cancelled_revenue: 0,
    monthly_breakdown: [],
    daily_breakdown: [],
    revenue_by_category: [],
  },

  topCustomers: {
    period: null,
    total_customer_revenue: 0,
    top_customers: [],
  },

  bestSellers: {
    period: null,
    total_units_sold: 0,
    best_sellers: [],
  },
});

export function useReports() {
  return state;
}

export async function fetchDailySales(date = null) {
  state.loading = true;
  state.error = null;
  try {
    const params = date ? { date } : {};
    const { data } = await api.get('/admin/reports/daily-sales', { params });
    state.dailySales = data;
  } catch (e) {
    state.error = e.message;
  } finally {
    state.loading = false;
  }
}

export async function fetchMonthlySales(month = null) {
  state.loading = true;
  state.error = null;
  try {
    const params = month ? { month } : {};
    const { data } = await api.get('/admin/reports/monthly-sales', { params });
    state.monthlySales = data;
  } catch (e) {
    state.error = e.message;
  } finally {
    state.loading = false;
  }
}

export async function fetchRevenue({ from, to } = {}) {
  state.loading = true;
  state.error = null;
  try {
    const params = {};
    if (from) params.from = from;
    if (to) params.to = to;
    const { data } = await api.get('/admin/reports/revenue', { params });
    state.revenue = data;
  } catch (e) {
    state.error = e.message;
  } finally {
    state.loading = false;
  }
}

export async function fetchTopCustomers({ from, to, limit } = {}) {
  state.loading = true;
  state.error = null;
  try {
    const params = {};
    if (from) params.from = from;
    if (to) params.to = to;
    if (limit) params.limit = limit;
    const { data } = await api.get('/admin/reports/top-customers', { params });
    state.topCustomers = data;
  } catch (e) {
    state.error = e.message;
  } finally {
    state.loading = false;
  }
}

export async function fetchBestSellers({ from, to, limit } = {}) {
  state.loading = true;
  state.error = null;
  try {
    const params = {};
    if (from) params.from = from;
    if (to) params.to = to;
    if (limit) params.limit = limit;
    const { data } = await api.get('/admin/reports/best-sellers', { params });
    state.bestSellers = data;
  } catch (e) {
    state.error = e.message;
  } finally {
    state.loading = false;
  }
}
