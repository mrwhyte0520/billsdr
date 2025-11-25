import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function AccountsPayablePage() {
  const navigate = useNavigate();

  const modules = [
    {
      title: 'Reportes de Cuentas por Pagar',
      description: 'Reportes completos de cuentas por pagar con filtros avanzados',
      icon: 'ri-file-chart-line',
      href: '/accounts-payable/reports',
      color: 'blue'
    },
    {
      title: 'Gestión de Proveedores',
      description: 'Base de datos y mantenimiento de proveedores',
      icon: 'ri-truck-line',
      href: '/accounts-payable/suppliers',
      color: 'green'
    },
    {
      title: 'Procesamiento de Pagos',
      description: 'Pagos por cheque, transferencia y efectivo',
      icon: 'ri-bank-card-line',
      href: '/accounts-payable/payments',
      color: 'purple'
    },
    {
      title: 'Órdenes de Compra',
      description: 'Gestión y seguimiento de órdenes de compra',
      icon: 'ri-shopping-cart-line',
      href: '/accounts-payable/purchase-orders',
      color: 'orange'
    },
    {
      title: 'Solicitudes de Cotización',
      description: 'Solicitudes de cotización y comparaciones',
      icon: 'ri-file-list-line',
      href: '/accounts-payable/quotes',
      color: 'red'
    },
    {
      title: 'Anticipos a Proveedores',
      description: 'Pagos de anticipos a proveedores',
      icon: 'ri-money-dollar-circle-line',
      href: '/accounts-payable/advances',
      color: 'indigo'
    }
  ];

  const apStats = [
    {
      title: 'Balance Total CxP',
      value: '$185,000',
      change: '+3.8%',
      icon: 'ri-file-list-3-line',
      color: 'red'
    },
    {
      title: 'Vence Esta Semana',
      value: '$45,000',
      change: '+12%',
      icon: 'ri-calendar-line',
      color: 'orange'
    },
    {
      title: 'Pagos Vencidos',
      value: '$12,500',
      change: '-8.5%',
      icon: 'ri-alert-line',
      color: 'red'
    },
    {
      title: 'Proveedores Activos',
      value: '156',
      change: '+5',
      icon: 'ri-truck-line',
      color: 'blue'
    }
  ];

  const topSuppliers = [
    {
      name: 'Proveedor Industrial SA',
      rnc: '101234567',
      balance: '$35,000',
      dueDate: '20/01/2024',
      status: 'Por Vencer'
    },
    {
      name: 'Distribuidora Nacional SRL',
      rnc: '201234567',
      balance: '$28,000',
      dueDate: '25/01/2024',
      status: 'Al Día'
    },
    {
      name: 'Servicios Técnicos EIRL',
      rnc: '301234567',
      balance: '$19,500',
      dueDate: '10/01/2024',
      status: 'Vencido'
    },
    {
      name: 'Materiales de Construcción SA',
      rnc: '401234567',
      balance: '$16,500',
      dueDate: '30/01/2024',
      status: 'Current'
    }
  ];

  const recentPurchases = [
    {
      type: 'Orden de Compra',
      supplier: 'Proveedor Industrial SA',
      amount: '$8,500',
      reference: 'PO-2024-045',
      date: '15/01/2024'
    },
    {
      type: 'Pago',
      supplier: 'Distribuidora Nacional SRL',
      amount: '$12,500',
      reference: 'PAY-2024-089',
      date: '14/01/2024'
    },
    {
      type: 'Factura Recibida',
      supplier: 'Servicios Técnicos EIRL',
      amount: '$4,500',
      reference: 'INV-SUP-156',
      date: '13/01/2024'
    }
  ];

  const pendingApprovals = [
    {
      type: 'Purchase Order',
      supplier: 'Nuevo Proveedor XYZ',
      amount: 'RD$ 125,000',
      requestedBy: 'Juan Pérez',
      date: '15/01/2024'
    },
    {
      type: 'Solicitud de Pago',
      supplier: 'Servicios Urgentes SA',
      amount: '$7,500',
      requestedBy: 'María García',
      date: '14/01/2024'
    }
  ];

  // Module Access Functions
  const handleAccessModule = (moduleHref: string, moduleName: string) => {
    navigate(moduleHref);
  };

  // Approval Functions
  const handleApproveRequest = (type: string, supplier: string, amount: string) => {
    if (confirm(`¿Aprobar ${type} para ${supplier} por ${amount}?`)) {
      alert(`${type} aprobada correctamente para ${supplier}`);
    }
  };

  const handleRejectRequest = (type: string, supplier: string, amount: string) => {
    if (confirm(`¿Rechazar ${type} para ${supplier} por ${amount}?`)) {
      alert(`${type} rechazada para ${supplier}`);
    }
  };

  // Navigation Functions
  const handleViewAll = (section: string) => {
    alert(`Viendo todas las ${section}...`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Encabezado */}
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Módulo de Cuentas por Pagar</h1>
          <p className="text-slate-400">Sistema completo de gestión de proveedores y pagos</p>
        </div>

        {/* A/P Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {apStats.map((stat, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-lg shadow-slate-900/60"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-50 mt-1">{stat.value}</p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-900 border border-slate-700">
                  <i className={`${stat.icon} text-xl text-purple-300`}></i>
                </div>
              </div>
              <div className="mt-4">
                <span
                  className={`text-sm font-medium ${
                    stat.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-sm text-slate-500 ml-1">vs last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Malla de módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 hover:border-purple-500/70 hover:shadow-lg hover:shadow-purple-500/30 transition-all cursor-pointer"
            >
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${module.color}-100 mr-4`}>
                  <i className={`${module.icon} text-xl text-${module.color}-600`}></i>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-50 mb-2">{module.title}</h3>
              <p className="text-slate-300 mb-4 text-sm">{module.description}</p>
              <button
                onClick={() => handleAccessModule(module.href, module.title)}
                className="w-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-sky-400 text-slate-950 py-2 px-4 rounded-xl hover:brightness-110 transition-colors whitespace-nowrap font-semibold shadow-md shadow-purple-500/40"
              >
                Acceder
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Proveedores principales */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-900/60">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-slate-50">Proveedores con Mayor Balance</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topSuppliers.map((supplier, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-900/70 rounded-xl border border-slate-800">
                    <div>
                      <p className="font-medium text-slate-50">{supplier.name}</p>
                      <p className="text-sm text-slate-400">RNC: {supplier.rnc}</p>
                      <p className="text-xs text-slate-500">Vence: {supplier.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-50">{supplier.balance}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                        supplier.status === 'Al Día'
                          ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300'
                          : supplier.status === 'Por Vencer'
                          ? 'border-amber-500/60 bg-amber-500/10 text-amber-300'
                          : 'border-red-500/60 bg-red-500/10 text-red-300'
                      }`}>
                        {supplier.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actividad reciente */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-900/60">
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-50">Actividad Reciente</h3>
                <button
                  onClick={() => handleViewAll('actividades recientes')}
                  className="text-purple-300 hover:text-purple-200 text-sm font-medium whitespace-nowrap"
                >
                  Ver todo
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentPurchases.map((purchase, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-900/70 rounded-xl border border-slate-800">
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 ${
                          purchase.type === 'Pago'
                            ? 'bg-emerald-500/20'
                            : purchase.type === 'Purchase Order'
                            ? 'bg-blue-500/20'
                            : 'bg-amber-500/20'
                        }`}
                      >
                        <i
                          className={`$${
                            ''
                          }`}
                        ></i>
                      </div>
                      <div>
                        <p className="font-medium text-slate-50">{purchase.supplier}</p>
                        <p className="text-sm text-slate-400">{purchase.reference}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          purchase.type === 'Payment' ? 'text-emerald-400' : 'text-sky-400'
                        }`}
                      >
                        {purchase.amount}
                      </p>
                      <p className="text-xs text-slate-500">{purchase.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-lg font-semibold text-slate-50">Aprobaciones Pendientes</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingApprovals.map((approval, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-slate-900/70 border border-slate-800 rounded-xl"
                >
                  <div>
                    <p className="font-medium text-slate-50">{approval.type}</p>
                    <p className="text-sm text-slate-400">{approval.supplier}</p>
                    <p className="text-xs text-slate-500">Solicitado por: {approval.requestedBy}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-50">{approval.amount}</p>
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => handleApproveRequest(approval.type, approval.supplier, approval.amount)}
                        className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 text-xs rounded-lg hover:brightness-110 whitespace-nowrap font-medium shadow-md shadow-emerald-500/30"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => handleRejectRequest(approval.type, approval.supplier, approval.amount)}
                        className="px-3 py-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg hover:bg-slate-800 whitespace-nowrap"
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}