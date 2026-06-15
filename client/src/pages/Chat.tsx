import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  MessageCircle,
  Loader,
  Lightbulb,
  MapPin,
  Clock,
  AlertCircle,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export default function Chat() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: t("chat.welcome"),
      timestamp: new Date(),
      suggestions: [
        t("chat.suggestion1"),
        t("chat.suggestion2"),
        t("chat.suggestion3"),
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I understand you're asking about "${input}". Here's my recommendation: For your journey, I suggest taking the Metro from Andheri to Bandra during off-peak hours (10 AM - 4 PM) to avoid crowds. This route is the safest option with a 9/10 safety score and saves 2.8 kg of CO₂ compared to taking a cab. The journey takes approximately 45 minutes and costs ₹85.`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setLoading(false);
    }, 1000);
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border/40">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-accent" />
            <div>
              <h1 className="text-2xl font-bold">{t("chat.title")}</h1>
              <p className="text-sm text-muted-foreground">
                {t("chat.subtitle")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 container py-8 overflow-y-auto">
        <div className="space-y-6 max-w-2xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-md ${
                  message.role === "user"
                    ? "bg-accent text-accent-foreground rounded-2xl rounded-tr-none"
                    : "bg-muted rounded-2xl rounded-tl-none"
                } p-4`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <span className="text-xs opacity-70 mt-2 block">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="text-xs font-semibold opacity-70">
                      {t("chat.suggestions")}
                    </div>
                    {message.suggestions.map((suggestion, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs h-auto py-2"
                        onClick={() => handleSuggestion(suggestion)}
                      >
                        <Lightbulb className="w-3 h-3 mr-2" />
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-tl-none p-4">
                <Loader className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur border-t border-border/40">
        <div className="container py-4">
          <div className="max-w-2xl mx-auto">
            {/* Quick Tips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
              <Card className="p-3 flex items-start gap-2 text-xs">
                <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <span>{t("chat.tip1")}</span>
              </Card>
              <Card className="p-3 flex items-start gap-2 text-xs">
                <Clock className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <span>{t("chat.tip2")}</span>
              </Card>
              <Card className="p-3 flex items-start gap-2 text-xs">
                <AlertCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <span>{t("chat.tip3")}</span>
              </Card>
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                placeholder={t("chat.placeholder")}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
                disabled={loading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={loading || !input.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
