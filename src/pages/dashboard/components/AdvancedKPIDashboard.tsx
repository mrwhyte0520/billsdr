
import { useState, useEffect } from 'react';

interface KPIMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
}

interface ChartData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export default function AdvancedKPIDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [kpiMetrics, setKpiMetrics] = useState<KPIMetric[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    // Simulate loading KPI data
    setKpiMetrics([
      {
        title: 'Ingresos Totales',
        value: '$284,750',
        change: '+12.5%',
        trend: 'up',
        icon: 'ri-money-dollar-circle-line',
        color: 'from-green-500 to-green-600'
      },
      {
        title: 'Gastos Operativos',
        value: '$123,480',
        change: '-3.2%',
        trend: 'down',
        icon: 'ri-shopping-cart-line',
        color: 'from-red-500 to-red-600'
      },
      {
        title: 'Utilidad Neta',
        value: '$161,270',
        change: '+18.7%',
        trend: 'up',
        icon: 'ri-line-chart-line',
        color: 'from-blue-500 to-blue-600'
      },
      {
        title: 'Flujo de Caja',
        value: '$89,230',
        change: '+5.4%',
        trend: 'up',
        icon: 'ri-exchange-line',
        color: 'from-purple-500 to-purple-600'
      },
      {
        title: 'Cuentas por Cobrar',
        value: '$45,620',
        change: '-8.1%',
        trend: 'down',
        icon: 'ri-file-list-3-line',
        color: 'from-orange-500 to-orange-600'
      },
      {
        title: 'ROI Mensual',
        value: '24.8%',
        change: '+2.3%',
        trend: 'up',
        icon: 'ri-percent-line',
        color: 'from-indigo-500 to-indigo-600'
      }
    ]);

    setChartData([
      { month: 'Ene', revenue: 2100000, expenses: 1200000, profit: 900000 },
      { month: 'Feb', revenue: 2300000, expenses: 1150000, profit: 1150000 },
      { month: 'Mar', revenue: 2500000, expenses: 1300000, profit: 1200000 },
      { month: 'Abr', revenue: 2200000, expenses: 1100000, profit: 1100000 },
      { month: 'May', revenue: 2700000, expenses: 1250000, profit: 1450000 },
      { month: 'Jun', revenue: 2847500, expenses: 1234800, profit: 1612700 }
    ]);
  }, [selectedPeriod]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-50">Dashboard KPI Avanzado</h2>
        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
          {[
            { key: 'week', label: 'Semana' },
            { key: 'month', label: 'Mes' },
            { key: 'quarter', label: 'Trimestre' },
            { key: 'year', label: 'Año' }
          ].map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedPeriod === period.key
                  ? 'bg-slate-100 text-slate-900 shadow-sm'
                  : 'text-slate-300 hover:text-slate-50'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiMetrics.map((metric, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-lg shadow-slate-900/60"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center shadow-md shadow-slate-900/50`}>
                <i className={`${metric.icon} text-2xl text-white`}></i>
              </div>
              <div
                className={`flex items-center text-sm font-medium ${
                  metric.trend === 'up'
                    ? 'text-emerald-400'
                    : metric.trend === 'down'
                    ? 'text-red-400'
                    : 'text-slate-400'
                }`}
              >
                <i
                  className={`$${
                    ''
                  } mr-1`}
                ></i>
                {metric.change}
              </div>
            </div>
            <h3 className="text-sm font-medium text-slate-400 mb-1">{metric.title}</h3>
            <p className="text-2xl font-bold text-slate-50">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Financial Chart */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-lg shadow-slate-900/60">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-50">Análisis Financiero</h3>
          <div className="flex space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-slate-300">Ingresos</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-slate-300">Gastos</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-slate-300">Utilidad</span>
            </div>
          </div>
        </div>
        
        <div className="h-80 flex items-end space-x-4">
          {chartData.map((data, index) => {
            const maxValue = Math.max(...chartData.map(d => Math.max(d.revenue, d.expenses, d.profit)));
            const revenueHeight = (data.revenue / maxValue) * 100;
            const expenseHeight = (data.expenses / maxValue) * 100;
            const profitHeight = (data.profit / maxValue) * 100;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex justify-center space-x-1 mb-2">
                  <div 
                    className="w-4 bg-green-500 rounded-t"
                    style={{ height: `${revenueHeight * 2.5}px` }}
                    title={`Ingresos: ${formatCurrency(data.revenue)}`}
                  ></div>
                  <div 
                    className="w-4 bg-red-500 rounded-t"
                    style={{ height: `${expenseHeight * 2.5}px` }}
                    title={`Gastos: ${formatCurrency(data.expenses)}`}
                  ></div>
                  <div 
                    className="w-4 bg-blue-500 rounded-t"
                    style={{ height: `${profitHeight * 2.5}px` }}
                    title={`Utilidad: ${formatCurrency(data.profit)}`}
                  ></div>
                </div>
                <span className="text-xs text-slate-400 font-medium">{data.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Financial Ratios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-lg shadow-slate-900/60">
          <h3 className="text-lg font-semibold text-slate-50 mb-4">Ratios Financieros</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Liquidez Corriente</span>
              <span className="font-semibold text-emerald-400">2.45</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Margen de Utilidad</span>
              <span className="font-semibold text-sky-400">56.7%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Rotación de Inventario</span>
              <span className="font-semibold text-purple-400">8.2x</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Días de Cobro</span>
              <span className="font-semibold text-amber-400">32 días</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-lg shadow-slate-900/60">
          <h3 className="text-lg font-semibold text-slate-50 mb-4">Alertas y Recomendaciones</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/40">
              <i className="ri-check-line text-emerald-300 mt-0.5"></i>
              <div>
                <p className="text-sm font-medium text-slate-50">Flujo de caja positivo</p>
                <p className="text-xs text-emerald-200">Excelente gestión financiera</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-amber-500/10 rounded-xl border border-amber-500/40">
              <i className="ri-alert-line text-amber-300 mt-0.5"></i>
              <div>
                <p className="text-sm font-medium text-slate-50">Cuentas por cobrar altas</p>
                <p className="text-xs text-amber-200">Revisar políticas de crédito</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-sky-500/10 rounded-xl border border-sky-500/40">
              <i className="ri-lightbulb-line text-sky-300 mt-0.5"></i>
              <div>
                <p className="text-sm font-medium text-slate-50">Oportunidad de inversión</p>
                <p className="text-xs text-sky-200">Considerar expansión del negocio</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
