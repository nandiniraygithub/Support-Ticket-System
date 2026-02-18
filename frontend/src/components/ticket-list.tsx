import { useState, useMemo } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, RotateCcw, Clock } from "lucide-react"
import { updateTicket } from '@/lib/api'
import type { Ticket } from '@/lib/api'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import { Skeleton } from "@/components/ui/skeleton"

interface TicketListProps {
    initialTickets: Ticket[];
    onRefresh: () => void;
    loading: boolean;
}

export default function TicketList({ initialTickets, onRefresh, loading }: TicketListProps) {
    const [search, setSearch] = useState('')
    const [filterCategory, setFilterCategory] = useState('all')
    const [filterPriority, setFilterPriority] = useState('all')
    const [filterStatus, setFilterStatus] = useState('all')

    const filteredTickets = useMemo(() => {
        return initialTickets.filter(ticket => {
            const matchesSearch = ticket.title.toLowerCase().includes(search.toLowerCase()) ||
                ticket.description.toLowerCase().includes(search.toLowerCase())
            const matchesCategory = filterCategory === 'all' || ticket.category === filterCategory
            const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority
            const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus

            return matchesSearch && matchesCategory && matchesPriority && matchesStatus
        })
    }, [initialTickets, search, filterCategory, filterPriority, filterStatus])

    const handleStatusUpdate = async (id: number, newStatus: string) => {
        try {
            await updateTicket(id, { status: newStatus });
            toast.success(`Ticket status updated to ${newStatus}`);
            onRefresh();
        } catch (error) {
            toast.error("Failed to update status");
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical': return 'bg-destructive text-destructive-foreground hover:bg-destructive/90';
            case 'high': return 'bg-orange-500 text-white hover:bg-orange-600';
            case 'medium': return 'bg-blue-500 text-white hover:bg-blue-600';
            default: return 'bg-slate-500 text-white hover:bg-slate-600';
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'resolved': return 'bg-green-500/10 text-green-600 border-green-200';
            case 'closed': return 'bg-slate-500/10 text-slate-600 border-slate-200';
            case 'in_progress': return 'bg-blue-500/10 text-blue-600 border-blue-200';
            default: return 'bg-orange-500/10 text-orange-600 border-orange-200';
        }
    }

    if (loading && initialTickets.length === 0) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-muted/30 p-4 rounded-xl border border-border/50">
                <div className="md:col-span-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search tickets..."
                        className="pl-9 bg-background"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="billing">Billing</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="account">Account</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-4">
                {filteredTickets.map((ticket) => (
                    <Card key={ticket.id} className="group hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="space-y-3 flex-1">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                                            {ticket.priority.toUpperCase()}
                                        </Badge>
                                        <Badge variant="outline" className={getStatusColor(ticket.status)}>
                                            {ticket.status.replace('_', ' ').toUpperCase()}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto md:ml-0">
                                            <Clock className="h-3 w-3" />
                                            {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{ticket.title}</h3>
                                        <p className="text-muted-foreground line-clamp-2 mt-1">{ticket.description}</p>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm font-medium">
                                        <span className="bg-muted px-2 py-0.5 rounded text-xs uppercase tracking-wider">{ticket.category}</span>
                                    </div>
                                </div>

                                <div className="flex md:flex-col justify-end gap-2 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 border-dashed">
                                    <Select
                                        onValueChange={(val) => handleStatusUpdate(ticket.id, val)}
                                        defaultValue={ticket.status}
                                    >
                                        <SelectTrigger className="w-[140px] h-9">
                                            <SelectValue placeholder="Update Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="open">Open</SelectItem>
                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                            <SelectItem value="resolved">Resolved</SelectItem>
                                            <SelectItem value="closed">Closed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {filteredTickets.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed rounded-xl bg-muted/10">
                        <RotateCcw className="h-10 w-10 mx-auto text-muted-foreground mb-4 opacity-20" />
                        <h3 className="text-lg font-medium">No tickets found</h3>
                        <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
                        <Button variant="link" onClick={() => {
                            setSearch(''); setFilterCategory('all'); setFilterPriority('all'); setFilterStatus('all');
                        }}>Clear all filters</Button>
                    </div>
                )}
            </div>
        </div>
    )
}
