import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bot,
    X,
    Send,
    Sparkles,
    User,
    Loader2,
    Zap,
    MessageSquare,
    ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { processCommand, CommandResult } from "@/lib/services/aiCommandService";
import { AgentPartner } from "@/lib/services/agentService";
import { agentPartners as mockAgentPartners } from "@/data/agentPartners";
import * as agentService from "@/lib/services/agentService";

interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    action?: string;
}

const QUICK_ACTIONS = [
    "List all agents",
    "Update Celeste's phone",
    "Add new agent",
    "Show help",
];

export default function AICommandCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "welcome",
            role: "assistant",
            content:
                "Hey Scott 👋 I'm your AI assistant. Ask me to update agent info, manage listings, or make changes using natural language.\n\nTry: \"Update Celeste's phone to (425) 555-1234\"",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [agents, setAgents] = useState<AgentPartner[]>(mockAgentPartners);
    const [pulseCount, setPulseCount] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function loadAgents() {
            const { data } = await agentService.getAllAgents();
            if (data && data.length > 0) {
                setAgents(data);
            }
        }
        loadAgents();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
            setPulseCount(0);
        }
    }, [isOpen]);

    async function handleSubmit(text?: string) {
        const command = text || input.trim();
        if (!command || isProcessing) return;

        const userMsg: ChatMessage = {
            id: `user-${Date.now()}`,
            role: "user",
            content: command,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsProcessing(true);

        try {
            const result: CommandResult = await processCommand(command, agents);

            const assistantMsg: ChatMessage = {
                id: `assistant-${Date.now()}`,
                role: "assistant",
                content: result.message,
                timestamp: new Date(),
                action: result.action,
            };

            setMessages((prev) => [...prev, assistantMsg]);

            // Refresh agents if something was updated/created
            if (result.action === "update" || result.action === "create") {
                const { data } = await agentService.getAllAgents();
                if (data && data.length > 0) {
                    setAgents(data);
                }
            }
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: `error-${Date.now()}`,
                    role: "assistant",
                    content: "Something went wrong. Please try again or rephrase your request.",
                    timestamp: new Date(),
                },
            ]);
        }

        setIsProcessing(false);
    }

    return (
        <>
            {/* Floating AI Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-2xl shadow-amber-500/30 flex items-center justify-center group"
                    >
                        <Bot className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                        {pulseCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                {pulseCount}
                            </span>
                        )}
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-75" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-6 right-6 z-50 w-[420px] max-h-[600px] bg-[#0a0a0b] border border-white/10 rounded-3xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden backdrop-blur-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                                        <Zap className="w-4 h-4 text-black" />
                                    </div>
                                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0a0a0b]" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white tracking-tight">
                                        AI Command Center
                                    </h3>
                                    <p className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-wider">
                                        Online • Ready
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsOpen(false)}
                                    className="h-8 w-8 rounded-lg hover:bg-white/10 text-slate-400"
                                >
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsOpen(false)}
                                    className="h-8 w-8 rounded-lg hover:bg-white/10 text-slate-400"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-[300px] max-h-[400px] scrollbar-thin scrollbar-thumb-white/10">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-3 ${
                                        msg.role === "user" ? "flex-row-reverse" : ""
                                    }`}
                                >
                                    {/* Avatar */}
                                    <div
                                        className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center ${
                                            msg.role === "assistant"
                                                ? "bg-gradient-to-br from-amber-400/20 to-amber-600/20"
                                                : "bg-white/10"
                                        }`}
                                    >
                                        {msg.role === "assistant" ? (
                                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                        ) : (
                                            <User className="w-3.5 h-3.5 text-slate-400" />
                                        )}
                                    </div>

                                    {/* Bubble */}
                                    <div
                                        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                                            msg.role === "assistant"
                                                ? "bg-white/[0.04] text-slate-300 border border-white/5 rounded-tl-md"
                                                : "bg-amber-500/20 text-amber-100 border border-amber-500/10 rounded-tr-md"
                                        }`}
                                    >
                                        {msg.content}
                                        {msg.action === "update" && (
                                            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-white/5">
                                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                                <span className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-wider">
                                                    Changes Applied
                                                </span>
                                            </div>
                                        )}
                                        {msg.action === "create" && (
                                            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-white/5">
                                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                                                <span className="text-[10px] font-bold text-blue-400/80 uppercase tracking-wider">
                                                    Agent Created
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {isProcessing && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-3"
                                >
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center">
                                        <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                                    </div>
                                    <div className="bg-white/[0.04] border border-white/5 rounded-2xl rounded-tl-md px-4 py-3">
                                        <div className="flex gap-1.5">
                                            <span className="w-2 h-2 bg-amber-500/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                            <span className="w-2 h-2 bg-amber-500/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                            <span className="w-2 h-2 bg-amber-500/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Actions */}
                        <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-thin border-t border-white/5">
                            {QUICK_ACTIONS.map((action) => (
                                <button
                                    key={action}
                                    onClick={() => handleSubmit(action)}
                                    disabled={isProcessing}
                                    className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5 transition-all disabled:opacity-50"
                                >
                                    {action}
                                </button>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="px-4 py-3 border-t border-white/5 bg-white/[0.01]">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSubmit();
                                }}
                                className="flex items-center gap-2"
                            >
                                <div className="flex-1 relative">
                                    <input
                                        ref={inputRef}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Ask me anything or give a command..."
                                        disabled={isProcessing}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all disabled:opacity-50"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={!input.trim() || isProcessing}
                                    size="icon"
                                    className="h-10 w-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-black disabled:opacity-30"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
