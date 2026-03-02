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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
            const result: CommandResult = await processCommand(input);
            
            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: result.message,
                timestamp: new Date(),
                action: result.action,
            };

            setMessages((prev) => [...prev, assistantMessage]);
            setPulseCount((prev) => prev + 1);

            // Refresh agents if the command affected them
            if (result.action && ["UPDATE", "CREATE", "DELETE"].includes(result.action)) {
                const { data } = await agentService.getAllAgents();
                if (data && data.length > 0) {
                    setAgents(data);
                }
            }
        } catch (error) {
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "Sorry, I encountered an error processing your request. Please try again.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <motion.button
                className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90 }}
                            animate={{ rotate: 0 }}
                            exit={{ rotate: 90 }}
                        >
                            <X className="w-6 h-6" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="bot"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="relative"
                        >
                            <Bot className="w-6 h-6" />
                            {pulseCount > 0 && (
                                <motion.div
                                    className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.3 }}
                                />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">AI Assistant</h3>
                                    <p className="text-xs opacity-90">Natural language commands</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100%-180px)]">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-2 ${
                                        message.role === "user" ? "justify-end" : "justify-start"
                                    }`}
                                >
                                    {message.role === "assistant" && (
                                        <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                            <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[80%] p-3 rounded-lg ${
                                            message.role === "user"
                                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                                : "bg-gray-100 dark:bg-gray-800"
                                        }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                        {message.action && (
                                            <div className="mt-2 flex items-center gap-1 text-xs opacity-75">
                                                <Zap className="w-3 h-3" />
                                                Action: {message.action}
                                            </div>
                                        )}
                                    </div>
                                    {message.role === "user" && (
                                        <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                            <User className="w-4 h-4" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            {isProcessing && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-2 items-center text-gray-500 dark:text-gray-400"
                                >
                                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="text-sm">Thinking...</span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Actions */}
                        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-800">
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {QUICK_ACTIONS.map((action) => (
                                    <button
                                        key={action}
                                        onClick={() => setInput(action)}
                                        className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        {action}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input Form */}
                        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-800">
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask me anything..."
                                    className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={isProcessing}
                                />
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={!input.trim() || isProcessing}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}