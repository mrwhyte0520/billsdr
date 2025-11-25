import { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Customer {
  id: string;
  name: string;
  document: string;
  phone: string;
  email: string;
  address: string;
  creditLimit: number;
  currentBalance: number;
  status: 'active' | 'inactive' | 'blocked';
}

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Mock data
  const customers: Customer[] = [
    {
      id: '1',
      name: 'Empresa ABC S.R.L.',
      document: '131-12345-6',
      phone: '809-123-4567',
      email: 'contacto@empresaabc.com',
      address: 'Av. 27 de Febrero, Santo Domingo',
      creditLimit: 500000,
      currentBalance: 125000,
      status: 'active'
    },
    {
      id: '2',
      name: 'Comercial XYZ',
      document: '131-23456-7',
      phone: '809-234-5678',
      email: 'ventas@comercialxyz.com',
      address: 'Calle Mercedes, Santiago',
      creditLimit: 300000,
      currentBalance: 85000,
      status: 'active'
    },
    {
      id: '3',
      name: 'Distribuidora DEF',
      document: '131-34567-8',
      phone: '809-345-6789',
      email: 'info@distribuidoradef.com',
      address: 'Av. Independencia, La Vega',
      creditLimit: 200000,
      currentBalance: 45000,
      status: 'active'
    },
    {
      id: '4',
      name: 'Servicios GHI',
      document: '131-45678-9',
      phone: '809-456-7890',
      email: 'servicios@ghi.com',
      address: 'Calle Duarte, San Cristóbal',
      creditLimit: 150000,
      currentBalance: 0,
      status: 'inactive'
    }
  ];

  const getCustomerStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300';
      case 'inactive': return 'border-slate-500/60 bg-slate-700/20 text-slate-200';
      case 'blocked': return 'border-red-500/60 bg-red-500/10 text-red-300';
      default: return 'border-slate-500/60 bg-slate-700/20 text-slate-200';
    }
  };

  const getCustomerStatusName = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'blocked': return 'Bloqueado';
      default: return 'Desconocido';
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.document.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Reporte de Clientes', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 20, 40);
    
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const totalCreditLimit = customers.reduce((sum, c) => sum + c.creditLimit, 0);
    const totalBalance = customers.reduce((sum, c) => sum + c.currentBalance, 0);
    
    doc.setFontSize(14);
    doc.text('Estadísticas de Clientes', 20, 60);
    
    const statsData = [
      ['Concepto', 'Valor'],
      ['Total de Clientes', customers.length.toString()],
      ['Clientes Activos', activeCustomers.toString()],
      ['Límite de Crédito Total', `$ ${totalCreditLimit.toLocaleString()}`],
      ['Saldo Total Pendiente', `$ ${totalBalance.toLocaleString()}`]
    ];
    
    (doc as any).autoTable({
      startY: 70,
      head: [statsData[0]],
      body: statsData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }
    });
    
    doc.setFontSize(14);
    doc.text('Detalle de Clientes', 20, (doc as any).lastAutoTable.finalY + 20);
    
    const customerData = filteredCustomers.map(customer => [
      customer.name,
      customer.document,
      customer.phone,
      customer.email,
      `$ ${customer.creditLimit.toLocaleString()}`,
      `$ ${customer.currentBalance.toLocaleString()}`,
      getCustomerStatusName(customer.status)
    ]);
    
    (doc as any).autoTable({
      startY: (doc as any).lastAutoTable.finalY + 30,
      head: [['Cliente', 'Documento', 'Teléfono', 'Email', 'Límite Crédito', 'Saldo Actual', 'Estado']],
      body: customerData,
      theme: 'striped',
      headStyles: { fillColor: [168, 85, 247] },
      styles: { fontSize: 8 }
    });
    
    doc.save(`clientes-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportToExcel = () => {
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const totalCreditLimit = customers.reduce((sum, c) => sum + c.creditLimit, 0);
    const totalBalance = customers.reduce((sum, c) => sum + c.currentBalance, 0);
    
    const csvContent = [
      ['Reporte de Clientes'],
      [`Fecha de generación: ${new Date().toLocaleDateString()}`],
      [''],
      ['ESTADÍSTICAS'],
      ['Total de Clientes', customers.length.toString()],
      ['Clientes Activos', activeCustomers.toString()],
      ['Límite de Crédito Total', `$ ${totalCreditLimit.toLocaleString()}`],
      ['Saldo Total Pendiente', `$ ${totalBalance.toLocaleString()}`],
      [''],
      ['DETALLE DE CLIENTES'],
      ['Cliente', 'Documento', 'Teléfono', 'Email', 'Dirección', 'Límite Crédito', 'Saldo Actual', 'Estado'],
      ...filteredCustomers.map(customer => [
        customer.name,
        customer.document,
        customer.phone,
        customer.email,
        customer.address,
        customer.creditLimit,
        customer.currentBalance,
        getCustomerStatusName(customer.status)
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `clientes-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleNewCustomer = () => {
    setSelectedCustomer(null);
    setShowCustomerModal(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetails(true);
  };

  const handleCustomerStatement = (customer: Customer) => {
    alert(`Estado de cuenta para ${customer.name}:\n\nSaldo actual: $ ${customer.currentBalance.toLocaleString()}\nLímite de crédito: $ ${customer.creditLimit.toLocaleString()}`);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    alert(selectedCustomer ? 'Cliente actualizado exitosamente' : 'Cliente creado exitosamente');
    setShowCustomerModal(false);
    setSelectedCustomer(null);
  };

  return (
    <DashboardLayout>
      <div className="py-4 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Gestión de Clientes</h1>
            <p className="text-sm text-slate-400 mt-1">Administra la información de tus clientes y sus límites de crédito.</p>
          </div>
          <button 
            onClick={handleNewCustomer}
            className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-sky-400 text-slate-950 px-4 py-2 rounded-xl hover:brightness-110 transition-colors whitespace-nowrap font-semibold shadow-md shadow-purple-500/40"
          >
            <i className="ri-user-add-line mr-2"></i>
            Nuevo Cliente
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
                placeholder="Buscar por nombre o documento..."
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
              <option value="inactive">Inactivos</option>
              <option value="blocked">Bloqueados</option>
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

        {/* Customers Table */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-950/60">
          <div className="overflow-x-auto rounded-2xl">
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-900/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Límite Crédito
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Saldo Actual
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
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-900/60">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-50">{customer.name}</div>
                        <div className="text-sm text-slate-400">{customer.address}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                      {customer.document}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-slate-100">{customer.phone}</div>
                        <div className="text-sm text-slate-400">{customer.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                      ${customer.creditLimit.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-50">
                      ${customer.currentBalance.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCustomerStatusColor(customer.status)}`}>
                        {getCustomerStatusName(customer.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditCustomer(customer)}
                          className="text-sky-400 hover:text-sky-300"
                          title="Editar cliente"
                        >
                          <i className="ri-edit-line"></i>
                        </button>
                        <button 
                          onClick={() => handleViewCustomer(customer)}
                          className="text-emerald-400 hover:text-emerald-300"
                          title="Ver detalles"
                        >
                          <i className="ri-eye-line"></i>
                        </button>
                        <button 
                          onClick={() => handleCustomerStatement(customer)}
                          className="text-purple-400 hover:text-purple-300"
                          title="Estado de cuenta"
                        >
                          <i className="ri-file-list-line"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Modal */}
        {showCustomerModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-slate-950/80">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-50">
                  {selectedCustomer ? 'Editar Cliente' : 'Nuevo Cliente'}
                </h3>
                <button
                  onClick={() => {
                    setShowCustomerModal(false);
                    setSelectedCustomer(null);
                  }}
                  className="text-slate-400 hover:text-slate-100"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
              
              <form onSubmit={handleSaveCustomer} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Nombre/Razón Social
                    </label>
                    <input
                      type="text"
                      required
                      defaultValue={selectedCustomer?.name || ''}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Nombre del cliente"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      RNC/Cédula
                    </label>
                    <input
                      type="text"
                      required
                      defaultValue={selectedCustomer?.document || ''}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="000-0000000-0"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      required
                      defaultValue={selectedCustomer?.phone || ''}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="809-000-0000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      defaultValue={selectedCustomer?.email || ''}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="cliente@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Dirección
                  </label>
                  <textarea
                    rows={2}
                    defaultValue={selectedCustomer?.address || ''}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Dirección completa del cliente"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Límite de Crédito
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      defaultValue={selectedCustomer?.creditLimit || ''}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Estado
                    </label>
                    <select 
                      defaultValue={selectedCustomer?.status || 'active'}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-8"
                    >
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                      <option value="blocked">Bloqueado</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomerModal(false);
                      setSelectedCustomer(null);
                    }}
                    className="flex-1 bg-slate-900 border border-slate-700 text-slate-200 py-2 rounded-xl hover:bg-slate-800 transition-colors whitespace-nowrap"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-sky-400 text-slate-950 py-2 rounded-xl hover:brightness-110 transition-colors whitespace-nowrap font-semibold shadow-md shadow-purple-500/40"
                  >
                    {selectedCustomer ? 'Actualizar' : 'Crear'} Cliente
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Customer Details Modal */}
        {showCustomerDetails && selectedCustomer && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-slate-950/80">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-slate-50">Detalles del Cliente</h3>
                <button
                  onClick={() => {
                    setShowCustomerDetails(false);
                    setSelectedCustomer(null);
                  }}
                  className="text-slate-400 hover:text-slate-100"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400">Nombre/Razón Social</label>
                    <p className="text-lg font-semibold text-slate-50">{selectedCustomer.name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-400">RNC/Cédula</label>
                    <p className="text-slate-100">{selectedCustomer.document}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-400">Teléfono</label>
                    <p className="text-slate-100">{selectedCustomer.phone}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-400">Email</label>
                    <p className="text-slate-100">{selectedCustomer.email}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400">Dirección</label>
                    <p className="text-slate-100">{selectedCustomer.address}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-400">Límite de Crédito</label>
                    <p className="text-lg font-semibold text-sky-400">${selectedCustomer.creditLimit.toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-400">Saldo Actual</label>
                    <p className="text-lg font-semibold text-emerald-400">${selectedCustomer.currentBalance.toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-400">Estado</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCustomerStatusColor(selectedCustomer.status)}`}>
                      {getCustomerStatusName(selectedCustomer.status)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowCustomerDetails(false);
                    setShowCustomerModal(true);
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-sky-400 text-slate-950 py-2 rounded-xl hover:brightness-110 transition-colors whitespace-nowrap font-semibold shadow-md shadow-purple-500/40"
                >
                  <i className="ri-edit-line mr-2"></i>
                  Editar Cliente
                </button>
                <button
                  onClick={() => handleCustomerStatement(selectedCustomer)}
                  className="flex-1 bg-emerald-600 text-white py-2 rounded-xl hover:bg-emerald-500 transition-colors whitespace-nowrap font-semibold shadow-md shadow-emerald-500/40"
                >
                  <i className="ri-file-list-line mr-2"></i>
                  Estado de Cuenta
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}