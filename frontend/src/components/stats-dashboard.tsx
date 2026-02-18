import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Stats } from "@/lib/api"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Skeleton } from "@/components/ui/skeleton"
import { Ticket, Clock, AlertCircle } from "lucide-react"

interface StatsDashboardProps {
    stats: Stats | null;
    loading: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function StatsDashboard({ stats, loading }: StatsDashboardProps) {
    if (loading || !stats) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
                <Skeleton className="h-80 w-full md:col-span-2 rounded-xl" />
                <Skeleton className="h-80 w-full rounded-xl" />
            </div>
        )
    }

    const PRIORITY_COLORS: Record<string, string> = {
        critical: '#ef4444', // Red
        high: '#f97316',     // Orange
        medium: '#eab308',   // Yellow
        low: '#22c55e',      // Green
    };

    const priorityData = Object.entries(stats.priority_breakdown).map(([name, value]) => ({
        name,
        value,
        fill: PRIORITY_COLORS[name] || '#8884d8'
    }));

    const categoryData = Object.entries(stats.category_breakdown).map(([name, value]) => ({ name, value }));

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                        <Ticket className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.total_tickets}</div>
                        <p className="text-xs text-muted-foreground mt-1">Sum of all entries</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.open_tickets}</div>
                        <p className="text-xs text-muted-foreground mt-1">Pending resolution</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Avg Tickets / Day</CardTitle>
                        <Clock className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.avg_tickets_per_day}</div>
                        <p className="text-xs text-muted-foreground mt-1">Based on submission history</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Priority Breakdown</CardTitle>
                        <CardDescription>Distribution of tickets by severity level</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={priorityData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: 'hsl(var(--muted)/0.4)' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Categories</CardTitle>
                        <CardDescription>Volume across departments</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
