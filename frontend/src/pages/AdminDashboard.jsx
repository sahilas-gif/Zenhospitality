import { useState, useEffect, useCallback } from 'react';
import { LayoutDashboard, LogOut, Calendar, Package as PackageIcon, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

const INITIAL_FORM = {
  title: '', slug: '', description: '', category: 'travel_booking',
  destination: '', duration_days: 1, price_from: 0, price_to: 0,
  highlights: [], is_featured: false, images: []
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('packages');
  const [packages, setPackages] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  // Form State
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [highlightInput, setHighlightInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'packages') {
        const { data } = await api.get('/packages');
        setPackages(data);
      } else {
        const { data } = await api.get('/admin/enquiries');
        setEnquiries(data);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  }, [activeTab, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/admin/login');
  };

  const openModal = (pkg = null) => {
    if (pkg) {
      setEditingPackage(pkg);
      setFormData({
        title: pkg.title, slug: pkg.slug, description: pkg.description,
        category: pkg.category, destination: pkg.destination,
        duration_days: pkg.duration_days, price_from: pkg.price_from,
        price_to: pkg.price_to, highlights: pkg.highlights || [],
        is_featured: pkg.is_featured, images: pkg.images || []
      });
    } else {
      setEditingPackage(null);
      setFormData(INITIAL_FORM);
    }
    setFiles([]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPackage(null);
  };

  const addHighlight = () => {
    if (highlightInput.trim()) {
      setFormData({ ...formData, highlights: [...formData.highlights, highlightInput.trim()] });
      setHighlightInput('');
    }
  };

  const removeHighlight = (idx) => {
    setFormData({ ...formData, highlights: formData.highlights.filter((_, i) => i !== idx) });
  };

  const removeImage = (idx) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) });
  };

  const handleChange = (field, transform = v => v) => (e) =>
    setFormData(prev => ({ ...prev, [field]: transform(e.target.value) }));

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      let finalImages = [...formData.images];
      
      if (files.length > 0) {
        setUploading(true);
        const uploadData = new FormData();
        Array.from(files).forEach(file => uploadData.append('files', file));
        
        const uploadRes = await api.post('/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        finalImages = [...finalImages, ...uploadRes.data.urls];
        setUploading(false);
      }

      const payload = { ...formData, images: finalImages };

      if (editingPackage) {
        await api.put(`/packages/${editingPackage.id}`, payload);
      } else {
        await api.post('/packages', payload);
      }
      
      closeModal();
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to save package');
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this package?')) {
      try {
        await api.delete(`/packages/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
        alert('Failed to delete package');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] pt-8 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-white flex items-center">
              <LayoutDashboard className="w-8 h-8 mr-3 text-emerald-500" />
              Admin Portal
            </h1>
          </div>
          <button onClick={handleLogout} className="flex items-center px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition-colors border border-red-900/50 text-sm">
            <LogOut className="w-4 h-4 mr-1.5" /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-800 pb-2">
          <button 
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${activeTab === 'packages' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('packages')}
          >
            <PackageIcon className="w-4 h-4" /> Packages
          </button>
          <button 
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${activeTab === 'enquiries' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('enquiries')}
          >
            <Calendar className="w-4 h-4" /> Enquiries
          </button>
        </div>

        {/* Content */}
        <div className="glass-card rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/20 backdrop-blur-md">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500" />
            </div>
          ) : activeTab === 'packages' ? (
            <div>
              <div className="p-4 border-b border-gray-800 flex justify-between">
                <h2 className="text-xl font-medium text-white">Manage Packages</h2>
                <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors text-sm font-medium shadow-lg shadow-emerald-900/20">
                  <Plus className="w-4 h-4" /> Add Package
                </button>
              </div>
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Title</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Price</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {packages.map(pkg => (
                    <tr key={pkg.id} className="hover:bg-gray-800/30">
                      <td className="px-6 py-4 text-sm font-medium text-white">{pkg.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-400 capitalize">{pkg.category.replace('_', ' ')}</td>
                      <td className="px-6 py-4 text-sm text-emerald-400">${pkg.price_from} - ${pkg.price_to}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => openModal(pkg)} className="text-blue-400 hover:text-blue-300 mr-4"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(pkg.id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <div className="p-4 border-b border-gray-800">
                <h2 className="text-xl font-medium text-white">Customer Enquiries</h2>
              </div>
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Phone</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {enquiries.map(enq => (
                    <tr key={enq.id} className="hover:bg-gray-800/30">
                      <td className="px-6 py-4 text-sm font-medium text-white">{enq.customer_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{enq.customer_phone}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-2 py-1 rounded bg-gray-800 text-gray-300 text-xs">{enq.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0a0f1c] border border-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-[#0a0f1c] border-b border-gray-800 p-4 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-white">{editingPackage ? 'Edit Package' : 'New Package'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Title</label>
                  <input required type="text" value={formData.title} onChange={handleChange('title')} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Slug (URL friendly)</label>
                  <input required type="text" value={formData.slug} onChange={handleChange('slug')} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Description</label>
                  <textarea required rows={3} value={formData.description} onChange={handleChange('description')} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Category</label>
                  <select value={formData.category} onChange={handleChange('category')} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
                    <option value="travel_booking">Travel Booking</option>
                    <option value="corporate">Corporate</option>
                    <option value="hotel_management">Hotel Management</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Destination</label>
                  <input type="text" value={formData.destination} onChange={handleChange('destination')} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Duration (Days)</label>
                  <input type="number" min="1" value={formData.duration_days} onChange={handleChange('duration_days', v => parseInt(v))} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-400 mb-1">Price From</label>
                    <input type="number" value={formData.price_from} onChange={handleChange('price_from', v => parseFloat(v))} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-gray-400 mb-1">Price To</label>
                    <input type="number" value={formData.price_to} onChange={handleChange('price_to', v => parseFloat(v))} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Highlights</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={highlightInput} onChange={e => setHighlightInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addHighlight())} className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder="e.g. 5 Star Accommodation" />
                    <button type="button" onClick={addHighlight} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.highlights.map((h, i) => (
                      <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-emerald-900/30 text-emerald-400 border border-emerald-800/50">
                        {h}
                        <button type="button" onClick={() => removeHighlight(i)} className="ml-2 hover:text-white"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Images (Multiple)</label>
                  <input type="file" multiple accept="image/*" onChange={e => setFiles(e.target.files)} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-emerald-400 hover:file:bg-gray-700 transition-colors" />
                  
                  {formData.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-4">
                      {formData.images.map((img, i) => (
                        <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-800">
                          <img src={img} alt="" className="w-full h-24 object-cover" />
                          <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 p-1 bg-red-500/80 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 flex items-center gap-3">
                  <input type="checkbox" id="featured" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} className="w-4 h-4 rounded bg-gray-900 border-gray-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-gray-900" />
                  <label htmlFor="featured" className="text-sm text-gray-300">Feature this package on homepage</label>
                </div>

              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-400 hover:text-white font-medium transition-colors">Cancel</button>
                <button type="submit" disabled={uploading} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                  {uploading ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" /> : 'Save Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
