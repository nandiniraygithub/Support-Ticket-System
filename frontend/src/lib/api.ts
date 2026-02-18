import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
});

export interface Ticket {
    id: number;
    title: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    created_at: string;
}

export interface Stats {
    total_tickets: number;
    open_tickets: number;
    avg_tickets_per_day: number;
    priority_breakdown: Record<string, number>;
    category_breakdown: Record<string, number>;
}

export const getTickets = (params?: any) => api.get<Ticket[]>('/tickets/', { params });
export const createTicket = (data: Partial<Ticket>) => api.post<Ticket>('/tickets/', data);
export const updateTicket = (id: number, data: Partial<Ticket>) => api.patch<Ticket>(`/tickets/${id}/`, data);
export const getStats = () => api.get<Stats>('/tickets/stats/');
export const classifyTicket = (description: string) => api.post<{ suggested_category: string, suggested_priority: string }>('/tickets/classify/', { description });

export default api;
