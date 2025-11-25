import { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

export default function SalesReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [selectedReport, setSelectedReport] = useState('sales-summary');
  const [showFilters, setShowFilters] = useState(false);

  const reportTypes = [
    { id: 'sales-summary', name: 'Resumen de Ventas', icon: 'ri-bar-chart-line' },
    { id: 'product-sales', name: 'Ventas por Producto', icon: 'ri-shopping-bag-line' },
    { id: 'customer-sales', name: 'Ventas por Cliente', icon: 'ri-user-line' },
    { id: 'payment-methods', name: 'Métodos de Pago', icon: 'ri-bank-card-line' },
    { id: 'tax-summary', name: 'Resumen de Impuestos', icon: 'ri-file-text-line' },
    { id: 'profit-analysis', name: 'Análisis de Rentabilidad', icon: 'ri-line-chart-line' }
  ];

  const periods = [
    { id: 'today', name: 'Hoy' },
    { id: 'yesterday', name: 'Ayer' },
    { id: 'this-week', name: 'Esta Semana' },
    { id: 'last-week', name: 'Semana Pasada' },
    { id: 'this-month', name: 'Este Mes' },
    { id: 'last-month', name: 'Mes Pasado' },
    { id: 'this-year', name: 'Este Año' },
    { id: 'custom', name: 'Personalizado' }
  ];

  const salesSummary = {
    totalSales: 'RD$ 185,450',
    totalInvoices: 67,
    averageTicket: 'RD$ 2,768',
    totalTax: 'RD$ 33,381',
    netSales: 'RD$ 152,069',
    grossProfit: 'RD$ 45,621',
    profitMargin: '30.0%'
  };

  const topProducts = [
    { name: 'Laptop Dell Inspiron 15', quantity: 8, revenue: 'RD$ 280,000', margin: '22%' },
    { name: 'Monitor Samsung 24"', quantity: 15, revenue: 'RD$ 150,000', margin: '18%' },
    { name: 'Impresora HP LaserJet', quantity: 6, revenue: 'RD$ 108,000', margin: '25%' },
    { name: 'Teclado Mecánico RGB', quantity: 25, revenue: 'RD$ 75,000', margin: '35%' },
    { name: 'Mouse Inalámbrico', quantity: 40, revenue: 'RD$ 40,000', margin: '40%' }
  ];

  const topCustomers = [
    { name: 'Empresa ABC SRL', invoices: 12, revenue: 'RD$ 450,000', lastPurchase: '15/01/2024' },
    { name: 'Comercial XYZ EIRL', invoices: 8, revenue: 'RD$ 320,000', lastPurchase: '14/01/2024' },
    { name: 'Distribuidora DEF SA', invoices: 15, revenue: 'RD$ 780,000', lastPurchase: '15/01/2024' },
    { name: 'Servicios GHI SRL', invoices: 6, revenue: 'RD$ 180,000', lastPurchase: '13/01/2024' },
    { name: 'Tecnología JKL SA', invoices: 10, revenue: 'RD$ 520,000', lastPurchase: '15/01/2024' }
  ];

  const paymentMethods = [
    { method: 'Efectivo', amount: 'RD$ 75,200', percentage: '40.6%', transactions: 28 },
    { method: 'Tarjeta de Crédito', amount: 'RD$ 65,150', percentage: '35.1%', transactions: 22 },
    { method: 'Transferencia', amount: 'RD$ 35,100', percentage: '18.9%', transactions: 12 },
    { method: 'Cheque', amount: 'RD$ 10,000', percentage: '5.4%', transactions: 5 }
  ];

  const handleGenerateReport = () => {
    alert(`Generando reporte: ${reportTypes.find(r => r.id === selectedReport)?.name} para el período: ${periods.find(p => p.id === selectedPeriod)?.name}`);
  };

  const handleExportReport = (format: string) => {
    alert(`Exportando reporte en formato ${format.toUpperCase()}`);
  };

  const handlePrintReport = () => {
    alert('Imprimiendo reporte...');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Reportes de Ventas</h1>
            <p className="text-sm text-slate-400">Análisis detallado de ventas y rendimiento</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-purple-500/70 transition-colors whitespace-nowrap text-sm"
            >
              <i className="ri-filter-line mr-2"></i>
              Filtros
            </button>
            <button
              onClick={handleGenerateReport}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-sky-400 text-slate-950 hover:brightness-110 transition-colors whitespace-nowrap font-semibold shadow-md shadow-sky-500/40 text-sm"
            >
              <i className="ri-refresh-line mr-2"></i>
              Generar Reporte
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-950/60 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Tipo de Reporte</label>
                <select
                  value={selectedReport}
                  onChange={(e) => setSelectedReport(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70 pr-8"
                >
                  {reportTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Período</label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70 pr-8"
                >
                  {periods.map((period) => (
                    <option key={period.id} value={period.id}>{period.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Acciones</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleExportReport('pdf')}
                    className="flex-1 px-3 py-2 rounded-xl bg-red-600 text-white hover:bg-red-500 transition-colors text-xs sm:text-sm whitespace-nowrap shadow-md shadow-red-600/40"
                  >
                    <i className="ri-file-pdf-line mr-1"></i>
                    PDF
                  </button>
                  <button
                    onClick={() => handleExportReport('excel')}
                    className="flex-1 px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors text-xs sm:text-sm whitespace-nowrap shadow-md shadow-emerald-600/40"
                  >
                    <i className="ri-file-excel-line mr-1"></i>
                    Excel
                  </button>
                  <button
                    onClick={handlePrintReport}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-800 text-slate-100 hover:bg-slate-700 transition-colors text-xs sm:text-sm whitespace-nowrap"
                  >
                    <i className="ri-printer-line mr-1"></i>
                    Imprimir
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sales Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-950/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Ventas Totales</p>
                <p className="text-2xl font-bold text-slate-50 mt-1">{salesSummary.totalSales}</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-500/20 border border-blue-400/40">
                <i className="ri-money-dollar-circle-line text-xl text-blue-300"></i>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-emerald-400">+12.5%</span>
              <span className="text-sm text-slate-400 ml-1">vs período anterior</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-950/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Facturas Emitidas</p>
                <p className="text-2xl font-bold text-slate-50 mt-1">{salesSummary.totalInvoices}</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-emerald-500/20 border border-emerald-400/40">
                <i className="ri-file-text-line text-xl text-emerald-300"></i>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-emerald-400">+8.2%</span>
              <span className="text-sm text-slate-400 ml-1">vs período anterior</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-950/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Ticket Promedio</p>
                <p className="text-2xl font-bold text-slate-50 mt-1">{salesSummary.averageTicket}</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-purple-500/20 border border-purple-500/50">
                <i className="ri-calculator-line text-xl text-purple-300"></i>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-emerald-400">+5.1%</span>
              <span className="text-sm text-slate-400 ml-1">vs período anterior</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-950/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Margen de Ganancia</p>
                <p className="text-2xl font-bold text-slate-50 mt-1">{salesSummary.profitMargin}</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-orange-500/20 border border-orange-400/50">
                <i className="ri-line-chart-line text-xl text-orange-300"></i>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-emerald-400">+2.3%</span>
              <span className="text-sm text-slate-400 ml-1">vs período anterior</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-950/60">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-slate-50">Productos Más Vendidos</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                        <span className="text-sm font-bold text-blue-300">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-50">{product.name}</p>
                        <p className="text-sm text-slate-400">Vendidos: {product.quantity} unidades</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-400">{product.revenue}</p>
                      <p className="text-sm text-slate-400">Margen: {product.margin}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Customers */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-950/60">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-slate-50">Mejores Clientes</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topCustomers.map((customer, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3">
                        <span className="text-sm font-bold text-emerald-300">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-50">{customer.name}</p>
                        <p className="text-sm text-slate-400">{customer.invoices} facturas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-400">{customer.revenue}</p>
                      <p className="text-sm text-slate-400">{customer.lastPurchase}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-950/60">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-lg font-semibold text-slate-50">Métodos de Pago</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {paymentMethods.map((method, index) => (
                <div key={index} className="text-center rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm shadow-slate-950/60">
                  <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4 border border-blue-400/40">
                    <i className="ri-bank-card-line text-2xl text-blue-300"></i>
                  </div>
                  <h4 className="font-semibold text-slate-50 mb-2">{method.method}</h4>
                  <p className="text-2xl font-bold text-emerald-400 mb-1">{method.amount}</p>
                  <p className="text-sm text-slate-400 mb-1">{method.percentage} del total</p>
                  <p className="text-xs text-slate-500">{method.transactions} transacciones</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}