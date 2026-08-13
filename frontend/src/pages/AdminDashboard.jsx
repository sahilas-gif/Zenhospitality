import { useState, useEffect } from 'react';
import { LayoutDashboard, LogOut, Plus, Edit2, Trash2, Package as PackageIcon, Inbox, CheckCircle, Clock, X, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api, { API_ORIGIN } from '../lib/api';

const INITIAL_FORM = {
  title: '',
  slug: '',
  description: '',
  category: 'travel_booking',
  destination: '',
  duration_days: 1,
  price_from: 0,
  price_to: 0,
  highlights: [],
  is_featured: false,
  images: []
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('packages'); // 'packages' | 'enquiries'
  const [packages, setPackages] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [files, setFiles] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [highlightInput, setHighlightInput] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [pkgRes, enqRes] = await Promise.all([
        api.get('/packages'),
        api.get('/admin/enquiries')
      ]);
      setPackages(pkgRes.data);
      setEnquiries(enqRes.data);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      } else {
        setError('Failed to load dashboard data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/admin/login');
  };

  const openCreateModal = () => {
    setEditingPackage(null);
    setFormData(INITIAL_FORM);
    setFiles(null);
    setModalOpen(true);
  };

  const openEditModal = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      title: pkg.title || '',
      slug: pkg.slug || '',
      description: pkg.description || '',
      category: pkg.category || 'travel_booking',
      destination: pkg.destination || '',
      duration_days: pkg.duration_days || 1,
      price_from: pkg.price_from || 0,
      price_to: pkg.price_to || 0,
      highlights: pkg.highlights || [],
      is_featured: pkg.is_featured || false,
      images: pkg.images || []
    });
    setFiles(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingPackage(null);
    setFormData(INITIAL_FORM);
    setFiles(null);
    setHighlightInput('');
  };

  const handleChange = (field, transform = v => v) => (e) => {
    const value = transform(e.target.value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addHighlight = () => {
    if (highlightInput.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, highlightInput.trim()]
      }));
      setHighlightInput('');
    }
  };

  const removeHighlight = (index) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError('');

    try {
      let updatedImages = [...formData.images];

      // Handle image uploads if new files were selected
      if (files && files.length > 0) {
        const uploadData = new FormData();
        for (let i = 0; i < files.length; i++) {
          uploadData.append('files', files[i]);
        }

        const uploadRes = await api.post('/upload/images', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        if (uploadRes.data?.urls) {
          updatedImages = [...updatedImages, ...uploadRes.data.urls];
        }
      }

      const payload = {
        ...formData,
        images: updatedImages
      };

      if (editingPackage) {
        await api.put(`/packages/${editingPackage.id}`, payload);
        setSuccess('Package updated successfully!');
      } else {
        await api.post('/packages', payload);
        setSuccess('Package created successfully!');
      }

      closeModal();
      fetchData();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save package.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePackage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    try {
      await api.delete(`/packages/${id}`);
      setSuccess('Package deleted.');
      fetchData();
      setTimeout(() => setSuccess(''), 4000);
    } catch {
      setError('Failed to delete package.');
    }
  };

  const handleUpdateStatus = async (enquiryId, newStatus) => {
    try {
      await api.patch(`/admin/enquiries/${enquiryId}/status?status=${newStatus}`);
      setSuccess('Enquiry status updated.');
      fetchData();
      setTimeout(() => setSuccess(''), 4000);
    } catch {
      setError('Failed to update status.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] pt-8 pb-12 font-sans text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-white flex items-center">
              <LayoutDashboard className="w-8 h-8 mr-3 text-emerald-500" />
              Zen Owner Portal
            </h1>
            <p className="text-gray-400 text-sm mt-1">Manage tour packages, customer enquiries, and website content.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs bg-emerald-900/40 text-emerald-400 border border-emerald-800/50 px-3 py-1.5 rounded-full font-medium">
              Logged in as: <strong className="text-white">zenhospi</strong>
            </span>
            <button onClick={handleLogout} className="flex items-center px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition-colors border border-red-900/50 text-sm font-medium">
              <LogOut className="w-4 h-4 mr-1.5" /> Logout
            </button>
          </div>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')}><X className="w-4 h-4" /></button>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 text-sm flex items-center justify-between">
            <span>{success}</span>
            <button onClick={() => setSuccess('')}><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Navigation Tabs & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-6 gap-4">
          <div className="flex gap-2 p-1 bg-gray-900/60 rounded-xl border border-gray-800 self-start">
            <button
              onClick={() => setActiveTab('packages')}
              className={`flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'packages'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <PackageIcon className="w-4 h-4 mr-2" /> Tour Packages ({packages.length})
            </button>
            <button
              onClick={() => setActiveTab('enquiries')}
              className={`flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'enquiries'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Inbox className="w-4 h-4 mr-2" /> Customer Enquiries ({enquiries.length})
            </button>
          </div>

          {activeTab === 'packages' && (
            <button
              onClick={openCreateModal}
              className="flex items-center justify-center px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-900/20 text-sm"
            >
              <Plus className="w-4 h-4 mr-2" /> Add New Package
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4" />
            <p className="text-gray-400 text-sm">Loading admin records...</p>
          </div>
        ) : (
          <>
            {/* PACKAGES TAB */}
            {activeTab === 'packages' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all flex flex-col justify-between">
                    <div>
                      <div className="relative h-44 bg-gray-800 overflow-hidden">
                        {pkg.images && pkg.images.length > 0 ? (
                          <img
                            src={pkg.images[0].startsWith('http') ? pkg.images[0] : `${API_ORIGIN}${pkg.images[0]}`}
                            alt={pkg.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                        )}
                        <span className="absolute top-3 left-3 bg-navy-950/80 backdrop-blur-md text-emerald-400 text-xs px-3 py-1 rounded-full border border-white/10 font-semibold uppercase tracking-wider">
                          {pkg.category?.replace('_', ' ')}
                        </span>
                        {pkg.is_featured && (
                          <span className="absolute top-3 right-3 bg-amber-500/90 text-navy-950 text-xs px-2.5 py-1 rounded-full font-bold">
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="p-5">
                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{pkg.title}</h3>
                        <p className="text-gray-400 text-xs mb-4 line-clamp-2">{pkg.description}</p>
                        
                        <div className="flex justify-between items-center text-xs text-gray-400 border-t border-gray-800/80 pt-3">
                          <span>📍 {pkg.destination}</span>
                          <span>⏳ {pkg.duration_days} Days</span>
                        </div>
                        <div className="mt-2 text-sm font-semibold text-emerald-400">
                          ₹{pkg.price_from?.toLocaleString()} - ₹{pkg.price_to?.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-950/50 border-t border-gray-800 flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(pkg)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-xs flex items-center gap-1 font-medium"
                      >
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeletePackage(pkg.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition-colors text-xs flex items-center gap-1 font-medium"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ENQUIRIES TAB */}
            {activeTab === 'enquiries' && (
              <div className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden">
                {enquiries.length === 0 ? (
                  <div className="py-16 text-center text-gray-500">No customer enquiries received yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-950/80 text-gray-400 uppercase text-xs border-b border-gray-800">
                        <tr>
                          <th className="px-6 py-4">Customer</th>
                          <th className="px-6 py-4">Phone</th>
                          <th className="px-6 py-4">Travel Date & Size</th>
                          <th className="px-6 py-4">Message</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800/60 text-gray-300">
                        {enquiries.map((enq) => (
                          <tr key={enq.id} className="hover:bg-gray-800/30 transition-colors">
                            <td className="px-6 py-4 font-semibold text-white">{enq.customer_name}</td>
                            <td className="px-6 py-4 text-emerald-400 font-mono">{enq.customer_phone}</td>
                            <td className="px-6 py-4 text-xs">
                              <div>📅 {enq.travel_date || 'N/A'}</div>
                              <div className="text-gray-500">👥 {enq.group_size || 1} Persons</div>
                            </td>
                            <td className="px-6 py-4 max-w-xs truncate text-xs text-gray-400">{enq.message || '—'}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                enq.status === 'converted'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : enq.status === 'contacted'
                                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              }`}>
                                {enq.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <select
                                value={enq.status}
                                onChange={(e) => handleUpdateStatus(enq.id, e.target.value)}
                                className="bg-gray-950 border border-gray-700 text-xs rounded-lg px-2.5 py-1.5 text-gray-300 focus:border-emerald-500"
                              >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="converted">Converted</option>
                                <option value="closed">Closed</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}

      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0a0f1c] border border-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-[#0a0f1c] border-b border-gray-800 p-4 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-white">{editingPackage ? 'Edit Tour Package' : 'Create New Tour Package'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Title</label>
                  <input required type="text" value={formData.title} onChange={handleChange('title')} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-500" placeholder="e.g. Goa Beach Retreat" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Slug (URL friendly)</label>
                  <input required type="text" value={formData.slug} onChange={handleChange('slug')} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-500" placeholder="e.g. goa-beach-retreat" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Description</label>
                  <textarea required rows={3} value={formData.description} onChange={handleChange('description')} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-500" placeholder="Package summary..." />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Category</label>
                  <select value={formData.category} onChange={handleChange('category')} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-500">
                    <option value="travel_booking">Travel Booking</option>
                    <option value="corporate">Corporate</option>
                    <option value="hotel_management">Hotel Management</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Destination</label>
                  <input type="text" value={formData.destination} onChange={handleChange('destination')} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-500" placeholder="e.g. Goa, India" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Duration (Days)</label>
                  <input type="number" min="1" value={formData.duration_days} onChange={handleChange('duration_days', v => parseInt(v))} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-500" />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Price From (₹)</label>
                    <input type="number" value={formData.price_from} onChange={handleChange('price_from', v => parseFloat(v))} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Price To (₹)</label>
                    <input type="number" value={formData.price_to} onChange={handleChange('price_to', v => parseFloat(v))} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-500" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Highlights</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={highlightInput} onChange={e => setHighlightInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addHighlight())} className="flex-1 bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-500" placeholder="Add highlight and press Enter..." />
                    <button type="button" onClick={addHighlight} className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold rounded-xl transition-colors">Add</button>
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
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Package Images</label>
                  <input type="file" multiple accept="image/*" onChange={e => setFiles(e.target.files)} className="w-full text-xs text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gray-800 file:text-emerald-400 hover:file:bg-gray-700 transition-colors" />
                  
                  {formData.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-4">
                      {formData.images.map((img, i) => (
                        <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-800 bg-gray-950">
                          <img src={img.startsWith('http') ? img : `${API_ORIGIN}${img}`} alt="" className="w-full h-24 object-cover" />
                          <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 p-1 bg-red-500/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 flex items-center gap-3">
                  <input type="checkbox" id="featured" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} className="w-4 h-4 rounded bg-gray-950 border-gray-800 text-emerald-500 focus:ring-emerald-500" />
                  <label htmlFor="featured" className="text-sm text-gray-300 font-medium">Feature this package on homepage</label>
                </div>

              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 text-gray-400 hover:text-white font-medium transition-colors text-sm">Cancel</button>
                <button type="submit" disabled={uploading} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition-all shadow-lg text-sm flex items-center gap-2">
                  {uploading ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" /> : (editingPackage ? 'Update Package' : 'Save Package')}
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
