import { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Payment {
  id: string;
  customerId: string;
  customerName: string;
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  paymentMethod: 'cash' | 'check' | 'transfer' | 'card';
  date: string;
  reference: string;
}

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Mock data
  const payments: Payment[] = [
    {
      id: '1',
      customerId: '1',
      customerName: 'Empresa ABC S.R.L.',
      invoiceId: '1',
      invoiceNumber: 'FAC-001',
      amount: 50000,
      paymentMethod: 'transfer',
      date: '2024-01-15',
      reference: 'TRF-001'
    },
    {
      id: '2',
      customerId: '2',
      customerName: 'Comercial XYZ',
      invoiceId: '5',
      invoiceNumber: 'FAC-005',
      amount: 120000,
      paymentMethod: 'check',
      date: '2024-01-20',
      reference: 'CHK-001'
    },
    {
      id: '3',
      customerId: '1',
      customerName: 'Empresa ABC S.R.L.',
      invoiceId: '1',
      invoiceNumber: 'FAC-001',
      amount: 25000,
      paymentMethod: 'cash',
      date: '2024-01-25',
      reference: 'EFE-001'
    },
    {
      id: '4',
      customerId: '3',
      customerName: 'Distribuidora DEF',
      invoiceId: '4',
      invoiceNumber: 'FAC-004',
      amount: 45000,
      paymentMethod: 'card',
      date: '2024-01-28',
      reference: 'TAR-001'
    },
    {
      id: '5',
      customerId: '2',
      customerName: 'Comercial XYZ',
      invoiceId: '3',
      invoiceNumber: 'FAC-003',
      amount: 85000,
      paymentMethod: 'transfer',
      date: '2024-01-30',
      reference: 'TRF-002'
    }
  ];

  const invoices = [
    { id: '1', invoiceNumber: 'FAC-001', customerName: 'Empresa ABC S.R.L.', balance: 25000 },
    { id: '2', invoiceNumber: 'FAC-002', customerName: 'Empresa ABC S.R.L.', balance: 75000 },
    { id: '3', invoiceNumber: 'FAC-003', customerName: 'Comercial XYZ', balance: 0 },
    { id: '4', invoiceNumber: 'FAC-004', customerName: 'Distribuidora DEF', balance: 0 }
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

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash': return 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300';
      case 'check': return 'border-sky-500/60 bg-sky-500/10 text-sky-300';
      case 'transfer': return 'border-purple-500/60 bg-purple-500/10 text-purple-300';
      case 'card': return 'border-amber-500/60 bg-amber-500/10 text-amber-300';
      default: return 'border-slate-600/60 bg-slate-700/20 text-slate-200';
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = methodFilter === 'all' || payment.paymentMethod === methodFilter;
    return matchesSearch && matchesMethod;
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Reporte de Pagos Recibidos', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 20, 40);
    
    const totalPayments = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
    const paymentsByMethod = filteredPayments.reduce((acc, payment) => {
      acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + payment.amount;
      return acc;
    }, {} as Record<string, number>);
    
    doc.setFontSize(14);
    doc.text('Resumen de Pagos', 20, 60);
    
    const summaryData = [
      ['Concepto', 'Monto'],
      ['Total Recibido', `$ ${totalPayments.toLocaleString()}`],
      ['Número de Pagos', filteredPayments.length.toString()],
      ['Efectivo', `$ ${(paymentsByMethod.cash || 0).toLocaleString()}`],
      ['Transferencias', `$ ${(paymentsByMethod.transfer || 0).toLocaleString()}`],
      ['Cheques', `$ ${(paymentsByMethod.check || 0).toLocaleString()}`],
      ['Tarjetas', `$ ${(paymentsByMethod.card || 0).toLocaleString()}`]
    ];
    
    (doc as any).autoTable({
      startY: 70,
      head: [summaryData[0]],
      body: summaryData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94] }
    });
    
    doc.setFontSize(14);
    doc.text('Detalle de Pagos', 20, (doc as any).lastAutoTable.finalY + 20);
    
    const paymentData = filteredPayments.map(payment => [
      payment.date,
      payment.customerName,
      payment.invoiceNumber,
      `$ ${payment.amount.toLocaleString()}`,
      getPaymentMethodName(payment.paymentMethod),
      payment.reference
    ]);
    
    (doc as any).autoTable({
      startY: (doc as any).lastAutoTable.finalY + 30,
      head: [['Fecha', 'Cliente', 'Factura', 'Monto', 'Método', 'Referencia']],
      body: paymentData,
      theme: 'striped',
      headStyles: { fillColor: [16, 185, 129] },
      styles: { fontSize: 9 }
    });
    
    doc.save(`pagos-recibidos-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportToExcel = () => {
    const totalPayments = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
    const paymentsByMethod = filteredPayments.reduce((acc, payment) => {
      acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + payment.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const csvContent = [
      ['Reporte de Pagos Recibidos'],
      [`Fecha de generación: ${new Date().toLocaleDateString()}`],
      [''],
      ['RESUMEN DE PAGOS'],
      ['Total Recibido', `$ ${totalPayments.toLocaleString()}`],
      ['Número de Pagos', filteredPayments.length.toString()],
      ['Efectivo', `$ ${(paymentsByMethod.cash || 0).toLocaleString()}`],
      ['Transferencias', `$ ${(paymentsByMethod.transfer || 0).toLocaleString()}`],
      ['Cheques', `$ ${(paymentsByMethod.check || 0).toLocaleString()}`],
      ['Tarjetas', `$ ${(paymentsByMethod.card || 0).toLocaleString()}`],
      [''],
      ['DETALLE DE PAGOS'],
      ['Fecha', 'Cliente', 'Factura', 'Monto', 'Método', 'Referencia'],
      ...filteredPayments.map(payment => [
        payment.date,
        payment.customerName,
        payment.invoiceNumber,
        payment.amount,
        getPaymentMethodName(payment.paymentMethod),
        payment.reference
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pagos-recibidos-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleNewPayment = () => {
    setSelectedPayment(null);
    setShowPaymentModal(true);
  };

  const handleViewPayment = (paymentId: string) => {
    const payment = payments.find(pay => pay.id === paymentId);
    if (payment) {
      alert(`Detalles del pago:\n\nCliente: ${payment.customerName}\nFactura: ${payment.invoiceNumber}\nMonto: $ ${payment.amount.toLocaleString()}\nMétodo: ${getPaymentMethodName(payment.paymentMethod)}\nReferencia: ${payment.reference}`);
    }
  };

  const handlePrintPayment = (paymentId: string) => {
    const payment = payments.find(pay => pay.id === paymentId);
    if (payment) {
      alert(`Imprimiendo recibo de pago ${payment.reference}...`);
    }
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Pago registrado exitosamente');
    setShowPaymentModal(false);
    setSelectedPayment(null);
  };

  return (
    <DashboardLayout>
      <div className="py-4 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Pagos Recibidos</h1>
            <p className="text-sm text-slate-400 mt-1">Consulta y registra los pagos recibidos de tus clientes.</p>
          </div>
          <button 
            onClick={handleNewPayment}
            className="bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-500 transition-colors whitespace-nowrap font-semibold shadow-md shadow-emerald-500/40"
          >
            <i className="ri-money-dollar-circle-line mr-2"></i>
            Registrar Pago
          </button>
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
                placeholder="Buscar por cliente, factura o referencia..."
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
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

        {/* Payments Table */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-950/60">
          <div className="overflow-x-auto rounded-2xl">
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-900/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Factura
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
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-950 divide-y divide-slate-800">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-900/60">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                      {payment.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                      {payment.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                      {payment.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-50">
                      ${payment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPaymentMethodColor(payment.paymentMethod)}`}>
                        {getPaymentMethodName(payment.paymentMethod)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                      {payment.reference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewPayment(payment.id)}
                          className="text-sky-400 hover:text-sky-300"
                          title="Ver detalles"
                        >
                          <i className="ri-eye-line"></i>
                        </button>
                        <button 
                          onClick={() => handlePrintPayment(payment.id)}
                          className="text-purple-400 hover:text-purple-300"
                          title="Imprimir recibo"
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

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 w-96 shadow-2xl shadow-slate-950/80">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-50">Registrar Pago</h3>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedPayment(null);
                  }}
                  className="text-slate-400 hover:text-slate-100"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
              
              <form onSubmit={handleSavePayment} className="space-y-4">
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
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Número de referencia"
                  />
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPaymentModal(false);
                      setSelectedPayment(null);
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