import React, { useState } from 'react';
import { useServices } from '../context/ServiceContext';
import { Trash2, Plus, Edit2, Save, X } from 'lucide-react';

export const AdminPanel = () => {
    const { services, addService, updateService, deleteService } = useServices();
    const [isEditing, setIsEditing] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [isAdding, setIsAdding] = useState(false);
    const [newService, setNewService] = useState({
        title: '',
        category: 'apartment',
        price: '',
        price_type: 'fixed',
        description: '',
        features: [''],
        gradient: 'from-blue-400 to-blue-600'
    });

    const categories = [
        { id: 'apartment', label: 'Квартира' },
        { id: 'house', label: 'Будинок' },
        { id: 'office', label: 'Офіс' }
    ];

    const priceTypes = [
        { id: 'fixed', label: 'Фіксована (від)' },
        { id: 'sqm', label: 'За м²' }
    ];

    const gradients = [
        { label: 'Blue', value: 'from-blue-400 to-blue-600' },
        { label: 'Purple', value: 'from-purple-400 to-purple-600' },
        { label: 'Emerald', value: 'from-emerald-400 to-emerald-600' },
        { label: 'Orange', value: 'from-orange-400 to-orange-600' },
        { label: 'Pink', value: 'from-pink-400 to-pink-600' },
        { label: 'Teal', value: 'from-teal-400 to-teal-600' }
    ];

    const getPriceLabel = (price, type) => {
        if (!price) return '';
        return type === 'sqm' ? `${price} ₴/м²` : `від ${price} ₴`;
    };

    const handleEditClick = (service) => {
        setIsEditing(service.id);
        setEditForm({ ...service });
    };

    const handleSaveEdit = () => {
        const updated = {
            ...editForm,
            price_label: getPriceLabel(editForm.price, editForm.price_type)
        };
        updateService(isEditing, updated);
        setIsEditing(null);
    };

    const handleCreateService = () => {
        const payload = {
            ...newService,
            price_label: getPriceLabel(newService.price, newService.price_type)
        };
        addService(payload);
        setIsAdding(false);
        setNewService({
            title: '',
            category: 'apartment',
            price: '',
            price_type: 'fixed',
            description: '',
            features: [''],
            gradient: 'from-blue-400 to-blue-600'
        });
    };

    const handleFeatureChange = (index, value, isNew = false) => {
        if (isNew) {
            const newFeatures = [...newService.features];
            newFeatures[index] = value;
            setNewService({ ...newService, features: newFeatures });
        } else {
            const newFeatures = [...editForm.features];
            newFeatures[index] = value;
            setEditForm({ ...editForm, features: newFeatures });
        }
    };

    const addFeatureField = (isNew = false) => {
        if (isNew) {
            setNewService({ ...newService, features: [...newService.features, ''] });
        } else {
            setEditForm({ ...editForm, features: [...editForm.features, ''] });
        }
    };

    const removeFeatureField = (index, isNew = false) => {
        if (isNew) {
            setNewService({ ...newService, features: newService.features.filter((_, i) => i !== index) });
        } else {
            setEditForm({ ...editForm, features: editForm.features.filter((_, i) => i !== index) });
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-3xl font-bold">Admin Panel - Services</h1>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-white text-black px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors"
                    >
                        <Plus size={18} />
                        Add Service
                    </button>
                </div>

                {isAdding && (
                    <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/10 mb-8 animate-in fade-in slide-in-from-top-4">
                        <h2 className="text-xl font-bold mb-4">New Service</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="flex gap-4">
                                <select
                                    className="flex-1 bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/40"
                                    value={newService.category}
                                    onChange={e => setNewService({ ...newService, category: e.target.value })}
                                >
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                </select>
                                <select
                                    className="flex-1 bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/40"
                                    value={newService.price_type}
                                    onChange={e => setNewService({ ...newService, price_type: e.target.value })}
                                >
                                    {priceTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                                </select>
                            </div>

                            <input
                                className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/40"
                                placeholder="Title"
                                value={newService.title}
                                onChange={e => setNewService({ ...newService, title: e.target.value })}
                            />

                            <input
                                className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/40"
                                placeholder="Price Value (e.g. 1500)"
                                type="number"
                                value={newService.price}
                                onChange={e => setNewService({ ...newService, price: e.target.value })}
                            />

                            <textarea
                                className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/40 md:col-span-2"
                                placeholder="Description"
                                value={newService.description}
                                onChange={e => setNewService({ ...newService, description: e.target.value })}
                            />

                            <div className="md:col-span-2">
                                <label className="block text-sm text-white/50 mb-2">Features</label>
                                {newService.features.map((feature, idx) => (
                                    <div key={idx} className="flex gap-2 mb-2">
                                        <input
                                            className="flex-1 bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-white/40"
                                            value={feature}
                                            onChange={e => handleFeatureChange(idx, e.target.value, true)}
                                            placeholder="Feature item"
                                        />
                                        <button onClick={() => removeFeatureField(idx, true)} className="text-red-400 hover:text-red-300">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                <button onClick={() => addFeatureField(true)} className="text-sm text-blue-400 hover:text-blue-300 mt-1">
                                    + Add Feature
                                </button>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm text-white/50 mb-2">Theme</label>
                                <div className="flex gap-4">
                                    {gradients.map(g => (
                                        <button
                                            key={g.value}
                                            onClick={() => setNewService({ ...newService, gradient: g.value })}
                                            className={`w-8 h-8 rounded-full bg-gradient-to-br ${g.value} ring-2 ${newService.gradient === g.value ? 'ring-white' : 'ring-transparent'}`}
                                            title={g.label}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setIsAdding(false)} className="px-4 py-2 rounded-lg text-white/60 hover:text-white">Cancel</button>
                            <button onClick={handleCreateService} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500">Create</button>
                        </div>
                    </div>
                )}

                <div className="grid gap-4">
                    {services.map(service => (
                        <div key={service.id} className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-6">
                            {isEditing === service.id ? (
                                <div className="flex-1 grid grid-cols-1 gap-4">
                                    <div className="flex gap-4">
                                        <select
                                            className="flex-1 bg-black/50 border border-white/10 rounded-lg p-3 text-white"
                                            value={editForm.category}
                                            onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                                        >
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                        </select>
                                        <select
                                            className="flex-1 bg-black/50 border border-white/10 rounded-lg p-3 text-white"
                                            value={editForm.price_type}
                                            onChange={e => setEditForm({ ...editForm, price_type: e.target.value })}
                                        >
                                            {priceTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                                        </select>
                                    </div>
                                    <input
                                        className="bg-black/50 border border-white/10 rounded-lg p-3 text-white"
                                        value={editForm.title}
                                        onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                    />
                                    <input
                                        className="bg-black/50 border border-white/10 rounded-lg p-3 text-white"
                                        value={editForm.price}
                                        onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                                    />
                                    <textarea
                                        className="bg-black/50 border border-white/10 rounded-lg p-3 text-white"
                                        value={editForm.description}
                                        onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                    />
                                    <div>
                                        {editForm.features.map((f, i) => (
                                            <div key={i} className="flex gap-2 mb-2">
                                                <input
                                                    className="flex-1 bg-black/50 border border-white/10 rounded-lg p-2 text-sm"
                                                    value={f}
                                                    onChange={e => handleFeatureChange(i, e.target.value)}
                                                />
                                                <button onClick={() => removeFeatureField(i)} className="text-red-400">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        <button onClick={() => addFeatureField()} className="text-sm text-blue-400">+ Add Feature</button>
                                    </div>
                                    <div className="flex gap-4">
                                        {gradients.map(g => (
                                            <button
                                                key={g.value}
                                                onClick={() => setEditForm({ ...editForm, gradient: g.value })}
                                                className={`w-6 h-6 rounded-full bg-gradient-to-br ${g.value} ring-2 ${editForm.gradient === g.value ? 'ring-white' : 'ring-transparent'}`}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex justify-end gap-3 mt-2">
                                        <button onClick={() => setIsEditing(null)} className="text-white/60">Cancel</button>
                                        <button onClick={handleSaveEdit} className="bg-green-600 px-4 py-2 rounded-lg font-bold">Save</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${service.gradient}`} />
                                            <span className="text-[10px] uppercase font-bold tracking-widest bg-white/10 px-2 py-0.5 rounded text-white/60">
                                                {categories.find(c => c.id === service.category)?.label || service.category}
                                            </span>
                                            <h3 className="text-xl font-bold">{service.title}</h3>
                                        </div>
                                        <p className="text-white/60 mb-2">{service.description}</p>
                                        <div className="flex items-baseline gap-2">
                                            <p className="font-bold text-lg text-blue-400">{service.price_label || service.price}</p>
                                            {service.price_type === 'sqm' && <span className="text-xs text-white/40">за м²</span>}
                                        </div>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {service.features.map((f, i) => (
                                                <span key={i} className="text-xs bg-white/5 px-2 py-1 rounded text-white/70">{f}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-row md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                                        <button
                                            onClick={() => handleEditClick(service)}
                                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-blue-400 transition-colors"
                                        >
                                            <Edit2 size={20} />
                                        </button>
                                        <button
                                            onClick={() => deleteService(service.id)}
                                            className="p-2 bg-white/5 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
