"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  products?: Product[];
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      content: "Hi! I'm your Neonverse assistant. How can I help you today? You can ask me about laptops, phones, or any other gadgets!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate bot thinking
    setTimeout(async () => {
      const response = await processMessage(input);
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 800);
  };

  const processMessage = async (text: string): Promise<Message> => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      if (res.ok) {
        return {
          id: Date.now().toString(),
          role: "bot",
          content: data.reply || "How else can I help you?",
          products: data.products && data.products.length > 0 ? data.products : undefined,
        };
      }
    } catch (error) {
      console.error("Chat error:", error);
    }

    return {
      id: Date.now().toString(),
      role: "bot",
      content: "I'm having trouble connecting right now. Please try again later!",
    };
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-void-950/90 shadow-2xl backdrop-blur-2xl sm:w-[400px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-neon-orange/20 to-neon-rose/20 p-4">
              <div className="flex items-center gap-3">
                <div className="relative h-8 w-8 rounded-full bg-gradient-to-br from-neon-orange to-neon-rose p-1 shadow-neon-orange">
                  <BotIcon className="h-full w-full text-white" />
                  <span className="absolute -right-0.5 -top-0.5 block h-2.5 w-2.5 rounded-full border-2 border-void-950 bg-green-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Neon Assistant</h3>
                  <p className="text-[10px] text-white/50">Online • Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-white/50 hover:bg-white/5 hover:text-white"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-neon-orange text-white shadow-neon-orange/20"
                        : "bg-white/[0.05] border border-white/10 text-white/90"
                    }`}
                  >
                    <p>{msg.content}</p>
                    
                    {msg.products && (
                      <div className="mt-3 space-y-3">
                        {msg.products.map((product) => (
                          <div
                            key={product.id}
                            className="group flex gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-2 transition-colors hover:border-neon-orange/30"
                          >
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-14 w-14 rounded-lg object-cover"
                            />
                            <div className="flex flex-1 flex-col justify-center min-w-0">
                              <Link
                                href={`/product/${product.slug}`}
                                onClick={() => setIsOpen(false)}
                                className="text-xs font-semibold text-white hover:text-neon-orange"
                              >
                                {product.name}
                              </Link>
                              <p className="text-[10px] text-neon-amber font-bold">
                                {formatPrice(product.price)}
                              </p>
                              <button
                                onClick={() => addItem({
                                  id: product.id,
                                  slug: product.slug,
                                  name: product.name,
                                  price: product.price,
                                  imageUrl: product.imageUrl,
                                  stock: product.stock,
                                  category: product.category,
                                })}
                                className="mt-1 w-full rounded-md bg-white/10 py-1 text-[10px] font-bold text-white transition-colors hover:bg-neon-orange hover:text-white"
                              >
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white/[0.05] border border-white/10 px-4 py-2">
                    <div className="flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/30" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/30 [animation-delay:0.2s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/30 [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="border-t border-white/10 p-4"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about products..."
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white placeholder:text-white/20 outline-none transition-all focus:border-neon-orange/50 focus:ring-1 focus:ring-neon-orange/20"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-neon-orange to-neon-rose text-white shadow-neon-orange transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  <SendIcon className="h-5 w-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 ${
          isOpen
            ? "bg-void-900 border border-white/10 text-white"
            : "bg-gradient-to-br from-neon-orange to-neon-rose text-white shadow-neon-orange"
        }`}
      >
        {isOpen ? <CloseIcon className="h-6 w-6" /> : <BotIcon className="h-7 w-7" />}
      </motion.button>
    </div>
  );
}

function BotIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}
