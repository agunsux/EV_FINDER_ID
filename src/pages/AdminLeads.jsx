import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getLeads } from '../utils/leadStorage';

const AdminLeads = () => {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    // Load leads on mount
    setLeads(getLeads().reverse()); // Show newest first
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white pt-24 pb-12">
      <Navbar />
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Kelola data prospek (leads) yang masuk dari platform.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg px-6 py-3 text-center">
            <p className="text-sm text-gray-400">Total Leads</p>
            <p className="text-2xl font-bold text-emerald-400">{leads.length}</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-white/5 border-b border-white/10 text-gray-400 font-medium">
                <tr>
                  <th className="px-6 py-4 whitespace-nowrap">Tanggal</th>
                  <th className="px-6 py-4">Nama Prospek</th>
                  <th className="px-6 py-4">No. WhatsApp</th>
                  <th className="px-6 py-4">Kota</th>
                  <th className="px-6 py-4">Minat Kendaraan</th>
                  <th className="px-6 py-4 whitespace-nowrap">Sumber</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      Belum ada data leads yang masuk.
                    </td>
                  </tr>
                ) : (
                  leads.map(lead => (
                    <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400">{formatDate(lead.timestamp)}</td>
                      <td className="px-6 py-4 font-medium text-white">{lead.name}</td>
                      <td className="px-6 py-4">
                        <a href={`https://wa.me/${lead.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
                          {lead.whatsapp}
                        </a>
                      </td>
                      <td className="px-6 py-4">{lead.city}</td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs font-semibold">
                          {lead.model}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 capitalize">{lead.source}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLeads;
