
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function AccountsReceivablePage() {
  // Mock data para estadísticas del dashboard
  const totalReceivables = 435000;
  const overdueAmount = 125000;
  const currentAmount = 310000;
  const activeCustomers = 15;

  const modules = [
    {
      title: 'Facturas por Cobrar',
      description: 'Gestión de facturas pendientes de cobro',
      icon: 'ri-file-list-3-line',
      path: '/accounts-receivable/invoices',
      color: 'bg-blue-500',
      stats: 'RD$ 435,000'
    },
    {
      title: 'Gestión de Clientes',
      description: 'Administración de información de clientes',
      icon: 'ri-user-line',
      path: '/accounts-receivable/customers',
      color: 'bg-purple-500',
      stats: '15 Activos'
    },
    {
      title: 'Pagos Recibidos',
      description: 'Registro y seguimiento de pagos',
      icon: 'ri-money-dollar-circle-line',
      path: '/accounts-receivable/payments',
      color: 'bg-green-500',
      stats: 'RD$ 285,000'
    },
    {
      title: 'Recibos de Cobro',
      description: 'Emisión y gestión de recibos',
      icon: 'ri-receipt-line',
      path: '/accounts-receivable/receipts',
      color: 'bg-indigo-500',
      stats: '24 Emitidos'
    },
    {
      title: 'Anticipos de Clientes',
      description: 'Gestión de anticipos recibidos',
      icon: 'ri-wallet-line',
      path: '/accounts-receivable/advances',
      color: 'bg-orange-500',
      stats: 'RD$ 150,000'
    },
    {
      title: 'Notas de Crédito',
      description: 'Gestión de notas de crédito',
      icon: 'ri-file-reduce-line',
      path: '/accounts-receivable/credit-notes',
      color: 'bg-emerald-500',
      stats: 'RD$ 45,000'
    },
    {
      title: 'Notas de Débito',
      description: 'Gestión de notas de débito',
      icon: 'ri-file-add-line',
      path: '/accounts-receivable/debit-notes',
      color: 'bg-red-500',
      stats: 'RD$ 25,000'
    },
    {
      title: 'Reportes CxC',
      description: 'Reportes y análisis de cuentas por cobrar',
      icon: 'ri-bar-chart-line',
      path: '/accounts-receivable/reports',
      color: 'bg-cyan-500',
      stats: '8 Disponibles'
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Cuentas por Cobrar</h1>
            <p className="text-slate-400 mt-1">Gestión integral de cuentas por cobrar y clientes</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-900/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total por Cobrar</p>
                <p className="text-2xl font-bold text-slate-50">${totalReceivables.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
                <i className="ri-money-dollar-circle-line text-2xl text-emerald-300"></i>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-900/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Vencidas</p>
                <p className="text-2xl font-bold text-red-300">${overdueAmount.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/50 flex items-center justify-center">
                <i className="ri-alarm-warning-line text-2xl text-red-200"></i>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-900/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Corrientes</p>
                <p className="text-2xl font-bold text-emerald-300">${currentAmount.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
                <i className="ri-time-line text-2xl text-emerald-200"></i>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-900/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Clientes Activos</p>
                <p className="text-2xl font-bold text-slate-50">{activeCustomers}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/50 flex items-center justify-center">
                <i className="ri-user-line text-2xl text-purple-200"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module, index) => (
            <Link
              key={index}
              to={module.path}
              className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 hover:border-purple-500/70 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${module.color.replace('bg-', 'bg-')} shadow-md shadow-slate-900/40`}>
                  <i className={`${module.icon} text-2xl text-white`}></i>
                </div>
                <span className="text-sm font-medium text-slate-400">{module.stats}</span>
              </div>
              
              <h3 className="text-lg font-semibold text-slate-50 mb-2 group-hover:text-purple-200 transition-colors">
                {module.title}
              </h3>
              
              <p className="text-slate-300 text-sm">
                {module.description}
              </p>
              
              <div className="mt-4 flex items-center text-purple-300 text-sm font-medium">
                <span>Acceder</span>
                <i className="ri-arrow-right-line ml-2 group-hover:translate-x-1 transition-transform duration-200"></i>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-lg shadow-slate-900/60">
          <h3 className="text-lg font-semibold text-slate-50 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/accounts-receivable/invoices"
              className="flex items-center p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/70 hover:bg-slate-900 transition-colors"
            >
              <i className="ri-add-line text-2xl text-purple-300 mr-3"></i>
              <div>
                <p className="font-medium text-slate-50">Nueva Factura</p>
                <p className="text-sm text-slate-400">Crear factura por cobrar</p>
              </div>
            </Link>
            
            <Link
              to="/accounts-receivable/payments"
              className="flex items-center p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/70 hover:bg-slate-900 transition-colors"
            >
              <i className="ri-money-dollar-circle-line text-2xl text-emerald-300 mr-3"></i>
              <div>
                <p className="font-medium text-slate-50">Registrar Pago</p>
                <p className="text-sm text-slate-400">Registrar pago recibido</p>
              </div>
            </Link>
            
            <Link
              to="/accounts-receivable/customers"
              className="flex items-center p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/70 hover:bg-slate-900 transition-colors"
            >
              <i className="ri-user-add-line text-2xl text-purple-300 mr-3"></i>
              <div>
                <p className="font-medium text-slate-50">Nuevo Cliente</p>
                <p className="text-sm text-slate-400">Agregar nuevo cliente</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
