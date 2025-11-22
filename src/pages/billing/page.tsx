import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function BillingPage() {
  const navigate = useNavigate();

  const modules = [
    {
      title: 'Reportes de Ventas',
      description: 'Análisis completo de ventas y rendimiento comercial',
      icon: 'ri-bar-chart-line',
      href: '/billing/sales-reports',
      color: 'blue'
    },
    {
      title: 'Facturación',
      description: 'Crear y gestionar facturas de clientes',
      icon: 'ri-file-text-line',
      href: '/billing/invoicing',
      color: 'green'
    },
    {
      title: 'Pre-facturación',
      description: 'Cotizaciones y presupuestos para clientes',
      icon: 'ri-draft-line',
      href: '/billing/pre-invoicing',
      color: 'purple'
    },
    {
      title: 'Facturación Recurrente',
      description: 'Suscripciones y facturación automática',
      icon: 'ri-repeat-line',
      href: '/billing/recurring',
      color: 'orange'
    },
    {
      title: 'Cierre de Caja',
      description: 'Reconciliación diaria de efectivo y ventas',
      icon: 'ri-safe-line',
      href: '/billing/cash-closing',
      color: 'red'
    },
    {
      title: 'Cotizaciones de Ventas',
      description: 'Propuestas comerciales y seguimiento de oportunidades',
      icon: 'ri-file-list-line',
      href: '/billing/quotes',
      color: 'indigo'
    }
  ];

  const salesStats = [
    {
      title: 'Ventas de Hoy',
      value: '$18,500',
      change: '+12.5%',
      icon: 'ri-money-dollar-circle-line',
      color: 'green'
    },
    {
      title: 'Facturas Emitidas',
      value: '67',
      change: '+8.2%',
      icon: 'ri-file-text-line',
      color: 'blue'
    },
    {
      title: 'Cotizaciones Pendientes',
      value: '23',
      change: '+15%',
      icon: 'ri-file-list-line',
      color: 'orange'
    },
    {
      title: 'Ingresos Mensuales',
      value: '$285,000',
      change: '+18.3%',
      icon: 'ri-line-chart-line',
      color: 'purple'
    }
  ];

  const recentInvoices = [
    {
      number: 'FAC-2024-189',
      customer: 'Empresa ABC SRL',
      amount: '$4,500',
      status: 'Pagada',
      date: '15/01/2024'
    },
    {
      number: 'FAC-2024-188',
      customer: 'Comercial XYZ EIRL',
      amount: '$3,250',
      status: 'Pendiente',
      date: '15/01/2024'
    },
    {
      number: 'FAC-2024-187',
      customer: 'Distribuidora DEF SA',
      amount: '$7,800',
      status: 'Pagada',
      date: '14/01/2024'
    },
    {
      number: 'FAC-2024-186',
      customer: 'Servicios GHI SRL',
      amount: '$2,500',
      status: 'Vencida',
      date: '13/01/2024'
    }
  ];

  const topProducts = [
    {
      name: 'Laptop Dell Inspiron 15',
      quantity: 25,
      revenue: '$87,500',
      margin: '22%'
    },
    {
      name: 'Monitor Samsung 24"',
      quantity: 45,
      revenue: '$45,000',
      margin: '18%'
    },
    {
      name: 'Impresora HP LaserJet',
      quantity: 18,
      revenue: '$32,400',
      margin: '25%'
    },
    {
      name: 'Teclado Mecánico RGB',
      quantity: 67,
      revenue: '$20,100',
      margin: '35%'
    }
  ];

  const pendingQuotes = [
    {
      number: 'COT-2024-045',
      customer: 'Nuevo Cliente SA',
      amount: '$12,500',
      validUntil: '25/01/2024',
      status: 'Pendiente'
    },
    {
      number: 'COT-2024-044',
      customer: 'Empresa Potencial SRL',
      amount: '$8,900',
      validUntil: '22/01/2024',
      status: 'En Revisión'
    }
  ];

  // Module Access Functions
  const handleAccessModule = (moduleHref: string) => {
    navigate(moduleHref);
  };

  // Quote Management Functions
  const handleConvertQuote = (quoteNumber: string, customer: string, amount: string) => {
    if (confirm(`¿Convertir cotización ${quoteNumber} a factura para ${customer}?`)) {
      alert(`Cotización ${quoteNumber} convertida a factura exitosamente`);
    }
  };

  const handleEditQuote = (quoteNumber: string) => {
    navigate('/billing/quotes');
  };

  // Navigation Functions
  const handleViewAllInvoices = () => {
    navigate('/billing/invoicing');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Módulo de Facturación</h1>
          <p className="text-slate-400">Sistema completo de gestión de ventas y facturación</p>
        </div>

        {/* Sales Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {salesStats.map((stat, index) => (
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
                <span className="text-sm font-medium text-emerald-400">{stat.change}</span>
                <span className="text-sm text-slate-500 ml-1">vs ayer</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 hover:border-purple-500/70 hover:shadow-lg hover:shadow-purple-500/30 transition-all cursor-pointer"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-500 via-fuchsia-500 to-sky-400 mr-4 shadow-md shadow-purple-500/40">
                  <i className={`${module.icon} text-xl text-slate-950`}></i>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-50 mb-2">{module.title}</h3>
              <p className="text-slate-300 mb-4 text-sm">{module.description}</p>
              <button
                onClick={() => handleAccessModule(module.href)}
                className="w-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-sky-400 text-slate-950 py-2 px-4 rounded-xl hover:brightness-110 transition-colors whitespace-nowrap font-semibold shadow-md shadow-purple-500/40"
              >
                Acceder
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Invoices */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-900/60">
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-50">Facturas Recientes</h3>
                <button
                  onClick={handleViewAllInvoices}
                  className="text-sm font-medium text-purple-300 hover:text-purple-200 whitespace-nowrap"
                >
                  Ver todas
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentInvoices.map((invoice, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-900/70 border border-slate-800"
                  >
                    <div>
                      <p className="font-medium text-slate-50">{invoice.number}</p>
                      <p className="text-sm text-slate-400">{invoice.customer}</p>
                      <p className="text-xs text-slate-500">{invoice.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-50">{invoice.amount}</p>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                          invoice.status === 'Pagada'
                            ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300'
                            : invoice.status === 'Pendiente'
                            ? 'border-amber-500/60 bg-amber-500/10 text-amber-300'
                            : 'border-red-500/60 bg-red-500/10 text-red-300'
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-900/60">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-slate-50">Productos Más Vendidos</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-900/70 border border-slate-800"
                  >
                    <div>
                      <p className="font-medium text-slate-50">{product.name}</p>
                      <p className="text-sm text-slate-400">Vendidos: {product.quantity} unidades</p>
                      <p className="text-xs text-slate-500">Margen: {product.margin}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-400">{product.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pending Quotes */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-900/60">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-lg font-semibold text-slate-50">Cotizaciones Pendientes</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingQuotes.map((quote, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-slate-900/70 border border-slate-800 rounded-xl"
                >
                  <div>
                    <p className="font-medium text-slate-50">{quote.number}</p>
                    <p className="text-sm text-slate-400">{quote.customer}</p>
                    <p className="text-xs text-slate-500">Válida hasta: {quote.validUntil}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-50">{quote.amount}</p>
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => handleConvertQuote(quote.number, quote.customer, quote.amount)}
                        className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 text-xs rounded-lg hover:brightness-110 whitespace-nowrap font-medium shadow-md shadow-emerald-500/30"
                      >
                        Convertir
                      </button>
                      <button
                        onClick={() => handleEditQuote(quote.number)}
                        className="px-3 py-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg hover:bg-slate-800 whitespace-nowrap"
                      >
                        Editar
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