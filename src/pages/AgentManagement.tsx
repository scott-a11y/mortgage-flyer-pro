import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    Plus,
    Search,
    ArrowLeft,
    Edit3,
    Trash2,
    Upload,
    Phone,
    Mail,
    Globe,
    Building2,
    Palette,
    Save,
    X,
    Camera,
    Check,
    Shield,
    ChevronRight,
    LayoutDashboard,
    UserCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import * as agentService from "@/lib/services/agentService";
import { uploadHeadshot } from "@/lib/services/storageService";
import { AgentPartner, CreateAgentInput } from "@/lib/services/agentService";
import { agentPartners as mockAgentPartners } from "@/data/agentPartners";
import { brokerageThemes, ColorTheme } from "@/types/flyer";

type ViewMode = "grid" | "list";

interface AgentFormData {
    name: string;
    title: string;
    phone: string;
    email: string;
    brokerage: string;
    website: string;
    license_number: string;
    color_primary: string;
    color_secondary: string;
    color_accent: string;
    headshot_url: string;
}

const emptyForm: AgentFormData = {
    name: "",
    title: "REALTOR®",
    phone: "",
    email: "",
    brokerage: "",
    website: "",
    license_number: "",
    color_primary: "#000000",
    color_secondary: "#FFFFFF",
    color_accent: "#D4AF37",
    headshot_url: "",
};

export default function AgentManagement() {
    const navigate = useNavigate();
    const [agents, setAgents] = useState<AgentPartner[]>(mockAgentPartners);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAgent, setSelectedAgent] = useState<AgentPartner | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState<AgentFormData>(emptyForm);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [isSaving, setIsSaving] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadAgents();
    }, []);

    async function loadAgents() {
        setIsLoading(true);
        const { data: dbAgents } = await agentService.getAllAgents();
        if (dbAgents && dbAgents.length > 0) {
            setAgents(dbAgents);
        }
        setIsLoading(false);
    }

    const filteredAgents = agents.filter(
        (a) =>
            a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.realtor.brokerage.toLowerCase().includes(searchTerm.toLowerCase())
    );

    function openCreateForm() {
        setFormData(emptyForm);
        setPreviewUrl("");
        setSelectedAgent(null);
        setIsEditing(false);
        setIsCreating(true);
    }

    function openEditForm(agent: AgentPartner) {
        setFormData({
            name: agent.name,
            title: agent.realtor.title,
            phone: agent.realtor.phone,
            email: agent.realtor.email,
            brokerage: agent.realtor.brokerage,
            website: agent.realtor.website,
            license_number: "",
            color_primary: agent.colorTheme.primary,
            color_secondary: agent.colorTheme.secondary,
            color_accent: agent.colorTheme.accent,
            headshot_url: agent.realtor.headshot || "",
        });
        setPreviewUrl(agent.realtor.headshot || "");
        setSelectedAgent(agent);
        setIsEditing(true);
        setIsCreating(false);
    }

    function closeForm() {
        setIsEditing(false);
        setIsCreating(false);
        setSelectedAgent(null);
        setFormData(emptyForm);
        setPreviewUrl("");
    }

    async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show local preview immediately
        const localUrl = URL.createObjectURL(file);
        setPreviewUrl(localUrl);

        setUploadingPhoto(true);
        const slug = formData.name.toLowerCase().replace(/\s+/g, "-") || "agent";
        const { url, error } = await uploadHeadshot(file, slug);

        if (error || !url) {
            // Keep local preview, store as data URL fallback
            const reader = new FileReader();
            reader.onload = () => {
                setFormData((prev) => ({ ...prev, headshot_url: reader.result as string }));
            };
            reader.readAsDataURL(file);
            toast.info("Photo saved locally — will upload when Supabase Storage is configured.");
        } else {
            setFormData((prev) => ({ ...prev, headshot_url: url }));
            toast.success("Photo uploaded successfully!");
        }
        setUploadingPhoto(false);
    }

    async function handleSave() {
        if (!formData.name.trim()) {
            toast.error("Agent name is required.");
            return;
        }

        setIsSaving(true);

        const input: CreateAgentInput = {
            name: formData.name,
            title: formData.title,
            phone: formData.phone,
            email: formData.email,
            brokerage: formData.brokerage,
            website: formData.website,
            license_number: formData.license_number,
            headshot_url: formData.headshot_url,
            color_primary: formData.color_primary,
            color_secondary: formData.color_secondary,
            color_accent: formData.color_accent,
        };

        if (isEditing && selectedAgent) {
            const { data, error } = await agentService.updateAgent(selectedAgent.id, input);
            if (error) {
                // Fallback: update local state
                setAgents((prev) =>
                    prev.map((a) =>
                        a.id === selectedAgent.id
                            ? {
                                  ...a,
                                  name: formData.name,
                                  realtor: {
                                      ...a.realtor,
                                      name: formData.name,
                                      title: formData.title,
                                      phone: formData.phone,
                                      email: formData.email,
                                      brokerage: formData.brokerage,
                                      website: formData.website,
                                      headshot: formData.headshot_url || a.realtor.headshot,
                                  },
                                  colorTheme: {
                                      ...a.colorTheme,
                                      primary: formData.color_primary,
                                      secondary: formData.color_secondary,
                                      accent: formData.color_accent,
                                  },
                              }
                            : a
                    )
                );
                toast.success("Agent updated locally!");
            } else if (data) {
                await loadAgents();
                toast.success(`${data.name} updated successfully!`);
            }
        } else if (isCreating) {
            const { data, error } = await agentService.createAgent(input);
            if (error) {
                // Fallback: add to local state
                const newAgent: AgentPartner = {
                    id: `local-${Date.now()}`,
                    name: formData.name,
                    realtor: {
                        name: formData.name,
                        title: formData.title,
                        phone: formData.phone,
                        email: formData.email,
                        brokerage: formData.brokerage,
                        website: formData.website,
                        headshot: formData.headshot_url,
                    },
                    colorTheme: {
                        id: `custom-${Date.now()}`,
                        name: formData.brokerage || "Custom",
                        primary: formData.color_primary,
                        secondary: formData.color_secondary,
                        accent: formData.color_accent,
                    },
                };
                setAgents((prev) => [newAgent, ...prev]);
                toast.success("Agent added locally!");
            } else if (data) {
                await loadAgents();
                toast.success(`${data.name} added successfully!`);
            }
        }

        setIsSaving(false);
        closeForm();
    }

    async function handleDelete(agent: AgentPartner) {
        if (!confirm(`Delete ${agent.name}? This cannot be undone.`)) return;

        const { error } = await agentService.deleteAgent(agent.id);
        if (error) {
            // Fallback: remove from local state
            setAgents((prev) => prev.filter((a) => a.id !== agent.id));
        } else {
            await loadAgents();
        }
        toast.success(`${agent.name} removed.`);
    }

    function applyBrokerageTheme(theme: ColorTheme) {
        setFormData((prev) => ({
            ...prev,
            brokerage: theme.name,
            color_primary: theme.primary,
            color_secondary: theme.secondary,
            color_accent: theme.accent,
        }));
        toast.success(`Applied ${theme.name} theme`);
    }

    const showForm = isEditing || isCreating;

    return (
        <div className="min-h-screen bg-[#030304] text-slate-300 selection:bg-amber-500/30 font-sans pb-20 overflow-x-hidden">
            <Helmet><title>Agent Management | Mortgage Flyer Pro</title></Helmet>
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px] opacity-40" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[150px] opacity-30" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-16">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate("/dashboard")}
                                className="rounded-full bg-white/5 border border-white/10 hover:bg-white/10"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                                <Users className="w-3.5 h-3.5 text-purple-400" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400/80">
                                    Partner Network
                                </span>
                            </div>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none">
                            Agent <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-amber-200 to-white">
                                Management
                            </span>
                        </h1>
                        <p className="text-slate-400 max-w-lg font-medium">
                            Add, edit, and manage your real estate agent partners. Upload headshots, set brokerage themes, and keep contact info up to date.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 min-w-[240px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search agents..."
                                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl"
                            />
                        </div>
                        <Button
                            onClick={openCreateForm}
                            className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-xl px-6 hover:from-amber-400 hover:to-amber-500 gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Agent
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Agent Grid */}
                    <div className={`${showForm ? "lg:col-span-1" : "lg:col-span-3"} space-y-4`}>
                        <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-4">
                            {filteredAgents.length} Partners
                            <div className="h-px flex-1 bg-white/5" />
                        </h2>

                        <div className={`grid ${showForm ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"} gap-4`}>
                            <AnimatePresence>
                                {filteredAgents.map((agent, i) => (
                                    <motion.div
                                        key={agent.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Card
                                            className={`group relative p-5 bg-white/[0.02] border-white/10 hover:border-white/20 transition-all cursor-pointer overflow-hidden ${
                                                selectedAgent?.id === agent.id
                                                    ? "border-amber-500/50 bg-amber-500/[0.03]"
                                                    : ""
                                            }`}
                                            onClick={() => openEditForm(agent)}
                                        >
                                            {/* Theme color bar */}
                                            <div
                                                className="absolute top-0 left-0 right-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity"
                                                style={{
                                                    background: `linear-gradient(90deg, ${agent.colorTheme.primary}, ${agent.colorTheme.secondary})`,
                                                }}
                                            />

                                            <div className="flex items-start gap-4 mt-2">
                                                {/* Avatar */}
                                                <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 bg-slate-800">
                                                    {agent.realtor.headshot ? (
                                                        <img
                                                            src={agent.realtor.headshot}
                                                            className="w-full h-full object-cover"
                                                            alt={agent.name}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xl font-black text-slate-600">
                                                            {agent.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-bold text-white tracking-tight truncate">
                                                        {agent.name}
                                                    </h3>
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate">
                                                        {agent.realtor.brokerage}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-1 truncate">
                                                        {agent.realtor.title}
                                                    </p>
                                                </div>

                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 hover:text-amber-500"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openEditForm(agent);
                                                        }}
                                                    >
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 hover:text-red-500"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(agent);
                                                        }}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Quick contact */}
                                            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/5">
                                                {agent.realtor.phone && (
                                                    <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                                        <Phone className="w-3 h-3" />
                                                        {agent.realtor.phone}
                                                    </span>
                                                )}
                                                {agent.realtor.email && (
                                                    <span className="flex items-center gap-1.5 text-[10px] text-slate-500 truncate">
                                                        <Mail className="w-3 h-3" />
                                                        {agent.realtor.email}
                                                    </span>
                                                )}
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Edit / Create Panel */}
                    <AnimatePresence>
                        {showForm && (
                            <motion.div
                                className="lg:col-span-2"
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 40 }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            >
                                <Card className="bg-white/[0.03] border-white/10 p-8 rounded-3xl backdrop-blur-xl sticky top-8">
                                    {/* Panel Header */}
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-amber-500/20 rounded-xl">
                                                {isCreating ? (
                                                    <Plus className="w-5 h-5 text-amber-500" />
                                                ) : (
                                                    <Edit3 className="w-5 h-5 text-amber-500" />
                                                )}
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold text-white">
                                                    {isCreating ? "Add New Agent" : `Edit ${selectedAgent?.name}`}
                                                </h2>
                                                <p className="text-xs text-slate-500">
                                                    {isCreating ? "Fill in the agent details below" : "Update agent profile & settings"}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={closeForm}
                                            className="rounded-full hover:bg-white/10"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    {/* Photo Upload */}
                                    <div className="flex items-center gap-6 mb-8 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                        <div
                                            className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-dashed border-white/20 hover:border-amber-500/50 transition-colors cursor-pointer group bg-slate-800/50 flex-shrink-0"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {previewUrl ? (
                                                <img
                                                    src={previewUrl}
                                                    className="w-full h-full object-cover"
                                                    alt="Preview"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 group-hover:text-amber-500 transition-colors">
                                                    <Camera className="w-6 h-6 mb-1" />
                                                    <span className="text-[9px] font-bold uppercase tracking-wider">Photo</span>
                                                </div>
                                            )}
                                            {uploadingPhoto && (
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                    <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                                                </div>
                                            )}
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handlePhotoUpload}
                                            />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white">
                                                Agent Headshot
                                            </h4>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Click to upload or drag a photo. JPG, PNG recommended. Will auto-crop to circle in flyers.
                                            </p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="mt-2 h-7 text-[10px] border-white/10 hover:border-amber-500/30"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <Upload className="w-3 h-3 mr-1.5" />
                                                Upload Photo
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                <UserCircle2 className="w-3.5 h-3.5" /> Full Name
                                            </Label>
                                            <Input
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="bg-white/5 border-white/10 text-white rounded-xl"
                                                placeholder="Jane Smith"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                <Shield className="w-3.5 h-3.5" /> Title
                                            </Label>
                                            <Input
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="bg-white/5 border-white/10 text-white rounded-xl"
                                                placeholder="REALTOR®"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                <Phone className="w-3.5 h-3.5" /> Phone
                                            </Label>
                                            <Input
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="bg-white/5 border-white/10 text-white rounded-xl"
                                                placeholder="(425) 555-0123"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                <Mail className="w-3.5 h-3.5" /> Email
                                            </Label>
                                            <Input
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="bg-white/5 border-white/10 text-white rounded-xl"
                                                placeholder="agent@email.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                <Building2 className="w-3.5 h-3.5" /> Brokerage
                                            </Label>
                                            <Input
                                                value={formData.brokerage}
                                                onChange={(e) => setFormData({ ...formData, brokerage: e.target.value })}
                                                className="bg-white/5 border-white/10 text-white rounded-xl"
                                                placeholder="Century 21 North Homes"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                <Globe className="w-3.5 h-3.5" /> Website
                                            </Label>
                                            <Input
                                                value={formData.website}
                                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                                className="bg-white/5 border-white/10 text-white rounded-xl"
                                                placeholder="www.agent-website.com"
                                            />
                                        </div>
                                    </div>

                                    {/* Color Theme */}
                                    <div className="mb-8">
                                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-4">
                                            <Palette className="w-3.5 h-3.5" /> Brokerage Theme
                                        </Label>
                                        <div className="grid grid-cols-4 gap-2 mb-4">
                                            {brokerageThemes.map((theme) => (
                                                <button
                                                    key={theme.id}
                                                    onClick={() => applyBrokerageTheme(theme)}
                                                    className={`p-2 rounded-xl border transition-all text-left group/theme ${
                                                        formData.color_primary === theme.primary &&
                                                        formData.color_secondary === theme.secondary
                                                            ? "border-amber-500/50 bg-amber-500/10"
                                                            : "border-white/5 bg-white/[0.02] hover:border-white/20"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div
                                                            className="w-4 h-4 rounded-full border border-white/10"
                                                            style={{ backgroundColor: theme.primary }}
                                                        />
                                                        <div
                                                            className="w-4 h-4 rounded-full border border-white/10"
                                                            style={{ backgroundColor: theme.secondary }}
                                                        />
                                                    </div>
                                                    <span className="text-[9px] font-bold text-slate-500 group-hover/theme:text-slate-300 uppercase tracking-wider block truncate">
                                                        {theme.name}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Custom colors */}
                                        <div className="flex items-center gap-4 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <label className="text-[10px] text-slate-500 font-bold uppercase">Primary</label>
                                                <input
                                                    type="color"
                                                    value={formData.color_primary}
                                                    onChange={(e) => setFormData({ ...formData, color_primary: e.target.value })}
                                                    className="w-8 h-8 rounded-lg border border-white/10 cursor-pointer"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <label className="text-[10px] text-slate-500 font-bold uppercase">Secondary</label>
                                                <input
                                                    type="color"
                                                    value={formData.color_secondary}
                                                    onChange={(e) => setFormData({ ...formData, color_secondary: e.target.value })}
                                                    className="w-8 h-8 rounded-lg border border-white/10 cursor-pointer"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <label className="text-[10px] text-slate-500 font-bold uppercase">Accent</label>
                                                <input
                                                    type="color"
                                                    value={formData.color_accent}
                                                    onChange={(e) => setFormData({ ...formData, color_accent: e.target.value })}
                                                    className="w-8 h-8 rounded-lg border border-white/10 cursor-pointer"
                                                />
                                            </div>

                                            {/* Preview bar */}
                                            <div className="flex-1 h-8 rounded-lg overflow-hidden flex ml-2">
                                                <div className="flex-1" style={{ backgroundColor: formData.color_primary }} />
                                                <div className="flex-1" style={{ backgroundColor: formData.color_secondary }} />
                                                <div className="w-4" style={{ backgroundColor: formData.color_accent }} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3">
                                        <Button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-xl px-8 hover:from-amber-400 hover:to-amber-500 gap-2"
                                        >
                                            {isSaving ? (
                                                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Save className="w-4 h-4" />
                                            )}
                                            {isCreating ? "Add Agent" : "Save Changes"}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={closeForm}
                                            className="border-white/10 text-white hover:bg-white/5 rounded-xl"
                                        >
                                            Cancel
                                        </Button>
                                        {isEditing && selectedAgent && (
                                            <Button
                                                variant="ghost"
                                                onClick={() => navigate(`/dashboard/${selectedAgent.id}`)}
                                                className="text-slate-400 hover:text-white rounded-xl gap-2 ml-auto"
                                            >
                                                View Dashboard
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
