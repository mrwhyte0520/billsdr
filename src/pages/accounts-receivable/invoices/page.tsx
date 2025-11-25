import { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  balance: number;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
  daysOverdue: number;
}

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Mock data
  const invoices: Invoice[] = [
    {
      id: '1',
      customerId: '1',
      customerName: 'Empresa ABC S.R.L.',
      invoiceNumber: 'FAC-001',
      date: '2024-01-01',
      dueDate: '2024-01-31',
      amount: 100000,
      paidAmount: 50000,
      balance: 50000,
      status: 'partial',
      daysOverdue: 0
    },
    {
      id: '2',
      customerId: '1',
      customerName: 'Empresa ABC S.R.L.',
      invoiceNumber: 'FAC-002',
      date: '2023-12-15',
      dueDate: '2024-01-14',
      amount: 75000,
      paidAmount: 0,
      balance: 75000,
      status: 'overdue',
      daysOverdue: 15
    },
    {
      id: '3',
      customerId: '2',
      customerName: 'Comercial XYZ',
      invoiceNumber: 'FAC-003',
      date: '2024-01-10',
      dueDate: '2024-02-09',
      amount: 85000,
      paidAmount: 0,
      balance: 85000,
      status: 'pending',
      daysOverdue: 0
    },
    {
      id: '4',
      customerId: '3',
      customerName: 'Distribuidora DEF',
      invoiceNumber: 'FAC-004',
      date: '2024-01-05',
      dueDate: '2024-02-04',
      amount: 45000,
      paidAmount: 0,
      balance: 45000,
      status: 'pending',
      daysOverdue: 0
    },
    {
      id: '5',
      customerId: '2',
      customerName: 'Comercial XYZ',
      invoiceNumber: 'FAC-005',
      date: '2023-12-20',
      dueDate: '2024-01-19',
      amount: 120000,
      paidAmount: 120000,
      balance: 0,
      status: 'paid',
      daysOverdue: 0
    }
  ];

  const customers = [
    { id: '1', name: 'Empresa ABC S.R.L.' },
    { id: '2', name: 'Comercial XYZ' },
    { id: '3', name: 'Distribuidora DEF' },
    { id: '4', name: 'Servicios GHI' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300';
      case 'partial': return 'border-amber-500/60 bg-amber-500/10 text-amber-300';
      case 'pending': return 'border-sky-500/60 bg-sky-500/10 text-sky-300';
      case 'overdue': return 'border-red-500/60 bg-red-500/10 text-red-300';
      default: return 'border-slate-600/60 bg-slate-700/20 text-slate-200';
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case 'paid': return 'Pagada';
      case 'partial': return 'Parcial';
      case 'pending': return 'Pendiente';
      case 'overdue': return 'Vencida';
      default: return 'Desconocido';
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Reporte de Facturas por Cobrar', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 20, 40);
    doc.text(`Estado: ${statusFilter === 'all' ? 'Todos' : statusFilter}`, 20, 50);
    
    const totalAmount = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalBalance = filteredInvoices.reduce((sum, inv) => sum + inv.balance, 0);
    const totalPaid = filteredInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    
    doc.setFontSize(14);
    doc.text('Resumen Financiero', 20, 70);
    
    const summaryData = [
      ['Concepto', 'Monto'],
      ['Total Facturado', `$ ${totalAmount.toLocaleString()}`],
      ['Total Pagado', `$ ${totalPaid.toLocaleString()}`],
      ['Saldo Pendiente', `$ ${totalBalance.toLocaleString()}`],
      ['Número de Facturas', filteredInvoices.length.toString()]
    ];
    
    (doc as any).autoTable({
      startY: 80,
      head: [summaryData[0]],
      body: summaryData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 10 }
    });
    
    doc.setFontSize(14);
    doc.text('Detalle de Facturas', 20, (doc as any).lastAutoTable.finalY + 20);
    
    const invoiceData = filteredInvoices.map(invoice => [
      invoice.invoiceNumber,
      invoice.customerName,
      invoice.date,
      invoice.dueDate,
      `RD$ ${invoice.amount.toLocaleString()}`,
      `RD$ ${invoice.paidAmount.toLocaleString()}`,
      `RD$ ${invoice.balance.toLocaleString()}`,
      getStatusName(invoice.status)
    ]);
    
    (doc as any).autoTable({
      startY: (doc as any).lastAutoTable.finalY + 30,
      head: [['Factura', 'Cliente', 'Fecha', 'Vencimiento', 'Monto', 'Pagado', 'Saldo', 'Estado']],
      body: invoiceData,
      theme: 'striped',
      headStyles: { fillColor: [34, 197, 94] },
      styles: { fontSize: 8 }
    });
    
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Página ${i} de ${pageCount}`, 20, doc.internal.pageSize.height - 10);
      doc.text('Sistema de Gestión Empresarial', doc.internal.pageSize.width - 60, doc.internal.pageSize.height - 10);
    }
    
    doc.save(`facturas-por-cobrar-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportToExcel = () => {
    const totalAmount = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalBalance = filteredInvoices.reduce((sum, inv) => sum + inv.balance, 0);
    const totalPaid = filteredInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    
    const csvContent = [
      ['Reporte de Facturas por Cobrar'],
      [`Fecha de generación: ${new Date().toLocaleDateString()}`],
      [`Estado: ${statusFilter === 'all' ? 'Todos' : statusFilter}`],
      [''],
      ['RESUMEN FINANCIERO'],
      ['Total Facturado', `$ ${totalAmount.toLocaleString()}`],
      ['Total Pagado', `$ ${totalPaid.toLocaleString()}`],
      ['Saldo Pendiente', `$ ${totalBalance.toLocaleString()}`],
      ['Número de Facturas', filteredInvoices.length.toString()],
      [''],
      ['DETALLE DE FACTURAS'],
      ['Factura', 'Cliente', 'Fecha', 'Vencimiento', 'Monto', 'Pagado', 'Saldo', 'Estado', 'Días Vencido'],
      ...filteredInvoices.map(invoice => [
        invoice.invoiceNumber,
        invoice.customerName,
        invoice.date,
        invoice.dueDate,
        invoice.amount,
        invoice.paidAmount,
        invoice.balance,
        getStatusName(invoice.status),
        invoice.daysOverdue
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `facturas-por-cobrar-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleNewInvoice = () => {
    setSelectedInvoice(null);
    setShowInvoiceModal(true);
  };

  const handleRegisterPayment = (invoice?: Invoice) => {
    setSelectedInvoice(invoice || null);
    setShowPaymentModal(true);
  };

  const handleViewInvoice = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      alert(`Detalles de la factura ${invoice.invoiceNumber}:\n\nCliente: ${invoice.customerName}\nMonto: $ ${invoice.amount.toLocaleString()}\nSaldo: $ ${invoice.balance.toLocaleString()}\nEstado: ${getStatusName(invoice.status)}`);
    }
  };

  const handlePrintInvoice = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      alert(`Imprimiendo factura ${invoice.invoiceNumber}...`);
    }
  };

  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Factura creada exitosamente');
    setShowInvoiceModal(false);
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Pago registrado exitosamente');
    setShowPaymentModal(false);
    setSelectedInvoice(null);
  };

  return (
    <DashboardLayout>
      <div className="py-4 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Facturas por Cobrar</h1>
            <p className="text-sm text-slate-400 mt-1">Gestiona tus cuentas por cobrar, registra pagos y genera reportes.</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleNewInvoice}
              className="bg-gradient-to-r from-sky-500 to-emerald-400 text-slate-950 px-4 py-2 rounded-xl hover:brightness-110 transition-colors whitespace-nowrap font-semibold shadow-md shadow-sky-500/40"
            >
              <i className="ri-add-line mr-2"></i>
              Nueva Factura
            </button>
            <button 
              onClick={() => handleRegisterPayment()}
              className="bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-500 transition-colors whitespace-nowrap font-semibold shadow-md shadow-emerald-500/40"
            >
              <i className="ri-money-dollar-circle-line mr-2"></i>
              Registrar Pago
            </button>
          </div>
        </div>

        {/* Filters and Export */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="ri-search-line text-slate-400"></i>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-50 placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                placeholder="Buscar por cliente o número de factura..."
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm pr-8"
            >
              <option value="all">Todos los Estados</option>
              <option value="pending">Pendientes</option>
              <option value="partial">Parciales</option>
              <option value="paid">Pagadas</option>
              <option value="overdue">Vencidas</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={exportToPDF}
              className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-500 transition-colors whitespace-nowrap font-semibold shadow-md shadow-red-500/40"
            >
              <i className="ri-file-pdf-line mr-2"></i>PDF
            </button>
            <button
              onClick={exportToExcel}
              className="bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-500 transition-colors whitespace-nowrap font-semibold shadow-md shadow-emerald-500/40"
            >
              <i className="ri-file-excel-line mr-2"></i>Excel
            </button>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-950/60">
          <div className="overflow-x-auto rounded-2xl">
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-900/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Factura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Vencimiento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Pagado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Saldo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-950 divide-y divide-slate-800">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-900/60">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-50">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                      {invoice.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                      {invoice.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                      {invoice.dueDate}
                      {invoice.daysOverdue > 0 && (
                        <span className="ml-2 text-red-300 text-xs">
                          ({invoice.daysOverdue} días)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                      ${invoice.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                      ${invoice.paidAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-50">
                      ${invoice.balance.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                        {getStatusName(invoice.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleRegisterPayment(invoice)}
                          className="text-emerald-400 hover:text-emerald-300"
                          title="Registrar Pago"
                        >
                          <i className="ri-money-dollar-circle-line"></i>
                        </button>
                        <button 
                          onClick={() => handleViewInvoice(invoice.id)}
                          className="text-sky-400 hover:text-sky-300" 
                          title="Ver Detalles"
                        >
                          <i className="ri-eye-line"></i>
                        </button>
                        <button 
                          onClick={() => handlePrintInvoice(invoice.id)}
                          className="text-purple-400 hover:text-purple-300" 
                          title="Imprimir"
                        >
                          <i className="ri-printer-line"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Invoice Modal */}
        {showInvoiceModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-slate-950/80">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-50">Nueva Factura</h3>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="text-slate-400 hover:text-slate-100"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
              
              <form onSubmit={handleSaveInvoice} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Cliente
                    </label>
                    <select 
                      required
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-8"
                    >
                      <option value="">Seleccionar cliente</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Fecha de Vencimiento
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Descripción
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Descripción de los productos o servicios..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Monto
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowInvoiceModal(false)}
                    className="flex-1 bg-slate-900 border border-slate-700 text-slate-200 py-2 rounded-xl hover:bg-slate-800 transition-colors whitespace-nowrap"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-sky-500 to-emerald-400 text-slate-950 py-2 rounded-xl hover:brightness-110 transition-colors whitespace-nowrap font-semibold shadow-md shadow-sky-500/40"
                  >
                    Crear Factura
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 w-96 shadow-2xl shadow-slate-950/80">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-50">Registrar Pago</h3>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedInvoice(null);
                  }}
                  className="text-slate-400 hover:text-slate-100"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
              
              {selectedInvoice && (
                <div className="mb-4 p-4 bg-slate-900/80 rounded-xl border border-slate-700">
                  <p className="text-sm text-slate-300">Factura: <span className="font-medium text-slate-50">{selectedInvoice.invoiceNumber}</span></p>
                  <p className="text-sm text-slate-300">Cliente: <span className="font-medium text-slate-50">{selectedInvoice.customerName}</span></p>
                  <p className="text-lg font-semibold text-emerald-400">Saldo: ${selectedInvoice.balance.toLocaleString()}</p>
                </div>
              )}
              
              <form onSubmit={handleSavePayment} className="space-y-4">
                {!selectedInvoice && (
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Factura
                    </label>
                    <select 
                      required
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-8"
                    >
                      <option value="">Seleccionar factura</option>
                      {invoices.filter(inv => inv.balance > 0).map((invoice) => (
                        <option key={invoice.id} value={invoice.id}>
                          {invoice.invoiceNumber} - {invoice.customerName} (${invoice.balance.toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Monto a Pagar
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0.00"
                    max={selectedInvoice?.balance || undefined}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Método de Pago
                  </label>
                  <select 
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-8"
                  >
                    <option value="cash">Efectivo</option>
                    <option value="check">Cheque</option>
                    <option value="transfer">Transferencia</option>
                    <option value="card">Tarjeta</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Referencia
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Número de referencia"
                  />
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPaymentModal(false);
                      setSelectedInvoice(null);
                    }}
                    className="flex-1 bg-slate-900 border border-slate-700 text-slate-200 py-2 rounded-xl hover:bg-slate-800 transition-colors whitespace-nowrap"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 text-white py-2 rounded-xl hover:bg-emerald-500 transition-colors whitespace-nowrap font-semibold shadow-md shadow-emerald-500/40"
                  >
                    Registrar Pago
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}