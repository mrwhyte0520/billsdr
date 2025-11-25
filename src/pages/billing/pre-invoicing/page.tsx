import { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

export default function PreInvoicingPage() {
  const [showNewQuoteModal, setShowNewQuoteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewQuote, setViewQuote] = useState<any | null>(null);
  const [editingQuote, setEditingQuote] = useState<any | null>(null);

  const initialQuotes = [
    {
      id: 'COT-2024-045',
      customer: 'Nuevo Cliente SA',
      customerEmail: 'contacto@nuevocliente.com',
      amount: 125000,
      tax: 22500,
      total: 147500,
      status: 'pending',
      date: '2024-01-15',
      validUntil: '2024-01-25',
      items: [
        { description: 'Servidor Dell PowerEdge R740', quantity: 1, price: 85000, total: 85000 },
        { description: 'Licencias Windows Server', quantity: 2, price: 20000, total: 40000 }
      ]
    },
    {
      id: 'COT-2024-044',
      customer: 'Empresa Potencial SRL',
      customerEmail: 'compras@empresapotencial.com',
      amount: 89000,
      tax: 16020,
      total: 105020,
      status: 'under_review',
      date: '2024-01-14',
      validUntil: '2024-01-22',
      items: [
        { description: 'Sistema de Videoconferencia', quantity: 1, price: 65000, total: 65000 },
        { description: 'Instalación y Configuración', quantity: 1, price: 24000, total: 24000 }
      ]
    },
    {
      id: 'COT-2024-043',
      customer: 'Comercial ABC EIRL',
      customerEmail: 'ventas@comercialabc.com',
      amount: 45000,
      tax: 8100,
      total: 53100,
      status: 'approved',
      date: '2024-01-13',
      validUntil: '2024-01-20',
      items: [
        { description: 'Laptops HP EliteBook', quantity: 3, price: 15000, total: 45000 }
      ]
    },
    {
      id: 'COT-2024-042',
      customer: 'Servicios XYZ SA',
      customerEmail: 'admin@serviciosxyz.com',
      amount: 78000,
      tax: 14040,
      total: 92040,
      status: 'rejected',
      date: '2024-01-12',
      validUntil: '2024-01-19',
      items: [
        { description: 'Software de Gestión Empresarial', quantity: 1, price: 78000, total: 78000 }
      ]
    },
    {
      id: 'COT-2024-041',
      customer: 'Distribuidora DEF SA',
      customerEmail: 'compras@distribuidoradef.com',
      amount: 156000,
      tax: 28080,
      total: 184080,
      status: 'expired',
      date: '2024-01-10',
      validUntil: '2024-01-17',
      items: [
        { description: 'Equipos de Red Cisco', quantity: 5, price: 25000, total: 125000 },
        { description: 'Servicios de Implementación', quantity: 1, price: 31000, total: 31000 }
      ]
    }
  ];

  const [quotes, setQuotes] = useState(initialQuotes);

  const customers = [
    { id: '1', name: 'Nuevo Cliente SA', email: 'contacto@nuevocliente.com', phone: '809-555-0201' },
    { id: '2', name: 'Empresa Potencial SRL', email: 'compras@empresapotencial.com', phone: '809-555-0202' },
    { id: '3', name: 'Comercial ABC EIRL', email: 'ventas@comercialabc.com', phone: '809-555-0203' },
    { id: '4', name: 'Servicios XYZ SA', email: 'admin@serviciosxyz.com', phone: '809-555-0204' },
    { id: '5', name: 'Distribuidora DEF SA', email: 'compras@distribuidoradef.com', phone: '809-555-0205' }
  ];

  const products = [
    { id: '1', name: 'Servidor Dell PowerEdge R740', price: 85000, stock: 5 },
    { id: '2', name: 'Sistema de Videoconferencia', price: 65000, stock: 8 },
    { id: '3', name: 'Laptops HP EliteBook', price: 15000, stock: 25 },
    { id: '4', name: 'Software de Gestión Empresarial', price: 78000, stock: 1 },
    { id: '5', name: 'Equipos de Red Cisco', price: 25000, stock: 12 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-950/60 text-amber-200 border border-amber-500/50';
      case 'under_review': return 'bg-sky-950/60 text-sky-200 border border-sky-500/50';
      case 'approved': return 'bg-emerald-950/60 text-emerald-200 border border-emerald-500/50';
      case 'rejected': return 'bg-rose-950/60 text-rose-200 border border-rose-500/50';
      case 'expired': return 'bg-slate-900/80 text-slate-200 border border-slate-700';
      default: return 'bg-slate-900/80 text-slate-200 border border-slate-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'under_review': return 'En Revisión';
      case 'approved': return 'Aprobada';
      case 'rejected': return 'Rechazada';
      case 'expired': return 'Expirada';
      default: return 'Desconocido';
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateQuote = () => {
    setEditingQuote(null);
    setShowNewQuoteModal(true);
  };

  const handleViewQuote = (quoteId: string) => {
    const quote = filteredQuotes.find(q => q.id === quoteId) || quotes.find(q => q.id === quoteId);
    if (quote) {
      setViewQuote(quote);
    }
  };

  const handleEditQuote = (quoteId: string) => {
    const quote = filteredQuotes.find(q => q.id === quoteId) || quotes.find(q => q.id === quoteId);
    if (!quote) return;

    setEditingQuote(quote);
    setShowNewQuoteModal(true);
  };

  const handleDeleteQuote = (quoteId: string) => {
    if (confirm(`¿Está seguro de eliminar la cotización ${quoteId}?`)) {
      alert(`Cotización ${quoteId} eliminada`);
    }
  };

  const handlePrintQuote = (quoteId: string) => {
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('No se pudo abrir la ventana de impresión. Verifique los bloqueadores de ventanas emergentes.');
      return;
    }

    const itemsHtml = quote.items
      .map(item => `
        <tr>
          <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 12px;">${item.description}</td>
          <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 12px; text-align: right;">${item.quantity}</td>
          <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 12px; text-align: right;">RD$ ${item.price.toLocaleString()}</td>
          <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 12px; text-align: right;">RD$ ${item.total.toLocaleString()}</td>
        </tr>
      `)
      .join('');

    printWindow.document.write(`
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>Cotización ${quote.id}</title>
          <style>
            body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 24px; }
            h1 { font-size: 22px; margin-bottom: 4px; }
            h2 { font-size: 16px; margin: 16px 0 8px; }
            p { font-size: 12px; color: #4b5563; margin: 0 0 4px; }
            table { border-collapse: collapse; width: 100%; margin-top: 12px; }
            thead { background-color: #f3f4f6; }
            th { padding: 8px; border: 1px solid #e5e7eb; font-size: 12px; text-align: left; }
          </style>
        </head>
        <body>
          <h1>Cotización ${quote.id}</h1>
          <p>Generado el ${new Date().toLocaleString('es-DO')}</p>

          <h2>Cliente</h2>
          <p><strong>${quote.customer}</strong></p>
          <p>${quote.customerEmail}</p>

          <h2>Fechas</h2>
          <p>Emisión: ${new Date(quote.date).toLocaleDateString('es-DO')}</p>
          <p>Válida hasta: ${new Date(quote.validUntil).toLocaleDateString('es-DO')}</p>

          <h2>Resumen</h2>
          <p>Monto: RD$ ${quote.amount.toLocaleString()}</p>
          <p>ITBIS: RD$ ${quote.tax.toLocaleString()}</p>
          <p><strong>Total: RD$ ${quote.total.toLocaleString()}</strong></p>

          <h2>Productos/Servicios</h2>
          <table>
            <thead>
              <tr>
                <th>Descripción</th>
                <th style="text-align: right;">Cantidad</th>
                <th style="text-align: right;">Precio</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleConvertToInvoice = (quoteId: string) => {
    if (confirm(`¿Convertir cotización ${quoteId} en factura?`)) {
      setQuotes(prev => prev.filter(q => q.id !== quoteId));
      alert(`Cotización ${quoteId} convertida en factura (simulado). Ya no aparece en Pre-facturación.`);
    }
  };

  const handleDuplicateQuote = (quoteId: string) => {
    alert(`Duplicando cotización: ${quoteId}`);
  };

  const handleApproveQuote = (quoteId: string) => {
    if (confirm(`¿Aprobar cotización ${quoteId}?`)) {
      alert(`Cotización ${quoteId} aprobada`);
    }
  };

  const handleRejectQuote = (quoteId: string) => {
    if (confirm(`¿Rechazar cotización ${quoteId}?`)) {
      alert(`Cotización ${quoteId} rechazada`);
    }
  };

  const handleExportQuotesToPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('No se pudo abrir la ventana de impresión. Verifique los bloqueadores de ventanas emergentes.');
      return;
    }

    const rowsHtml = filteredQuotes
      .map(quote => `
        <tr>
          <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 12px;">${quote.id}</td>
          <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 12px;">${quote.customer}</td>
          <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 12px;">${new Date(quote.date).toLocaleDateString('es-DO')}</td>
          <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 12px;">${new Date(quote.validUntil).toLocaleDateString('es-DO')}</td>
          <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 12px;">RD$ ${quote.total.toLocaleString()}</td>
          <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 12px; text-transform: capitalize;">${getStatusText(quote.status)}</td>
        </tr>
      `)
      .join('');

    printWindow.document.write(`
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>Listado de Cotizaciones</title>
          <style>
            body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 24px; }
            h1 { font-size: 20px; margin-bottom: 4px; }
            p { font-size: 12px; color: #6b7280; margin-bottom: 16px; }
            table { border-collapse: collapse; width: 100%; }
            thead { background-color: #f3f4f6; }
            th { padding: 8px; border: 1px solid #e5e7eb; font-size: 12px; text-align: left; }
          </style>
        </head>
        <body>
          <h1>Listado de Cotizaciones</h1>
          <p>Generado el ${new Date().toLocaleString('es-DO')}</p>
          <table>
            <thead>
              <tr>
                <th>No. Cotización</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Válida Hasta</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Pre-facturación</h1>
            <p className="text-sm text-slate-400 mt-1">Gestión de cotizaciones y presupuestos</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleExportQuotesToPDF}
              className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-500 transition-colors whitespace-nowrap shadow-md shadow-red-600/40 text-sm"
            >
              <i className="ri-file-pdf-line mr-2"></i>
              Exportar PDF
            </button>
            <button
              onClick={handleCreateQuote}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-sky-400 text-slate-950 hover:brightness-110 transition-colors whitespace-nowrap font-semibold shadow-md shadow-purple-500/40 text-sm"
            >
              <i className="ri-add-line mr-2"></i>
              Nueva Cotización
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-950/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Cotizaciones</p>
                <p className="text-2xl font-bold text-slate-50 mt-1">{quotes.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-500/20 border border-blue-400/40">
                <i className="ri-file-list-line text-xl text-blue-300"></i>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-950/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Pendientes</p>
                <p className="text-2xl font-bold text-slate-50 mt-1">
                  {quotes.filter(q => q.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-amber-500/20 border border-amber-400/40">
                <i className="ri-time-line text-xl text-amber-300"></i>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-950/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Aprobadas</p>
                <p className="text-2xl font-bold text-slate-50 mt-1">
                  {quotes.filter(q => q.status === 'approved').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-emerald-500/20 border border-emerald-400/40">
                <i className="ri-check-line text-xl text-emerald-300"></i>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-950/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">En Revisión</p>
                <p className="text-2xl font-bold text-slate-50 mt-1">
                  {quotes.filter(q => q.status === 'under_review').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-sky-500/20 border border-sky-400/40">
                <i className="ri-search-line text-xl text-sky-300"></i>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-950/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Expiradas</p>
                <p className="text-2xl font-bold text-slate-50 mt-1">
                  {quotes.filter(q => q.status === 'expired').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-slate-500/20 border border-slate-400/40">
                <i className="ri-calendar-line text-xl text-slate-300"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-950/60 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Buscar</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por cliente o número de cotización..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-transparent border border-slate-700 text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70"
                />
                <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500"></i>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Estado</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70 pr-8"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="under_review">En Revisión</option>
                <option value="approved">Aprobadas</option>
                <option value="rejected">Rechazadas</option>
                <option value="expired">Expiradas</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="w-full px-4 py-2 rounded-xl bg-slate-900/80 text-slate-200 hover:bg-slate-800 transition-colors whitespace-nowrap border border-slate-700 text-sm"
              >
                <i className="ri-refresh-line mr-2"></i>
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Quotes Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-950/60 overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-lg font-semibold text-slate-50">
              Cotizaciones ({filteredQuotes.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-slate-800">
              <thead className="bg-slate-900/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Número
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Válida Hasta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-950 divide-y divide-slate-800">
                {filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-slate-900/60">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-50">{quote.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-100">{quote.customer}</div>
                      <div className="text-sm text-slate-400">{quote.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                      {new Date(quote.date).toLocaleDateString('es-DO')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                      {new Date(quote.validUntil).toLocaleDateString('es-DO')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-50">
                      RD$ {quote.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(quote.status)}`}>
                        {getStatusText(quote.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewQuote(quote.id)}
                          className="text-sky-300 hover:text-sky-100 p-1"
                          title="Ver cotización"
                        >
                          <i className="ri-eye-line"></i>
                        </button>
                        <button
                          onClick={() => handleEditQuote(quote.id)}
                          className="text-emerald-300 hover:text-emerald-100 p-1"
                          title="Editar cotización"
                        >
                          <i className="ri-edit-line"></i>
                        </button>
                        <button
                          onClick={() => handlePrintQuote(quote.id)}
                          className="text-slate-400 hover:text-slate-100 p-1"
                          title="Imprimir cotización"
                        >
                          <i className="ri-printer-line"></i>
                        </button>
                        {quote.status === 'approved' && (
                          <button
                            onClick={() => handleConvertToInvoice(quote.id)}
                            className="text-emerald-300 hover:text-emerald-100 p-1"
                            title="Convertir a factura"
                          >
                            <i className="ri-file-transfer-line"></i>
                          </button>
                        )}
                        {quote.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproveQuote(quote.id)}
                              className="text-emerald-300 hover:text-emerald-100 p-1"
                              title="Aprobar cotización"
                            >
                              <i className="ri-check-line"></i>
                            </button>
                            <button
                              onClick={() => handleRejectQuote(quote.id)}
                              className="text-rose-300 hover:text-rose-100 p-1"
                              title="Rechazar cotización"
                            >
                              <i className="ri-close-line"></i>
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDuplicateQuote(quote.id)}
                          className="text-amber-300 hover:text-amber-100 p-1"
                          title="Duplicar cotización"
                        >
                          <i className="ri-file-copy-line"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteQuote(quote.id)}
                          className="text-rose-300 hover:text-rose-100 p-1"
                          title="Eliminar cotización"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Quote Modal (crear / editar) */}
        {showNewQuoteModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl shadow-slate-950/80 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-50">
                  {editingQuote ? `Editar Cotización - ${editingQuote.id}` : 'Nueva Cotización'}
                </h3>
                <button
                  onClick={() => {
                    setShowNewQuoteModal(false);
                    setEditingQuote(null);
                  }}
                  className="text-slate-400 hover:text-slate-100"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Cliente</label>
                    <select className="w-full px-3 py-2 rounded-xl bg-transparent border border-slate-700 text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70 pr-8">
                      <option value="">Seleccionar cliente...</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>{customer.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Válida Hasta</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 rounded-xl bg-transparent border border-slate-700 text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-md font-medium text-slate-50 mb-4">Productos/Servicios</h4>
                  <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/80">
                    <table className="w-full">
                      <thead className="bg-slate-900/80">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Producto</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Cantidad</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Precio</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Total</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-4 py-3">
                            <select className="w-full px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70 pr-8">
                              <option value="">Seleccionar producto...</option>
                              {products.map((product) => (
                                <option key={product.id} value={product.id}>{product.name}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <input type="number" min="1" className="w-full px-2 py-1 rounded-lg bg-transparent border border-slate-700 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70" />
                          </td>
                          <td className="px-4 py-3">
                            <input type="number" className="w-full px-2 py-1 rounded-lg bg-transparent border border-slate-700 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70" />
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-medium text-slate-50">RD$ 0.00</span>
                          </td>
                          <td className="px-4 py-3">
                            <button className="text-rose-300 hover:text-rose-100">
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <button className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors whitespace-nowrap text-sm shadow-md shadow-emerald-600/40">
                    <i className="ri-add-line mr-2"></i>
                    Agregar Producto
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Términos y Condiciones</label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 rounded-xl bg-transparent border border-slate-700 text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70"
                      placeholder="Términos y condiciones de la cotización..."
                    ></textarea>
                  </div>
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Subtotal:</span>
                        <span className="text-sm font-medium text-slate-50">RD$ 0.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">ITBIS (18%):</span>
                        <span className="text-sm font-medium text-slate-50">RD$ 0.00</span>
                      </div>
                      <div className="border-t border-slate-800 pt-2">
                        <div className="flex justify-between">
                          <span className="text-base font-semibold text-slate-50">Total:</span>
                          <span className="text-base font-semibold text-emerald-400">RD$ 0.00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowNewQuoteModal(false);
                    setEditingQuote(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900/80 text-slate-200 hover:bg-slate-800 border border-slate-700 transition-colors whitespace-nowrap text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (editingQuote) {
                      alert(`Actualizando cotización ${editingQuote.id} como borrador...`);
                    } else {
                      alert('Guardando cotización como borrador...');
                    }
                    setShowNewQuoteModal(false);
                    setEditingQuote(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors whitespace-nowrap text-sm font-semibold shadow-md shadow-amber-500/40"
                >
                  {editingQuote ? 'Actualizar como Borrador' : 'Guardar Borrador'}
                </button>
                <button
                  onClick={() => {
                    if (editingQuote) {
                      alert(`Actualizando cotización ${editingQuote.id}...`);
                    } else {
                      alert('Creando y enviando cotización...');
                    }
                    setShowNewQuoteModal(false);
                    setEditingQuote(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-sky-400 text-slate-950 hover:brightness-110 transition-colors whitespace-nowrap text-sm font-semibold shadow-md shadow-purple-500/40"
                >
                  {editingQuote ? 'Actualizar Cotización' : 'Crear Cotización'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Quote Modal */}
        {viewQuote && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl shadow-slate-950/80 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-50">Detalle de Cotización - {viewQuote.id}</h3>
                <button
                  onClick={() => setViewQuote(null)}
                  className="text-slate-400 hover:text-slate-100"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Cliente</p>
                    <p className="text-sm text-slate-100">{viewQuote.customer}</p>
                    <p className="text-xs text-slate-400">{viewQuote.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-400">Fechas</p>
                    <p className="text-xs text-slate-300">Emisión: {new Date(viewQuote.date).toLocaleDateString('es-DO')}</p>
                    <p className="text-xs text-slate-300">Válida hasta: {new Date(viewQuote.validUntil).toLocaleDateString('es-DO')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-400">Estado</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(viewQuote.status)}`}>
                      {getStatusText(viewQuote.status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-400">Totales</p>
                    <p className="text-xs text-slate-300">Monto: RD$ {viewQuote.amount.toLocaleString()}</p>
                    <p className="text-xs text-slate-300">ITBIS: RD$ {viewQuote.tax.toLocaleString()}</p>
                    <p className="text-sm font-semibold text-emerald-400 mt-1">Total: RD$ {viewQuote.total.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-slate-50 mb-2">Productos/Servicios</h4>
                  <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/80">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-900/80 text-slate-400">
                        <tr>
                          <th className="px-4 py-2 text-left">Descripción</th>
                          <th className="px-4 py-2 text-right">Cantidad</th>
                          <th className="px-4 py-2 text-right">Precio</th>
                          <th className="px-4 py-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {viewQuote.items?.map((item: any, idx: number) => (
                          <tr key={idx} className="text-slate-100">
                            <td className="px-4 py-2">{item.description}</td>
                            <td className="px-4 py-2 text-right">{item.quantity}</td>
                            <td className="px-4 py-2 text-right">RD$ {item.price.toLocaleString()}</td>
                            <td className="px-4 py-2 text-right">RD$ {item.total.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}