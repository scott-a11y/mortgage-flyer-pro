import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2, CheckCircle2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

interface StrategyReportProps {
    data: {
        homeValue: number;
        mortgageBalance: number;
        netEquity: number;
        bridgeBuyingPower: number;
        stateName: string;
        officerName: string;
        agentName: string;
    };
}

export function StrategyReport({ data }: StrategyReportProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const reportRef = useRef<HTMLDivElement>(null);

    const generatePDF = async () => {
        if (!reportRef.current) return;

        setIsGenerating(true);
        try {
            const canvas = await html2canvas(reportRef.current, {
                scale: 2, // Higher quality
                useCORS: true,
                backgroundColor: '#0a0a0c'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width / 2, canvas.height / 2]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
            pdf.save(`Strategy_Report_${data.stateName.replace(/\s+/g, '_')}.pdf`);

            setIsComplete(true);
            toast.success("Report Generated", {
                description: "Your custom strategy report has been downloaded."
            });

            // Reset state after a delay
            setTimeout(() => setIsComplete(false), 3000);
        } catch (error) {
            console.error("PDF Generation Error:", error);
            toast.error("Generation Failed", {
                description: "We couldn't generate the PDF at this time."
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6">
            <Button
                onClick={generatePDF}
                disabled={isGenerating}
                className={`w-full h-14 text-sm font-bold uppercase tracking-widest rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 ${isComplete
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-black'
                        : 'bg-white text-black hover:bg-slate-200'
                    }`}
            >
                {isGenerating ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating Report...
                    </>
                ) : isComplete ? (
                    <>
                        <CheckCircle2 className="w-4 h-4" />
                        Download Complete
                    </>
                ) : (
                    <>
                        <FileDown className="w-4 h-4" />
                        Download Strategy Report (PDF)
                    </>
                )}
            </Button>

            {/* Hidden Report Template for PDF Generation */}
            <div className="absolute left-[-9999px] top-[-9999px]">
                <div
                    ref={reportRef}
                    className="w-[800px] bg-[#0a0a0c] text-white p-12 space-y-12 font-sans overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-white/10 pb-8">
                        <div>
                            <div className="text-amber-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Private & Confidential</div>
                            <h1 className="text-4xl font-serif">Strategy <span className="text-amber-500 italic">Report</span></h1>
                            <p className="text-slate-500 mt-2">Custom Relocation Analysis for {data.stateName}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-white font-medium">{data.officerName}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Strategic Lender</div>
                        </div>
                    </div>

                    {/* Core Numbers */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-4">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Bridge Buying Power</div>
                            <div className="text-5xl font-serif text-white tracking-tight">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(data.bridgeBuyingPower)}
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed font-light">
                                Estimated liquidity available to fund your next purchase deposit and down payment before selling.
                            </p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-4">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Estimated Net Proceeds</div>
                            <div className="text-5xl font-serif text-white tracking-tight">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(data.netEquity)}
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed font-light">
                                Estimated cash from sale after all commissions, closing costs, and mortgage payoff.
                            </p>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h3 className="text-lg font-serif border-b border-white/5 pb-2">Analysis Parameters</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Target Home Value</span>
                                    <span className="text-white font-medium">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.homeValue)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Current Mortgage</span>
                                    <span className="text-white font-medium">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.mortgageBalance)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Destination State</span>
                                    <span className="text-white font-medium text-amber-500">{data.stateName}</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-lg font-serif border-b border-white/5 pb-2">The Strategic Roadmap</h3>
                            <div className="space-y-4 text-xs">
                                <div className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-500 font-bold text-[8px]">1</div>
                                    <p className="text-slate-400">Activate bridge financing to tap current equity.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-500 font-bold text-[8px]">2</div>
                                    <p className="text-slate-400">Make non-contingent offer on destination home.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-500 font-bold text-[8px]">3</div>
                                    <p className="text-slate-400">Move first, then list old home for top dollar.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Card */}
                    <div className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 rounded-2xl p-8 flex justify-between items-center">
                        <div className="space-y-2">
                            <h4 className="text-white font-medium">Ready to initialize?</h4>
                            <p className="text-xs text-slate-500 max-w-xs">Contact us to verify these numbers and lock in your bridge strategy for {data.stateName}.</p>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-bold text-white uppercase tracking-widest">{data.officerName}</div>
                            <div className="text-[10px] text-slate-500 mt-1">{data.agentName} | Strategic Partner</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
