import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const DEFAULT_SERVICES = [
        {
            id: 'default_1',
            title: "Базове прибирання",
            description: "Ідеально для підтримки чистоти. Ми протираємо пил, миємо підлогу та наводимо лад.",
            price: "1500",
            price_label: "від 1500 ₴",
            price_type: 'fixed',
            category: 'apartment',
            gradient: "from-blue-400 to-blue-600",
            features: ["Сухе та вологе прибирання", "Очищення поверхонь", "Дезінфекція санвузлів", "Виніс сміття"],
            is_featured: true
        },
        {
            id: 'default_2',
            title: "Генеральне прибирання",
            description: "Повне очищення квартири від стелі до підлоги. Включає миття вікон та видалення складних забруднень.",
            price: "3500",
            price_label: "від 3500 ₴",
            price_type: 'sqm',
            category: 'apartment',
            gradient: "from-purple-400 to-purple-600",
            features: ["Все з базового прибирання", "Миття вікон та рам", "Очищення кухні та жиру", "Хімчистка меблів (опція)"],
            is_featured: true
        },
        {
            id: 'default_3',
            title: "Прибирання після ремонту",
            description: "Видалення будівельного пилу, слідів фарби та цементу. Робимо квартиру придатною для життя.",
            price: "60",
            price_label: "60 ₴/м²",
            price_type: 'sqm',
            category: 'house',
            gradient: "from-orange-400 to-orange-600",
            features: ["Видалення будівельного пилу", "Миття всіх поверхонь", "Чистка плитки та швів", "Виніс будівельного сміття"],
            is_featured: true
        }
    ];

    const fetchServices = async () => {
        try {
            const data = await api.getServices();
            setServices(data);
        } catch (error) {
            console.error('Failed to load services:', error);

            const saved = localStorage.getItem('uberem_services');
            if (saved) {
                setServices(JSON.parse(saved));
            } else {
                setServices(DEFAULT_SERVICES);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const refreshServices = () => {
        fetchServices();
    };

    const addService = async (serviceData) => {
        try {
            const token = localStorage.getItem('admin_token');
            let payload = serviceData;


            if (!(serviceData instanceof FormData)) {
                const formData = new FormData();
                for (const key in serviceData) {
                    if (key === 'features' && Array.isArray(serviceData[key])) {
                        formData.append(key, JSON.stringify(serviceData[key]));
                    } else if (serviceData[key] !== undefined && serviceData[key] !== null) {
                        formData.append(key, serviceData[key]);
                    }
                }
                payload = formData;
            }

            await api.createService(payload, token);
            await fetchServices();
        } catch (error) {
            console.error('Failed to add service:', error);
            throw error;
        }
    };

    const updateService = async (id, serviceData) => {
        try {
            const token = localStorage.getItem('admin_token');
            let payload = serviceData;

            if (!(serviceData instanceof FormData)) {
                const formData = new FormData();
                for (const key in serviceData) {
                    if (key === 'features' && Array.isArray(serviceData[key])) {
                        formData.append(key, JSON.stringify(serviceData[key]));
                    } else if (serviceData[key] !== undefined && serviceData[key] !== null) {
                        formData.append(key, serviceData[key]);
                    }
                }
                payload = formData;
            }

            await api.updateService(id, payload, token);
            await fetchServices();
        } catch (error) {
            console.error('Failed to update service:', error);
            throw error;
        }
    };

    const deleteService = async (id) => {
        try {
            const token = localStorage.getItem('admin_token');
            await api.deleteService(id, token);
            await fetchServices();
        } catch (error) {
            console.error('Failed to delete service:', error);
            throw error;
        }
    };

    return (
        <ServiceContext.Provider value={{ services, loading, refreshServices, addService, updateService, deleteService }}>
            {children}
        </ServiceContext.Provider>
    );
};

export const useServices = () => {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error('useServices must be used within a ServiceProvider');
    }
    return context;
};
