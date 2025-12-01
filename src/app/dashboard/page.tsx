"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Package, Edit, Trash2, LogOut, X } from 'lucide-react';

// Mock auth functions - replace with your actual auth implementation
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
const removeToken = () => typeof window !== 'undefined' && localStorage.removeItem('authToken');

interface Product {
  id: number;
  item_name: string;
  quantity: number;
  unit?: string;
  price?: number;
}

export default function InventoryDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [withdrawingProduct, setWithdrawingProduct] = useState<Product | null>(null);
  const [withdrawQuantity, setWithdrawQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    item_name: '',
    quantity: '',
    unit: '',
    price: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = getToken();
      console.log('Fetching products with token:', token);
      
      const response = await fetch('https://midterm-output-1.onrender.com/inventory', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Fetch response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched products:', data);
        setProducts(data);
      } else {
        const errorData = await response.json();
        console.error('Error fetching products:', errorData);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!formData.item_name || !formData.quantity || !formData.price) {
      alert('Please fill in all required fields');
      return;
    }

    const token = getToken();
    if (!token) {
      alert('You are not logged in. Please login first.');
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    try {
      console.log('Sending request with token:', token);
      
      const payload = {
        item_name: formData.item_name,
        quantity: parseInt(formData.quantity),
        unit: formData.unit || null,
        price: parseFloat(formData.price)
      };
      
      console.log('Payload:', payload);
      
      const response = await fetch('https://midterm-output-1.onrender.com/inventory', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        await fetchProducts();
        setShowAddModal(false);
        resetForm();
        alert('Product added successfully!');
      } else {
        alert(`Failed to add product: ${responseData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert(`Failed to add product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    
    const token = getToken();
    if (!token) {
      alert('You are not logged in. Please login first.');
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://midterm-output-1.onrender.com/inventory/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          item_name: formData.item_name,
          quantity: parseInt(formData.quantity),
          unit: formData.unit || null,
          price: parseFloat(formData.price)
        })
      });

      if (response.ok) {
        await fetchProducts();
        setShowEditModal(false);
        setEditingProduct(null);
        resetForm();
        alert('Product updated successfully!');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`https://midterm-output-1.onrender.com/inventory/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchProducts();
        alert('Product deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const openWithdrawModal = (product: Product) => {
    setWithdrawingProduct(product);
    setWithdrawQuantity('');
    setShowWithdrawModal(true);
  };

  const handleWithdrawProduct = async () => {
    if (!withdrawingProduct) return;
    
    const withdrawAmount = parseInt(withdrawQuantity);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    if (withdrawAmount > withdrawingProduct.quantity) {
      alert(`Cannot withdraw ${withdrawAmount}. Only ${withdrawingProduct.quantity} available.`);
      return;
    }

    const token = getToken();
    if (!token) {
      alert('You are not logged in. Please login first.');
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    try {
      const newQuantity = withdrawingProduct.quantity - withdrawAmount;
      const response = await fetch(`https://midterm-output-1.onrender.com/inventory/${withdrawingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quantity: newQuantity
        })
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        await fetchProducts();
        setShowWithdrawModal(false);
        setWithdrawingProduct(null);
        setWithdrawQuantity('');
        alert(`Successfully withdrew ${withdrawAmount} ${withdrawingProduct.unit || 'unit(s)'}. New quantity: ${newQuantity}`);
      } else {
        alert(`Failed to withdraw product: ${responseData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error withdrawing product:', error);
      alert(`Failed to withdraw product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      item_name: product.item_name,
      quantity: product.quantity.toString(),
      unit: product.unit || '',
      price: Number(product.price || 0).toString()
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      item_name: '',
      quantity: '',
      unit: '',
      price: ''
    });
  };

  const handleLogout = () => {
    removeToken();
    window.location.href = '/login';
  };

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + (Number(p.price || 0) * p.quantity), 0);
  const lowStock = products.filter(p => p.quantity < 100).length;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Inventory Management
              </h1>
            </div>
            
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              size="sm"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Products</p>
                  <p className="text-3xl font-bold text-white">{totalProducts}</p>
                </div>
                <Package className="w-12 h-12 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Value</p>
                  <p className="text-3xl font-bold text-white">₱{totalValue.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Low Stock Items</p>
                  <p className="text-3xl font-bold text-white">{lowStock}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Section */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white text-xl">Product Inventory</CardTitle>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </CardHeader>
          <CardContent>
            {loading && products.length === 0 ? (
              <p className="text-center text-gray-400 py-8">Loading products...</p>
            ) : products.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No products yet. Add your first product!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Item Name</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Unit</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Price</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Quantity</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Total Value</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="py-3 px-4 text-white font-medium">{product.item_name}</td>
                        <td className="py-3 px-4 text-gray-300">{product.unit || '-'}</td>
                        <td className="py-3 px-4 text-green-400">₱{Number(product.price || 0).toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            product.quantity < 100 
                              ? 'bg-red-500/20 text-red-400' 
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            {product.quantity}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-blue-400">₱{(Number(product.price || 0) * product.quantity).toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openWithdrawModal(product)}
                              className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20"
                              title="Withdraw Stock"
                            >
                              📦
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openEditModal(product)}
                              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Add New Product</CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => { setShowAddModal(false); resetForm(); }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Item Name *</label>
                  <input
                    type="text"
                    value={formData.item_name}
                    onChange={(e) => setFormData({...formData, item_name: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Chicken"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Unit</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., kg, pcs, box"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Quantity *</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => { setShowAddModal(false); resetForm(); }}
                    className="flex-1 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddProduct}
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? 'Adding...' : 'Add Product'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Edit Product</CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => { setShowEditModal(false); setEditingProduct(null); resetForm(); }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Item Name *</label>
                  <input
                    type="text"
                    value={formData.item_name}
                    onChange={(e) => setFormData({...formData, item_name: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Unit</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., kg, pcs, box"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Quantity *</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => { setShowEditModal(false); setEditingProduct(null); resetForm(); }}
                    className="flex-1 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdateProduct}
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? 'Updating...' : 'Update Product'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Withdraw Stock Modal */}
      {showWithdrawModal && withdrawingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Withdraw Stock</CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => { setShowWithdrawModal(false); setWithdrawingProduct(null); setWithdrawQuantity(''); }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">Item</p>
                  <p className="text-lg font-semibold text-white">{withdrawingProduct.item_name}</p>
                  <div className="mt-2 flex justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Available</p>
                      <p className="text-xl font-bold text-green-400">{withdrawingProduct.quantity} {withdrawingProduct.unit || 'units'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Price per unit</p>
                      <p className="text-xl font-bold text-blue-400">₱{Number(withdrawingProduct.price || 0).toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Withdraw Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    max={withdrawingProduct.quantity}
                    value={withdrawQuantity}
                    onChange={(e) => setWithdrawQuantity(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder={`Max: ${withdrawingProduct.quantity}`}
                  />
                </div>

                {withdrawQuantity && parseInt(withdrawQuantity) > 0 && (
                  <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg">
                    <p className="text-sm text-blue-300">
                      After withdrawal: <span className="font-bold">{withdrawingProduct.quantity - parseInt(withdrawQuantity)} {withdrawingProduct.unit || 'units'}</span> remaining
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => { setShowWithdrawModal(false); setWithdrawingProduct(null); setWithdrawQuantity(''); }}
                    className="flex-1 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleWithdrawProduct}
                    disabled={loading || !withdrawQuantity || parseInt(withdrawQuantity) <= 0}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                  >
                    {loading ? 'Processing...' : 'Withdraw'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}