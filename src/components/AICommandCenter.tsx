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
        setPulseCount((prev) => prev + 1);

        try {
            const result = await processCommand(input, agents);

            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: result.message,
                timestamp: new Date(),
                action: result.action,
            };

            setMessages((prev) => [...prev, assistantMessage]);

            if (result.agents) {
                setAgents(result.agents);
            }
        } catch (error) {
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content:
                    "Oops! Something went wrong. Try rephrasing your request.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleQuickAction = (action: string) => {
        setInput(action);
        setTimeout(handleSendMessage, 100);
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
                            size="lg"
                            onClick={() => setIsOpen(true)}
                            className="relative rounded-full w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-2xl"
                        >
                            <Bot className="w-6 h-6" />
                            {pulseCount > 0 && (
                                <motion.div
                                    key={pulseCount}
                                    initial={{ scale: 1, opacity: 0.8 }}
                                    animate={{ scale: 4, opacity: 0 }}
                                    transition={{ duration: 1.5 }}
                                    className="absolute inset-0 rounded-full bg-purple-600"
                                />
                            )}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Bot className="w-6 h-6" />
                                <div>
                                    <h3 className="font-semibold">
                                        AI Command Center
                                    </h3>
                                    <p className="text-xs opacity-90">
                                        Natural language control
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(false)}
                                className="text-white hover:bg-white/20"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-3 ${
                                        message.role === "user"
                                            ? "justify-end"
                                            : ""
                                    }`}
                                >
                                    {message.role === "assistant" && (
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                            <Bot className="w-5 h-5 text-purple-600" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[80%] rounded-lg p-3 ${
                                            message.role === "user"
                                                ? "bg-purple-600 text-white"
                                                : "bg-gray-100 text-gray-900"
                                        }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">
                                            {message.content}
                                        </p>
                                        {message.action && (
                                            <div className="mt-2 flex items-center gap-1 text-xs opacity-70">
                                                <Zap className="w-3 h-3" />
                                                {message.action}
                                            </div>
                                        )}
                                    </div>
                                    {message.role === "user" && (
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                            <User className="w-5 h-5 text-gray-700" />
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
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                        <Bot className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div className="bg-gray-100 rounded-lg p-3">
                                        <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Actions */}
                        <div className="p-3 border-t border-gray-200">
                            <div className="flex gap-2 flex-wrap">
                                {QUICK_ACTIONS.map((action) => (
                                    <button
                                        key={action}
                                        onClick={() => handleQuickAction(action)}
                                        className="text-xs px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                    >
                                        {action}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-gray-200">
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
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                    disabled={isProcessing}
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!input.trim() || isProcessing}
                                    className="bg-purple-600 hover:bg-purple-700"
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
        </>
    );
}