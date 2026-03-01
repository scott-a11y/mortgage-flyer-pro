import { useState, useEffect, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { 
    Sparkles, 
    ArrowLeft, 
    Home, 
    MapPin, 
    Coffee, 
    MessageSquare, 
    Plus, 
    Trash2, 
    Share2,
    Eye,
    Layout,
    RefreshCw,
    ChevronDown,
    X,
        Search,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { BuyerExperience, TourInsight, formatCurrency, PropertyListing } from "@/types/property";
import { mapleValleyProperty } from "@/data/mapleValleyProperty";
import { bothellProperty } from "@/data/bothellProperty";
import { generateGhostDetail } from "@/lib/services/aiService";
import { searchByMLS, searchByAddress, rmlsResultToPropertyListing, MLS_SOURCES, type MLSSource } from "@/lib/services/rmlsService";
const STORAGE_KEY = "buyer-experience-draft";
const CUSTOM_LISTINGS_KEY = "custom-listings";

// Available listings for the "Change Listing" modal
const availableListings = [
    { slug: "maple-valley", property: mapleValleyProperty },
    { slug: "bothell", property: bothellProperty },
];

export default function BuyerAgentToolkit() {
    const navigate = useNavigate();
    const [isGhostLoading, setIsGhostLoading] = useState(false);
    const [showListingModal, setShowListingModal] = useState(false);
    const [showAddListingForm, setShowAddListingForm] = useState(false);
        const [rmlsSearchMode, setRmlsSearchMode] = useState<'mls' | 'address'>('mls');
    const [rmlsQuery, setRmlsQuery] = useState('');
    const [rmlsResults, setRmlsResults] = useState<PropertyListing[]>([]);
    const [rmlsLoading, setRmlsLoading] = useState(false);
    const [rmlsError, setRmlsError] = useState<string | null>(null);
    const [mlsSource, setMlsSource] = useState<MLSSource>('rmls');     const [modalTab, setModalTab] = useState<'listings' | 'rmls'>('listings');
    const [customListings, setCustomListings] = useState<Array<{ slug: string; property: PropertyListing }>>(() => {
        try {
            const saved = localStorage.getItem(CUSTOM_LISTINGS_KEY);
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error('Failed to parse custom listings', e);
        }
        return [];
    });
    const [newListingForm, setNewListingForm] = useState({
        address: "", city: "", state: "WA", bedrooms: 3, bathrooms: 2,
        squareFootage: 2000, listPrice: 500000, mlsNumber: "", headline: ""
    });

    // Load from localStorage or use defaults
    const [experience, setExperience] = useState<BuyerExperience>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error('Failed to parse experience', e);
        }
        return {
            id: "exp_1",
            listing: mapleValleyProperty,
            agentTake: "This home perfectly balances modern luxury with suburban tranquility. The open-concept kitchen is truly the heart of the home, ideal for the growing family dynamics we discussed. I especially love how the natural light hits the kitchen island during breakfast time.",
            tourInsights: [
                { id: "1", type: "highlight", category: "kitchen", content: "South-facing windows provide incredible natural light all afternoon." },
                { id: "2", type: "vibe", category: "arrival", content: "The street is exceptionally quiet, perfect for those morning walks or kids playing outside." }
            ],
            localGems: [
                { name: "Lake Wilderness Park", category: "Nature", note: "Just a 5-minute bike ride away. Best sunset views in the city.", distance: "0.8 miles" },
                { name: "Caffe Ladro", category: "Coffee", note: "My favorite local spot for a morning latte.", distance: "1.2 miles" }
            ],
            buyerName: "Sarah & Mike",
            strategyType: "wealth-builder"
        };
    });

    // Auto-save to localStorage on every change (Issue #5)
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(experience));
        } catch (e) {
            console.error('Failed to save experience', e);
        }
    }, [experience]);

    // Warn before navigating away with unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);

    // Bug 2 fix: Debounced auto-replace buyer name in agent's take
    // Uses a separate "last committed name" ref so intermediate keystrokes
    // don't cascade replacements and garble the text.
    const lastCommittedName = useRef(experience.buyerName);
    const nameDebounceTimer = useRef<ReturnType<typeof setTimeout>>();
    useEffect(() => {
        if (nameDebounceTimer.current) clearTimeout(nameDebounceTimer.current);
        nameDebounceTimer.current = setTimeout(() => {
            const oldName = lastCommittedName.current;
            const newName = experience.buyerName;
            if (oldName && newName && oldName !== newName && experience.agentTake.includes(oldName)) {
                setExperience(prev => ({
                    ...prev,
                    agentTake: prev.agentTake.split(oldName).join(newName)
                }));
                lastCommittedName.current = newName;
                toast.success(`Updated Agent's Take: "${oldName}" → "${newName}"`, { duration: 2000 });
            } else if (newName && oldName !== newName) {
                // Name changed but wasn't found in the text — still update ref
                // so next change uses the correct baseline
                lastCommittedName.current = newName;
            }
        }, 800);
        return () => {
            if (nameDebounceTimer.current) clearTimeout(nameDebounceTimer.current);
        };
    }, [experience.buyerName]);

    const addInsight = () => {
        const newInsight: TourInsight = {
            id: Date.now().toString(),
            type: "vibe",
            category: "general",
            content: ""
        };
        setExperience({
            ...experience,
            tourInsights: [...experience.tourInsights, newInsight]
        });
    };

    const removeInsight = (id: string) => {
        setExperience({
            ...experience,
            tourInsights: experience.tourInsights.filter(i => i.id !== id)
        });
        toast.success("Insight removed");
    };

    const updateInsight = (id: string, content: string) => {
        setExperience({
            ...experience,
            tourInsights: experience.tourInsights.map(i => i.id === id ? { ...i, content } : i)
        });
    };

    const addGem = () => {
        setExperience({
            ...experience,
            localGems: [...experience.localGems, { name: "", category: "Food", note: "" }]
        });
    };

    // Issue #4: Remove gem
    const removeGem = (idx: number) => {
        setExperience({
            ...experience,
            localGems: experience.localGems.filter((_, i) => i !== idx)
        });
        toast.success("Local gem removed");
    };

    const handleShare = () => {
        // Also save to localStorage before sharing
        localStorage.setItem(STORAGE_KEY, JSON.stringify(experience));
        navigator.clipboard?.writeText(window.location.origin + "/tour-live");
        toast.success("Tour Experience Link Created!", {
            description: "The link has been copied to your clipboard."
        });
    };

    // Issue #2: Change listing handler
    const changeListing = (property: typeof mapleValleyProperty) => {
        setExperience({
            ...experience,
            listing: property
        });
        setShowListingModal(false);
        toast.success(`Switched to ${property.specs.address}`);
    };

    // Add a custom listing
    const addCustomListing = () => {
        const { address, city, state, bedrooms, bathrooms, squareFootage, listPrice, mlsNumber, headline } = newListingForm;
        if (!address || !city) {
            toast.error("Address and City are required");
            return;
        }
        const newProperty: PropertyListing = {
            specs: {
                address, city, state, bedrooms, bathrooms, squareFootage,
                listPrice, mlsNumber: mlsNumber || `CUSTOM-${Date.now()}`,
                                yearBuilt: new Date().getFullYear(), lotSize: "N/A", propertyType: "Single Family",
                zip: "00000", garage: "N/A"
            },
            features: {
                headline: headline || `${bedrooms}BR/${bathrooms}BA in ${city}`,
                subheadline: "", bulletPoints: []
            },
                        images: { hero: "/placeholder.svg", secondary: [] },
                        financing: {
                listPrice,
                downPaymentPercent: 20,
                interestRate: 6.5,
                loanTermYears: 30
            }
        };
        const slug = address.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const updated = [...customListings, { slug, property: newProperty }];
        setCustomListings(updated);
        try { localStorage.setItem(CUSTOM_LISTINGS_KEY, JSON.stringify(updated)); } catch (e) { console.error('Failed to set custom listings', e); }
        setNewListingForm({ address: "", city: "", state: "WA", bedrooms: 3, bathrooms: 2, squareFootage: 2000, listPrice: 500000, mlsNumber: "", headline: "" });
        setShowAddListingForm(false);
        toast.success(`Added listing: ${address}`);
    };

    // Remove a custom listing
    const removeCustomListing = (idx: number) => {
        const updated = customListings.filter((_, i) => i !== idx);
        setCustomListings(updated);
        try { localStorage.setItem(CUSTOM_LISTINGS_KEY, JSON.stringify(updated)); } catch (e) { console.error('Failed to set custom listings', e); }
        toast.success("Custom listing removed");
    };

    // Combine default + custom listings
    const allListings = [...availableListings, ...customListings];

        // RMLS Search handler
    const handleRmlsSearch = async () => {
        if (!rmlsQuery.trim()) {
            toast.error('Enter an MLS number or address to search');
            return;
        }
        setRmlsLoading(true);
        setRmlsError(null);
        setRmlsResults([]);
        try {
            const response = rmlsSearchMode === 'mls'
                    ? await searchByMLS(rmlsQuery.trim(), mlsSource)
                    : await searchByAddress(rmlsQuery.trim(), undefined, mlsSource);
                if (response.error) {
                    setRmlsError(response.error);
                }
                const results = (response.results || []).map(rmlsResultToPropertyListing);
                if (results.length === 0 && !response.error) {
                    setRmlsError('No listings found. Check your search and try again.');
                }
                setRmlsResults(results);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Search failed';
            setRmlsError(msg);
        } finally {
            setRmlsLoading(false);
        }
    };

    // Import an RMLS result as a custom listing
    const importRmlsListing = (property: PropertyListing) => {
        const slug = property.specs.address.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const updated = [...customListings, { slug, property }];
        setCustomListings(updated);
        try { localStorage.setItem(CUSTOM_LISTINGS_KEY, JSON.stringify(updated)); } catch (e) { console.error('Failed to set custom listings', e); }
        changeListing(property);
        setModalTab('listings');
        setRmlsQuery('');
        setRmlsResults([]);
        toast.success(`Imported: ${property.specs.address}`);
    };

    // Issue #1: Ghost Detail with better error handling
    const handleGhostDetail = async () => {
        setIsGhostLoading(true);
        try {
            toast.info("AI Ghost Detailer Engaged", {
                description: "Synthesizing property data into a premium perspective..."
            });
            
            const aiPerspective = await generateGhostDetail({
                propertyData: {
                    city: experience.listing.specs.city,
                    bedrooms: experience.listing.specs.bedrooms,
                    bathrooms: experience.listing.specs.bathrooms,
                    price: formatCurrency(experience.listing.specs.listPrice),
                    description: experience.listing.features.headline
                },
                buyerName: experience.buyerName || "there",
                agentName: "Scott"
            });

            setExperience({
                ...experience,
                agentTake: aiPerspective
            });
            
            toast.success("Perspective Optimized", {
                description: "The Ghost Detailer has refined your take."
            });
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Something went wrong";
            if (msg.includes("API key")) {
                toast.error("Gemini API Key Required", {
                    description: "Set VITE_GEMINI_API_KEY in your environment variables to enable AI features."
                });
            } else {
                toast.error("AI Generation Failed", {
                    description: msg
                });
            }
        } finally {
            setIsGhostLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#030304] text-slate-300 font-sans">
            <Helmet><title>Buyer Experience Studio | Mortgage Flyer Pro</title></Helmet>
            {/* Atmosphere */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] opacity-40" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[150px] opacity-30" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="space-y-4">
                        <button 
                            onClick={() => navigate("/dashboard")}
                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors mb-4"
                        >
                            <ArrowLeft className="w-3 h-3" />
                            Back to Dashboard
                        </button>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400">Buyer Experience Studio</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter">
                            Detailing & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Listing Insights</span>
                        </h1>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" className="border-white/10 hover:bg-white/5 gap-2" onClick={() => navigate("/tour-live")}>
                            <Eye className="w-4 h-4" />
                            Preview Live
                        </Button>
                        <Button className="bg-purple-500 hover:bg-purple-600 text-white font-bold gap-2" onClick={handleShare}>
                            <Share2 className="w-4 h-4" />
                            Share Experience
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Core Detailing */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Section: Listing Reference */}
                        <Card className="p-6 bg-white/[0.03] border-white/10 backdrop-blur-xl">
                            <div className="flex items-start gap-4">
                                <div className="w-24 h-24 rounded-xl overflow-hidden ring-1 ring-white/10">
                                    <img src={experience.listing.images.hero} alt="Listing" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Target Property</div>
                                    <h3 className="text-xl font-bold text-white">{experience.listing.specs.address}</h3>
                                    <p className="text-sm text-slate-400">{experience.listing.specs.city}, {experience.listing.specs.state}</p>
                                    <Badge variant="secondary" className="mt-2 bg-white/5 border-white/10 text-slate-400">
                                        MLS #{experience.listing.specs.mlsNumber}
                                    </Badge>
                                </div>
                                {/* Issue #2: Wire up Change Listing button */}
                                <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                                    onClick={() => { setModalTab('listings'); setShowListingModal(true); }}
                                >
                                    Change Listing
                                </Button>
                            </div>
                        </Card>

                        {/* Issue #2: Change Listing Modal */}
                        {showListingModal && (
                            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowListingModal(false)}>
                                <Card 
                                    className="w-full max-w-md bg-[#0a0a0b] border-white/10 p-6 space-y-4 rounded-2xl" 
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-white">Select Listing</h3>
                                        <Button size="icon" variant="ghost" onClick={() => setShowListingModal(false)} className="h-8 w-8 rounded-lg hover:bg-white/10">
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                                        {/* Tab Navigation */}
                    <div className="flex gap-2 border-b border-white/10 pb-3">
                        <button
                            onClick={() => setModalTab('listings')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                                modalTab === 'listings'
                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            Saved Listings
                        </button>
                        <button
                            onClick={() => setModalTab('rmls')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                                modalTab === 'rmls'
                                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <Search className="w-3 h-3" />
                            Import from RMLS
                        </button>
                    </div>
                                                        {modalTab === 'listings' && (<>
                                    <div className="space-y-3">
                                        {allListings.map((listing) => (
                                            <button
                                                key={listing.slug}
                                                onClick={() => changeListing(listing.property)}
                                                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                                                    experience.listing.specs.address === listing.property.specs.address
                                                        ? "border-purple-500/50 bg-purple-500/10"
                                                        : "border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                                                }`}
                                            >
                                                <div className="w-16 h-16 rounded-lg overflow-hidden ring-1 ring-white/10 flex-shrink-0">
                                                    <img src={listing.property.images.hero} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white">{listing.property.specs.address}</p>
                                                    <p className="text-xs text-slate-500">{listing.property.specs.city}, {listing.property.specs.state}</p>
                                                    <p className="text-xs text-slate-400 mt-1">
                                                        {listing.property.specs.bedrooms} bed / {listing.property.specs.bathrooms} bath / {listing.property.specs.squareFootage.toLocaleString()} sqft
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                                                    {/* Add Listing Button */}
                                {!showAddListingForm ? (
                                    <button
                                        onClick={() => setShowAddListingForm(true)}
                                        className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-white/10 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all text-slate-500 hover:text-purple-400"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Add New Listing</span>
                                    </button>
                                ) : (
                                    <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/5 space-y-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest">New Listing</h4>
                                            <Button variant="ghost" size="icon" onClick={() => setShowAddListingForm(false)} className="h-6 w-6 text-slate-500 hover:text-white">
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </div>
                                        <Input
                                            placeholder="Street Address *"
                                            value={newListingForm.address}
                                            onChange={(e) => setNewListingForm({...newListingForm, address: e.target.value})}
                                            className="bg-white/5 border-white/10 text-white text-sm h-9"
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                placeholder="City *"
                                                value={newListingForm.city}
                                                onChange={(e) => setNewListingForm({...newListingForm, city: e.target.value})}
                                                className="bg-white/5 border-white/10 text-white text-sm h-9"
                                            />
                                            <Input
                                                placeholder="State"
                                                value={newListingForm.state}
                                                onChange={(e) => setNewListingForm({...newListingForm, state: e.target.value})}
                                                className="bg-white/5 border-white/10 text-white text-sm h-9"
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <Input
                                                type="number"
                                                placeholder="Beds"
                                                value={newListingForm.bedrooms}
                                                onChange={(e) => setNewListingForm({...newListingForm, bedrooms: Number(e.target.value)})}
                                                className="bg-white/5 border-white/10 text-white text-sm h-9"
                                            />
                                            <Input
                                                type="number"
                                                placeholder="Baths"
                                                value={newListingForm.bathrooms}
                                                onChange={(e) => setNewListingForm({...newListingForm, bathrooms: Number(e.target.value)})}
                                                className="bg-white/5 border-white/10 text-white text-sm h-9"
                                            />
                                            <Input
                                                type="number"
                                                placeholder="Sq Ft"
                                                value={newListingForm.squareFootage}
                                                onChange={(e) => setNewListingForm({...newListingForm, squareFootage: Number(e.target.value)})}
                                                className="bg-white/5 border-white/10 text-white text-sm h-9"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                type="number"
                                                placeholder="List Price"
                                                value={newListingForm.listPrice}
                                                onChange={(e) => setNewListingForm({...newListingForm, listPrice: Number(e.target.value)})}
                                                className="bg-white/5 border-white/10 text-white text-sm h-9"
                                            />
                                            <Input
                                                placeholder="MLS # (optional)"
                                                value={newListingForm.mlsNumber}
                                                onChange={(e) => setNewListingForm({...newListingForm, mlsNumber: e.target.value})}
                                                className="bg-white/5 border-white/10 text-white text-sm h-9"
                                            />
                                        </div>
                                        <Button
                                            onClick={addCustomListing}
                                            className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase tracking-widest"
                                        >
                                            <Plus className="w-3 h-3 mr-2" />
                                            Add Listing
                                        </Button>
                                    </div>
                                )}
                                                                                </>)}

                    {/* RMLS Search Tab */}
                    {modalTab === 'rmls' && (
                        <div className="space-y-4">
                            {/* MLS Source Selector */}                                 <div className="flex gap-2 mb-3">                                     {MLS_SOURCES.map((source) => (                                         <button                                             key={source.value}                                             onClick={(e) => { e.stopPropagation(); setMlsSource(source.value); }}                                             className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${                                                 mlsSource === source.value                                                     ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'                                                     : 'text-slate-500 hover:text-white hover:bg-white/5'                                             }`}                                         >                                             {source.label}                                             <span className="block text-[9px] font-normal normal-case tracking-normal opacity-60">{source.region}</span>                                         </button>                                     ))}                                 </div>                                  {/* Search Mode Toggle */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setRmlsSearchMode('mls')}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                                        rmlsSearchMode === 'mls'
                                            ? 'bg-white/10 text-white border border-white/20'
                                            : 'text-slate-500 hover:text-white'
                                    }`}
                                >
                                    MLS Number
                                </button>
                                <button
                                    onClick={() => setRmlsSearchMode('address')}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                                        rmlsSearchMode === 'address'
                                            ? 'bg-white/10 text-white border border-white/20'
                                            : 'text-slate-500 hover:text-white'
                                    }`}
                                >
                                    Address
                                </button>
                            </div>
                            {/* Search Input */}
                            <div className="flex gap-2">
                                <Input
                                    placeholder={rmlsSearchMode === 'mls' ? 'Enter MLS #...' : 'Enter street address...'}
                                    value={rmlsQuery}
                                    onChange={(e) => setRmlsQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleRmlsSearch()}
                                    className="bg-white/5 border-white/10 text-white text-sm"
                                />
                                <Button
                                    onClick={handleRmlsSearch}
                                    disabled={rmlsLoading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                                >
                                    {rmlsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                                </Button>
                            </div>
                            {/* Error Message */}
                            {rmlsError && (
                                <div className="text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                                    {rmlsError}
                                </div>
                            )}
                            {/* Results */}
                            {rmlsResults.length > 0 && (
                                <div className="space-y-3">
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                                        {rmlsResults.length} result{rmlsResults.length !== 1 ? 's' : ''} found
                                    </p>
                                    {rmlsResults.map((property, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => importRmlsListing(property)}
                                            className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-blue-500/30 hover:bg-blue-500/5 transition-all text-left"
                                        >
                                            <div className="w-16 h-16 rounded-lg overflow-hidden ring-1 ring-white/10 flex-shrink-0">
                                                <img src={property.images.hero} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">{property.specs.address}</p>
                                                <p className="text-xs text-slate-500">{property.specs.city}, {property.specs.state}</p>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    {property.specs.bedrooms} bed / {property.specs.bathrooms} bath / {property.specs.squareFootage.toLocaleString()} sqft
                                                </p>
                                                <p className="text-xs text-emerald-400 mt-1">
                                                    {formatCurrency(property.specs.listPrice)}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                            {/* Demo Notice */}
                            {!rmlsLoading && rmlsResults.length === 0 && !rmlsError && (
                                <div className="text-center py-6 text-slate-600 text-sm border border-dashed border-white/10 rounded-xl">
                                    <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                    <p>Search listings by MLS number or address.</p>
                                    <p className="text-xs mt-1 text-slate-700">Requires RMLS_BEARER_TOKEN or BRIDGE_BEARER_TOKEN in Vercel env vars.</p>
                                </div>
                            )}
                        </div>
                    )}
                                </Card>
                            </div>
                        )}

                        {/* Section: The Agent's Take */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-purple-400" />
                                    <h2 className="text-lg font-bold text-white uppercase tracking-wider">The Agent's Take</h2>
                                </div>
                                {/* Issue #1: Better Ghost Detail button with loading state */}
                                <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="text-[10px] font-black uppercase tracking-widest text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 gap-2"
                                    onClick={handleGhostDetail}
                                    disabled={isGhostLoading}
                                >
                                    {isGhostLoading ? (
                                        <RefreshCw className="w-3 h-3 animate-spin" />
                                    ) : (
                                        <Sparkles className="w-3 h-3" />
                                    )}
                                    {isGhostLoading ? "Generating..." : "Ghost Detail"}
                                </Button>
                            </div>
                            <Card className="p-6 bg-white/[0.03] border-white/10 backdrop-blur-xl">
                                <Textarea 
                                    value={experience.agentTake}
                                    onChange={(e) => setExperience({ ...experience, agentTake: e.target.value })}
                                    placeholder="What's your professional perspective on this home for this specific buyer?"
                                    className="bg-transparent border-none p-0 focus-visible:ring-0 text-lg leading-relaxed text-slate-300 resize-none min-h-[120px]"
                                />
                            </Card>
                        </div>

                        {/* Section: Tour Insights */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Layout className="w-5 h-5 text-blue-400" />
                                    <h2 className="text-lg font-bold text-white uppercase tracking-wider">Specific Insights</h2>
                                </div>
                                {/* Issue #12: Better visibility for Add Insight button */}
                                <Button 
                                    size="sm" 
                                    onClick={addInsight} 
                                    className="bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30 text-purple-300 hover:text-white text-xs font-bold"
                                >
                                    <Plus className="w-3 h-3 mr-2" />
                                    Add Insight
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {experience.tourInsights.map((insight) => (
                                    <Card key={insight.id} className="p-4 bg-white/[0.02] border-white/5 flex items-start gap-4">
                                        <select 
                                            value={insight.category}
                                            onChange={(e) => setExperience({
                                                ...experience,
                                                tourInsights: experience.tourInsights.map(i => i.id === insight.id ? { ...i, category: e.target.value as TourInsight['category'] } : i)
                                            })}
                                            className="bg-white/5 border border-white/10 rounded-md text-[10px] uppercase font-bold px-2 py-1 text-slate-400 outline-none focus:border-purple-500 transition-colors"
                                        >
                                            <option value="arrival">Arrival</option>
                                            <option value="kitchen">Kitchen</option>
                                            <option value="primary">Primary</option>
                                            <option value="outdoors">Outdoors</option>
                                            <option value="general">General</option>
                                        </select>
                                        <select 
                                            value={insight.type}
                                            onChange={(e) => setExperience({
                                                ...experience,
                                                tourInsights: experience.tourInsights.map(i => i.id === insight.id ? { ...i, type: e.target.value as TourInsight['type'] } : i)
                                            })}
                                            className="bg-white/5 border border-white/10 rounded-md text-[10px] uppercase font-bold px-2 py-1 text-slate-400 outline-none focus:border-purple-500 transition-colors"
                                        >
                                            <option value="highlight">Highlight</option>
                                            <option value="vibe">Vibe</option>
                                            <option value="pro">Pro</option>
                                            <option value="con">Con</option>
                                        </select>
                                        <Input 
                                            value={insight.content}
                                            onChange={(e) => updateInsight(insight.id, e.target.value)}
                                            placeholder="Detail something specific about the layout, condition, or feeling..."
                                            className="bg-transparent border-none p-0 focus-visible:ring-0 text-slate-300 h-auto"
                                        />
                                        {/* Issue #3: Proper accessible delete button */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeInsight(insight.id)}
                                            className="h-8 w-8 flex-shrink-0 text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors rounded-lg"
                                            aria-label={`Delete insight: ${insight.content || 'empty'}`}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </Card>
                                ))}
                                {experience.tourInsights.length === 0 && (
                                    <div className="text-center py-8 text-slate-600 text-sm">
                                        No insights yet. Click "Add Insight" to start adding your observations.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Experience Nuances */}
                    <div className="space-y-8">
                        {/* Section: Experience Personalization */}
                        <div className="space-y-4">
                            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Personalization</h2>
                            <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/5 border-white/10 backdrop-blur-xl space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Buyer Name(s)</label>
                                    <Input 
                                        value={experience.buyerName} 
                                        onChange={(e) => setExperience({...experience, buyerName: e.target.value})}
                                        className="bg-white/5 border-white/10 text-white" 
                                    />
                                </div>
                                <div>
                                    {/* Issue #13: Better styled dropdown */}
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Financing Strategy</label>
                                    <div className="relative">
                                        <select 
                                            value={experience.strategyType}
                                            onChange={(e) => setExperience({...experience, strategyType: e.target.value as BuyerExperience['strategyType']})}
                                            className="w-full appearance-none bg-white/5 border border-white/10 rounded-md text-sm font-medium px-3 py-2.5 text-white outline-none focus:border-purple-500 transition-colors cursor-pointer"
                                        >
                                            <option value="wealth-builder">Wealth Builder (30yr Fixed)</option>
                                            <option value="cash-flow">Cash Flow Maximizer (ARM)</option>
                                            <option value="low-down">Low Down Payment (FHA/VA)</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Section: Local Gems */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Local Gems</h2>
                                <button onClick={addGem} className="text-[10px] font-bold text-purple-400 hover:text-purple-300 uppercase tracking-widest transition-colors flex items-center gap-1">
                                    <Plus className="w-3 h-3" />
                                    Add Gem
                                </button>
                            </div>
                            <div className="space-y-4">
                                {experience.localGems.map((gem: BuyerExperience['localGems'][0], idx: number) => (
                                    <Card key={idx} className="p-4 bg-white/[0.03] border-white/10 space-y-3 relative group">
                                        {/* Issue #4: Delete button for gems */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeGem(idx)}
                                            className="absolute top-2 right-2 h-7 w-7 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            aria-label={`Remove ${gem.name || 'gem'}`}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                        <div className="flex items-center gap-2">
                                            {gem.category === 'Coffee' ? <Coffee className="w-3.5 h-3.5 text-amber-500" /> : <MapPin className="w-3.5 h-3.5 text-blue-400" />}
                                            <Input 
                                                value={gem.name} 
                                                onChange={(e) => {
                                                    const newGems = [...experience.localGems];
                                                    newGems[idx].name = e.target.value;
                                                    setExperience({ ...experience, localGems: newGems });
                                                }}
                                                placeholder="Place Name" 
                                                className="bg-transparent border-none p-0 h-auto text-sm font-bold text-white focus-visible:ring-0" 
                                            />
                                        </div>
                                        <Textarea 
                                            value={gem.note}
                                            onChange={(e) => {
                                                const newGems = [...experience.localGems];
                                                newGems[idx].note = e.target.value;
                                                setExperience({ ...experience, localGems: newGems });
                                            }}
                                            placeholder="Why do they need to know about this?" 
                                            className="bg-white/5 border-white/10 text-xs text-slate-400 h-20 resize-none" 
                                        />
                                    </Card>
                                ))}
                                {experience.localGems.length === 0 && (
                                    <div className="text-center py-6 text-slate-600 text-sm border border-dashed border-white/10 rounded-xl">
                                        No gems yet. Click "Add Gem" to add nearby spots.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Auto-save indicator */}
                        <div className="flex items-center gap-2 text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Auto-saving changes
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
