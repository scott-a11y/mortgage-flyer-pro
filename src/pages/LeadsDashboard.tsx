import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, Eye, Download, Phone, Mail, Calendar, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Lead {
    name: string;
    email: string;
    phone: string;
    preApproved: string;
    message: string;
    property: string;
    timestamp: string;
    source: string;
}

export default function LeadsDashboard() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [stats, setStats] = useState({
        totalViews: 0,
        totalLeads: 0,
        conversionRate: "0%"
    });

    const loadData = () => {
        // Load leads
        const storedLeads = JSON.parse(localStorage.getItem('captured_leads') || '[]');
        setLeads(storedLeads);

        // Load view counts for all properties
        let totalViews = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith('lead_views_')) {
                totalViews += parseInt(localStorage.getItem(key) || '0');
            }
        }

        const conversionRate = totalViews > 0
            ? ((storedLeads.length / totalViews) * 100).toFixed(1) + '%'
            : '0%';

        setStats({
            totalViews,
            totalLeads: storedLeads.length,
            conversionRate
        });
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDeleteLead = (index: number) => {
        const updated = leads.filter((_, i) => i !== index);
        localStorage.setItem('captured_leads', JSON.stringify(updated));
        setLeads(updated);
        toast.success("Lead removed");
    };

    const handleClearAll = () => {
        if (confirm("Clear all leads? This cannot be undone.")) {
            localStorage.setItem('captured_leads', '[]');
            setLeads([]);
            toast.success("All leads cleared");
        }
    };

    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans p-6">
            {/* Header */}
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link to="/">
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Back to Builder
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black">Lead Dashboard</h1>
                            <p className="text-sm text-slate-400">Track leads from your property flyers</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={loadData} variant="outline" size="sm" className="gap-2 border-slate-700">
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </Button>
                        {leads.length > 0 && (
                            <Button onClick={handleClearAll} variant="outline" size="sm" className="gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10">
                                <Trash2 className="w-4 h-4" />
                                Clear All
                            </Button>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                        { icon: Eye, value: stats.totalViews, label: "Page Views", color: "text-blue-400" },
                        { icon: Users, value: stats.totalLeads, label: "Total Leads", color: "text-amber-400" },
                        { icon: Download, value: stats.conversionRate, label: "Conversion Rate", color: "text-green-400" }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-5 rounded-xl bg-white/5 border border-white/10"
                        >
                            <stat.icon className={`w-6 h-6 mb-3 ${stat.color}`} />
                            <div className="text-3xl font-black text-white">{stat.value}</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Leads Table */}
                <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                    <div className="p-4 border-b border-white/10">
                        <h2 className="font-bold">Recent Leads</h2>
                    </div>

                    {leads.length === 0 ? (
                        <div className="p-12 text-center">
                            <Users className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                            <h3 className="text-lg font-bold text-slate-400 mb-2">No leads yet</h3>
                            <p className="text-sm text-slate-500 mb-4">Leads will appear here when someone fills out your property form</p>
                            <Link to="/lead/maple-valley">
                                <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                                    View Lead Capture Page
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/10">
                            <AnimatePresence>
                                {leads.map((lead, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="p-4 hover:bg-white/5 transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="font-bold text-white">{lead.name}</div>
                                                    {lead.preApproved === 'yes' && (
                                                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-green-500/20 text-green-400 font-bold uppercase">
                                                            Pre-Approved
                                                        </span>
                                                    )}
                                                    {lead.preApproved === 'cash' && (
                                                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-amber-500/20 text-amber-400 font-bold uppercase">
                                                            Cash Buyer
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-slate-400">
                                                    <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-white">
                                                        <Mail className="w-3 h-3" />
                                                        {lead.email}
                                                    </a>
                                                    <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-white">
                                                        <Phone className="w-3 h-3" />
                                                        {lead.phone}
                                                    </a>
                                                </div>
                                                {lead.message && (
                                                    <p className="mt-2 text-sm text-slate-500 italic">"{lead.message}"</p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(lead.timestamp)}
                                                </div>
                                                <Button
                                                    onClick={() => handleDeleteLead(i)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-slate-500 hover:text-red-400 h-7"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
