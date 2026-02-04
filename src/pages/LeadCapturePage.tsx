import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { mapleValleyProperty, celesteZarlingFlyerData } from "@/data/mapleValleyProperty";
import { Home, Bed, Bath, Square, Calendar, MapPin, Phone, Mail, CheckCircle2, Loader2, User, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface LeadFormData {
    name: string;
    email: string;
    phone: string;
    preApproved: string;
    message: string;
}

export default function LeadCapturePage() {
    const { slug } = useParams<{ slug: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [property, setProperty] = useState(mapleValleyProperty);
    const [flyerData, setFlyerData] = useState(celesteZarlingFlyerData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState<LeadFormData>({
        name: "",
        email: "",
        phone: "",
        preApproved: "",
        message: ""
    });

    useEffect(() => {
        // Track page view
        const views = parseInt(localStorage.getItem(`lead_views_${slug}`) || "0") + 1;
        localStorage.setItem(`lead_views_${slug}`, views.toString());
        console.log(`Property page views: ${views}`);

        // Load synced data
        const savedData = localStorage.getItem('property_preview_data');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.property) setProperty(parsed.property);
                if (parsed.flyerData) setFlyerData(parsed.flyerData);
            } catch (e) {
                console.error("Sync data parse error:", e);
            }
        }

        const timer = setTimeout(() => setIsLoading(false), 600);
        return () => clearTimeout(timer);
    }, [slug]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Store lead locally
        const leads = JSON.parse(localStorage.getItem('captured_leads') || '[]');
        const newLead = {
            ...formData,
            property: property.specs.address,
            timestamp: new Date().toISOString(),
            source: 'qr_scan'
        };
        leads.push(newLead);
        localStorage.setItem('captured_leads', JSON.stringify(leads));

        // Simulate email notification (in production, this would hit an API)
        console.log("New lead captured:", newLead);
        console.log("Sending notification to:", flyerData.broker.email);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsSubmitting(false);
        setIsSubmitted(true);
        toast.success("Thanks! We'll be in touch soon.");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const accentColor = flyerData.colorTheme?.secondary || "#F59E0B";

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                <div className="text-center space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto" style={{ color: accentColor }} />
                    <p className="text-sm font-medium text-slate-400">Loading property...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 font-sans">
            <Helmet>
                <title>{property.features.headline} | {property.specs.address}</title>
                <meta name="description" content={property.features.subheadline} />
            </Helmet>

            {/* Hero Section */}
            <div className="relative h-[50vh] min-h-[400px]">
                <img
                    src={property.images.hero}
                    alt={property.features.headline}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

                {/* Property Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <MapPin className="w-4 h-4" style={{ color: accentColor }} />
                                <span className="text-sm text-slate-300">{property.specs.city}, {property.specs.state}</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                                {property.features.headline}
                            </h1>
                            <p className="text-lg text-slate-300 mb-4">{property.specs.address}</p>
                            <div className="text-3xl md:text-4xl font-black" style={{ color: accentColor }}>
                                ${property.specs.listPrice.toLocaleString()}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-10">
                <div className="grid md:grid-cols-2 gap-10">
                    {/* Property Details */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Stats */}
                        <div className="grid grid-cols-4 gap-4">
                            {[
                                { icon: Bed, value: property.specs.bedrooms, label: "Beds" },
                                { icon: Bath, value: property.specs.bathrooms, label: "Baths" },
                                { icon: Square, value: property.specs.squareFootage.toLocaleString(), label: "Sq Ft" },
                                { icon: Calendar, value: property.specs.yearBuilt, label: "Built" }
                            ].map((stat, i) => (
                                <div key={i} className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                                    <stat.icon className="w-5 h-5 mx-auto mb-1 text-slate-400" />
                                    <div className="text-lg font-black text-white">{stat.value}</div>
                                    <div className="text-[10px] uppercase tracking-wider text-slate-500">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-lg font-bold text-white mb-3">About This Property</h2>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {flyerData.marketCopy?.marketInsight || property.features.subheadline}
                            </p>
                        </div>

                        {/* Features */}
                        <div>
                            <h2 className="text-lg font-bold text-white mb-3">Key Features</h2>
                            <ul className="grid grid-cols-2 gap-2">
                                {property.features.bulletPoints?.slice(0, 6).map((bullet, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: accentColor }} />
                                        {bullet}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Agent Contact */}
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                            <img
                                src={flyerData.realtor.headshot}
                                alt={flyerData.realtor.name}
                                className="w-14 h-14 rounded-full object-cover border-2"
                                style={{ borderColor: accentColor }}
                            />
                            <div className="flex-1">
                                <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Listing Agent</div>
                                <div className="text-white font-bold">{flyerData.realtor.name}</div>
                                <div className="text-xs text-slate-400">{flyerData.realtor.brokerage}</div>
                            </div>
                            <a href={`tel:${flyerData.realtor.phone}`}>
                                <Button size="sm" style={{ backgroundColor: accentColor }} className="text-slate-950 font-bold">
                                    <Phone className="w-4 h-4" />
                                </Button>
                            </a>
                        </div>
                    </motion.div>

                    {/* Lead Capture Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="sticky top-6 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                            <AnimatePresence mode="wait">
                                {isSubmitted ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-10"
                                    >
                                        <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                                            <CheckCircle2 className="w-8 h-8 text-slate-950" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Request Sent!</h3>
                                        <p className="text-slate-400 text-sm">
                                            {flyerData.realtor.name} will be in touch with you shortly.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        key="form"
                                        onSubmit={handleSubmit}
                                        className="space-y-4"
                                    >
                                        <div className="text-center mb-6">
                                            <h3 className="text-xl font-bold text-white mb-1">Interested?</h3>
                                            <p className="text-sm text-slate-400">Get more info or schedule a tour</p>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                <Input
                                                    name="name"
                                                    placeholder="Your Name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                                                />
                                            </div>

                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                <Input
                                                    name="email"
                                                    type="email"
                                                    placeholder="Email Address"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                                                />
                                            </div>

                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                <Input
                                                    name="phone"
                                                    type="tel"
                                                    placeholder="Phone Number"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                                                />
                                            </div>

                                            <select
                                                name="preApproved"
                                                value={formData.preApproved}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm"
                                            >
                                                <option value="" className="bg-slate-900">Pre-approval status...</option>
                                                <option value="yes" className="bg-slate-900">Yes, I'm pre-approved</option>
                                                <option value="no" className="bg-slate-900">Not yet pre-approved</option>
                                                <option value="cash" className="bg-slate-900">Cash buyer</option>
                                            </select>

                                            <textarea
                                                name="message"
                                                placeholder="Questions or comments? (optional)"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-500 resize-none"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full h-12 text-base font-bold text-slate-950"
                                            style={{ backgroundColor: accentColor }}
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4 mr-2" />
                                                    Request Information
                                                </>
                                            )}
                                        </Button>

                                        <p className="text-[10px] text-slate-500 text-center">
                                            By submitting, you agree to be contacted about this property.
                                        </p>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Loan Officer Card */}
                        <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="flex items-center gap-3">
                                <img
                                    src={flyerData.broker.headshot}
                                    alt={flyerData.broker.name}
                                    className="w-12 h-12 rounded-full object-cover border-2"
                                    style={{ borderColor: accentColor }}
                                />
                                <div className="flex-1">
                                    <div className="text-[10px] uppercase tracking-wider text-slate-500">Financing by</div>
                                    <div className="text-white font-bold text-sm">{flyerData.broker.name}</div>
                                    <div className="text-xs text-slate-400">{flyerData.company.name}</div>
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-white/10 text-center">
                                <div className="text-[10px] text-slate-500 mb-1">Current 30-Year Rate</div>
                                <div className="text-2xl font-black" style={{ color: accentColor }}>
                                    {flyerData.rates.thirtyYearFixed}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-white/10 py-6 px-6 mt-10">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-xs text-slate-500">
                        {flyerData.company.name} · NMLS #{flyerData.company.nmls} · Equal Housing Opportunity
                    </p>
                </div>
            </footer>
        </div>
    );
}
