import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FlyerData } from "@/types/flyer";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, Save, X, Lock, Unlock, ChevronDown, ChevronUp, Wifi } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface LiveRateEditorProps {
    data: FlyerData;
    slug: string;
    onRatesUpdated: (newRates: FlyerData["rates"]) => void;
}

const ADMIN_PIN = "1106"; // Simple PIN for demo - should be per-user in production

export function LiveRateEditor({ data, slug, onRatesUpdated }: LiveRateEditorProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pinInput, setPinInput] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    // Local rate state for editing
    const [editRates, setEditRates] = useState({
        thirtyYearFixed: data.rates.thirtyYearFixed,
        thirtyYearFixedAPR: data.rates.thirtyYearFixedAPR,
        fifteenYearFixed: data.rates.fifteenYearFixed || "5.790%",
        fifteenYearFixedAPR: data.rates.fifteenYearFixedAPR || "5.99%",
        thirtyYearJumbo: data.rates.thirtyYearJumbo,
        thirtyYearJumboAPR: data.rates.thirtyYearJumboAPR,
        fiveOneArm: data.rates.fiveOneArm,
        fiveOneArmAPR: data.rates.fiveOneArmAPR,
    });

    const handlePinSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pinInput === ADMIN_PIN) {
            setIsAuthenticated(true);
            toast.success("Admin access granted");
        } else {
            toast.error("Invalid PIN");
            setPinInput("");
        }
    };

    const updateRate = (field: string, value: string) => {
        setEditRates(prev => ({ ...prev, [field]: value }));
    };

    const handleFetchLiveRates = async () => {
        setIsFetching(true);
        try {
            const { data: response, error } = await supabase.functions.invoke('fetch-mortgage-rates');

            if (error) throw error;

            if (response?.success && response?.rates) {
                setEditRates({
                    thirtyYearFixed: response.rates.thirtyYearFixed || editRates.thirtyYearFixed,
                    thirtyYearFixedAPR: response.rates.thirtyYearFixedAPR || editRates.thirtyYearFixedAPR,
                    fifteenYearFixed: response.rates.fifteenYearFixed || editRates.fifteenYearFixed,
                    fifteenYearFixedAPR: response.rates.fifteenYearFixedAPR || editRates.fifteenYearFixedAPR,
                    thirtyYearJumbo: response.rates.thirtyYearJumbo || editRates.thirtyYearJumbo,
                    thirtyYearJumboAPR: response.rates.thirtyYearJumboAPR || editRates.thirtyYearJumboAPR,
                    fiveOneArm: response.rates.fiveOneArm || editRates.fiveOneArm,
                    fiveOneArmAPR: response.rates.fiveOneArmAPR || editRates.fiveOneArmAPR,
                });
                toast.success("Live rates fetched!");
            }
        } catch (err) {
            console.error("Error fetching rates:", err);
            // Simulate rates for demo
            const baseRate = 6.125 + (Math.random() - 0.5) * 0.1;
            setEditRates({
                thirtyYearFixed: baseRate.toFixed(3) + "%",
                thirtyYearFixedAPR: (baseRate + 0.2).toFixed(3) + "%",
                fifteenYearFixed: (baseRate - 0.335).toFixed(3) + "%",
                fifteenYearFixedAPR: (baseRate - 0.135).toFixed(3) + "%",
                thirtyYearJumbo: (baseRate + 0.300).toFixed(3) + "%",
                thirtyYearJumboAPR: (baseRate + 0.500).toFixed(3) + "%",
                fiveOneArm: (baseRate - 0.405).toFixed(3) + "%",
                fiveOneArmAPR: (baseRate + 0.725).toFixed(3) + "%",
            });
            toast.success("Sample rates refreshed!");
        } finally {
            setIsFetching(false);
        }
    };

    const handleSaveRates = async () => {
        setIsSaving(true);

        const newRates = {
            ...data.rates,
            ...editRates,
            dateGenerated: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };

        try {
            // First update the local display
            onRatesUpdated(newRates);

            // Then try to persist to Supabase (if not in demo mode)
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
            const isPlaceholder = !supabaseUrl || supabaseUrl.includes('placeholder.supabase.co');

            if (!isPlaceholder && !slug.startsWith('scott-little')) {
                const { error } = await supabase
                    .from("flyer_templates")
                    .update({
                        data: {
                            ...data,
                            rates: newRates
                        },
                        updated_at: new Date().toISOString()
                    })
                    .eq("slug", slug);

                if (error) throw error;
            }

            toast.success("Rates updated successfully!", {
                description: "The live flyer now shows your new rates."
            });
        } catch (err) {
            console.error("Error saving rates:", err);
            toast.error("Failed to save to database", {
                description: "Local display updated, but persist failed."
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-3 w-80 bg-[#0f0f11] border border-amber-500/20 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-4 border-b border-amber-500/10 bg-amber-500/5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider flex items-center gap-2">
                                    {isAuthenticated ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                    Rate Admin
                                </h3>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsExpanded(false)}
                                    className="h-6 w-6 text-slate-400 hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="p-4">
                            {!isAuthenticated ? (
                                <form onSubmit={handlePinSubmit} className="space-y-3">
                                    <Label className="text-[10px] uppercase tracking-widest text-slate-500">
                                        Enter Admin PIN
                                    </Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="password"
                                            value={pinInput}
                                            onChange={(e) => setPinInput(e.target.value)}
                                            placeholder="••••"
                                            className="bg-black/50 border-amber-500/20 text-center text-lg tracking-[0.5em] font-mono"
                                            maxLength={4}
                                        />
                                        <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-black font-bold">
                                            <Lock className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <p className="text-[9px] text-slate-500 text-center">
                                        Demo PIN: 1106
                                    </p>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleFetchLiveRates}
                                            disabled={isFetching}
                                            className="flex-1 border-amber-500/20 text-amber-500 hover:bg-amber-500/10 text-[10px] uppercase tracking-wider font-bold"
                                        >
                                            {isFetching ? <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> : <Wifi className="w-3 h-3 mr-1" />}
                                            Fetch Live
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label className="text-[9px] uppercase text-slate-500">30-Yr Fixed</Label>
                                            <Input
                                                value={editRates.thirtyYearFixed}
                                                onChange={(e) => updateRate("thirtyYearFixed", e.target.value)}
                                                className="h-8 text-xs bg-black/50 border-amber-500/10"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[9px] uppercase text-slate-500">APR</Label>
                                            <Input
                                                value={editRates.thirtyYearFixedAPR}
                                                onChange={(e) => updateRate("thirtyYearFixedAPR", e.target.value)}
                                                className="h-8 text-xs bg-black/50 border-amber-500/10"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[9px] uppercase text-slate-500">15-Yr Fixed</Label>
                                            <Input
                                                value={editRates.fifteenYearFixed}
                                                onChange={(e) => updateRate("fifteenYearFixed", e.target.value)}
                                                className="h-8 text-xs bg-black/50 border-amber-500/10"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[9px] uppercase text-slate-500">APR</Label>
                                            <Input
                                                value={editRates.fifteenYearFixedAPR}
                                                onChange={(e) => updateRate("fifteenYearFixedAPR", e.target.value)}
                                                className="h-8 text-xs bg-black/50 border-amber-500/10"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[9px] uppercase text-slate-500">Jumbo</Label>
                                            <Input
                                                value={editRates.thirtyYearJumbo}
                                                onChange={(e) => updateRate("thirtyYearJumbo", e.target.value)}
                                                className="h-8 text-xs bg-black/50 border-amber-500/10"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[9px] uppercase text-slate-500">APR</Label>
                                            <Input
                                                value={editRates.thirtyYearJumboAPR}
                                                onChange={(e) => updateRate("thirtyYearJumboAPR", e.target.value)}
                                                className="h-8 text-xs bg-black/50 border-amber-500/10"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleSaveRates}
                                        disabled={isSaving}
                                        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold h-10 uppercase tracking-wider text-xs"
                                    >
                                        {isSaving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                        Publish Rate Update
                                    </Button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <Button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`rounded-full h-12 px-4 shadow-lg transition-all ${isExpanded
                    ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                    : "bg-amber-500 text-black hover:bg-amber-600"
                    }`}
            >
                {isExpanded ? (
                    <ChevronDown className="w-5 h-5" />
                ) : (
                    <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        <span className="font-bold text-xs uppercase tracking-wider">Update Rates</span>
                    </>
                )}
            </Button>
        </div>
    );
}
