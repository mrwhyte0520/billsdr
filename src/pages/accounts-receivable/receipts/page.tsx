import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Receipt {
  id: string;
  receiptNumber: string;
  customerId: string;
  customerName: string;
  date: string;
  amount: number;
  paymentMethod: 'cash' | 'check' | 'transfer' | 'card';
  reference: string;
  concept: string;
  status: 'active' | 'cancelled';
  invoiceNumbers: string[];
}

export default function ReceiptsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showReceiptDetails, setShowReceiptDetails] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  // Mock data
  const receipts: Receipt[] = [
    {
      id: '1',
      receiptNumber: 'RC-001',
      customerId: '1',
      customerName: 'Empresa ABC S.R.L.',
      date: '2024-01-15',
      amount: 75000,
      paymentMethod: 'transfer',
      reference: 'TRF-001',
      concept: 'Pago de facturas FAC-001, FAC-002',
      status: 'active',
      invoiceNumbers: ['FAC-001', 'FAC-002']
    },
    {
      id: '2',
      receiptNumber: 'RC-002',
      customerId: '2',
      customerName: 'Comercial XYZ',
      date: '2024-01-20',
      amount: 120000,
      paymentMethod: 'check',
      reference: 'CHK-001',
      concept: 'Pago factura FAC-005',
      status: 'active',
      invoiceNumbers: ['FAC-005']
    },
    {
      id: '3',
      receiptNumber: 'RC-003',
      customerId: '1',
      customerName: 'Empresa ABC S.R.L.',
      date: '2024-01-25',
      amount: 50000,
      paymentMethod: 'cash',
      reference: 'EFE-001',
      concept: 'Pago parcial factura FAC-003',
      status: 'active',
      invoiceNumbers: ['FAC-003']
    },
    {
      id: '4',
      receiptNumber: 'RC-004',
      customerId: '3',
      customerName: 'Distribuidora DEF',
      date: '2024-01-28',
      amount: 85000,
      paymentMethod: 'card',
      reference: 'TDC-001',
      concept: 'Pago factura FAC-006',
      status: 'active',
      invoiceNumbers: ['FAC-006']
    },
    {
      id: '5',
      receiptNumber: 'RC-005',
      customerId: '2',
      customerName: 'Comercial XYZ',
      date: '2024-01-30',
      amount: 45000,
      paymentMethod: 'transfer',
      reference: 'TRF-002',
      concept: 'Pago anticipado',
      status: 'cancelled',
      invoiceNumbers: []
    }
  ];

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'cash': return 'Efectivo';
      case 'check': return 'Cheque';
      case 'transfer': return 'Transferencia';
      case 'card': return 'Tarjeta';
      default: return 'Otro';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300';
      case 'cancelled': return 'border-red-500/60 bg-red-500/10 text-red-300';
      default: return 'border-slate-600/60 bg-slate-700/20 text-slate-200';
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'cancelled': return 'Anulado';
      default: return 'Desconocido';
    }
  };

  const filteredReceipts = receipts.filter(receipt => {
    const matchesSearch = receipt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receipt.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || receipt.status === statusFilter;
    const matchesPaymentMethod = paymentMethodFilter === 'all' || receipt.paymentMethod === paymentMethodFilter;
    return matchesSearch && matchesStatus && matchesPaymentMethod;
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Reporte de Recibos de Cobro', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 20, 40);
    doc.text(`Estado: ${statusFilter === 'all' ? 'Todos' : statusFilter}`, 20, 50);
    doc.text(`Método de pago: ${paymentMethodFilter === 'all' ? 'Todos' : getPaymentMethodName(paymentMethodFilter)}`, 20, 60);
    
    // Estadísticas
    const totalAmount = filteredReceipts.reduce((sum, receipt) => sum + receipt.amount, 0);
    const activeReceipts = filteredReceipts.filter(r => r.status === 'active').length;
    const cancelledReceipts = filteredReceipts.filter(r => r.status === 'cancelled').length;
    
    doc.setFontSize(14);
    doc.text('Resumen de Recibos', 20, 80);
    
    const summaryData = [
      ['Concepto', 'Valor'],
      ['Total Recibido', `$ ${totalAmount.toLocaleString()}`],
      ['Recibos Activos', activeReceipts.toString()],
      ['Recibos Anulados', cancelledReceipts.toString()],
      ['Total de Recibos', filteredReceipts.length.toString()]
    ];
    
    (doc as any).autoTable({
      startY: 90,
      head: [summaryData[0]],
      body: summaryData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }
    });
    
    // Tabla de recibos
    doc.setFontSize(14);
    doc.text('Detalle de Recibos', 20, (doc as any).lastAutoTable.finalY + 20);
    
    const receiptData = filteredReceipts.map(receipt => [
      receipt.receiptNumber,
      receipt.customerName,
      receipt.date,
      `$ ${receipt.amount.toLocaleString()}`,
      getPaymentMethodName(receipt.paymentMethod),
      receipt.reference,
      getStatusName(receipt.status)
    ]);
    
    (doc as any).autoTable({
      startY: (doc as any).lastAutoTable.finalY + 30,
      head: [['Recibo', 'Cliente', 'Fecha', 'Monto', 'Método', 'Referencia', 'Estado']],
      body: receiptData,
      theme: 'striped',
      headStyles: { fillColor: [34, 197, 94] },
      styles: { fontSize: 8 }
    });
    
    doc.save(`recibos-cobro-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportToExcel = () => {
    const totalAmount = filteredReceipts.reduce((sum, receipt) => sum + receipt.amount, 0);
    const activeReceipts = filteredReceipts.filter(r => r.status === 'active').length;
    const cancelledReceipts = filteredReceipts.filter(r => r.status === 'cancelled').length;
    
    const csvContent = [
      ['Reporte de Recibos de Cobro'],
      [`Fecha de generación: ${new Date().toLocaleDateString()}`],
      [`Estado: ${statusFilter === 'all' ? 'Todos' : statusFilter}`],
      [`Método de pago: ${paymentMethodFilter === 'all' ? 'Todos' : getPaymentMethodName(paymentMethodFilter)}`],
      [''],
      ['RESUMEN'],
      ['Total Recibido', `$ ${totalAmount.toLocaleString()}`],
      ['Recibos Activos', activeReceipts.toString()],
      ['Recibos Anulados', cancelledReceipts.toString()],
      ['Total de Recibos', filteredReceipts.length.toString()],
      [''],
      ['DETALLE DE RECIBOS'],
      ['Recibo', 'Cliente', 'Fecha', 'Monto', 'Método', 'Referencia', 'Concepto', 'Estado'],
      ...filteredReceipts.map(receipt => [
        receipt.receiptNumber,
        receipt.customerName,
        receipt.date,
        receipt.amount,
        getPaymentMethodName(receipt.paymentMethod),
        receipt.reference,
        receipt.concept,
        getStatusName(receipt.status)
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `recibos-cobro-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleNewReceipt = () => {
    setSelectedReceipt(null);
    setShowReceiptModal(true);
  };

  const handleViewReceipt = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setShowReceiptDetails(true);
  };

  const handlePrintReceipt = (receipt: Receipt) => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('RECIBO DE COBRO', 20, 30);
    
    doc.setFontSize(12);
    doc.text(`Recibo No: ${receipt.receiptNumber}`, 20, 50);
    doc.text(`Fecha: ${receipt.date}`, 20, 60);
    
    doc.text(`Cliente: ${receipt.customerName}`, 20, 80);
    doc.text(`Concepto: ${receipt.concept}`, 20, 90);
    doc.text(`Método de Pago: ${getPaymentMethodName(receipt.paymentMethod)}`, 20, 100);
    doc.text(`Referencia: ${receipt.reference}`, 20, 110);
    
    doc.setFontSize(16);
    doc.text(`Monto: $ ${receipt.amount.toLocaleString()}`, 20, 130);
    
    if (receipt.invoiceNumbers.length > 0) {
      doc.setFontSize(12);
      doc.text('Facturas aplicadas:', 20, 150);
      receipt.invoiceNumbers.forEach((invoice, index) => {
        doc.text(`- ${invoice}`, 30, 160 + (index * 10));
      });
    }
    
    doc.save(`recibo-${receipt.receiptNumber}.pdf`);
  };

  const handleCancelReceipt = (receiptId: string) => {
    if (confirm('¿Está seguro de que desea anular este recibo?')) {
      alert('Recibo anulado exitosamente');
    }
  };

  const handleSaveReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Recibo creado exitosamente');
    setShowReceiptModal(false);
  };

  return (
    <DashboardLayout>
      <div className="py-4 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Recibos de Cobro</h1>
            <nav className="flex space-x-2 text-sm text-slate-400 mt-2">
              <Link to="/accounts-receivable" className="hover:text-purple-300">Cuentas por Cobrar</Link>
              <span>/</span>
              <span>Recibos de Cobro</span>
            </nav>
          </div>
          <button 
            onClick={handleNewReceipt}
            className="bg-gradient-to-r from-sky-500 to-emerald-400 text-slate-950 px-4 py-2 rounded-xl hover:brightness-110 transition-colors whitespace-nowrap font-semibold shadow-md shadow-sky-500/40"
          >
            <i className="ri-add-line mr-2"></i>
            Nuevo Recibo
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-900/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Recibido</p>
                <p className="text-2xl font-bold text-emerald-300">
                  ${filteredReceipts.filter(r => r.status === 'active').reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
                <i className="ri-money-dollar-circle-line text-2xl text-emerald-200"></i>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-900/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Recibos Activos</p>
                <p className="text-2xl font-bold text-sky-400">
                  {filteredReceipts.filter(r => r.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-500/50 flex items-center justify-center">
                <i className="ri-file-list-line text-2xl text-sky-200"></i>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-900/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Recibos Anulados</p>
                <p className="text-2xl font-bold text-red-300">
                  {filteredReceipts.filter(r => r.status === 'cancelled').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/50 flex items-center justify-center">
                <i className="ri-close-circle-line text-2xl text-red-200"></i>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-900/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Promedio por Recibo</p>
                <p className="text-2xl font-bold text-purple-300">
                  ${filteredReceipts.length > 0 ? Math.round(filteredReceipts.reduce((sum, r) => sum + r.amount, 0) / filteredReceipts.length).toLocaleString() : '0'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/50 flex items-center justify-center">
                <i className="ri-bar-chart-line text-2xl text-purple-200"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Export */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">
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
                placeholder="Buscar por cliente, número de recibo o referencia..."
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
              <option value="active">Activos</option>
              <option value="cancelled">Anulados</option>
            </select>
          </div>

          <div className="w-full md:w-48">
            <select
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm pr-8"
            >
              <option value="all">Todos los Métodos</option>
              <option value="cash">Efectivo</option>
              <option value="check">Cheque</option>
              <option value="transfer">Transferencia</option>
              <option value="card">Tarjeta</option>
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

        {/* Receipts Table */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-950/60">
          <div className="overflow-x-auto rounded-2xl">
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-900/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Recibo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Método
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Referencia
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
                {filteredReceipts.map((receipt) => (
                  <tr key={receipt.id} className="hover:bg-slate-900/60">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-50">
                      {receipt.receiptNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                      {receipt.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                      {receipt.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-50">
                      ${receipt.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                      {getPaymentMethodName(receipt.paymentMethod)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                      {receipt.reference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(receipt.status)}`}>
                        {getStatusName(receipt.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewReceipt(receipt)}
                          className="text-sky-400 hover:text-sky-300"
                          title="Ver detalles"
                        >
                          <i className="ri-eye-line"></i>
                        </button>
                        <button
                          onClick={() => handlePrintReceipt(receipt)}
                          className="text-purple-400 hover:text-purple-300"
                          title="Imprimir recibo"
                        >
                          <i className="ri-printer-line"></i>
                        </button>
                        {receipt.status === 'active' && (
                          <button
                            onClick={() => handleCancelReceipt(receipt.id)}
                            className="text-red-400 hover:text-red-300"
                            title="Anular recibo"
                          >
                            <i className="ri-close-circle-line"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Receipt Modal */}
        {showReceiptModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-slate-950/80">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-50">Nuevo Recibo de Cobro</h3>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="text-slate-400 hover:text-slate-100"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
              
              <form onSubmit={handleSaveReceipt} className="space-y-4">
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
                      <option value="1">Empresa ABC S.R.L.</option>
                      <option value="2">Comercial XYZ</option>
                      <option value="3">Distribuidora DEF</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Fecha
                    </label>
                    <input
                      type="date"
                      required
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Método de Pago
                    </label>
                    <select 
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                    >
                      <option value="cash">Efectivo</option>
                      <option value="check">Cheque</option>
                      <option value="transfer">Transferencia</option>
                      <option value="card">Tarjeta</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Referencia
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Número de referencia"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Concepto
                  </label>
                  <textarea
                    rows={3}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Descripción del pago recibido..."
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowReceiptModal(false)}
                    className="flex-1 bg-slate-900 border border-slate-700 text-slate-200 py-2 rounded-xl hover:bg-slate-800 transition-colors whitespace-nowrap"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-sky-500 to-emerald-400 text-slate-950 py-2 rounded-xl hover:brightness-110 transition-colors whitespace-nowrap font-semibold shadow-md shadow-sky-500/40"
                  >
                    Crear Recibo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Receipt Details Modal */}
        {showReceiptDetails && selectedReceipt && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-slate-950/80">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-slate-50">Detalles del Recibo</h3>
                <button
                  onClick={() => {
                    setShowReceiptDetails(false);
                    setSelectedReceipt(null);
                  }}
                  className="text-slate-400 hover:text-slate-100"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400">Número de Recibo</label>
                    <p className="text-lg font-semibold text-slate-50">{selectedReceipt.receiptNumber}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-400">Cliente</label>
                    <p className="text-slate-100">{selectedReceipt.customerName}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-400">Fecha</label>
                    <p className="text-slate-100">{selectedReceipt.date}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-400">Monto</label>
                    <p className="text-2xl font-bold text-emerald-400">${selectedReceipt.amount.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400">Método de Pago</label>
                    <p className="text-slate-100">{getPaymentMethodName(selectedReceipt.paymentMethod)}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-400">Referencia</label>
                    <p className="text-slate-100">{selectedReceipt.reference}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-400">Estado</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedReceipt.status)}`}>
                      {getStatusName(selectedReceipt.status)}
                    </span>
                  </div>
                  
                  {selectedReceipt.invoiceNumbers.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-slate-400">Facturas Aplicadas</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedReceipt.invoiceNumbers.map((invoice, index) => (
                          <span key={index} className="bg-sky-500/15 text-sky-300 px-2 py-1 rounded text-xs border border-sky-500/40">
                            {invoice}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-400">Concepto</label>
                <p className="text-slate-100 mt-1">{selectedReceipt.concept}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}