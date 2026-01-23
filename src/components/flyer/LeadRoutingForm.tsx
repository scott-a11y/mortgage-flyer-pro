import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const leadSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Valid phone number is required"),
});

interface LeadRoutingFormProps {
    stateName: string;
    isReferral: boolean;
    flyerSlug?: string;
}

export function LeadRoutingForm({ stateName, isReferral, flyerSlug }: LeadRoutingFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(leadSchema)
    });

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('leads')
                .insert([{
                    first_name: data.firstName,
                    last_name: data.lastName,
                    email: data.email,
                    phone: data.phone,
                    moving_to_state: stateName,
                    referral_type: isReferral ? 'referral' : 'local',
                    lead_source_flyer_slug: flyerSlug,
                }]);

            if (error) throw error;

            setIsDone(true);
            toast.success("Strategy Request Sent", {
                description: isReferral
                    ? `We've received your request for ${stateName}. A referral partner will contact you shortly.`
                    : `We've received your request for ${stateName}. Our local team will reach out shortly.`
            });
        } catch (error) {
            console.error("Lead submission error:", error);
            toast.error("Submission Failed", {
                description: "Please try again or contact us directly."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isDone) {
        return (
            <div className="text-center p-12 space-y-4 animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-500">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif text-white">Strategy Initialized</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">
                    We have received your details for {stateName}. Check your email for a confirmation and your next steps.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className={`uppercase tracking-widest text-[10px] font-bold ${isReferral ? 'border-blue-500/30 text-blue-400 bg-blue-500/5' : 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5'}`}>
                    {isReferral ? 'Referral Request' : 'Local Direct Request'}
                </Badge>
                <div className="h-px flex-1 bg-white/10" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 ml-1">First Name</label>
                        <Input
                            {...register('firstName')}
                            className="bg-black/40 border-white/10 h-12 focus:border-amber-500/50"
                            placeholder="John"
                        />
                        {errors.firstName && <p className="text-[10px] text-red-500 ml-1">{errors.firstName.message as string}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 ml-1">Last Name</label>
                        <Input
                            {...register('lastName')}
                            className="bg-black/40 border-white/10 h-12 focus:border-amber-500/50"
                            placeholder="Doe"
                        />
                        {errors.lastName && <p className="text-[10px] text-red-500 ml-1">{errors.lastName.message as string}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 ml-1">Email Address</label>
                    <Input
                        {...register('email')}
                        type="email"
                        className="bg-black/40 border-white/10 h-12 focus:border-amber-500/50"
                        placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-[10px] text-red-500 ml-1">{errors.email.message as string}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 ml-1">Phone Number</label>
                    <Input
                        {...register('phone')}
                        type="tel"
                        className="bg-black/40 border-white/10 h-12 focus:border-amber-500/50"
                        placeholder="(555) 000-0000"
                    />
                    {errors.phone && <p className="text-[10px] text-red-500 ml-1">{errors.phone.message as string}</p>}
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-amber-500 text-black font-bold uppercase tracking-widest rounded-xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/10 mt-6"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Processing...
                        </>
                    ) : (
                        <>
                            Initialize {stateName} Strategy
                            <Send className="w-4 h-4 ml-2" />
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
}
