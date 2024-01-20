import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Search, Plus, Grid, List, Image as ImageIcon } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/formatters';
import Modal from '../components/Modal';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [formData, setFormData] = useState({ name: '', category: 'Electronics', price: '', stock: '', status: 'active', image: '' });
  const [currentId, setCurrentId] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/products?category=${categoryFilter}&search=${search}`);
      setProducts(res.data.products);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, categoryFilter]);

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ name: '', category: 'Electronics', price: '', stock: '', status: 'active', image: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setModalMode('edit');
    setFormData({ ...product });
    setCurrentId(product._id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await api.post('/products', formData);
        toast.success('Product added successfully');
      } else {
        await api.put(`/products/${currentId}`, formData);
        toast.success('Product updated successfully');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const statusColors = {
    active: 'bg-accent-success/10 text-accent-success border-accent-success/20',
    out_of_stock: 'bg-accent-warning/10 text-accent-warning border-accent-warning/20',
    discontinued: 'bg-accent-danger/10 text-accent-danger border-accent-danger/20'
  };

  const categoryColors = {
    Electronics: 'bg-accent-primary',
    Clothing: 'bg-accent-purple',
    Books: 'bg-accent-warning',
    Home: 'bg-accent-success',
    Sports: 'bg-accent-danger'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-accent-primary hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Filters and Controls */}
      <div className="card-bg border border-custom p-4 rounded-xl flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-sub" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-light-main dark:bg-dark-main border border-custom rounded-lg focus:outline-none focus:border-accent-primary text-sm"
            />
          </div>
          
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-light-main dark:bg-dark-main border border-custom rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent-primary min-w-[150px]"
          >
            <option>All</option>
            <option>Electronics</option>
            <option>Clothing</option>
            <option>Books</option>
            <option>Home</option>
            <option>Sports</option>
          </select>
        </div>

        <div className="flex bg-light-main dark:bg-dark-main rounded-lg p-1 border border-custom self-start sm:self-auto">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-light-card dark:bg-dark-card shadow-sm text-accent-primary' : 'text-sub hover:text-light-text dark:hover:text-dark-text'}`}
          >
            <Grid size={18} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-light-card dark:bg-dark-card shadow-sm text-accent-primary' : 'text-sub hover:text-light-text dark:hover:text-dark-text'}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="card-bg border border-custom rounded-xl p-12 text-center text-sub">
          No products found.
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="card-bg border border-custom rounded-xl overflow-hidden hover:shadow-lg transition-all group flex flex-col">
              <div className="h-48 w-full bg-light-main dark:bg-dark-main relative overflow-hidden group-hover:opacity-90 transition-opacity">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sub">
                    <ImageIcon size={40} opacity={0.5} />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm rounded-lg p-1">
                  <button onClick={() => openEditModal(product)} className="p-1.5 text-white hover:text-accent-primary transition-colors"><Edit2 size={14} /></button>
                  <button onClick={() => deleteProduct(product._id)} className="p-1.5 text-white hover:text-accent-danger transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${categoryColors[product.category] || 'bg-gray-500'} bg-opacity-10 text-${categoryColors[product.category]?.split('-')[1] || 'gray-500'}`}>
                    {product.category}
                  </span>
                </div>
                
                <h3 className="font-semibold text-lg mb-1 line-clamp-2 flex-1">{product.name}</h3>
                <p className="text-accent-primary font-bold text-xl mb-4">{formatCurrency(product.price)}</p>
                
                <div className="flex justify-between items-center text-sm mb-4">
                  <div className="text-sub">
                    <span className="block text-xs">Stock</span>
                    <span className="font-medium text-light-text dark:text-dark-text">{product.stock}</span>
                  </div>
                  <div className="text-sub text-right">
                    <span className="block text-xs">Sales</span>
                    <span className="font-medium text-light-text dark:text-dark-text">{product.sales}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-custom mt-auto">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border inline-block w-full text-center ${statusColors[product.status]}`}>
                    {product.status.replace('_', ' ').charAt(0).toUpperCase() + product.status.replace('_', ' ').slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-bg border border-custom rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-light-main dark:bg-dark-main border-b border-custom">
                <tr>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Stock</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-custom last:border-0 hover:bg-light-main dark:hover:bg-dark-main transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-custom" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-sub border border-custom">
                            <ImageIcon size={16} />
                          </div>
                        )}
                        <span className="font-medium text-light-text dark:text-dark-text">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sub">{product.category}</td>
                    <td className="px-6 py-4 font-medium text-accent-primary">{formatCurrency(product.price)}</td>
                    <td className="px-6 py-4">{product.stock}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[product.status]}`}>
                        {product.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(product)} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors text-sub hover:text-accent-primary">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => deleteProduct(product._id)} className="p-1.5 hover:bg-accent-danger/10 rounded-md transition-colors text-sub hover:text-accent-danger">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'add' ? 'Add New Product' : 'Edit Product'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-sub mb-1">Product Name</label>
            <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 bg-light-main dark:bg-dark-main border border-custom rounded-lg focus:outline-none focus:border-accent-primary" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-sub mb-1">Category</label>
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 bg-light-main dark:bg-dark-main border border-custom rounded-lg focus:outline-none focus:border-accent-primary">
                <option>Electronics</option>
                <option>Clothing</option>
                <option>Books</option>
                <option>Home</option>
                <option>Sports</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-sub mb-1">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 bg-light-main dark:bg-dark-main border border-custom rounded-lg focus:outline-none focus:border-accent-primary">
                <option value="active">Active</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-sub mb-1">Price ($)</label>
              <input required type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full px-3 py-2 bg-light-main dark:bg-dark-main border border-custom rounded-lg focus:outline-none focus:border-accent-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-sub mb-1">Stock</label>
              <input required type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full px-3 py-2 bg-light-main dark:bg-dark-main border border-custom rounded-lg focus:outline-none focus:border-accent-primary" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-sub mb-1">Image URL</label>
            <input type="url" placeholder="https://images.unsplash.com/..." value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full px-3 py-2 bg-light-main dark:bg-dark-main border border-custom rounded-lg focus:outline-none focus:border-accent-primary" />
            {formData.image && (
              <div className="mt-2 h-32 rounded-lg overflow-hidden border border-custom">
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-custom">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-dark-main rounded-lg transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium bg-accent-primary text-white hover:bg-blue-600 rounded-lg transition-colors">
              {modalMode === 'add' ? 'Create Product' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductsPage;
