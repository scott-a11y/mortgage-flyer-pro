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
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSendMessage = async () => {
        if (!input.trim() || isProcessing) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsProcessing(true);

        try {
            const result = await processCommand(input, agents);
            
            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: result.response,
                timestamp: new Date(),
                action: result.action,
            };

            setMessages((prev) => [...prev, assistantMessage]);

            if (result.action === "update_agent" || result.action === "add_agent") {
                const { data } = await agentService.getAllAgents();
                if (data && data.length > 0) {
                    setAgents(data);
                }
            }

            setPulseCount((prev) => prev + 1);
        } catch (error) {
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "Sorry, I encountered an error processing that command. Please try again.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="fixed bottom-20 right-4 w-[400px] h-[600px] bg-background border border-border rounded-lg shadow-2xl z-50 flex flex-col"
                    >
                        <div className="flex items-center justify-between p-4 border-b">
                            <div className="flex items-center gap-2">
                                <Bot className="w-5 h-5 text-primary" />
                                <h3 className="font-semibold">AI Command Center</h3>
                                <Sparkles className="w-4 h-4 text-yellow-500" />
                            </div>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-3 ${
                                        message.role === "user" ? "justify-end" : ""
                                    }`}
                                >
                                    {message.role === "assistant" && (
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <Bot className="w-4 h-4 text-primary" />
                                        </div>
                                    )}
                                    <div
                                        className={`rounded-lg p-3 max-w-[80%] ${
                                            message.role === "user"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted"
                                        }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">
                                            {message.content}
                                        </p>
                                        {message.action && (
                                            <div className="flex items-center gap-1 mt-2 text-xs opacity-70">
                                                <Zap className="w-3 h-3" />
                                                Action: {message.action}
                                            </div>
                                        )}
                                    </div>
                                    {message.role === "user" && (
                                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                            <User className="w-4 h-4 text-primary-foreground" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            {isProcessing && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-3"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="bg-muted rounded-lg p-3">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-2 border-t">
                            <div className="flex gap-1 mb-2">
                                {QUICK_ACTIONS.map((action) => (
                                    <Button
                                        key={action}
                                        variant="outline"
                                        size="sm"
                                        className="text-xs"
                                        onClick={() => setInput(action)}
                                    >
                                        {action}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 border-t">
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            handleSendMessage();
                                        }
                                    }}
                                    placeholder="Type a command..."
                                    className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    disabled={isProcessing}
                                />
                                <Button
                                    size="icon"
                                    onClick={handleSendMessage}
                                    disabled={!input.trim() || isProcessing}
                                >
                                    {isProcessing ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-4 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center z-50"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                        >
                            <ChevronDown className="w-6 h-6" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                        >
                            <MessageSquare className="w-6 h-6" />
                        </motion.div>
                    )}
                </AnimatePresence>
                {pulseCount > 0 && !isOpen && (
                    <motion.div
                        key={pulseCount}
                        initial={{ scale: 0.8, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 bg-primary rounded-full"
                    />
                )}
            </motion.button>
        </>
    );
}