import React from "react";
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Send, Bot, User, Sparkles, Lightbulb } from "lucide-react";
import { apiFetch } from "../../lib/api";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AIChatboxProps {
  open: boolean;
  onClose: () => void;
}

export function AIChatbox({ open, onClose }: AIChatboxProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your AI sustainability assistant. Tell me what waste materials you have, and I'll suggest creative ways to upcycle them into useful products! 🌱"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input
    };

    const historyForApi = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await apiFetch("/chat", {
        method: "POST",
        body: JSON.stringify({ message: userMessage.content, history: historyForApi }),
      });
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: res.reply
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      toast.error(err?.message || "The AI assistant is temporarily unavailable");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col rounded-3xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-xl">AI Upcycle Assistant</div>
              <p className="text-sm text-gray-500">Turn waste into wonderful products</p>
            </div>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Chat with our AI assistant to get creative suggestions for upcycling and transforming waste materials into useful products
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 min-h-0 px-6 py-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  message.role === "user" 
                    ? "bg-linear-to-br from-emerald-500 to-teal-600" 
                    : "bg-linear-to-br from-purple-500 to-pink-600"
                }`}>
                  {message.role === "user" ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className={`flex-1 max-w-[80%] ${message.role === "user" ? "flex justify-end" : ""}`}>
                  <div className={`rounded-2xl px-4 py-3 whitespace-pre-line ${
                    message.role === "user"
                      ? "bg-linear-to-br from-emerald-500 to-teal-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}>
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex gap-2 mb-3">
            <Button
              size="sm"
              variant="outline"
              className="rounded-full text-xs"
              onClick={() => setInput("I have plastic bottles")}
            >
              <Lightbulb className="h-3 w-3 mr-1" />
              Plastic bottles
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full text-xs"
              onClick={() => setInput("I have old cardboard boxes")}
            >
              <Lightbulb className="h-3 w-3 mr-1" />
              Cardboard
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full text-xs"
              onClick={() => setInput("I have glass jars")}
            >
              <Lightbulb className="h-3 w-3 mr-1" />
              Glass jars
            </Button>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Type your waste materials..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className="rounded-full border-gray-300"
            />
            <Button
              onClick={handleSend}
              className="rounded-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shrink-0"
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}