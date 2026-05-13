import React from "react";
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Send, Bot, User, Sparkles, Lightbulb } from "lucide-react";

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

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("plastic bottle") || lowerMessage.includes("bottles")) {
      return "Great! Plastic bottles can be transformed into amazing products:\n\n🌿 **Vertical Garden Planters** - Cut bottles in half and stack them to create a wall garden\n💡 **Lamp Shades** - Cut decorative patterns and add LED lights\n🎨 **Organizers** - Cut and paint to make desk organizers or jewelry holders\n🚿 **Drip Irrigation System** - Poke holes for a DIY watering system\n\nWould you like detailed instructions for any of these?";
    }
    
    if (lowerMessage.includes("cardboard") || lowerMessage.includes("box")) {
      return "Cardboard is incredibly versatile! Here are some ideas:\n\n📦 **Storage Boxes** - Decorate and organize your space\n🎭 **Kids' Playhouse** - Build a castle or fort\n🖼️ **Picture Frames** - Cut and paint for unique wall art\n📚 **Book Organizers** - Create custom shelving\n🐱 **Pet Furniture** - Cats love cardboard scratchers!\n\nWhich project interests you?";
    }
    
    if (lowerMessage.includes("glass jar") || lowerMessage.includes("jars")) {
      return "Glass jars are perfect for upcycling! Try these:\n\n🕯️ **Candle Holders** - Add candles or fairy lights\n🌱 **Terrariums** - Create mini gardens\n🍴 **Kitchen Storage** - Store dry goods, spices\n💝 **Gift Containers** - Fill with homemade treats\n✨ **Bathroom Organizers** - Cotton balls, Q-tips storage\n\nShall I provide step-by-step instructions?";
    }
    
    if (lowerMessage.includes("old clothes") || lowerMessage.includes("fabric") || lowerMessage.includes("textile")) {
      return "Old textiles can have new life! Consider:\n\n🛍️ **Tote Bags** - Sew reusable shopping bags\n🧺 **Rag Rugs** - Braid or weave into colorful rugs\n🪆 **Pillow Covers** - Create decorative cushions\n🧸 **Stuffed Toys** - Make keepsakes for kids\n🧹 **Cleaning Rags** - Cut into reusable cloths\n\nWhat's your skill level with sewing?";
    }
    
    if (lowerMessage.includes("wood") || lowerMessage.includes("pallet") || lowerMessage.includes("lumber")) {
      return "Wood waste can create beautiful items:\n\n🪑 **Furniture** - Tables, benches, shelves\n🖼️ **Wall Art** - Rustic signs or geometric designs\n🌿 **Planters** - Garden boxes or vertical gardens\n🔨 **Tool Storage** - Pegboards or racks\n🏠 **Birdhouses** - Homes for garden birds\n\nDo you have basic woodworking tools?";
    }
    
    if (lowerMessage.includes("tin can") || lowerMessage.includes("aluminum")) {
      return "Tin cans are great for creative projects:\n\n✏️ **Desk Organizers** - Paint and decorate for pens/pencils\n🕯️ **Lanterns** - Punch holes for decorative patterns\n🌺 **Planters** - Small herb gardens\n🎨 **Paint Can Storage** - Organize art supplies\n🔔 **Wind Chimes** - String together for garden decor\n\nInterested in any specific project?";
    }
    
    if (lowerMessage.includes("newspaper") || lowerMessage.includes("magazine")) {
      return "Paper waste has many creative uses:\n\n🎁 **Gift Wrapping** - Unique, eco-friendly wrap\n🧺 **Paper Baskets** - Weave into sturdy containers\n🎨 **Papier-Mâché** - Create sculptures or bowls\n📰 **Seed Pots** - Biodegradable plant starters\n🖼️ **Wall Art** - Collages or rolled paper designs\n\nWant to learn a specific technique?";
    }
    
    if (lowerMessage.includes("tire") || lowerMessage.includes("rubber")) {
      return "Old tires can be transformed into:\n\n🪴 **Garden Planters** - Stack and paint for raised beds\n🏋️ **Outdoor Furniture** - Ottomans or tables\n🛝 **Playground Equipment** - Swings for kids\n👢 **Doormats** - Cut and arrange pieces\n🎨 **Art Sculptures** - Creative garden decorations\n\nThese projects work great for outdoor spaces!";
    }
    
    if (lowerMessage.includes("electronic") || lowerMessage.includes("computer") || lowerMessage.includes("phone")) {
      return "⚠️ Electronics should be handled carefully:\n\n🔌 **Donate/Refurbish** - Many parts can be reused\n🎨 **Art Projects** - Circuit boards make unique art\n💡 **Learning Tools** - Disassemble for STEM education\n♻️ **E-waste Recycling** - Find certified recyclers\n\n⚡ Remember: Always remove batteries and handle safely! Contact local e-waste facilities for proper disposal.";
    }
    
    return "That sounds interesting! To give you the best upcycling ideas, could you tell me more about:\n\n📦 The quantity of material you have\n🎨 Your crafting skill level\n⏰ Time you can dedicate\n🎯 What type of product you need (decor, storage, furniture, etc.)\n\nThe more details you share, the better suggestions I can provide!";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col rounded-3xl p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
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

        <ScrollArea className="flex-1 px-6 py-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  message.role === "user" 
                    ? "bg-gradient-to-br from-emerald-500 to-teal-600" 
                    : "bg-gradient-to-br from-purple-500 to-pink-600"
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
                      ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}>
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
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
              className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shrink-0"
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