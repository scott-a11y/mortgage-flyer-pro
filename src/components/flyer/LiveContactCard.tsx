import { useState } from "react";
import { FlyerData } from "@/types/flyer";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Globe, ChevronUp, ChevronDown, User, Building } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ContactCardProps {
    data: FlyerData;
}

export function LiveContactCard({ data }: ContactCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleCall = (phone: string) => {
        window.location.href = `tel:${phone.replace(/\D/g, '')}`;
    };

    const handleEmail = (email: string) => {
        window.location.href = `mailto:${email}`;
    };

    const handleWebsite = (url: string) => {
        const fullUrl = url.startsWith('http') ? url : `https://${url}`;
        window.open(fullUrl, '_blank');
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden">
            {/* Collapsed State - Tap Bar */}
            <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full bg-gradient-to-r from-slate-900 to-slate-800 border-t border-white/10 px-4 py-3 flex items-center justify-between"
                whileTap={{ scale: 0.98 }}
            >
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                        {data.broker.headshot ? (
                            <img src={data.broker.headshot} alt="" className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover" />
                        ) : (
                            <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-cyan-500/20 flex items-center justify-center">
                                <User className="w-4 h-4 text-cyan-400" />
                            </div>
                        )}
                        {data.realtor.headshot ? (
                            <img src={data.realtor.headshot} alt="" className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover" />
                        ) : (
                            <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-amber-500/20 flex items-center justify-center">
                                <Building className="w-4 h-4 text-amber-400" />
                            </div>
                        )}
                    </div>
                    <div className="text-left">
                        <p className="text-white text-sm font-medium leading-none">Contact Us</p>
                        <p className="text-slate-500 text-[10px] mt-0.5">{data.broker.name} & {data.realtor.name}</p>
                    </div>
                </div>
                {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                ) : (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                )}
            </motion.button>

            {/* Expanded Contact Sheet */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-slate-900 border-t border-white/5 overflow-hidden"
                    >
                        <div className="p-4 space-y-4">
                            {/* Broker Contact */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {data.broker.headshot ? (
                                        <img src={data.broker.headshot} alt="" className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                            <User className="w-5 h-5 text-cyan-400" />
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-white text-sm font-medium">{data.broker.name}</p>
                                        <p className="text-cyan-400 text-[10px] uppercase tracking-wider">{data.broker.title}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleCall(data.broker.phone)}
                                        className="h-9 w-9 rounded-full bg-green-500/10 text-green-400 hover:bg-green-500/20"
                                    >
                                        <Phone className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleEmail(data.broker.email)}
                                        className="h-9 w-9 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                                    >
                                        <Mail className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="border-t border-white/5" />

                            {/* Realtor Contact */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {data.realtor.headshot ? (
                                        <img src={data.realtor.headshot} alt="" className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                                            <Building className="w-5 h-5 text-amber-400" />
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-white text-sm font-medium">{data.realtor.name}</p>
                                        <p className="text-amber-400 text-[10px] uppercase tracking-wider">{data.realtor.brokerage}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleCall(data.realtor.phone)}
                                        className="h-9 w-9 rounded-full bg-green-500/10 text-green-400 hover:bg-green-500/20"
                                    >
                                        <Phone className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleEmail(data.realtor.email)}
                                        className="h-9 w-9 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                                    >
                                        <Mail className="w-4 h-4" />
                                    </Button>
                                    {data.realtor.website && (
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => handleWebsite(data.realtor.website)}
                                            className="h-9 w-9 rounded-full bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
                                        >
                                            <Globe className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
