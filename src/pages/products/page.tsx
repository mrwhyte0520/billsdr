
import { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { inventoryService } from '../../services/database';
import { useAuth } from '../../hooks/useAuth';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  maxStock: number;
  barcode: string;
  description: string;
  supplier: string;
  imageUrl: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
}

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Electrónicos' },
    { id: '2', name: 'Accesorios' },
    { id: '3', name: 'Suministros de Oficina' },
    { id: '4', name: 'Muebles' },
    { id: '5', name: 'Software' },
    { id: '6', name: 'Ropa' },
    { id: '7', name: 'Hogar' },
    { id: '8', name: 'Deportes' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    cost: '',
    stock: '',
    minStock: '',
    maxStock: '',
    barcode: '',
    description: '',
    supplier: '',
    imageUrl: '',
    status: 'active' as 'active' | 'inactive'
  });

  const [categoryFormData, setCategoryFormData] = useState({
    name: ''
  });

  // Sample data for demonstration
  const sampleProducts: Product[] = [
    {
      id: '1',
      name: 'Laptop Dell Inspiron 15',
      sku: 'DELL-INS-15-001',
      category: 'Electrónicos',
      price: 45000,
      cost: 35000,
      stock: 8,
      minStock: 5,
      maxStock: 50,
      barcode: '1234567890123',
      description: 'Laptop Dell Inspiron 15 con procesador Intel Core i5, 8GB RAM, 256GB SSD',
      supplier: 'Dell Technologies',
      imageUrl: 'https://readdy.ai/api/search-image?query=Dell%20Inspiron%2015%20laptop%20computer%20on%20clean%20white%20background%2C%20professional%20product%20photography%2C%20high%20quality%2C%20detailed%20view%2C%20modern%20design&width=400&height=400&seq=laptop001&orientation=squarish',
      status: 'active',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      name: 'Mouse Inalámbrico Logitech MX Master 3',
      sku: 'LOG-MX3-002',
      category: 'Accesorios',
      price: 3500,
      cost: 2500,
      stock: 25,
      minStock: 10,
      maxStock: 100,
      barcode: '2345678901234',
      description: 'Mouse inalámbrico ergonómico con sensor de alta precisión y batería de larga duración',
      supplier: 'Logitech',
      imageUrl: 'https://readdy.ai/api/search-image?query=Logitech%20MX%20Master%203%20wireless%20mouse%20on%20clean%20white%20background%2C%20professional%20product%20photography%2C%20high%20quality%2C%20detailed%20view%2C%20ergonomic%20design&width=400&height=400&seq=mouse001&orientation=squarish',
      status: 'active',
      createdAt: '2024-01-16T11:30:00Z',
      updatedAt: '2024-01-16T11:30:00Z'
    },
    {
      id: '3',
      name: 'Escritorio de Oficina Ejecutivo',
      sku: 'DESK-EXEC-003',
      category: 'Muebles',
      price: 15000,
      cost: 10000,
      stock: 3,
      minStock: 2,
      maxStock: 20,
      barcode: '3456789012345',
      description: 'Escritorio ejecutivo de madera con cajones y espacio amplio para trabajo',
      supplier: 'Muebles Modernos SA',
      imageUrl: 'https://readdy.ai/api/search-image?query=executive%20office%20desk%20wooden%20furniture%20on%20clean%20white%20background%2C%20professional%20product%20photography%2C%20high%20quality%2C%20detailed%20view%2C%20modern%20office%20furniture&width=400&height=400&seq=desk001&orientation=squarish',
      status: 'active',
      createdAt: '2024-01-17T09:15:00Z',
      updatedAt: '2024-01-17T09:15:00Z'
    },
    {
      id: '4',
      name: 'Silla Ergonómica de Oficina',
      sku: 'CHAIR-ERG-004',
      category: 'Muebles',
      price: 8500,
      cost: 6000,
      stock: 12,
      minStock: 5,
      maxStock: 30,
      barcode: '4567890123456',
      description: 'Silla ergonómica con soporte lumbar ajustable y reposabrazos',
      supplier: 'Ergonomic Solutions',
      imageUrl: 'https://readdy.ai/api/search-image?query=ergonomic%20office%20chair%20with%20lumbar%20support%20on%20clean%20white%20background%2C%20professional%20product%20photography%2C%20high%20quality%2C%20detailed%20view%2C%20modern%20office%20furniture&width=400&height=400&seq=chair001&orientation=squarish',
      status: 'active',
      createdAt: '2024-01-18T14:20:00Z',
      updatedAt: '2024-01-18T14:20:00Z'
    },
    {
      id: '5',
      name: 'Papel Bond Tamaño Carta',
      sku: 'PAPER-A4-005',
      category: 'Suministros de Oficina',
      price: 250,
      cost: 180,
      stock: 150,
      minStock: 50,
      maxStock: 500,
      barcode: '5678901234567',
      description: 'Papel bond blanco tamaño carta, paquete de 500 hojas',
      supplier: 'Papelería Central',
      imageUrl: 'https://readdy.ai/api/search-image?query=white%20office%20paper%20stack%20letter%20size%20on%20clean%20white%20background%2C%20professional%20product%20photography%2C%20high%20quality%2C%20detailed%20view%2C%20office%20supplies&width=400&height=400&seq=paper001&orientation=squarish',
      status: 'active',
      createdAt: '2024-01-19T08:45:00Z',
      updatedAt: '2024-01-19T08:45:00Z'
    },
    {
      id: '6',
      name: 'Monitor LED 24 pulgadas',
      sku: 'MON-LED-24-006',
      category: 'Electrónicos',
      price: 12000,
      cost: 9000,
      stock: 2,
      minStock: 3,
      maxStock: 25,
      barcode: '6789012345678',
      description: 'Monitor LED de 24 pulgadas Full HD con conectividad HDMI y VGA',
      supplier: 'Samsung Electronics',
      imageUrl: 'https://readdy.ai/api/search-image?query=24%20inch%20LED%20monitor%20computer%20display%20on%20clean%20white%20background%2C%20professional%20product%20photography%2C%20high%20quality%2C%20detailed%20view%2C%20modern%20technology&width=400&height=400&seq=monitor001&orientation=squarish',
      status: 'inactive',
      createdAt: '2024-01-20T16:10:00Z',
      updatedAt: '2024-01-20T16:10:00Z'
    }
  ];

  // Load products from database or use sample data
  useEffect(() => {
    loadProducts();
  }, [user]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      if (user) {
        const data = await inventoryService.getItems(user.id);
        if (data && data.length > 0) {
          const transformedProducts = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            sku: item.sku,
            category: item.category || 'Electrónicos',
            price: item.selling_price || 0,
            cost: item.cost_price || 0,
            stock: item.current_stock || 0,
            minStock: item.min_stock || 0,
            maxStock: item.max_stock || 0,
            barcode: item.barcode || '',
            description: item.description || '',
            supplier: item.supplier || '',
            imageUrl: item.image_url || '',
            status: item.is_active ? 'active' : 'inactive',
            createdAt: item.created_at,
            updatedAt: item.updated_at
          }));
          setProducts(transformedProducts);
        } else {
          setProducts(sampleProducts);
        }
      } else {
        setProducts(sampleProducts);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts(sampleProducts);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode.includes(searchTerm) ||
                         product.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'low_stock' && product.stock <= product.minStock) ||
                         product.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Dashboard calculations
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const lowStockProducts = products.filter(p => p.stock <= p.minStock).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const totalCost = products.reduce((sum, p) => sum + (p.cost * p.stock), 0);
  const potentialProfit = totalValue - totalCost;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, imageUrl: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newProduct: Product = {
        id: editingProduct?.id || Date.now().toString(),
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        stock: parseInt(formData.stock),
        minStock: parseInt(formData.minStock),
        maxStock: parseInt(formData.maxStock),
        barcode: formData.barcode,
        description: formData.description,
        supplier: formData.supplier,
        imageUrl: formData.imageUrl,
        status: formData.status,
        createdAt: editingProduct?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (user) {
        const itemData = {
          name: formData.name,
          sku: formData.sku,
          category: formData.category,
          selling_price: parseFloat(formData.price),
          cost_price: parseFloat(formData.cost),
          current_stock: parseInt(formData.stock),
          min_stock: parseInt(formData.minStock),
          max_stock: parseInt(formData.maxStock),
          barcode: formData.barcode,
          description: formData.description,
          supplier: formData.supplier,
          image_url: formData.imageUrl,
          is_active: formData.status === 'active'
        };

        if (editingProduct) {
          await inventoryService.updateItem(editingProduct.id, itemData);
        } else {
          await inventoryService.createItem(user.id, itemData);
        }
      }

      if (editingProduct) {
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? newProduct : p));
      } else {
        setProducts(prev => [...prev, newProduct]);
      }

      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar el producto. Intente nuevamente.');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price.toString(),
      cost: product.cost.toString(),
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
      maxStock: product.maxStock.toString(),
      barcode: product.barcode,
      description: product.description,
      supplier: product.supplier,
      imageUrl: product.imageUrl,
      status: product.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar este producto?')) {
      try {
        if (user) {
          await inventoryService.deleteItem(id);
        }
        setProducts(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error al eliminar el producto. Intente nuevamente.');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (confirm(`¿Está seguro de que desea eliminar ${selectedProducts.length} productos seleccionados?`)) {
      try {
        for (const id of selectedProducts) {
          if (user) {
            await inventoryService.deleteItem(id);
          }
        }
        setProducts(prev => prev.filter(p => !selectedProducts.includes(p.id)));
        setSelectedProducts([]);
        setShowBulkActions(false);
      } catch (error) {
        console.error('Error deleting products:', error);
        alert('Error al eliminar los productos. Intente nuevamente.');
      }
    }
  };

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    setProducts(prev => prev.map(p => 
      selectedProducts.includes(p.id) ? { ...p, status, updatedAt: new Date().toISOString() } : p
    ));
    setSelectedProducts([]);
    setShowBulkActions(false);
  };

  const exportToCSV = () => {
    const headers = ['Nombre', 'SKU', 'Categoría', 'Precio', 'Costo', 'Stock', 'Stock Mín', 'Stock Máx', 'Proveedor', 'Estado'];
    const csvContent = [
      headers.join(','),
      ...filteredProducts.map(product => [
        `"${product.name}"`,
        product.sku,
        product.category,
        product.price,
        product.cost,
        product.stock,
        product.minStock,
        product.maxStock,
        `"${product.supplier}"`,
        product.status === 'active' ? 'Activo' : 'Inactivo'
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `productos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      category: '',
      price: '',
      cost: '',
      stock: '',
      minStock: '',
      maxStock: '',
      barcode: '',
      description: '',
      supplier: '',
      imageUrl: '',
      status: 'active'
    });
    setEditingProduct(null);
  };

  const generateSKU = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `PRD-${timestamp}-${random}`;
  };

  const generateBarcode = () => {
    return Math.floor(Math.random() * 9000000000000) + 1000000000000;
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const selectAllProducts = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  useEffect(() => {
    setShowBulkActions(selectedProducts.length > 0);
  }, [selectedProducts]);

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryFormData.name.trim()) {
      alert('Por favor ingrese un nombre para la categoría');
      return;
    }

    // Check if category already exists
    const categoryExists = categories.some(cat => 
      cat.name.toLowerCase() === categoryFormData.name.trim().toLowerCase()
    );

    if (categoryExists) {
      alert('Esta categoría ya existe');
      return;
    }

    try {
      const newCategory: Category = {
        id: editingCategory?.id || Date.now().toString(),
        name: categoryFormData.name.trim()
      };

      if (editingCategory) {
        // Update existing category
        setCategories(prev => prev.map(cat => 
          cat.id === editingCategory.id ? newCategory : cat
        ));
        
        // Update products that use this category
        setProducts(prev => prev.map(product => 
          product.category === editingCategory.name 
            ? { ...product, category: newCategory.name, updatedAt: new Date().toISOString() }
            : product
        ));
      } else {
        // Add new category
        setCategories(prev => [...prev, newCategory]);
      }

      resetCategoryForm();
      setShowCategoryModal(false);
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error al guardar la categoría. Intente nuevamente.');
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name
    });
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;

    const productsInCategory = products.filter(p => p.category === category.name);
    
    if (productsInCategory.length > 0) {
      alert(`No se puede eliminar la categoría "${category.name}" porque tiene ${productsInCategory.length} productos asociados. Primero mueva los productos a otra categoría.`);
      return;
    }

    if (confirm(`¿Está seguro de que desea eliminar la categoría "${category.name}"?`)) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    }
  };

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: ''
    });
    setEditingCategory(null);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-slate-200">Cargando módulo de productos...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.REACT_APP_NAVIGATE('/dashboard')}
              className="flex items-center text-slate-400 hover:text-slate-100 transition-colors"
            >
              <i className="ri-arrow-left-line mr-2"></i>
              Volver al Inicio
            </button>
            <div className="h-6 w-px bg-slate-700"></div>
            <h1 className="text-2xl font-bold text-slate-50">Gestión de Productos</h1>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-sky-400 text-slate-950 px-4 py-2 rounded-xl hover:brightness-110 transition-colors whitespace-nowrap font-semibold shadow-md shadow-purple-500/40"
          >
            <i className="ri-add-line mr-2"></i>
            Agregar Producto
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-800 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'border-purple-500 text-purple-300'
                  : 'border-transparent text-slate-400 hover:text-slate-100 hover:border-slate-600'
              }`}
            >
              <i className="ri-dashboard-line mr-2"></i>
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'products'
                  ? 'border-purple-500 text-purple-300'
                  : 'border-transparent text-slate-400 hover:text-slate-100 hover:border-slate-600'
              }`}
            >
              <i className="ri-shopping-bag-line mr-2"></i>
              Productos
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'categories'
                  ? 'border-purple-500 text-purple-300'
                  : 'border-transparent text-slate-400 hover:text-slate-100 hover:border-slate-600'
              }`}
            >
              <i className="ri-folder-line mr-2"></i>
              Categorías
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'reports'
                  ? 'border-purple-500 text-purple-300'
                  : 'border-transparent text-slate-400 hover:text-slate-100 hover:border-slate-600'
              }`}
            >
              <i className="ri-file-chart-line mr-2"></i>
              Reportes
            </button>
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-900/60">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-sky-400 shadow-md shadow-purple-500/40">
                    <i className="ri-shopping-bag-line text-2xl text-slate-950"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-400">Total Productos</p>
                    <p className="text-2xl font-semibold text-slate-50">{totalProducts}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-900/60">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40">
                    <i className="ri-check-line text-2xl text-emerald-300"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-400">Productos Activos</p>
                    <p className="text-2xl font-semibold text-slate-50">{activeProducts}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-900/60">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40">
                    <i className="ri-alert-line text-2xl text-red-300"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-400">Stock Bajo</p>
                    <p className="text-2xl font-semibold text-slate-50">{lowStockProducts}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-900/60">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/50">
                    <i className="ri-money-dollar-circle-line text-2xl text-purple-200"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-400">Valor Total</p>
                    <p className="text-2xl font-semibold text-slate-50">${totalValue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-900/60">
              <h3 className="text-lg font-semibold text-slate-50 mb-4">Resumen Financiero</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-slate-400">Valor Total Inventario</p>
                  <p className="text-2xl font-bold text-slate-50">${totalValue.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-400">Costo Total</p>
                  <p className="text-2xl font-bold text-slate-50">${totalCost.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-400">Ganancia Potencial</p>
                  <p className="text-2xl font-bold text-emerald-400">${potentialProfit.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Low Stock Alert */}
            {lowStockProducts > 0 && (
              <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4">
                <div className="flex items-center">
                  <i className="ri-alert-line text-red-300 text-xl mr-3"></i>
                  <div>
                    <h4 className="text-red-100 font-medium">Alerta de Stock Bajo</h4>
                    <p className="text-red-200 text-sm">
                      {lowStockProducts} productos tienen stock por debajo del mínimo recomendado.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('products');
                      setSelectedStatus('low_stock');
                    }}
                    className="ml-auto bg-red-500 text-slate-950 px-4 py-2 rounded-xl hover:brightness-110 transition-colors text-sm whitespace-nowrap font-semibold shadow-md shadow-red-500/40"
                  >
                    Ver productos
                  </button>
                </div>
              </div>
            )}

            {/* Recent Products */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-900/60">
              <div className="p-6 border-b border-slate-800">
                <h3 className="text-lg font-semibold text-slate-50">Productos Recientes</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {products.slice(0, 5).map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between py-3 border-b border-slate-800 last:border-b-0"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={
                            product.imageUrl ||
                            'https://readdy.ai/api/search-image?query=generic%20product%20placeholder%20on%20clean%20white%20background%2C%20professional%20product%20photography%2C%20high%20quality%2C%20detailed%20view%2C%20simple%20design&width=60&height=60&seq=placeholder002&orientation=squarish'
                          }
                          alt={product.name}
                          className="w-12 h-12 object-cover object-top rounded-lg border border-slate-700"
                        />
                        <div>
                          <h4 className="font-medium text-slate-50">{product.name}</h4>
                          <p className="text-sm text-slate-400">{product.sku}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-50">${product.price.toLocaleString()}</p>
                        <p className="text-sm text-slate-400">Stock: {product.stock}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Filters and Actions */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-950/60 p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="ri-search-line text-slate-500"></i>
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70 text-sm"
                    placeholder="Buscar productos..."
                  />
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-50 text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70"
                >
                  <option value="all">Todas las Categorías</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>{category.name}</option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-50 text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70"
                >
                  <option value="all">Todos los Estados</option>
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="low_stock">Stock Bajo</option>
                </select>

                <button
                  onClick={exportToCSV}
                  className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-500 transition-colors text-sm whitespace-nowrap shadow-md shadow-emerald-500/30"
                >
                  <i className="ri-download-line mr-2"></i>
                  Exportar Excel
                </button>

                <div className="text-sm text-slate-400 flex items-center">
                  <span className="font-medium text-slate-100">{filteredProducts.length}</span>
                  <span className="ml-1">productos</span>
                </div>
              </div>

              {/* Bulk Actions */}
              {showBulkActions && (
                <div className="flex items-center justify-between bg-sky-950/60 border border-sky-500/40 p-3 rounded-xl">
                  <span className="text-sm text-sky-200">
                    {selectedProducts.length} productos seleccionados
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleBulkStatusChange('active')}
                      className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-emerald-500 transition-colors whitespace-nowrap"
                    >
                      Activar
                    </button>
                    <button
                      onClick={() => handleBulkStatusChange('inactive')}
                      className="bg-slate-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-slate-500 transition-colors whitespace-nowrap"
                    >
                      Desactivar
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-rose-500 transition-colors whitespace-nowrap"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )}

              {/* Select All */}
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                  onChange={selectAllProducts}
                  className="h-4 w-4 text-purple-500 focus:ring-purple-500 border-slate-600 rounded bg-slate-900"
                />
                <label className="ml-2 text-sm text-slate-400">
                  Seleccionar todos los productos visibles
                </label>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <i className="ri-shopping-bag-line text-6xl text-slate-700 mb-4 block"></i>
                  <h3 className="text-lg font-medium text-slate-100 mb-2">No hay productos registrados</h3>
                  <p className="text-slate-400 mb-4">Comience agregando su primer producto al inventario.</p>
                  <button
                    onClick={() => {
                      resetForm();
                      setShowModal(true);
                    }}
                    className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-sky-400 text-slate-950 px-4 py-2 rounded-xl hover:brightness-110 transition-colors whitespace-nowrap font-semibold shadow-md shadow-purple-500/40"
                  >
                    <i className="ri-add-line mr-2"></i>
                    Agregar Primer Producto
                  </button>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div key={product.id} className="bg-slate-950/80 rounded-2xl shadow-lg shadow-slate-950/60 border border-slate-800 overflow-hidden">
                    {/* Selection Checkbox */}
                    <div className="p-3 border-b border-slate-800 bg-slate-950/90">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleProductSelection(product.id)}
                        className="h-4 w-4 text-purple-500 focus:ring-purple-500 border-slate-600 rounded bg-slate-900"
                      />
                    </div>

                    {/* Product Image */}
                    <div className="w-full h-48 bg-slate-900 overflow-hidden">
                      <img
                        src={product.imageUrl || 'https://readdy.ai/api/search-image?query=generic%20product%20placeholder%20on%20clean%20white%20background%2C%20professional%20product%20photography%2C%20high%20quality%2C%20detailed%20view%2C%20simple%20design&width=300&height=300&seq=placeholder003&orientation=squarish'}
                        alt={product.name}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwQzE2MS4wNDYgMTAwIDE3MCA5MC45NTQzIDE3MCA4MEM1NyA2OS4wNDU3IDE0Ny45NTQgNjAgMTM2IDYwQzEyNC45NTQgNjAgMTE2IDY5LjA0NTcgMTE2IDgwQzExNiA5MC45NTQzIDEyNC45NTQgMTAwIDEzNiAxMDBIMTUwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTg2IDEyMEgxMTRDMTA3LjM3MyAxMjAgMTAyIDEyNS4zNzMgMTAyIDEzMlYyMDBDMTAyIDIwNi42MjcgMTA3LjM3MyAyMTIgMTE0IDIxMkgxODZDMTkyLjYyNyAyMTIgMTk4IDIwNi4yMjJgMTk0IDIwMFYxMzJDMTk0IDEyNS4zNzMgMTkyLjYyNyAxMjAgMTg2IDEyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-400">{product.category}</span>
                        <span className={`text-xs px-2 py-1 rounded-full border ${
                          product.status === 'active'
                            ? 'bg-emerald-950/60 text-emerald-200 border-emerald-500/50'
                            : 'bg-slate-900/80 text-slate-300 border-slate-700'
                        }`}>
                          {product.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>

                      <h3 className="font-semibold text-slate-50 mb-1 text-sm">{product.name}</h3>
                      <p className="text-xs text-slate-400 mb-2">SKU: {product.sku}</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="text-lg font-bold text-purple-300">${product.price.toLocaleString()}</div>
                          <div className="text-xs text-slate-400">Costo: ${product.cost.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${product.stock <= product.minStock ? 'text-rose-400' : 'text-slate-100'}`}>
                            Stock: {product.stock}
                          </div>
                          <div className="text-xs text-slate-500">Min: {product.minStock}</div>
                        </div>
                      </div>

                      {product.stock <= product.minStock && (
                        <div className="bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs p-2 rounded-lg mb-3 flex items-center">
                          <i className="ri-alert-line mr-1 text-rose-300"></i>
                          Stock bajo
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="flex-1 bg-slate-900/80 text-slate-100 py-2 px-3 rounded-xl hover:bg-slate-800 transition-colors text-sm whitespace-nowrap border border-slate-700"
                        >
                          <i className="ri-edit-line mr-1"></i>
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="flex-1 bg-rose-950/60 text-rose-200 py-2 px-3 rounded-xl hover:bg-rose-900 transition-colors text-sm whitespace-nowrap border border-rose-500/50"
                        >
                          <i className="ri-delete-bin-line mr-1"></i>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-950/60">
              <div className="p-6 border-b border-slate-800">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-slate-50">Gestión de Categorías</h3>
                  <button
                    onClick={() => {
                      resetCategoryForm();
                      setShowCategoryModal(true);
                    }}
                    className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-sky-400 text-slate-950 px-4 py-2 rounded-xl hover:brightness-110 transition-colors whitespace-nowrap font-semibold shadow-md shadow-purple-500/40"
                  >
                    <i className="ri-add-line mr-2"></i>
                    Nueva Categoría
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => {
                    const categoryProducts = products.filter(p => p.category === category.name);
                    const categoryValue = categoryProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
                    
                    return (
                      <div key={category.id} className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 hover:border-purple-500/70 hover:shadow-lg hover:shadow-purple-500/20 transition-all">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-slate-50 text-lg">{category.name}</h4>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditCategory(category)}
                              className="text-slate-400 hover:text-slate-100 transition-colors"
                              title="Editar categoría"
                            >
                              <i className="ri-edit-line"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="text-rose-400 hover:text-rose-200 transition-colors"
                              title="Eliminar categoría"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400">Productos:</span>
                            <span className="font-medium text-slate-50">{categoryProducts.length}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400">Valor total:</span>
                            <span className="font-medium text-emerald-400">${categoryValue.toLocaleString()}</span>
                          </div>
                          
                          {categoryProducts.length > 0 && (
                            <button
                              onClick={() => {
                                setActiveTab('products');
                                setSelectedCategory(category.name);
                                setSearchTerm('');
                                setSelectedStatus('all');
                              }}
                              className="w-full mt-3 bg-slate-900/80 text-slate-100 py-2 px-3 rounded-xl hover:bg-slate-800 transition-colors text-sm whitespace-nowrap border border-slate-700"
                            >
                              <i className="ri-eye-line mr-2"></i>
                              Ver Productos
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {categories.length === 0 && (
                  <div className="text-center py-12">
                    <i className="ri-folder-line text-6xl text-slate-700 mb-4 block"></i>
                    <h3 className="text-lg font-medium text-slate-100 mb-2">No hay categorías registradas</h3>
                    <p className="text-slate-400 mb-4">Comience creando su primera categoría de productos.</p>
                    <button
                      onClick={() => {
                        resetCategoryForm();
                        setShowCategoryModal(true);
                      }}
                      className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-sky-400 text-slate-950 px-4 py-2 rounded-xl hover:brightness-110 transition-colors whitespace-nowrap font-semibold shadow-md shadow-purple-500/40"
                    >
                      <i className="ri-add-line mr-2"></i>
                      Crear Primera Categoría
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-950/60 p-6">
                <h3 className="text-lg font-semibold text-slate-50 mb-2">Reporte de Inventario</h3>
                <p className="text-slate-400 mb-4 text-sm">Exportar lista completa de productos con stock y precios.</p>
                <button
                  onClick={exportToCSV}
                  className="w-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-sky-400 text-slate-950 py-2.5 rounded-xl hover:brightness-110 transition-colors whitespace-nowrap font-semibold shadow-md shadow-purple-500/40"
                >
                  <i className="ri-download-line mr-2"></i>
                  Descargar Excel
                </button>
              </div>

              <div className="rounded-2xl border border-rose-500/50 bg-rose-950/60 shadow-lg shadow-rose-900/60 p-6">
                <h3 className="text-lg font-semibold text-rose-100 mb-2">Productos con Stock Bajo</h3>
                <p className="text-rose-200 mb-4 text-sm">Lista de productos que necesitan reabastecimiento.</p>
                <button
                  onClick={() => {
                    const lowStockData = products.filter(p => p.stock <= p.minStock);
                    const headers = ['Nombre', 'SKU', 'Stock Actual', 'Stock Mínimo', 'Diferencia'];
                    const csvContent = [
                      headers.join(','),
                      ...lowStockData.map(product => [
                        `"${product.name}"`,
                        product.sku,
                        product.stock,
                        product.minStock,
                        product.minStock - product.stock
                      ].join(','))
                    ].join('\n');

                    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `stock_bajo_${new Date().toISOString().split('T')[0]}.csv`;
                    link.click();
                  }}
                  className="w-full bg-rose-500 text-slate-950 py-2.5 rounded-xl hover:bg-rose-400 transition-colors whitespace-nowrap font-semibold shadow-md shadow-rose-500/40"
                >
                  <i className="ri-alert-line mr-2"></i>
                  Descargar Reporte
                </button>
              </div>

              <div className="rounded-2xl border border-emerald-500/50 bg-emerald-950/60 shadow-lg shadow-emerald-900/60 p-6">
                <h3 className="text-lg font-semibold text-emerald-100 mb-2">Valorización de Inventario</h3>
                <p className="text-emerald-200 mb-4 text-sm">Reporte financiero del valor total del inventario.</p>
                <button
                  onClick={() => {
                    const headers = ['Categoría', 'Productos', 'Valor Total', 'Costo Total', 'Ganancia'];
                    const categoryData = categories.map(cat => {
                      const catProducts = products.filter(p => p.category === cat.name);
                      const totalValue = catProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
                      const totalCost = catProducts.reduce((sum, p) => sum + (p.cost * p.stock), 0);
                      return [
                        cat.name,
                        catProducts.length,
                        totalValue,
                        totalCost,
                        totalValue - totalCost
                      ];
                    });

                    const csvContent = [
                      headers.join(','),
                      ...categoryData.map(row => row.join(','))
                    ].join('\n');

                    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `valorizacion_${new Date().toISOString().split('T')[0]}.csv`;
                    link.click();
                  }}
                  className="w-full bg-emerald-500 text-slate-950 py-2.5 rounded-xl hover:bg-emerald-400 transition-colors whitespace-nowrap font-semibold shadow-md shadow-emerald-500/40"
                >
                  <i className="ri-money-dollar-circle-line mr-2"></i>
                  Descargar Valorización
                </button>
              </div>
            </div>

            {/* Statistics Summary */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 shadow-lg shadow-slate-950/60 p-6">
              <h3 className="text-lg font-semibold text-slate-50 mb-4">Estadísticas Generales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-300">{totalProducts}</p>
                  <p className="text-sm text-slate-400">Total de Productos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-400">{activeProducts}</p>
                  <p className="text-sm text-slate-400">Productos Activos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-rose-400">{lowStockProducts}</p>
                  <p className="text-sm text-slate-400">Stock Bajo</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-300">${totalValue.toLocaleString()}</p>
                  <p className="text-sm text-slate-400">Valor Total</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Modal */}
        {showCategoryModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-950 rounded-2xl w-full max-w-md border border-slate-800 shadow-2xl shadow-slate-950/80">
              <div className="p-6 border-b border-slate-800">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-slate-50">
                    {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                  </h2>
                  <button
                    onClick={() => setShowCategoryModal(false)}
                    className="text-slate-400 hover:text-slate-100 hover:bg-slate-900 rounded-full p-1.5"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>

                <form onSubmit={handleCategorySubmit} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Nombre de la Categoría *
                    </label>
                    <input
                      type="text"
                      required
                      value={categoryFormData.name}
                      onChange={(e) => setCategoryFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-3 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70"
                      placeholder="Ej: Electrónicos, Ropa, Hogar..."
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCategoryModal(false)}
                      className="flex-1 bg-slate-900/80 text-slate-200 py-3 rounded-xl hover:bg-slate-800 transition-colors whitespace-nowrap border border-slate-700"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-sky-400 text-slate-950 py-3 rounded-xl hover:brightness-110 transition-colors whitespace-nowrap font-semibold shadow-md shadow-purple-500/40"
                    >
                      {editingCategory ? 'Actualizar' : 'Crear'} Categoría
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Product Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-950 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-800 shadow-2xl shadow-slate-950/80">
              <div className="p-6 border-b border-slate-800">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-slate-50">
                    {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-slate-400 hover:text-slate-100 hover:bg-slate-900 rounded-full p-1.5"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                  {/* Product Image */}
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Imagen del Producto
                    </label>
                    <div className="flex items-center space-x-4">
                      {formData.imageUrl && (
                        <div className="w-20 h-20 bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
                          <img
                            src={formData.imageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full p-3 border-2 border-dashed border-slate-700 rounded-xl hover:border-purple-400 transition-colors text-center bg-slate-900/80"
                        >
                          <i className="ri-upload-cloud-line text-2xl text-slate-400 mb-2 block"></i>
                          <span className="text-sm text-slate-300">
                            {formData.imageUrl ? 'Cambiar imagen' : 'Subir imagen'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-2">
                        Nombre del Producto *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full p-3 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-2">
                        SKU *
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          required
                          value={formData.sku}
                          onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                          className="flex-1 p-3 rounded-l-xl bg-slate-900/80 border border-slate-700 text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, sku: generateSKU() }))}
                          className="px-3 bg-slate-900/80 border border-l-0 border-slate-700 rounded-r-xl hover:bg-slate-800 transition-colors text-slate-200"
                        >
                          <i className="ri-refresh-line"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-2">
                        Categoría *
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full p-3 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70 pr-8"
                      >
                        <option value="">Seleccionar categoría</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.name}>{category.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-2">
                        Código de Barras
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value={formData.barcode}
                          onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
                          className="flex-1 p-3 rounded-l-xl bg-slate-900/80 border border-slate-700 text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, barcode: generateBarcode().toString() }))}
                          className="px-3 bg-slate-900/80 border border-l-0 border-slate-700 rounded-r-xl hover:bg-slate-800 transition-colors text-slate-200"
                        >
                          <i className="ri-refresh-line"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-2">
                        Precio de Venta *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full p-3 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-2">
                        Costo *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.cost}
                        onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                        className="w-full p-3 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70"
                      />
                    </div>
                  </div>

                  {/* Inventory */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-2">
                        Stock Actual *
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.stock}
                        onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                        className="w-full p-3 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-2">
                        Stock Mínimo *
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.minStock}
                        onChange={(e) => setFormData(prev => ({ ...prev, minStock: e.target.value }))}
                        className="w-full p-3 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-2">
                        Stock Máximo *
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.maxStock}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxStock: e.target.value }))}
                        className="w-full p-3 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70"
                      />
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Proveedor
                    </label>
                    <input
                      type="text"
                      value={formData.supplier}
                      onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                      className="w-full p-3 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Descripción
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full p-3 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Estado
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                      className="w-full p-3 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/70 pr-8"
                    >
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                    </select>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-slate-900/80 text-slate-200 py-3 rounded-xl hover:bg-slate-800 transition-colors whitespace-nowrap border border-slate-700"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-sky-400 text-slate-950 py-3 rounded-xl hover:brightness-110 transition-colors whitespace-nowrap font-semibold shadow-md shadow-purple-500/40"
                    >
                      {editingProduct ? 'Actualizar' : 'Agregar'} Producto
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
