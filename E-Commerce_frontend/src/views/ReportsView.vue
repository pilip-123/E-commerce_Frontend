<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import {
  useReports,
  fetchDailySales,
  fetchMonthlySales,
  fetchRevenue,
  fetchTopCustomers,
  fetchBestSellers,
} from '@/stores/reports';
import { useAuth } from '@/stores/auth';
import { formatCurrency } from '@/utils/format';
import { useLocale } from '@/composables/useLocale';

const { t } = useLocale();
const auth = useAuth();
const router = useRouter();
const reports = useReports();

const tabs = [
  { key: 'daily', label: 'Daily Sales', icon: 'calendar' },
  { key: 'monthly', label: 'Monthly Sales', icon: 'bar-chart' },
  { key: 'revenue', label: 'Revenue', icon: 'dollar' },
  { key: 'customers', label: 'Top Customers', icon: 'users' },
  { key: 'sellers', label: 'Best Sellers', icon: 'trending-up' },
];

const selectedDate = ref('');
const selectedMonth = ref('');
const dateFrom = ref('');
const dateTo = ref('');
const customerLimit = ref(10);
const productLimit = ref(10);

const isAdmin = computed(() => {
  return auth.user?.role === 'admin' || auth.user?.role === 'manager' || auth.user?.role === 'staff';
});

function switchTab(key) {
  reports.activeTab = key;
  reports.error = null;
}

function pad(num) {
  return String(num).padStart(2, '0');
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function currentMonthStr() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

function defaultDateRange() {
  const to = new Date();
  const from = new Date();
  from.setMonth(from.getMonth() - 3);
  return {
    from: `${from.getFullYear()}-${pad(from.getMonth() + 1)}-${pad(from.getDate())}`,
    to: `${to.getFullYear()}-${pad(to.getMonth() + 1)}-${pad(to.getDate())}`,
  };
}

function loadTab() {
  switch (reports.activeTab) {
    case 'daily':
      fetchDailySales(selectedDate.value || null);
      break;
    case 'monthly':
      fetchMonthlySales(selectedMonth.value || null);
      break;
    case 'revenue':
      fetchRevenue({
        from: dateFrom.value || null,
        to: dateTo.value || null,
      });
      break;
    case 'customers':
      fetchTopCustomers({
        from: dateFrom.value || null,
        to: dateTo.value || null,
        limit: customerLimit.value,
      });
      break;
    case 'sellers':
      fetchBestSellers({
        from: dateFrom.value || null,
        to: dateTo.value || null,
        limit: productLimit.value,
      });
      break;
  }
}

onMounted(() => {
  if (!isAdmin.value) {
    router.replace({ name: 'home' });
    return;
  }
  const range = defaultDateRange();
  selectedDate.value = todayStr();
  selectedMonth.value = currentMonthStr();
  dateFrom.value = range.from;
  dateTo.value = range.to;
  loadTab();
});

watch(() => reports.activeTab, () => {
  loadTab();
});

function barMax(values) {
  if (!values || !values.length) return 1;
  return Math.max(...values.map(v => v.count ?? v.total ?? 0), 1);
}

function formatDateLabel(val) {
  if (!val) return '';
  const d = new Date(val);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDateFull(val) {
  if (!val) return '';
  const d = new Date(val);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

const statusColors = {
  Pending: '#f59e0b',
  Processing: '#3b82f6',
  Shipped: '#6366f1',
  Delivered: '#22c55e',
  Cancelled: '#ef4444',
};

function buildRevenueSvg() {
  const category = reports.revenue.revenue_by_category || [];
  if (!category.length) return null;
  const max = Math.max(...category.map(c => c.total));
  const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
  return { items: category, max, colors };
}
</script>

<template>
  <div class="page" v-if="isAdmin">
    <section class="reports-header">
      <div class="reports-header__content">
        <p class="eyebrow">Analytics</p>
        <h1>Reports</h1>
        <p class="reports-header__lead">
          View sales performance, revenue breakdown, top customers and best-selling products.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="reports-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="reports-tab"
          :class="{ 'reports-tab--active': reports.activeTab === tab.key }"
          @click="switchTab(tab.key)"
        >
          <span class="reports-tab__icon">
            <svg v-if="tab.icon === 'calendar'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <svg v-else-if="tab.icon === 'bar-chart'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <svg v-else-if="tab.icon === 'dollar'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <svg v-else-if="tab.icon === 'users'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <svg v-else-if="tab.icon === 'trending-up'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </span>
          {{ tab.label }}
        </button>
      </div>

      <div v-if="reports.loading" class="reports-status">
        <div class="spinner" />
        <p>Loading report data...</p>
      </div>

      <p v-if="reports.error" class="reports-error">{{ reports.error }}</p>

      <template v-if="!reports.loading && !reports.error">

        <!-- ──────── DAILY SALES ──────── -->
        <div v-if="reports.activeTab === 'daily'" class="report-panel">
          <div class="report-filters">
            <label class="filter-label">
              Date:
              <input type="date" class="filter-input" v-model="selectedDate" @change="loadTab()">
            </label>
          </div>
          <div class="stats-row">
            <div class="stat-card stat-card--cyan">
              <span class="stat-card__label">Total Sales</span>
              <span class="stat-card__value">{{ reports.dailySales.total_sales }}</span>
            </div>
            <div class="stat-card stat-card--green">
              <span class="stat-card__label">Total Revenue</span>
              <span class="stat-card__value">{{ formatCurrency(reports.dailySales.total_revenue) }}</span>
            </div>
            <div class="stat-card stat-card--blue">
              <span class="stat-card__label">Average Order</span>
              <span class="stat-card__value">{{ formatCurrency(reports.dailySales.average_order) }}</span>
            </div>
          </div>

          <div class="chart-card" v-if="reports.dailySales.hourly_distribution?.length">
            <h3 class="chart-card__title">Hourly Sales Distribution</h3>
            <div class="bar-chart">
              <div
                v-for="(h, i) in reports.dailySales.hourly_distribution"
                :key="i"
                class="bar-item"
                :title="`${h.hour}: ${h.count} orders, $${h.total.toFixed(2)}`"
              >
                <div class="bar-fill" :style="{ height: (h.count / barMax(reports.dailySales.hourly_distribution)) * 100 + '%' }" />
                <span class="bar-label" v-if="i % 3 === 0">{{ h.hour }}</span>
              </div>
            </div>
          </div>

          <div class="chart-card" v-if="reports.dailySales.status_breakdown?.length">
            <h3 class="chart-card__title">Status Breakdown</h3>
            <div class="status-grid">
              <div v-for="s in reports.dailySales.status_breakdown" :key="s.status" class="status-item">
                <span class="status-dot" :style="{ background: statusColors[s.status] || '#9ca3af' }" />
                <span class="status-name">{{ s.status }}</span>
                <span class="status-count">{{ s.count }} orders</span>
                <span class="status-rev">{{ formatCurrency(s.revenue) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ──────── MONTHLY SALES ──────── -->
        <div v-if="reports.activeTab === 'monthly'" class="report-panel">
          <div class="report-filters">
            <label class="filter-label">
              Month:
              <input type="month" class="filter-input" v-model="selectedMonth" @change="loadTab()">
            </label>
          </div>
          <div class="stats-row">
            <div class="stat-card stat-card--cyan">
              <span class="stat-card__label">Total Sales</span>
              <span class="stat-card__value">{{ reports.monthlySales.total_sales }}</span>
              <span class="stat-card__trend" :class="reports.monthlySales.sales_growth >= 0 ? 'up' : 'down'">
                {{ reports.monthlySales.sales_growth >= 0 ? '↑' : '↓' }} {{ Math.abs(reports.monthlySales.sales_growth) }}%
              </span>
            </div>
            <div class="stat-card stat-card--green">
              <span class="stat-card__label">Total Revenue</span>
              <span class="stat-card__value">{{ formatCurrency(reports.monthlySales.total_revenue) }}</span>
              <span class="stat-card__trend" :class="reports.monthlySales.revenue_growth >= 0 ? 'up' : 'down'">
                {{ reports.monthlySales.revenue_growth >= 0 ? '↑' : '↓' }} {{ Math.abs(reports.monthlySales.revenue_growth) }}%
              </span>
            </div>
            <div class="stat-card stat-card--blue">
              <span class="stat-card__label">Average Order</span>
              <span class="stat-card__value">{{ formatCurrency(reports.monthlySales.average_order) }}</span>
            </div>
          </div>

          <div class="chart-card" v-if="reports.monthlySales.daily_distribution?.length">
            <h3 class="chart-card__title">Daily Trends</h3>
            <div class="bar-chart bar-chart--sm">
              <div
                v-for="(d, i) in reports.monthlySales.daily_distribution"
                :key="i"
                class="bar-item"
                :title="`${d.date}: ${d.count} orders, $${d.total.toFixed(2)}`"
              >
                <div class="bar-fill" :style="{ height: (d.total / barMax(reports.monthlySales.daily_distribution.map(x => ({ total: x.total })))) * 100 + '%' }" />
                <span class="bar-label" v-if="i % 4 === 0">{{ formatDateLabel(d.date) }}</span>
              </div>
            </div>
          </div>

          <div class="chart-card" v-if="reports.monthlySales.status_breakdown?.length">
            <h3 class="chart-card__title">Status Breakdown</h3>
            <div class="status-grid">
              <div v-for="s in reports.monthlySales.status_breakdown" :key="s.status" class="status-item">
                <span class="status-dot" :style="{ background: statusColors[s.status] || '#9ca3af' }" />
                <span class="status-name">{{ s.status }}</span>
                <span class="status-count">{{ s.count }} orders</span>
                <span class="status-rev">{{ formatCurrency(s.revenue) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ──────── REVENUE ──────── -->
        <div v-if="reports.activeTab === 'revenue'" class="report-panel">
          <div class="report-filters">
            <label class="filter-label">From: <input type="date" class="filter-input" v-model="dateFrom"></label>
            <label class="filter-label">To: <input type="date" class="filter-input" v-model="dateTo"></label>
            <button class="filter-btn" @click="loadTab()">Apply</button>
          </div>

          <div class="stats-row stats-row--4">
            <div class="stat-card stat-card--green">
              <span class="stat-card__label">Total Revenue</span>
              <span class="stat-card__value">{{ formatCurrency(reports.revenue.total_revenue) }}</span>
            </div>
            <div class="stat-card stat-card--cyan">
              <span class="stat-card__label">Total Sales</span>
              <span class="stat-card__value">{{ reports.revenue.total_sales }}</span>
            </div>
            <div class="stat-card stat-card--blue">
              <span class="stat-card__label">Avg Order</span>
              <span class="stat-card__value">{{ formatCurrency(reports.revenue.average_order) }}</span>
            </div>
            <div class="stat-card stat-card--purple">
              <span class="stat-card__label">Completed</span>
              <span class="stat-card__value">{{ formatCurrency(reports.revenue.completed_revenue) }}</span>
            </div>
          </div>

          <div class="chart-card" v-if="reports.revenue.monthly_breakdown?.length">
            <h3 class="chart-card__title">Revenue by Month</h3>
            <div class="bar-chart">
              <div
                v-for="(m, i) in reports.revenue.monthly_breakdown"
                :key="i"
                class="bar-item"
                :title="`${m.month}: ${m.count} orders, $${m.total.toFixed(2)}`"
              >
                <div class="bar-fill bar-fill--green" :style="{ height: (m.total / barMax(reports.revenue.monthly_breakdown.map(x => ({ total: x.total })))) * 100 + '%' }" />
                <span class="bar-label">{{ m.month }}</span>
              </div>
            </div>
          </div>

          <div class="chart-card" v-if="buildRevenueSvg()">
            <h3 class="chart-card__title">Revenue by Category</h3>
            <div class="category-bars">
              <div
                v-for="(c, i) in buildRevenueSvg().items"
                :key="i"
                class="category-bar-row"
              >
                <span class="category-bar-name">{{ c.category }}</span>
                <div class="category-bar-track">
                  <div
                    class="category-bar-fill"
                    :style="{
                      width: (c.total / buildRevenueSvg().max) * 100 + '%',
                      background: buildRevenueSvg().colors[i % buildRevenueSvg().colors.length],
                    }"
                  />
                </div>
                <span class="category-bar-value">{{ formatCurrency(c.total) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ──────── TOP CUSTOMERS ──────── -->
        <div v-if="reports.activeTab === 'customers'" class="report-panel">
          <div class="report-filters">
            <label class="filter-label">From: <input type="date" class="filter-input" v-model="dateFrom"></label>
            <label class="filter-label">To: <input type="date" class="filter-input" v-model="dateTo"></label>
            <label class="filter-label">Limit: <input type="number" class="filter-input filter-input--sm" v-model.number="customerLimit" min="1" max="50"></label>
            <button class="filter-btn" @click="loadTab()">Apply</button>
          </div>

          <div class="stats-row">
            <div class="stat-card stat-card--green">
              <span class="stat-card__label">Customer Revenue</span>
              <span class="stat-card__value">{{ formatCurrency(reports.topCustomers.total_customer_revenue) }}</span>
            </div>
          </div>

          <div class="data-table-card">
            <h3 class="chart-card__title">Top Customers</h3>
            <div class="data-table-wrapper">
              <table class="data-table" v-if="reports.topCustomers.top_customers?.length">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Orders</th>
                    <th>Total Spent</th>
                    <th>Avg Order</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(c, i) in reports.topCustomers.top_customers" :key="c.id">
                    <td class="data-table__rank">{{ i + 1 }}</td>
                    <td class="data-table__name">
                      <span class="avatar-circle">{{ (c.name || '?')[0].toUpperCase() }}</span>
                      {{ c.name }}
                    </td>
                    <td>{{ c.email }}</td>
                    <td>{{ c.order_count }}</td>
                    <td class="data-table__amount">{{ formatCurrency(c.total_spent) }}</td>
                    <td class="data-table__amount">{{ formatCurrency(c.average_order) }}</td>
                  </tr>
                </tbody>
              </table>
              <p v-else class="reports-empty">No customer data found.</p>
            </div>
          </div>
        </div>

        <!-- ──────── BEST SELLERS ──────── -->
        <div v-if="reports.activeTab === 'sellers'" class="report-panel">
          <div class="report-filters">
            <label class="filter-label">From: <input type="date" class="filter-input" v-model="dateFrom"></label>
            <label class="filter-label">To: <input type="date" class="filter-input" v-model="dateTo"></label>
            <label class="filter-label">Limit: <input type="number" class="filter-input filter-input--sm" v-model.number="productLimit" min="1" max="50"></label>
            <button class="filter-btn" @click="loadTab()">Apply</button>
          </div>

          <div class="stats-row">
            <div class="stat-card stat-card--cyan">
              <span class="stat-card__label">Units Sold</span>
              <span class="stat-card__value">{{ reports.bestSellers.total_units_sold }}</span>
            </div>
          </div>

          <div class="chart-card" v-if="reports.bestSellers.best_sellers?.length">
            <h3 class="chart-card__title">Best Sellers</h3>
            <div class="bar-chart">
              <div
                v-for="(p, i) in reports.bestSellers.best_sellers.slice(0, 15)"
                :key="i"
                class="bar-item"
                :title="`${p.name}: ${p.units_sold} sold, $${p.total_revenue.toFixed(2)}`"
              >
                <div class="bar-fill bar-fill--accent" :style="{ height: (p.units_sold / barMax(reports.bestSellers.best_sellers.map(x => ({ count: x.units_sold })))) * 100 + '%' }" />
                <span class="bar-label" v-if="reports.bestSellers.best_sellers.length <= 15 || i % 2 === 0">{{ p.name.substring(0, 8) }}</span>
              </div>
            </div>
          </div>

          <div class="data-table-card">
            <h3 class="chart-card__title">Product Details</h3>
            <div class="data-table-wrapper">
              <table class="data-table" v-if="reports.bestSellers.best_sellers?.length">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Units Sold</th>
                    <th>Revenue</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(p, i) in reports.bestSellers.best_sellers" :key="p.id">
                    <td class="data-table__rank">{{ i + 1 }}</td>
                    <td class="data-table__name">
                      <span class="avatar-circle avatar-circle--sm">{{ (p.name || '?')[0].toUpperCase() }}</span>
                      {{ p.name }}
                    </td>
                    <td>{{ p.category || '-' }}</td>
                    <td class="data-table__amount">{{ formatCurrency(p.price) }}</td>
                    <td>{{ p.units_sold }}</td>
                    <td class="data-table__amount">{{ formatCurrency(p.total_revenue) }}</td>
                    <td>{{ p.stock }}</td>
                  </tr>
                </tbody>
              </table>
              <p v-else class="reports-empty">No product data found.</p>
            </div>
          </div>
        </div>

      </template>
    </section>
  </div>
</template>

<style scoped>
.reports-header {
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  background: var(--surface);
  box-shadow: var(--shadow);
  padding: 32px;
}

.reports-header__lead {
  margin: 12px 0 0;
  max-width: 56ch;
  color: var(--muted);
}

.reports-tabs {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: var(--accent-soft);
  border-radius: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.reports-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: var(--muted);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.reports-tab:hover {
  color: var(--text);
  background: var(--surface);
}

.reports-tab--active {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
}

.reports-tab__icon {
  display: flex;
  align-items: center;
}

.reports-tab--active .reports-tab__icon {
  color: #fff;
}

.report-panel {
  display: grid;
  gap: 20px;
}

.report-filters {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  padding: 12px 16px;
  background: var(--accent-soft);
  border-radius: 12px;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text);
}

.filter-input {
  padding: 6px 10px;
  border: 1px solid var(--line);
  border-radius: 8px;
  font-size: 0.82rem;
  background: var(--surface);
  color: var(--text);
}

.filter-input--sm {
  width: 70px;
}

.filter-btn {
  padding: 6px 14px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stats-row--4 {
  grid-template-columns: repeat(4, 1fr);
}

.stat-card {
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  background: var(--surface);
  box-shadow: var(--shadow);
}

.stat-card__label {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 4px;
}

.stat-card__value {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text);
}

.stat-card__trend {
  display: inline-block;
  margin-top: 4px;
  font-size: 0.78rem;
  font-weight: 700;
}

.stat-card__trend.up { color: #16a34a; }
.stat-card__trend.down { color: #dc2626; }

.stat-card--green { border-top: 3px solid #22c55e; }
.stat-card--cyan { border-top: 3px solid #06b6d4; }
.stat-card--blue { border-top: 3px solid #3b82f6; }
.stat-card--purple { border-top: 3px solid #8b5cf6; }

.chart-card, .data-table-card {
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  background: var(--surface);
  box-shadow: var(--shadow);
  padding: 24px;
}

.chart-card__title {
  margin: 0 0 16px;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text);
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 180px;
  padding-bottom: 28px;
}

.bar-chart--sm {
  height: 140px;
}

.bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  position: relative;
  min-width: 0;
}

.bar-fill {
  width: 80%;
  max-width: 28px;
  border-radius: 6px 6px 0 0;
  background: linear-gradient(180deg, #06b6d4, #0891b2);
  transition: height 0.3s;
  min-height: 2px;
}

.bar-fill--green {
  background: linear-gradient(180deg, #22c55e, #16a34a);
}

.bar-fill--accent {
  background: linear-gradient(180deg, #8b5cf6, #7c3aed);
}

.bar-label {
  position: absolute;
  bottom: -22px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.6rem;
  font-weight: 600;
  color: var(--muted);
  white-space: nowrap;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--accent-soft);
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text);
  flex: 1;
}

.status-count {
  font-size: 0.72rem;
  color: var(--muted);
}

.status-rev {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text);
}

.category-bars {
  display: grid;
  gap: 12px;
}

.category-bar-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.category-bar-name {
  width: 100px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text);
  text-align: right;
  flex-shrink: 0;
}

.category-bar-track {
  flex: 1;
  height: 22px;
  background: var(--accent-soft);
  border-radius: 6px;
  overflow: hidden;
}

.category-bar-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.4s;
}

.category-bar-value {
  width: 80px;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text);
  flex-shrink: 0;
}

.data-table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.data-table th {
  text-align: left;
  padding: 10px 14px;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid var(--line);
}

.data-table td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--line);
  color: var(--text);
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-table__rank {
  font-weight: 800;
  color: var(--muted);
}

.data-table__name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.data-table__amount {
  font-weight: 700;
  white-space: nowrap;
}

.avatar-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
  flex-shrink: 0;
}

.avatar-circle--sm {
  width: 24px;
  height: 24px;
  font-size: 0.65rem;
}

.reports-status {
  display: grid;
  place-items: center;
  gap: 12px;
  padding: 64px 0;
  color: var(--muted);
}

.reports-error {
  padding: 16px;
  border-radius: 10px;
  background: #fef2f2;
  color: #dc2626;
  font-weight: 600;
  font-size: 0.88rem;
}

.reports-empty {
  text-align: center;
  color: var(--muted);
  padding: 32px 0;
}

@media (max-width: 768px) {
  .stats-row { grid-template-columns: 1fr; }
  .stats-row--4 { grid-template-columns: repeat(2, 1fr); }
  .reports-tabs { flex-direction: column; }
  .bar-chart { height: 120px; }
  .category-bar-name { width: 60px; font-size: 0.7rem; }
  .category-bar-value { width: 60px; font-size: 0.72rem; }
}
</style>
