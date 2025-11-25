import { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

export default function AdvancesPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingAdvance, setEditingAdvance] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const [advances, setAdvances] = useState([
    {
      id: 1,
      number: 'ADV-2024-001',
      date: '2024-01-15',
      supplier: 'Proveedor Industrial SA',
      amount: 50000,
      reason: 'Anticipo para materiales industriales proyecto Q1',
      status: 'Aprobado',
      approvedBy: 'Juan Pérez',
      dueDate: '2024-02-15',
      remainingBalance: 35000,
      appliedAmount: 15000
    },
    {
      id: 2,
      number: 'ADV-2024-002',
      date: '2024-01-14',
      supplier: 'Distribuidora Nacional SRL',
      amount: 25000,
      reason: 'Anticipo para compra de inventario',
      status: 'Pendiente',
      approvedBy: '',
      dueDate: '2024-02-14',
      remainingBalance: 25000,
      appliedAmount: 0
    },
    {
      id: 3,
      number: 'ADV-2024-003',
      date: '2024-01-13',
      supplier: 'Servicios Técnicos EIRL',
      amount: 15000,
      reason: 'Anticipo para servicios técnicos especializados',
      status: 'Aplicado',
      approvedBy: 'María García',
      dueDate: '2024-01-30',
      remainingBalance: 0,
      appliedAmount: 15000
    },
    {
      id: 4,
      number: 'ADV-2024-004',
      date: '2024-01-12',
      supplier: 'Materiales Construcción SA',
      amount: 75000,
      reason: 'Anticipo para materiales de construcción premium',
      status: 'Rechazado',
      approvedBy: '',
      dueDate: '2024-02-12',
      remainingBalance: 75000,
      appliedAmount: 0
    }
  ]);

  const [formData, setFormData] = useState({
    supplier: '',
    amount: '',
    reason: '',
    dueDate: ''
  });

  const suppliers = [
    'Proveedor Industrial SA',
    'Distribuidora Nacional SRL',
    'Servicios Técnicos EIRL',
    'Materiales Construcción SA'
  ];

  const filteredAdvances = advances.filter(advance => {
    return filterStatus === 'all' || advance.status === filterStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAdvance) {
      setAdvances(advances.map(advance => 
        advance.id === editingAdvance.id 
          ? { 
              ...advance, 
              supplier: formData.supplier,
              amount: parseFloat(formData.amount),
              reason: formData.reason,
              dueDate: formData.dueDate,
              remainingBalance: parseFloat(formData.amount)
            }
          : advance
      ));
    } else {
      const newAdvance = {
        id: advances.length + 1,
        number: `ADV-2024-${String(advances.length + 1).padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0],
        supplier: formData.supplier,
        amount: parseFloat(formData.amount),
        reason: formData.reason,
        status: 'Pendiente',
        approvedBy: '',
        dueDate: formData.dueDate,
        remainingBalance: parseFloat(formData.amount),
        appliedAmount: 0
      };
      setAdvances([...advances, newAdvance]);
    }
    
    resetForm();
    alert(editingAdvance ? 'Anticipo actualizado exitosamente' : 'Anticipo creado exitosamente');
  };

  const resetForm = () => {
    setFormData({
      supplier: '',
      amount: '',
      reason: '',
      dueDate: ''
    });
    setEditingAdvance(null);
    setShowModal(false);
  };

  const handleEdit = (advance: any) => {
    setEditingAdvance(advance);
    setFormData({
      supplier: advance.supplier,
      amount: advance.amount.toString(),
      reason: advance.reason,
      dueDate: advance.dueDate
    });
    setShowModal(true);
  };

  const handleApprove = (id: number) => {
    if (confirm('¿Aprobar este anticipo?')) {
      setAdvances(advances.map(advance => 
        advance.id === id ? { ...advance, status: 'Aprobado', approvedBy: 'Usuario Actual' } : advance
      ));
      alert('Anticipo aprobado exitosamente');
    }
  };

  const handleReject = (id: number) => {
    if (confirm('¿Rechazar este anticipo?')) {
      setAdvances(advances.map(advance => 
        advance.id === id ? { ...advance, status: 'Rechazado' } : advance
      ));
      alert('Anticipo rechazado');
    }
  };

  const handleApply = (id: number) => {
    const advance = advances.find(a => a.id === id);
    if (advance && confirm(`¿Aplicar anticipo de RD$ ${advance.remainingBalance.toLocaleString()}?`)) {
      setAdvances(advances.map(a => 
        a.id === id ? { 
          ...a, 
          status: 'Aplicado',
          appliedAmount: a.amount,
          remainingBalance: 0
        } : a
      ));
      alert('Anticipo aplicado exitosamente');
    }
  };

  const exportToExcel = () => {
    alert('Exportando anticipos a Excel...');
  };

  const printAdvance = (advance: any) => {
    alert(`Imprimiendo anticipo: ${advance.number}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Anticipos a Proveedores</h1>
            <p className="text-sm text-slate-400">Gestiona anticipos y pagos adelantados</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={exportToExcel}
              className="bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-500 transition-colors whitespace-nowrap shadow-md shadow-emerald-600/40"
            >
              <i className="ri-file-excel-line mr-2"></i>
              Exportar Excel
            </button>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-sky-400 text-slate-950 px-4 py-2 rounded-xl hover:brightness-110 transition-colors whitespace-nowrap font-semibold shadow-md shadow-purple-500/40"
            >
              <i className="ri-add-line mr-2"></i>
              Nuevo Anticipo
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-950/60">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center mr-4">
                <i className="ri-money-dollar-circle-line text-xl text-blue-300"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Total Anticipos</p>
                <p className="text-2xl font-bold text-slate-50">RD$ {advances.reduce((sum, a) => sum + a.amount, 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-950/60">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center mr-4">
                <i className="ri-time-line text-xl text-orange-300"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Pendientes</p>
                <p className="text-2xl font-bold text-slate-50">RD$ {advances.filter(a => a.status === 'Pendiente').reduce((sum, a) => sum + a.amount, 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-950/60">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mr-4">
                <i className="ri-check-line text-xl text-emerald-300"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Aprobados</p>
                <p className="text-2xl font-bold text-slate-50">RD$ {advances.filter(a => a.status === 'Aprobado').reduce((sum, a) => sum + a.amount, 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-950/60">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/50 flex items-center justify-center mr-4">
                <i className="ri-wallet-line text-xl text-purple-300"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Saldo Pendiente</p>
                <p className="text-2xl font-bold text-slate-50">RD$ {advances.reduce((sum, a) => sum + a.remainingBalance, 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-950/60 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Estado</label>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70"
              >
                <option value="all">Todos los Estados</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Aplicado">Aplicado</option>
                <option value="Rechazado">Rechazado</option>
              </select>
            </div>
            <div className="md:col-span-2 flex items-end">
              <button 
                onClick={() => setFilterStatus('all')}
                className="w-full bg-slate-900/80 text-slate-200 py-2 px-4 rounded-xl hover:bg-slate-800 transition-colors whitespace-nowrap border border-slate-700 text-sm"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Advances Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-950/60 overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-lg font-semibold text-slate-50">Lista de Anticipos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-900/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Número</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Proveedor</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Monto</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Saldo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Vencimiento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-slate-950 divide-y divide-slate-800">
                {filteredAdvances.map((advance) => (
                  <tr key={advance.id} className="hover:bg-slate-900/60">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-50">{advance.number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">{advance.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-100">{advance.supplier}</div>
                        <div className="text-sm text-slate-400 truncate max-w-xs">{advance.reason}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-slate-50">
                      RD$ {advance.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-slate-50">
                      RD$ {advance.remainingBalance.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">{advance.dueDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        advance.status === 'Aprobado' ? 'bg-emerald-950/60 text-emerald-200 border border-emerald-500/50' :
                        advance.status === 'Pendiente' ? 'bg-orange-950/60 text-orange-200 border border-orange-500/50' :
                        advance.status === 'Aplicado' ? 'bg-sky-950/60 text-sky-200 border border-sky-500/50' :
                        'bg-rose-950/60 text-rose-200 border border-rose-500/50'
                      }`}>
                        {advance.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => printAdvance(advance)}
                          className="text-slate-400 hover:text-slate-100 whitespace-nowrap"
                        >
                          <i className="ri-printer-line"></i>
                        </button>
                        <button 
                          onClick={() => handleEdit(advance)}
                          className="text-purple-300 hover:text-purple-100 whitespace-nowrap"
                        >
                          <i className="ri-edit-line"></i>
                        </button>
                        {advance.status === 'Pendiente' && (
                          <>
                            <button 
                              onClick={() => handleApprove(advance.id)}
                              className="text-emerald-300 hover:text-emerald-100 whitespace-nowrap"
                            >
                              <i className="ri-check-line"></i>
                            </button>
                            <button 
                              onClick={() => handleReject(advance.id)}
                              className="text-rose-300 hover:text-rose-100 whitespace-nowrap"
                            >
                              <i className="ri-close-line"></i>
                            </button>
                          </>
                        )}
                        {advance.status === 'Aprobado' && advance.remainingBalance > 0 && (
                          <button 
                            onClick={() => handleApply(advance.id)}
                            className="text-sky-300 hover:text-sky-100 whitespace-nowrap"
                          >
                            <i className="ri-wallet-line"></i>
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

        {/* Advance Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl shadow-slate-950/80 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-50">
                  {editingAdvance ? 'Editar Anticipo' : 'Nuevo Anticipo'}
                </h3>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-slate-400 hover:text-slate-100"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Proveedor *</label>
                    <select 
                      required
                      value={formData.supplier}
                      onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70"
                    >
                      <option value="">Seleccionar proveedor</option>
                      {suppliers.map(supplier => (
                        <option key={supplier} value={supplier}>{supplier}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Monto *</label>
                    <input 
                      type="number"
                      required
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-200 mb-2">Motivo *</label>
                    <textarea 
                      required
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70"
                      placeholder="Describe el motivo del anticipo..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Fecha de Vencimiento *</label>
                    <input 
                      type="date"
                      required
                      value={formData.dueDate}
                      onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800 transition-colors whitespace-nowrap text-sm"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-sky-400 text-slate-950 hover:brightness-110 transition-colors whitespace-nowrap text-sm font-semibold shadow-md shadow-purple-500/40"
                  >
                    {editingAdvance ? 'Actualizar' : 'Crear'} Anticipo
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