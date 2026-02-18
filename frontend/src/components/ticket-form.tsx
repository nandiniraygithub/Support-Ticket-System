import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles } from "lucide-react"
import { classifyTicket, createTicket } from '@/lib/api'
import { toast } from 'sonner'

interface TicketFormProps {
    onCreated: () => void;
}

export default function TicketForm({ onCreated }: TicketFormProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [priority, setPriority] = useState('')
    const [isClassifying, setIsClassifying] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleDescriptionBlur = async () => {
        if (description.length < 10) return;

        setIsClassifying(true);
        try {
            const { data } = await classifyTicket(description);
            setCategory(data.suggested_category);
            setPriority(data.suggested_priority);
            toast.info("AI suggested category and priority", {
                description: "Review and adjust if needed.",
                icon: <Sparkles className="h-4 w-4 text-primary" />
            });
        } catch (error) {
            console.error("Classification failed", error);
        } finally {
            setIsClassifying(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !category || !priority) {
            toast.error("Please fill all fields");
            return;
        }

        setIsSubmitting(true);
        try {
            await createTicket({ title, description, category, priority });
            setTitle('');
            setDescription('');
            setCategory('');
            setPriority('');
            onCreated();
        } catch (error) {
            toast.error("Failed to create ticket");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card className="border-2">
            <CardHeader>
                <CardTitle>Create Support Ticket</CardTitle>
                <CardDescription>Describe your issue and let our AI assist you.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Issue Title</Label>
                        <Input
                            id="title"
                            placeholder="Brief summary of the problem"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            maxLength={200}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Detailed Description</Label>
                        <Textarea
                            id="description"
                            placeholder="What happened? Please be as detailed as possible."
                            className="min-h-[120px]"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onBlur={handleDescriptionBlur}
                            required
                        />
                        {isClassifying && (
                            <div className="flex items-center gap-2 text-sm text-primary animate-pulse">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                AI is analyzing your request...
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className={category ? "border-primary" : ""}>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="billing">Billing</SelectItem>
                                    <SelectItem value="technical">Technical</SelectItem>
                                    <SelectItem value="account">Account</SelectItem>
                                    <SelectItem value="general">General</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select value={priority} onValueChange={setPriority}>
                                <SelectTrigger className={priority ? "border-primary" : ""}>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isSubmitting || isClassifying}>
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Submit Ticket
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
