import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    LogOut,
    Package,
    DollarSign,
    BarChart3,
    Settings,
    ChevronRight,
    ArrowLeft,
    Plus,
    Edit2,
    Trash2,
    Save,
    X,
    Inbox
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useServices } from '../../context/ServiceContext';
import { useNavigate } from 'react-router-dom';
import { LeadsManagement } from '../../components/LeadsManagement';
import { SettingsManagement } from '../../components/SettingsManagement';


const ServicesManagement = ({ onBack }) => {
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
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                    <h1 className="text-2xl font-bold text-white">Управління послугами</h1>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg"
                >
                    <Plus size={18} />
                    Додати послугу
                </button>
            </div>


            {isAdding && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/10 mb-8"
                >
                    <h2 className="text-xl font-bold text-white mb-4">Нова послуга</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex gap-4">
                            <select
                                className="flex-1 bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50"
                                value={newService.category}
                                onChange={e => setNewService({ ...newService, category: e.target.value })}
                            >
                                {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                            </select>
                            <select
                                className="flex-1 bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50"
                                value={newService.price_type}
                                onChange={e => setNewService({ ...newService, price_type: e.target.value })}
                            >
                                {priceTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                            </select>
                        </div>

                        <input
                            className="bg-black/50 border border-white/10 rounded-xl p-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
                            placeholder="Назва послуги"
                            value={newService.title}
                            onChange={e => setNewService({ ...newService, title: e.target.value })}
                        />

                        <input
                            className="bg-black/50 border border-white/10 rounded-xl p-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
                            placeholder="Ціна (наприклад 1500)"
                            type="number"
                            value={newService.price}
                            onChange={e => setNewService({ ...newService, price: e.target.value })}
                        />

                        <textarea
                            className="bg-black/50 border border-white/10 rounded-xl p-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 md:col-span-2"
                            placeholder="Опис послуги"
                            value={newService.description}
                            onChange={e => setNewService({ ...newService, description: e.target.value })}
                        />

                        <div className="md:col-span-2">
                            <label className="block text-sm text-white/50 mb-2">Що входить</label>
                            {newService.features.map((feature, idx) => (
                                <div key={idx} className="flex gap-2 mb-2">
                                    <input
                                        className="flex-1 bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
                                        value={feature}
                                        onChange={e => handleFeatureChange(idx, e.target.value, true)}
                                        placeholder="Пункт послуги"
                                    />
                                    <button onClick={() => removeFeatureField(idx, true)} className="text-red-400 hover:text-red-300 p-2">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            <button onClick={() => addFeatureField(true)} className="text-sm text-blue-400 hover:text-blue-300 mt-1">
                                + Додати пункт
                            </button>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm text-white/50 mb-2">Колір теми</label>
                            <div className="flex gap-4 items-center justify-between">
                                <div className="flex gap-4">
                                    {gradients.map(g => (
                                        <button
                                            key={g.value}
                                            onClick={() => setNewService({ ...newService, gradient: g.value })}
                                            className={`w-8 h-8 rounded-full bg-gradient-to-br ${g.value} ring-2 ${newService.gradient === g.value ? 'ring-white ring-offset-2 ring-offset-[#1a1a1a]' : 'ring-transparent'} transition-all`}
                                            title={g.label}
                                        />
                                    ))}
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={newService.is_featured || false}
                                        onChange={(e) => setNewService({ ...newService, is_featured: e.target.checked })}
                                        className="w-5 h-5 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/50"
                                    />
                                    <span className="text-white text-sm">Показувати на головній</span>
                                </label>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm text-white/50 mb-2">Зображення (для карток на головній)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files[0]) {
                                        setNewService({ ...newService, image: e.target.files[0] });
                                    }
                                }}
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={() => setIsAdding(false)} className="px-4 py-2 rounded-lg text-white/60 hover:text-white transition-colors">Скасувати</button>
                        <button onClick={handleCreateService} className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold hover:opacity-90 transition-all">Створити</button>
                    </div>
                </motion.div>
            )}


            <div className="grid gap-4">
                {services.map(service => (
                    <motion.div
                        key={service.id}
                        layout
                        className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-6"
                    >
                        {isEditing === service.id ? (
                            <div className="flex-1 grid grid-cols-1 gap-4">
                                <div className="flex gap-4">
                                    <select
                                        className="flex-1 bg-black/50 border border-white/10 rounded-xl p-3 text-white"
                                        value={editForm.category}
                                        onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                                    >
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                    </select>
                                    <select
                                        className="flex-1 bg-black/50 border border-white/10 rounded-xl p-3 text-white"
                                        value={editForm.price_type}
                                        onChange={e => setEditForm({ ...editForm, price_type: e.target.value })}
                                    >
                                        {priceTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                                    </select>
                                </div>
                                <input
                                    className="bg-black/50 border border-white/10 rounded-xl p-3 text-white"
                                    value={editForm.title}
                                    onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                    placeholder="Назва"
                                />
                                <input
                                    className="bg-black/50 border border-white/10 rounded-xl p-3 text-white"
                                    value={editForm.price}
                                    onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                                    placeholder="Ціна"
                                />
                                <textarea
                                    className="bg-black/50 border border-white/10 rounded-xl p-3 text-white"
                                    value={editForm.description}
                                    onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                    placeholder="Опис"
                                />
                                <div>
                                    {editForm.features?.map((f, i) => (
                                        <div key={i} className="flex gap-2 mb-2">
                                            <input
                                                className="flex-1 bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white"
                                                value={f}
                                                onChange={e => handleFeatureChange(i, e.target.value)}
                                            />
                                            <button onClick={() => removeFeatureField(i)} className="text-red-400 p-2">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    <button onClick={() => addFeatureField()} className="text-sm text-blue-400">+ Додати пункт</button>
                                </div>
                                <div className="flex gap-4 flex-wrap items-center justify-between">
                                    <div className="flex gap-4">
                                        {gradients.map(g => (
                                            <button
                                                key={g.value}
                                                onClick={() => setEditForm({ ...editForm, gradient: g.value })}
                                                className={`w-6 h-6 rounded-full bg-gradient-to-br ${g.value} ring-2 ${editForm.gradient === g.value ? 'ring-white' : 'ring-transparent'}`}
                                            />
                                        ))}
                                    </div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={editForm.is_featured || false}
                                            onChange={(e) => setEditForm({ ...editForm, is_featured: e.target.checked })}
                                            className="w-5 h-5 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/50"
                                        />
                                        <span className="text-white text-sm">На головну</span>
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-sm text-white/50 mb-2">Змінити зображення</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files[0]) {
                                                setEditForm({ ...editForm, image: e.target.files[0] });
                                            }
                                        }}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                                    />
                                    {editForm.image_url && !editForm.image && (
                                        <p className="text-xs text-white/40 mt-1">Поточне зображення збережено</p>
                                    )}
                                </div>
                                <div className="flex justify-end gap-3 mt-2">
                                    <button onClick={() => setIsEditing(null)} className="text-white/60 hover:text-white transition-colors">Скасувати</button>
                                    <button onClick={handleSaveEdit} className="bg-green-600 px-4 py-2 rounded-xl font-bold text-white hover:bg-green-500 transition-colors flex items-center gap-2">
                                        <Save size={16} />
                                        Зберегти
                                    </button>
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
                                        {service.is_featured && (
                                            <span className="text-[10px] uppercase font-bold tracking-widest bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded border border-yellow-500/20">
                                                Featured
                                            </span>
                                        )}
                                        <h3 className="text-xl font-bold text-white">{service.title}</h3>
                                    </div>
                                    <p className="text-white/60 mb-2">{service.description}</p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="font-bold text-lg text-blue-400">{service.price_label || service.price}</p>
                                        {service.price_type === 'sqm' && <span className="text-xs text-white/40">за м²</span>}
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {service.features?.map((f, i) => (
                                            <span key={i} className="text-xs bg-white/5 px-2 py-1 rounded text-white/70">{f}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-row md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                                    <button
                                        onClick={() => handleEditClick(service)}
                                        className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-blue-400 transition-colors"
                                    >
                                        <Edit2 size={20} />
                                    </button>
                                    <button
                                        onClick={() => deleteService(service.id)}
                                        className="p-3 bg-white/5 hover:bg-red-500/20 rounded-xl text-red-400 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};


const menuItems = [
    {
        id: 'services',
        icon: Package,
        label: 'Послуги',
        description: 'Додавайте та редагуйте послуги',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        id: 'leads',
        icon: Inbox,
        label: 'Заявки',
        description: 'Управління клієнтськими заявками',
        color: 'from-yellow-500 to-orange-500',
    },
    {
        id: 'settings',
        icon: Settings,
        label: 'Налаштування',
        description: 'Конфігурація сайту',
        color: 'from-orange-500 to-red-500'
    },
];

export const AdminDashboard = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState(null);

    const handleLogout = async () => {
        await signOut();
        navigate('/admin/login');
    };


    if (activeSection === 'services') {
        return (
            <div className="min-h-screen bg-black">
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px]" />
                    <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px]" />
                </div>
                <header className="relative z-10 border-b border-white/10 bg-black/50 backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <LayoutDashboard className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-white font-bold">Admin Panel</h1>
                                <p className="text-white/40 text-xs">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/70 hover:text-white transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm font-medium">Вийти</span>
                        </button>
                    </div>
                </header>
                <main className="relative z-10 px-6 py-8">
                    <ServicesManagement onBack={() => setActiveSection(null)} />
                </main>
            </div>
        );
    }

    if (activeSection === 'leads') {
        return (
            <div className="min-h-screen bg-black">
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-[150px]" />
                    <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[150px]" />
                </div>
                <header className="relative z-10 border-b border-white/10 bg-black/50 backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                                <LayoutDashboard className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-white font-bold">Admin Panel</h1>
                                <p className="text-white/40 text-xs">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Вийти
                        </button>
                    </div>
                </header>
                <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                    <LeadsManagement onBack={() => setActiveSection(null)} />
                </div>
            </div>
        );
    }

    if (activeSection === 'settings') {
        return (
            <div className="min-h-screen bg-black">
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[150px]" />
                    <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[150px]" />
                </div>
                <header className="relative z-10 border-b border-white/10 bg-black/50 backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                                <LayoutDashboard className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-white font-bold">Admin Panel</h1>
                                <p className="text-white/40 text-xs">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Вийти
                        </button>
                    </div>
                </header>
                <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                    <SettingsManagement onBack={() => setActiveSection(null)} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">

            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px]" />
            </div>


            <header className="relative z-10 border-b border-white/10 bg-black/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <LayoutDashboard className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-white font-bold">Admin Panel</h1>
                            <p className="text-white/40 text-xs">{user?.email}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/70 hover:text-white transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Вийти</span>
                    </button>
                </div>
            </header>


            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Вітаємо! 👋
                    </h2>
                    <p className="text-white/60">
                        Оберіть розділ для роботи
                    </p>
                </motion.div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {menuItems.map((item, index) => (
                        <motion.button
                            key={item.id}
                            onClick={() => !item.disabled && setActiveSection(item.id)}
                            disabled={item.disabled}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`group relative bg-[#0a0a0a]/80 hover:bg-[#111]/80 border border-white/10 hover:border-white/20 rounded-2xl p-6 transition-all duration-300 overflow-hidden text-left ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >

                            <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-20 rounded-full blur-[50px] transition-opacity duration-500`} />

                            <div className="relative flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                        <item.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white group-hover:text-white transition-colors">
                                            {item.label}
                                        </h3>
                                        <p className="text-white/50 text-sm">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
                            </div>

                            {item.disabled && (
                                <div className="absolute top-2 right-2 px-2 py-0.5 bg-yellow-500/20 rounded text-yellow-400 text-[10px] font-bold uppercase">
                                    Скоро
                                </div>
                            )}
                        </motion.button>
                    ))}
                </div>
            </main>
        </div>
    );
};
