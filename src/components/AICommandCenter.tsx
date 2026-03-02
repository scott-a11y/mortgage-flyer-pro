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

    const processUserCommand = async (command: string) => {
        setIsProcessing(true);
        
        const userMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            role: "user",
            content: command,
            timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, userMessage]);
        
        try {
            const result = await processCommand(command, agents);
            
            const assistantMessage: ChatMessage = {
                id: `assistant-${Date.now()}`,
                role: "assistant",
                content: result.message,
                timestamp: new Date(),
                action: result.action,
            };
            
            setMessages(prev => [...prev, assistantMessage]);
            setPulseCount(prev => prev + 1);
            
            // Reload agents if they were modified
            if (result.action && ['update', 'add', 'delete'].includes(result.action)) {
                const { data } = await agentService.getAllAgents();
                if (data && data.length > 0) {
                    setAgents(data);
                }
            }
        } catch (error) {
            const errorMessage: ChatMessage = {
                id: `error-${Date.now()}`,
                role: "assistant",
                content: "Sorry, I encountered an error processing that command. Please try again.",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        }
        
        setIsProcessing(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isProcessing) {
            processUserCommand(input.trim());
            setInput("");
        }
    };

    const handleQuickAction = (action: string) => {
        processUserCommand(action);
    };

    return (
        <>
            {/* Floating Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="fixed bottom-6 right-6 z-50"
                    >
                        <Button
                            onClick={() => setIsOpen(true)}
                            className="h-14 w-14 rounded-full bg-primary shadow-lg hover:shadow-xl transform hover:scale-105 transition-all relative group"
                        >
                            <Bot className="h-6 w-6" />
                            {pulseCount > 0 && (
                                <motion.div
                                    key={pulseCount}
                                    initial={{ scale: 0.8, opacity: 0.8 }}
                                    animate={{ scale: 2, opacity: 0 }}
                                    transition={{ duration: 1 }}
                                    className="absolute inset-0 rounded-full bg-primary"
                                />
                            )}
                            <div className="absolute -top-12 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                    AI Command Center
                                </div>
                            </div>
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Interface */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25 }}
                        className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-lg shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Bot className="h-6 w-6" />
                                    <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-yellow-300" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">AI Command Center</h3>
                                    <p className="text-xs opacity-90">Natural language control</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsOpen(false)}
                                className="text-primary-foreground hover:text-primary-foreground/80"
                            >
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Messages */}
                        <div className="h-96 overflow-y-auto p-4 space-y-3">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-2 ${
                                        message.role === "user" ? "flex-row-reverse" : ""
                                    }`}
                                >
                                    <div
                                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                            message.role === "user"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-gray-100"
                                        }`}
                                    >
                                        {message.role === "user" ? (
                                            <User className="h-4 w-4" />
                                        ) : (
                                            <Bot className="h-4 w-4" />
                                        )}
                                    </div>
                                    <div
                                        className={`max-w-[80%] px-3 py-2 rounded-lg ${
                                            message.role === "user"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-gray-100"
                                        }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                        {message.action && (
                                            <div className="mt-2 flex items-center gap-1">
                                                <Zap className="h-3 w-3" />
                                                <span className="text-xs opacity-80">
                                                    Action: {message.action}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Actions */}
                        <div className="px-4 py-2 border-t border-gray-100">
                            <div className="flex gap-2 flex-wrap">
                                {QUICK_ACTIONS.map((action) => (
                                    <button
                                        key={action}
                                        onClick={() => handleQuickAction(action)}
                                        className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                                        disabled={isProcessing}
                                    >
                                        {action}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100">
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a command..."
                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    disabled={isProcessing}
                                />
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={!input.trim() || isProcessing}
                                >
                                    {isProcessing ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}