import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Phone,
    User,
    Calendar,
    DollarSign,
    Tag,
    Trash2,
    Check,
    Clock,
    X as XIcon
} from 'lucide-react';
import { api } from '../utils/api';

const statusConfig = {
    new: { label: 'Нова', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/20', text: 'text-blue-400', icon: Clock },
    contacted: { label: 'У роботі', color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: Phone },
    completed: { label: 'Виконано', color: 'from-green-500 to-emerald-500', bg: 'bg-green-500/20', text: 'text-green-400', icon: Check },
    cancelled: { label: 'Відхилено', color: 'from-red-500 to-pink-500', bg: 'bg-red-500/20', text: 'text-red-400', icon: XIcon }
};

export const LeadsManagement = ({ onBack }) => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const fetchLeads = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const data = await api.getLeads(token);
            setLeads(data);
        } catch (error) {
            console.error('Failed to load leads:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('admin_token');
            await api.updateLead(id, { status: newStatus }, token);
            await fetchLeads();
        } catch (error) {
            console.error('Failed to update lead:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Видалити цю заявку?')) return;

        try {
            const token = localStorage.getItem('admin_token');
            await api.deleteLead(id, token);
            await fetchLeads();
        } catch (error) {
            console.error('Failed to delete lead:', error);
        }
    };

    const filteredLeads = filter === 'all'
        ? leads
        : leads.filter(lead => lead.status === filter);

    const getStatusCount = (status) => {
        return leads.filter(l => l.status === status).length;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                    <h1 className="text-2xl font-bold text-white">Управління заявками</h1>
                </div>
                <div className="text-white/50 text-sm">
                    Всього: {leads.length} заявок
                </div>
            </div>


            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${filter === 'all'
                        ? 'bg-white text-black'
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                        }`}
                >
                    Всі ({leads.length})
                </button>
                {Object.entries(statusConfig).map(([status, config]) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all flex items-center gap-2 ${filter === status
                            ? `bg-gradient-to-r ${config.color} text-white`
                            : 'bg-white/5 text-white/70 hover:bg-white/10'
                            }`}
                    >
                        {config.label} ({getStatusCount(status)})
                    </button>
                ))}
            </div>


            <div className="grid gap-4">
                {filteredLeads.length === 0 ? (
                    <div className="text-center py-16 text-white/40">
                        <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Немає заявок</p>
                    </div>
                ) : (
                    filteredLeads.map((lead) => {
                        const config = statusConfig[lead.status] || statusConfig.new;
                        const StatusIcon = config.icon;

                        return (
                            <motion.div
                                key={lead.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-colors"
                            >
                                <div className="p-6">

                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between gap-4 flex-wrap">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <User className="w-5 h-5 text-white/40" />
                                                    <h3 className="text-xl font-bold text-white">{lead.name}</h3>
                                                </div>
                                                <div className="flex items-center gap-2 text-white/60">
                                                    <Phone className="w-4 h-4" />
                                                    <a href={`tel:${lead.phone}`} className="hover:text-white transition-colors">
                                                        {lead.phone}
                                                    </a>
                                                </div>
                                            </div>

                                            <div className={`px-3 py-1.5 rounded-full ${config.bg} border border-white/10 flex items-center gap-2`}>
                                                <StatusIcon className={`w-4 h-4 ${config.text}`} />
                                                <span className={`text-sm font-medium ${config.text}`}>
                                                    {config.label}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {lead.service_title && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Tag className="w-4 h-4 text-white/40" />
                                                    <span className="text-white/70">{lead.service_title}</span>
                                                </div>
                                            )}

                                            {lead.estimated_price && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <DollarSign className="w-4 h-4 text-white/40" />
                                                    <span className="text-white/70">{lead.estimated_price}</span>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 text-sm col-span-full">
                                                <Calendar className="w-4 h-4 text-white/40" />
                                                <span className="text-white/60">
                                                    {new Date(lead.created_at).toLocaleDateString('uk-UA', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                                <span className="text-white/40 mx-1">о</span>
                                                <span className="text-white/40">
                                                    {new Date(lead.created_at).toLocaleTimeString('uk-UA', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="border-t border-white/10 pt-4 mt-4">
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(statusConfig).map(([status, cfg]) => {
                                                const StatusBtnIcon = cfg.icon;
                                                return (
                                                    <button
                                                        key={status}
                                                        onClick={() => handleStatusChange(lead.id, status)}
                                                        disabled={lead.status === status}
                                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${lead.status === status
                                                            ? `${cfg.bg} ${cfg.text} cursor-default opacity-100`
                                                            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                                            }`}
                                                    >
                                                        <StatusBtnIcon className="w-4 h-4" />
                                                        {cfg.label}
                                                    </button>
                                                );
                                            })}

                                            <button
                                                onClick={() => handleDelete(lead.id)}
                                                className="ml-auto px-4 py-2 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Видалити
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
