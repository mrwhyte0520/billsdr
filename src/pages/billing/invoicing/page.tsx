import { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

const initialInvoices = [
    {
      id: 'FAC-2024-189',
      customer: 'Empresa ABC SRL',
      customerEmail: 'contacto@empresaabc.com',
      amount: 45000,
      tax: 8100,
      total: 53100,
      status: 'paid',
      date: '2024-01-15',
      dueDate: '2024-02-14',
      items: [
        { description: 'Laptop Dell Inspiron 15', quantity: 1, price: 35000, total: 35000 },
        { description: 'Mouse Inalámbrico', quantity: 2, price: 5000, total: 10000 }
      ]
    },
    {
      id: 'FAC-2024-188',
      customer: 'Comercial XYZ EIRL',
      customerEmail: 'ventas@comercialxyz.com',
      amount: 32500,
      tax: 5850,
      total: 38350,
      status: 'pending',
      date: '2024-01-15',
      dueDate: '2024-02-14',
      items: [
        { description: 'Monitor Samsung 24"', quantity: 2, price: 12500, total: 25000 },
        { description: 'Teclado Mecánico', quantity: 1, price: 7500, total: 7500 }
      ]
    },
    {
      id: 'FAC-2024-187',
      customer: 'Distribuidora DEF SA',
      customerEmail: 'compras@distribuidoradef.com',
      amount: 78000,
      tax: 14040,
      total: 92040,
      status: 'paid',
      date: '2024-01-14',
      dueDate: '2024-02-13',
      items: [
        { description: 'Impresora HP LaserJet', quantity: 3, price: 18000, total: 54000 },
        { description: 'Papel A4 (Resma)', quantity: 20, price: 1200, total: 24000 }
      ]
    },
    {
      id: 'FAC-2024-186',
      customer: 'Servicios GHI SRL',
      customerEmail: 'admin@serviciosghi.com',
      amount: 25000,
      tax: 4500,
      total: 29500,
      status: 'overdue',
      date: '2024-01-13',
      dueDate: '2024-01-28',
      items: [
        { description: 'Servicio de Mantenimiento', quantity: 1, price: 25000, total: 25000 }
      ]
    },
    {
      id: 'FAC-2024-185',
      customer: 'Tecnología JKL SA',
      customerEmail: 'info@tecnologiajkl.com',
      amount: 156000,
      tax: 28080,
      total: 184080,
      status: 'draft',
      date: '2024-01-15',
      dueDate: '2024-02-14',
      items: [
        { description: 'Servidor Dell PowerEdge', quantity: 1, price: 120000, total: 120000 },
        { description: 'Switch de Red 24 puertos', quantity: 2, price: 18000, total: 36000 }
      ]
    }
  ];

export default function InvoicingPage() {
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<any | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [invoices, setInvoices] = useState(initialInvoices);
  const [formCustomerId, setFormCustomerId] = useState('');
  const [formDueDate, setFormDueDate] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const customers = [
    { id: '1', name: 'Empresa ABC SRL', email: 'contacto@empresaabc.com', phone: '809-555-0101' },
    { id: '2', name: 'Comercial XYZ EIRL', email: 'ventas@comercialxyz.com', phone: '809-555-0102' },
    { id: '3', name: 'Distribuidora DEF SA', email: 'compras@distribuidoradef.com', phone: '809-555-0103' },
    { id: '4', name: 'Servicios GHI SRL', email: 'admin@serviciosghi.com', phone: '809-555-0104' },
    { id: '5', name: 'Tecnología JKL SA', email: 'info@tecnologiajkl.com', phone: '809-555-0105' }
  ];

  const products = [
    { id: '1', name: 'Laptop Dell Inspiron 15', price: 35000, stock: 25 },
    { id: '2', name: 'Monitor Samsung 24"', price: 12500, stock: 45 },
    { id: '3', name: 'Impresora HP LaserJet', price: 18000, stock: 18 },
    { id: '4', name: 'Teclado Mecánico RGB', price: 7500, stock: 67 },
    { id: '5', name: 'Mouse Inalámbrico', price: 5000, stock: 120 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-950/60 text-emerald-200 border border-emerald-500/50';
      case 'pending': return 'bg-amber-950/60 text-amber-200 border border-amber-500/50';
      case 'overdue': return 'bg-rose-950/60 text-rose-200 border border-rose-500/50';
      case 'draft': return 'bg-slate-900/80 text-slate-200 border border-slate-700';
      default: return 'bg-slate-900/80 text-slate-200 border border-slate-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Pagada';
      case 'pending': return 'Pendiente';
      case 'overdue': return 'Vencida';
      case 'draft': return 'Borrador';
      default: return 'Desconocido';
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateInvoice = () => {
    setEditingInvoice(null);
    setFormCustomerId('');
    setFormDueDate('');
    setFormNotes('');
    setShowNewInvoiceModal(true);
  };

  const handleViewInvoice = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      setViewInvoice(invoice);
    }
  };

  const handleEditInvoice = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;

    setEditingInvoice(invoice);

    const customerMatch = customers.find(c => c.name === invoice.customer || c.email === invoice.customerEmail);
    setFormCustomerId(customerMatch ? customerMatch.id : '');
    setFormDueDate(invoice.dueDate || '');
    setFormNotes('');

    setShowNewInvoiceModal(true);
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    if (confirm(`¿Está seguro de eliminar la factura ${invoiceId}?`)) {
      setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
      setViewInvoice((prev: any | null) => (prev?.id === invoiceId ? null : prev));
      alert(`Factura ${invoiceId} eliminada`);
    }
  };

  const handlePrintInvoice = (invoiceId: string) => {
    alert(`Imprimiendo factura: ${invoiceId}`);
  };

  const handleMarkAsPaid = (invoiceId: string) => {
    if (confirm(`¿Marcar factura ${invoiceId} como pagada?`)) {
      setInvoices(prev => prev.map(inv =>
        inv.id === invoiceId ? { ...inv, status: 'paid' } : inv
      ));
      alert(`Factura ${invoiceId} marcada como pagada`);
    }
  };

  const handleDuplicateInvoice = (invoiceId: string) => {
    const original = invoices.find(inv => inv.id === invoiceId);
    if (!original) return;

    const copyNumber = invoices.filter(inv => inv.id.startsWith(`${invoiceId}-COPIA`)).length + 1;
    const newId = `${invoiceId}-COPIA-${copyNumber}`;

    const duplicate = {
      ...original,
      id: newId,
      status: 'draft' as const,
      date: new Date().toISOString().split('T')[0],
    };

    setInvoices(prev => [...prev, duplicate]);
    alert(`Factura duplicada como ${newId}`);
  };

  const handleSaveDraft = () => {
    if (editingInvoice) {
      const customer = customers.find(c => c.id === formCustomerId);
      setInvoices(prev => prev.map(inv =>
        inv.id === editingInvoice.id
          ? {
              ...inv,
              customer: customer ? customer.name : inv.customer,
              customerEmail: customer ? customer.email : inv.customerEmail,
              dueDate: formDueDate || inv.dueDate,
            }
          : inv
      ));
      alert(`Factura ${editingInvoice.id} actualizada como borrador`);
    } else {
      alert('Guardando factura como borrador...');
    }

    setShowNewInvoiceModal(false);
    setEditingInvoice(null);
  };

  const handleCreateOrUpdateInvoice = () => {
    if (editingInvoice) {
      const customer = customers.find(c => c.id === formCustomerId);
      setInvoices(prev => prev.map(inv =>
        inv.id === editingInvoice.id
          ? {
              ...inv,
              customer: customer ? customer.name : inv.customer,
              customerEmail: customer ? customer.email : inv.customerEmail,
              dueDate: formDueDate || inv.dueDate,
            }
          : inv
      ));
      alert(`Factura ${editingInvoice.id} actualizada correctamente`);
    } else {
      alert('Creando y enviando factura...');
    }

    setShowNewInvoiceModal(false);
    setEditingInvoice(null);
  };

  const handleExportInvoices = (format: string) => {
    if (format === 'pdf') {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('No se pudo abrir la ventana de impresión. Verifique los bloqueadores de ventanas emergentes.');
        return;
      }

      const rowsHtml = filteredInvoices
        .map(inv => `
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 12px;">${inv.id}</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 12px;">${inv.customer}</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 12px;">${new Date(inv.date).toLocaleDateString('es-DO')}</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 12px;">${new Date(inv.dueDate).toLocaleDateString('es-DO')}</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 12px;">RD$ ${inv.total.toLocaleString()}</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 12px; text-transform: capitalize;">${inv.status}</td>
          </tr>
        `)
        .join('');

      printWindow.document.write(`
        <html>
          <head>
            <meta charSet="utf-8" />
            <title>Listado de Facturas</title>
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
            <h1>Listado de Facturas</h1>
            <p>Generado el ${new Date().toLocaleString('es-DO')}</p>
            <table>
              <thead>
                <tr>
                  <th>No. Factura</th>
                  <th>Cliente</th>
                  <th>Emisión</th>
                  <th>Vencimiento</th>
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
      return;
    }

    if (format === 'excel') {
      const header = [
        'No. Factura',
        'Cliente',
        'Email',
        'Emisión',
        'Vencimiento',
        'Monto',
        'ITBIS',
        'Total',
        'Estado',
      ];

      const rows = filteredInvoices.map(inv => [
        inv.id,
        inv.customer,
        inv.customerEmail,
        new Date(inv.date).toLocaleDateString('es-DO'),
        new Date(inv.dueDate).toLocaleDateString('es-DO'),
        inv.amount.toString(),
        inv.tax.toString(),
        inv.total.toString(),
        inv.status,
      ]);

      // Construir CSV con separador ";" (más amigable para Excel en configuración regional ES)
      const csvBody = [header, ...rows]
        .map(row => row
          .map(value => {
            const safe = String(value ?? '').trim();
            if (safe.includes(';') || safe.includes('"') || safe.includes('\n')) {
              return '"' + safe.replace(/"/g, '""') + '"';
            }
            return safe;
          })
          .join(';')
        )
        .join('\r\n');

      // Añadir BOM para que Excel detecte correctamente UTF-8 y acentos
      const BOM = "\uFEFF";
      const csvContent = BOM + csvBody;

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `facturas_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return;
    }

    alert(`Exportando facturas en formato ${format.toUpperCase()}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Facturación</h1>
            <p className="text-sm text-slate-400">Gestión completa de facturas y documentos fiscales</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => handleExportInvoices('pdf')}
              className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-500 transition-colors whitespace-nowrap shadow-md shadow-red-600/40 text-sm"
            >
              <i className="ri-file-pdf-line mr-2"></i>
              Exportar PDF
            </button>
            <button
              onClick={() => handleExportInvoices('excel')}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors whitespace-nowrap shadow-md shadow-emerald-600/40 text-sm"
            >
              <i className="ri-file-excel-line mr-2"></i>
              Exportar Excel
            </button>
            <button
              onClick={handleCreateInvoice}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-sky-400 text-slate-950 hover:brightness-110 transition-colors whitespace-nowrap font-semibold shadow-md shadow-purple-500/40 text-sm"
            >
              <i className="ri-add-line mr-2"></i>
              Nueva Factura
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-950/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Facturas</p>
                <p className="text-2xl font-bold text-slate-50 mt-1">{invoices.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-500/20 border border-blue-400/40">
                <i className="ri-file-text-line text-xl text-blue-300"></i>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-950/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Facturas Pagadas</p>
                <p className="text-2xl font-bold text-slate-50 mt-1">
                  {invoices.filter(inv => inv.status === 'paid').length}
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
                <p className="text-sm font-medium text-slate-400">Facturas Pendientes</p>
                <p className="text-2xl font-bold text-slate-50 mt-1">
                  {invoices.filter(inv => inv.status === 'pending').length}
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
                <p className="text-sm font-medium text-slate-400">Facturas Vencidas</p>
                <p className="text-2xl font-bold text-slate-50 mt-1">
                  {invoices.filter(inv => inv.status === 'overdue').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-rose-500/20 border border-rose-400/50">
                <i className="ri-alert-line text-xl text-rose-300"></i>
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
                  placeholder="Buscar por cliente o número de factura..."
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
                className="w-full px-3 py-2 rounded-xl bg-transparent border border-slate-700 text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70 pr-8"
              >
                <option value="all">Todos los estados</option>
                <option value="paid">Pagadas</option>
                <option value="pending">Pendientes</option>
                <option value="overdue">Vencidas</option>
                <option value="draft">Borradores</option>
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

        {/* Invoices Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-950/60 overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-lg font-semibold text-slate-50">
              Facturas ({filteredInvoices.length})
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
                    Vencimiento
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
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{invoice.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-100">{invoice.customer}</div>
                      <div className="text-sm text-slate-400">{invoice.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                      {new Date(invoice.date).toLocaleDateString('es-DO')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                      {new Date(invoice.dueDate).toLocaleDateString('es-DO')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-50">
                      RD$ {invoice.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                        {getStatusText(invoice.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewInvoice(invoice.id)}
                          className="text-sky-300 hover:text-sky-100 p-1"
                          title="Ver factura"
                        >
                          <i className="ri-eye-line"></i>
                        </button>
                        <button
                          onClick={() => handleEditInvoice(invoice.id)}
                          className="text-emerald-300 hover:text-emerald-100 p-1"
                          title="Editar factura"
                        >
                          <i className="ri-edit-line"></i>
                        </button>
                        <button
                          onClick={() => handlePrintInvoice(invoice.id)}
                          className="text-slate-400 hover:text-slate-100 p-1"
                          title="Imprimir factura"
                        >
                          <i className="ri-printer-line"></i>
                        </button>
                        {invoice.status === 'pending' && (
                          <button
                            onClick={() => handleMarkAsPaid(invoice.id)}
                            className="text-emerald-300 hover:text-emerald-100 p-1"
                            title="Marcar como pagada"
                          >
                            <i className="ri-check-line"></i>
                          </button>
                        )}
                        <button
                          onClick={() => handleDuplicateInvoice(invoice.id)}
                          className="text-amber-300 hover:text-amber-100 p-1"
                          title="Duplicar factura"
                        >
                          <i className="ri-file-copy-line"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          className="text-rose-300 hover:text-rose-100 p-1"
                          title="Eliminar factura"
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

        {/* New Invoice Modal (crear / editar) */}
        {showNewInvoiceModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl shadow-slate-950/80 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-50">
                  {editingInvoice ? `Editar Factura - ${editingInvoice.id}` : 'Nueva Factura'}
                </h3>
                <button
                  onClick={() => {
                    setShowNewInvoiceModal(false);
                    setEditingInvoice(null);
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
                    <select
                      value={formCustomerId}
                      onChange={(e) => setFormCustomerId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-transparent border border-slate-700 text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70 pr-8"
                    >
                      <option value="">Seleccionar cliente...</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>{customer.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Fecha de Vencimiento</label>
                    <input
                      type="date"
                      value={formDueDate}
                      onChange={(e) => setFormDueDate(e.target.value)}
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
                            <select className="w-full px-2 py-1 rounded-lg bg-transparent border border-slate-700 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70 pr-8">
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
                    <label className="block text-sm font-medium text-slate-200 mb-2">Notas</label>
                    <textarea
                      rows={4}
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-transparent border border-slate-700 text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70"
                      placeholder="Notas adicionales..."
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
                    setShowNewInvoiceModal(false);
                    setEditingInvoice(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900/80 text-slate-200 hover:bg-slate-800 border border-slate-700 transition-colors whitespace-nowrap text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveDraft}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors whitespace-nowrap text-sm font-semibold shadow-md shadow-amber-500/40"
                >
                  {editingInvoice ? 'Actualizar como Borrador' : 'Guardar Borrador'}
                </button>
                <button
                  onClick={handleCreateOrUpdateInvoice}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-sky-400 text-slate-950 hover:brightness-110 transition-colors whitespace-nowrap text-sm font-semibold shadow-md shadow-purple-500/40"
                >
                  {editingInvoice ? 'Actualizar Factura' : 'Crear Factura'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Invoice Modal */}
        {viewInvoice && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl shadow-slate-950/80 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-50">Detalle de Factura - {viewInvoice.id}</h3>
                <button
                  onClick={() => setViewInvoice(null)}
                  className="text-slate-400 hover:text-slate-100"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Cliente</p>
                    <p className="text-sm text-slate-100">{viewInvoice.customer}</p>
                    <p className="text-xs text-slate-400">{viewInvoice.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-400">Fechas</p>
                    <p className="text-xs text-slate-300">Emisión: {new Date(viewInvoice.date).toLocaleDateString('es-DO')}</p>
                    <p className="text-xs text-slate-300">Vencimiento: {new Date(viewInvoice.dueDate).toLocaleDateString('es-DO')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-400">Estado</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(viewInvoice.status)}`}>
                      {getStatusText(viewInvoice.status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-400">Totales</p>
                    <p className="text-xs text-slate-300">Monto: RD$ {viewInvoice.amount.toLocaleString()}</p>
                    <p className="text-xs text-slate-300">ITBIS: RD$ {viewInvoice.tax.toLocaleString()}</p>
                    <p className="text-sm font-semibold text-emerald-400 mt-1">Total: RD$ {viewInvoice.total.toLocaleString()}</p>
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
                        {viewInvoice.items.map((item: any, idx: number) => (
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