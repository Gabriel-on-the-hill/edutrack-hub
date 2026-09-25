// pages/admin/classes.jsx
// Admin Class Management

import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, withAuth } from '../../hooks/useAuth';
import AdminLayout from '../../components/admin/AdminLayout';
import FileDropzone from '../../components/admin/FileDropzone';
import { Icons } from '../../components/ui/Icons';

function AdminClasses() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    level: 'BEGINNER',
    scheduledTime: '',
    duration: 60,
    maxStudents: 10,
    price: 0,
    meetUrl: '',
    notesUrl: '',
    recordingUrl: '',
    status: 'SCHEDULED',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/classes');
      if (res.ok) {
        const data = await res.json();
        setClasses(data.classes || []);
      }
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subject: '',
      level: 'BEGINNER',
      scheduledTime: '',
      duration: 60,
      maxStudents: 10,
      price: 0,
      meetUrl: '',
      notesUrl: '',
      recordingUrl: '',
      status: 'SCHEDULED',
    });
    setEditingClass(null);
    setFormError('');
  };

  const handleCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (cls) => {
    setEditingClass(cls);
    setFormData({
      title: cls.title,
      description: cls.description || '',
      subject: cls.subject,
      level: cls.level,
      scheduledTime: new Date(cls.scheduledTime).toISOString().slice(0, 16),
      duration: cls.duration,
      maxStudents: cls.maxStudents,
      price: cls.price / 100, // Convert from kobo for display
      meetUrl: cls.meetUrl || '',
      notesUrl: cls.notesUrl || '',
      recordingUrl: cls.recordingUrl || '',
      status: cls.status || 'SCHEDULED',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        price: Math.round(formData.price * 100), // Convert to kobo
        scheduledTime: new Date(formData.scheduledTime).toISOString(),
      };

      const url = editingClass ? `/api/classes/${editingClass.id}` : '/api/classes';
      const method = editingClass ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save class');
      }

      setShowForm(false);
      resetForm();
      fetchClasses();
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (cls) => {
    if (!confirm(`Are you sure you want to delete "${cls.title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/classes/${cls.id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchClasses();
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatPrice = (price) => {
    if (price === 0) return 'Free';
    return `₦${(price / 100).toLocaleString()}`;
  };

  return (
    <AdminLayout>
      <Head>
        <title>Manage Classes - EduTrack Hub</title>
      </Head>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Class Management</h1>
          <p className="text-slate-600 mt-1">Create and manage your tutoring sessions</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-teal-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-teal-500/20 hover:bg-teal-700 hover:scale-105 transition-all flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          New Class
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
        </div>
      ) : classes.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icons.Calendar className="w-9 h-9 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No classes yet</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Get started by creating your first class. Students can enroll once you publish it.
          </p>
          <button onClick={handleCreate} className="bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors">
            Create Class
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Class Info</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Schedule</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Students</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classes.map((cls) => (
                  <tr key={cls.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-900">{cls.title}</p>
                        <p className="text-sm text-slate-500">{cls.subject} • {cls.level}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-900">{formatDate(cls.scheduledTime)}</p>
                      <p className="text-xs text-slate-500">{cls.duration} mins</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-900">{formatPrice(cls.price)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {[...Array(Math.min(3, cls.enrolledCount || 0))].map((_, i) => (
                            <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white"></div>
                          ))}
                        </div>
                        <span className="text-sm text-slate-600">
                          {cls.enrolledCount || 0}/{cls.maxStudents}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${cls.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' :
                        cls.status === 'LIVE' ? 'bg-green-100 text-green-700 animate-pulse' :
                          cls.status === 'COMPLETED' ? 'bg-slate-100 text-slate-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                        {cls.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(cls)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                          aria-label="Edit class"
                        >
                          <Icons.Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cls)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                          aria-label="Delete class"
                        >
                          <Icons.Trash className="w-4 h-4" />
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

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white px-8 py-6 border-b border-slate-100 flex justify-between items-center z-10">
                <h2 className="text-xl font-bold text-slate-900">
                  {editingClass ? 'Edit Class Details' : 'Create New Class'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
                  aria-label="Close"
                >
                  <Icons.X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {formError && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-2">
                    <Icons.AlertTriangle className="w-4 h-4 shrink-0" /> {formError}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Class Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                      placeholder="e.g. Mastering Quadratic Equations"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none resize-none"
                      placeholder="What will students learn in this session?"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject *</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                        placeholder="e.g. Math"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Level *</label>
                      <select
                        name="level"
                        value={formData.level}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-white"
                      >
                        <option value="BEGINNER">Beginner</option>
                        <option value="INTERMEDIATE">Intermediate</option>
                        <option value="ADVANCED">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date & Time *</label>
                      <input
                        type="datetime-local"
                        name="scheduledTime"
                        value={formData.scheduledTime}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Duration (mins) *</label>
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        required
                        min={15}
                        max={240}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Max Students *</label>
                      <input
                        type="number"
                        name="maxStudents"
                        value={formData.maxStudents}
                        onChange={handleInputChange}
                        required
                        min={1}
                        max={100}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Price (NGN) *</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₦</span>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                          min={0}
                          step={100}
                          className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Google Meet URL</label>
                    <div className="relative">
                      <Icons.Video className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="url"
                        name="meetUrl"
                        value={formData.meetUrl}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                        placeholder="https://meet.google.com/..."
                      />
                    </div>
                  </div>

                  {editingClass && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Resources: paste a link OR upload a file */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Resources (PDF / Slides)</label>
                        <input
                          type="url"
                          name="notesUrl"
                          value={formData.notesUrl}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none mb-3"
                          placeholder="Paste a link (Google Drive, etc.)"
                        />
                        <div className="relative text-center text-xs text-slate-400 mb-3">
                          <span className="absolute inset-x-0 top-1/2 h-px bg-slate-100" />
                          <span className="relative bg-white px-2">or upload a file</span>
                        </div>
                        <FileDropzone
                          onUploadSuccess={(url) => setFormData(prev => ({ ...prev, notesUrl: url }))}
                          label="Drop resources here"
                          icon={<Icons.Folder className="w-7 h-7 text-slate-400" />}
                        />
                      </div>

                      {/* Recording: link only (videos are hosted off-site) */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Class Recording</label>
                        <input
                          type="url"
                          name="recordingUrl"
                          value={formData.recordingUrl}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                          placeholder="Paste a YouTube, Vimeo or Drive link"
                        />
                        <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                          Host recordings on YouTube, Vimeo or Google Drive and paste the link here.
                          Video files can't be uploaded directly (and shouldn't be — it keeps your storage clean).
                        </p>
                      </div>
                    </div>
                  )}

                  {editingClass && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-white"
                      >
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="LIVE">Live Now</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="sticky bottom-0 bg-white pt-4 pb-0 flex justify-end gap-3 border-t border-slate-100 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 shadow-lg shadow-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {submitting ? 'Saving...' : editingClass ? 'Save Changes' : 'Create Class'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}

export default withAuth(AdminClasses, { requireAdmin: true });
