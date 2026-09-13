import React, { useState, useEffect } from 'react';
import { X, Users, MessageSquare, AlertCircle, ShieldCheck, Mail, Clock } from 'lucide-react';
import { authClient } from '../utils/authClient';

const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL
  ? import.meta.env.VITE_BACKEND_API_URL.replace(/\/$/, "")
  : 'http://localhost:3001';

export default function AdminPanel({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('inquiries'); // 'inquiries' | 'users'
  const [inquiries, setInquiries] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = activeTab === 'inquiries' 
        ? `${BACKEND_URL}/api/admin/inquiries`
        : `${BACKEND_URL}/api/admin/users`;

      const response = await authClient.$fetch(endpoint, {
        method: 'GET'
      });
      
      if (activeTab === 'inquiries') {
        setInquiries(response.data?.inquiries || []);
      } else {
        setUsers(response.data?.users || []);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data. Ensure you have admin privileges.');
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (id, status) => {
    try {
      await authClient.$fetch(`${BACKEND_URL}/api/admin/inquiries/${id}/status`, {
        method: 'PATCH',
        body: { status }
      });
      fetchData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const updateUserRole = async (id, role) => {
    try {
      await authClient.$fetch(`${BACKEND_URL}/api/admin/users/${id}/role`, {
        method: 'PATCH',
        body: { role }
      });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update role');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-fade-in border border-amber-200/50">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-100 bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-stone-900 font-sans tracking-tight">Admin Dashboard</h2>
              <p className="text-xs font-mono text-stone-500">Secure Management Console</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-200 text-stone-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-100 px-6 pt-4 gap-6 bg-stone-50">
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-4 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${activeTab === 'inquiries' ? 'border-amber-600 text-amber-700' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
          >
            <MessageSquare className="w-4 h-4" />
            User Inquiries
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-4 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${activeTab === 'users' ? 'border-amber-600 text-amber-700' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
          >
            <Users className="w-4 h-4" />
            User Management
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-stone-50/30">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-sm font-bold">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            </div>
          ) : (
            <>
              {activeTab === 'inquiries' && (
                <div className="space-y-4">
                  {inquiries.length === 0 ? (
                    <div className="text-center py-12 text-stone-500 font-mono text-sm">No inquiries found.</div>
                  ) : (
                    inquiries.map(inq => (
                      <div key={inq.id} className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-stone-900">{inq.name}</h3>
                            <div className="flex items-center gap-2 mt-1 text-xs font-mono text-stone-500">
                              <Mail className="w-3 h-3" />
                              <a href={`mailto:${inq.email}`} className="hover:text-amber-600 hover:underline">{inq.email}</a>
                              <span className="text-stone-300">•</span>
                              <Clock className="w-3 h-3" />
                              {new Date(inq.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                              inq.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                              inq.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                              'bg-emerald-100 text-emerald-800'
                            }`}>
                              {inq.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <span className="inline-block px-2.5 py-1 bg-stone-100 text-stone-700 text-xs font-bold rounded-lg mb-2 border border-stone-200">
                            Topic: {inq.topic}
                          </span>
                          <p className="text-sm text-stone-700 font-mono leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-100 whitespace-pre-wrap">
                            {inq.message}
                          </p>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <button onClick={() => updateInquiryStatus(inq.id, 'pending')} className="px-3 py-1.5 text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 rounded-lg transition-colors">Mark Pending</button>
                          <button onClick={() => updateInquiryStatus(inq.id, 'reviewed')} className="px-3 py-1.5 text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-lg transition-colors">Mark Reviewed</button>
                          <button onClick={() => updateInquiryStatus(inq.id, 'resolved')} className="px-3 py-1.5 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg transition-colors">Mark Resolved</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'users' && (
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-stone-50 border-b border-stone-200 font-mono text-xs uppercase text-stone-500">
                      <tr>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Joined</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {users.length === 0 ? (
                        <tr><td colSpan="4" className="text-center py-8 text-stone-500 font-mono">No users found.</td></tr>
                      ) : (
                        users.map(user => (
                          <tr key={user.id} className="hover:bg-stone-50/50">
                            <td className="px-6 py-4">
                              <div className="font-bold text-stone-900">{user.name || 'Unnamed'}</div>
                              <div className="text-xs font-mono text-stone-500">{user.email}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-stone-100 text-stone-700 border border-stone-200'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-stone-500 text-xs font-mono">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                              {user.role === 'admin' ? (
                                <button 
                                  onClick={() => updateUserRole(user.id, 'user')}
                                  className="px-3 py-1.5 text-xs font-bold text-stone-600 border border-stone-300 hover:bg-stone-100 rounded-lg transition-colors"
                                >
                                  Demote to User
                                </button>
                              ) : (
                                <button 
                                  onClick={() => updateUserRole(user.id, 'admin')}
                                  className="px-3 py-1.5 text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100 rounded-lg transition-colors"
                                >
                                  Promote to Admin
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
