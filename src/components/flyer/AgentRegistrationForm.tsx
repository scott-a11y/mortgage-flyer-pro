import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2 } from "lucide-react";

const agentSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    title: z.string().min(2, "Title is required"),
    phone: z.string().min(10, "Phone number is required"),
    email: z.string().email("Invalid email address"),
    brokerage: z.string().min(2, "Brokerage is required"),
    website: z.string().optional(),
    license_number: z.string().optional(),
    headshot_url: z.string().url("Please enter a valid image URL").optional().or(z.literal("")),
});

type AgentFormValues = z.infer<typeof agentSchema>;

export function AgentRegistrationForm({ onSuccess }: { onSuccess?: () => void }): JSX.Element {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm<AgentFormValues>({
        resolver: zodResolver(agentSchema),
        defaultValues: {
            name: "",
            title: "",
            phone: "",
            email: "",
            brokerage: "",
            website: "",
            license_number: "",
            headshot_url: "",
        },
    });

    const onSubmit = async (values: AgentFormValues) => {
        setIsSubmitting(true);
        try {
            const { error } = await supabase.from("agent_profiles").insert([{
                name: values.name,
                title: values.title,
                phone: values.phone,
                email: values.email,
                brokerage: values.brokerage,
                website: values.website || null,
                license_number: values.license_number || null,
                headshot_url: values.headshot_url || null,
            }]);
            if (error) throw error;

            setIsSuccess(true);
            toast.success("Successfully registered as a partner!");
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error registering agent:", error);
            toast.error("Failed to register. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
                <h3 className="text-xl font-bold">Registration Complete!</h3>
                <p className="text-muted-foreground">
                    Your profile has been added to our partner registry.
                </p>
                <Button onClick={() => setIsSuccess(false)} variant="outline">
                    Register Another
                </Button>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Adrian Mitchell" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Professional Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="REALTOR®" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="(555) 000-0000" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="name@brokerage.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="brokerage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Brokerage Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Portland Works Real Estate" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Website (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="www.yourwebsite.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="license_number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>License Number (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="#201247874" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="headshot_url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Headshot Image URL</FormLabel>
                            <FormControl>
                                <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormDescription>
                                Provide a link to your professional headshot.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Register as Partner
                </Button>
            </form>
        </Form>
    );
}
