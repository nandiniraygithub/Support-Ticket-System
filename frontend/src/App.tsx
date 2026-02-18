import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import TicketForm from './components/ticket-form.tsx'
import TicketList from './components/ticket-list.tsx'
import StatsDashboard from './components/stats-dashboard.tsx'
import { getTickets, getStats } from './lib/api'
import type { Ticket, Stats } from './lib/api'

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("list")

  const fetchBlocks = async () => {
    try {
      setLoading(true)
      const [ticketsRes, statsRes] = await Promise.all([
        getTickets(),
        getStats()
      ])
      setTickets(ticketsRes.data)
      setStats(statsRes.data)
    } catch (error) {
      console.error("Failed to fetch data", error)
      toast.error("Failed to sync with server")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlocks()
  }, [])

  const handleTicketCreated = () => {
    fetchBlocks()
    setActiveTab("list")
    toast.success("Ticket submitted successfully!")
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-primary">Support Center</h1>
            <p className="text-muted-foreground mt-1 text-lg">AI-Powered Ticketing System</p>
          </div>
          <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
            <span className="px-3 py-1 text-sm font-medium">Auto-classify: Active</span>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 h-12">
            <TabsTrigger value="list" className="text-base">All Tickets</TabsTrigger>
            <TabsTrigger value="new" className="text-base">New Ticket</TabsTrigger>
            <TabsTrigger value="dashboard" className="text-base">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <TicketList initialTickets={tickets} onRefresh={fetchBlocks} loading={loading} />
          </TabsContent>

          <TabsContent value="new">
            <div className="max-w-2xl mx-auto">
              <TicketForm onCreated={handleTicketCreated} />
            </div>
          </TabsContent>

          <TabsContent value="dashboard">
            <StatsDashboard stats={stats} loading={loading} />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </div>
  )
}

export default App
