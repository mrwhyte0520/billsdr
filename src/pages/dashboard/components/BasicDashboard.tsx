
import { useState, useEffect } from 'react';

interface BasicMetric {
  title: string;
  value: string;
  icon: string;
  color: string;
}

export default function BasicDashboard() {
  const [metrics, setMetrics] = useState<BasicMetric[]>([]);

  useEffect(() => {
    // Simulate loading basic metrics
    setMetrics([
      {
        title: 'Ingresos del Mes',
        value: '$284,750',
        icon: 'ri-money-dollar-circle-line',
        color: 'from-green-500 to-green-600'
      },
      {
        title: 'Gastos del Mes',
        value: '$123,480',
        icon: 'ri-shopping-cart-line',
        color: 'from-red-500 to-red-600'
      },
      {
        title: 'Facturas Pendientes',
        value: '23',
        icon: 'ri-file-list-3-line',
        color: 'from-orange-500 to-orange-600'
      },
      {
        title: 'Clientes Activos',
        value: '156',
        icon: 'ri-group-line',
        color: 'from-blue-500 to-blue-600'
      }
    ]);
  }, []);

  const recentTransactions = [
    { id: 1, description: 'Venta de productos', amount: '$4,500', date: '2024-01-15', type: 'income' },
    { id: 2, description: 'Pago de servicios', amount: '$1,250', date: '2024-01-14', type: 'expense' },
    { id: 3, description: 'Venta de servicios', amount: '$7,800', date: '2024-01-14', type: 'income' },
    { id: 4, description: 'Compra de inventario', amount: '$3,500', date: '2024-01-13', type: 'expense' },
    { id: 5, description: 'Pago de cliente', amount: '$9,200', date: '2024-01-13', type: 'income' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-50">Dashboard Básico</h2>

      {/* Basic Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-lg shadow-slate-900/60"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">{metric.title}</p>
                <p className="text-2xl font-bold text-slate-50">{metric.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center shadow-md shadow-slate-900/50`}>
                <i className={`${metric.icon} text-2xl text-white`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-lg shadow-slate-900/60">
          <h3 className="text-lg font-semibold text-slate-50 mb-4">Transacciones Recientes</h3>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-slate-900/70 rounded-xl border border-slate-800"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      transaction.type === 'income' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                    }`}
                  >
                    <i
                      className={`$${
                        ''
                      }`}
                    ></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-50">{transaction.description}</p>
                    <p className="text-xs text-slate-500">{transaction.date}</p>
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}{transaction.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-lg shadow-slate-900/60">
          <h3 className="text-lg font-semibold text-slate-50 mb-4">Resumen Mensual</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/40">
              <div>
                <p className="text-sm font-medium text-emerald-200">Total Ingresos</p>
                <p className="text-lg font-bold text-slate-50">$284,750</p>
              </div>
              <i className="ri-arrow-up-line text-2xl text-emerald-300"></i>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-xl bg-red-500/10 border border-red-500/40">
              <div>
                <p className="text-sm font-medium text-red-200">Total Gastos</p>
                <p className="text-lg font-bold text-slate-50">$123,480</p>
              </div>
              <i className="ri-arrow-down-line text-2xl text-red-300"></i>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-xl bg-sky-500/10 border border-sky-500/40">
              <div>
                <p className="text-sm font-medium text-sky-200">Utilidad Neta</p>
                <p className="text-lg font-bold text-slate-50">$161,270</p>
              </div>
              <i className="ri-line-chart-line text-2xl text-sky-300"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-lg shadow-slate-900/60">
        <h3 className="text-lg font-semibold text-slate-50 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/70 hover:bg-slate-900 transition-colors">
            <i className="ri-file-add-line text-2xl text-purple-300 mb-2"></i>
            <span className="text-sm font-medium text-slate-50">Nueva Factura</span>
          </button>
          
          <button className="flex flex-col items-center p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/70 hover:bg-slate-900 transition-colors">
            <i className="ri-user-add-line text-2xl text-emerald-300 mb-2"></i>
            <span className="text-sm font-medium text-slate-50">Nuevo Cliente</span>
          </button>
          
          <button className="flex flex-col items-center p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/70 hover:bg-slate-900 transition-colors">
            <i className="ri-shopping-cart-add-line text-2xl text-purple-300 mb-2"></i>
            <span className="text-sm font-medium text-slate-50">Nuevo Producto</span>
          </button>
          
          <button className="flex flex-col items-center p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/70 hover:bg-slate-900 transition-colors">
            <i className="ri-file-chart-line text-2xl text-sky-300 mb-2"></i>
            <span className="text-sm font-medium text-slate-50">Ver Reportes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
