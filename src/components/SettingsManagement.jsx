import React, { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Phone,
    Mail,
    MapPin,
    Clock,
    Instagram,
    Facebook,
    Send,
    ChevronDown,
    Save,
    Search,
    BarChart
} from 'lucide-react';
import { api } from '../utils/api';

export const SettingsManagement = ({ onBack }) => {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [expandedSections, setExpandedSections] = useState(['contact']);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const data = await api.getSettings(token);


            const settingsObj = data.reduce((acc, item) => {
                acc[item.key] = item.value || '';
                return acc;
            }, {});

            setSettings(settingsObj);
        } catch (error) {
            console.error('Failed to load settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('admin_token');


            const updates = Object.entries(settings).map(([key, value]) => ({
                key,
                value
            }));

            await api.updateSettings(updates, token);
            alert('✅ Налаштування збережено!');
        } catch (error) {
            console.error('Failed to save settings:', error);
            alert('❌ Помилка збереження. Спробуйте ще раз.');
        } finally {
            setSaving(false);
        }
    };

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const toggleSection = (section) => {
        setExpandedSections(prev =>
            prev.includes(section)
                ? prev.filter(s => s !== section)
                : [...prev, section]
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    const Section = ({ id, title, icon: Icon, color, children }) => {
        const isExpanded = expandedSections.includes(id);

        return (
            <div className="mb-4">
                <button
                    onClick={() => toggleSection(id)}
                    className={`w-full flex items-center justify-between p-6 rounded-2xl border border-white/10 bg-gradient-to-r ${color} transition-all ${isExpanded ? 'shadow-lg' : 'hover:border-white/20'
                        }`}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                            <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-white">{title}</h2>
                    </div>
                    <ChevronDown
                        className={`w-5 h-5 text-white transition-transform ${isExpanded ? 'rotate-180' : ''
                            }`}
                    />
                </button>

                {isExpanded && (
                    <div className="p-6 mt-2 bg-[#1a1a1a] rounded-2xl border border-white/10">
                        {children}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                    <h1 className="text-2xl font-bold text-white">Налаштування сайту</h1>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-bold text-white hover:shadow-lg transition-all disabled:opacity-50"
                >
                    <Save className="w-5 h-5" />
                    {saving ? 'Збереження...' : 'Зберегти все'}
                </button>
            </div>


            <Section
                id="contact"
                title="Контакти та соцмережі"
                icon={Phone}
                color="from-blue-500/10 to-cyan-500/10"
            >
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="flex items-center gap-2 text-sm text-white/50 mb-2">
                            <Phone className="w-4 h-4" />
                            Телефон
                        </label>
                        <input
                            type="text"
                            value={settings.phone || ''}
                            onChange={(e) => updateSetting('phone', e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                            placeholder="+380 XX XXX XX XX"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm text-white/50 mb-2">
                            <Mail className="w-4 h-4" />
                            Email
                        </label>
                        <input
                            type="email"
                            value={settings.email || ''}
                            onChange={(e) => updateSetting('email', e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                            placeholder="info@example.com"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm text-white/50 mb-2">
                            <MapPin className="w-4 h-4" />
                            Адреса
                        </label>
                        <input
                            type="text"
                            value={settings.address || ''}
                            onChange={(e) => updateSetting('address', e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                            placeholder="Київ, Україна"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm text-white/50 mb-2">
                            <Clock className="w-4 h-4" />
                            Години роботи
                        </label>
                        <input
                            type="text"
                            value={settings.hours || ''}
                            onChange={(e) => updateSetting('hours', e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                            placeholder="Пн-Нд: 8:00 - 20:00"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm text-white/50 mb-2">
                            <Instagram className="w-4 h-4" />
                            Instagram
                        </label>
                        <input
                            type="url"
                            value={settings.instagram || ''}
                            onChange={(e) => updateSetting('instagram', e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                            placeholder="https://instagram.com/..."
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm text-white/50 mb-2">
                            <Facebook className="w-4 h-4" />
                            Facebook
                        </label>
                        <input
                            type="url"
                            value={settings.facebook || ''}
                            onChange={(e) => updateSetting('facebook', e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                            placeholder="https://facebook.com/..."
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="flex items-center gap-2 text-sm text-white/50 mb-2">
                            <Send className="w-4 h-4" />
                            Telegram
                        </label>
                        <input
                            type="url"
                            value={settings.telegram || ''}
                            onChange={(e) => updateSetting('telegram', e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                            placeholder="https://t.me/..."
                        />
                    </div>
                </div>
            </Section>


            <Section
                id="seo"
                title="SEO налаштування"
                icon={Search}
                color="from-green-500/10 to-emerald-500/10"
            >
                <div className="space-y-4">
                    <div>
                        <label className="flex items-center gap-2 text-sm text-white/50 mb-2">
                            Meta Title
                        </label>
                        <input
                            type="text"
                            value={settings.meta_title || ''}
                            onChange={(e) => updateSetting('meta_title', e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-green-500 focus:outline-none transition-colors"
                            placeholder="Назва сайту для пошукових систем"
                        />
                        <p className="text-xs text-white/40 mt-1">{(settings.meta_title || '').length} / 60 символів</p>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm text-white/50 mb-2">
                            Meta Description
                        </label>
                        <textarea
                            value={settings.meta_description || ''}
                            onChange={(e) => updateSetting('meta_description', e.target.value)}
                            rows={3}
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-green-500 focus:outline-none transition-colors resize-none"
                            placeholder="Опис для пошукових систем (155-160 символів)"
                        />
                        <p className="text-xs text-white/40 mt-1">{(settings.meta_description || '').length} / 160 символів</p>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm text-white/50 mb-2">
                            Google Analytics ID
                        </label>
                        <input
                            type="text"
                            value={settings.ga_id || ''}
                            onChange={(e) => updateSetting('ga_id', e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-green-500 focus:outline-none transition-colors"
                            placeholder="G-XXXXXXXXXX"
                        />
                    </div>
                </div>
            </Section>
        </div>
    );
};
