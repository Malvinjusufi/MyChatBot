import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const getMockBotResponse = (userInput: string): string => {
    const responses = [
      "I'm just a mock bot, but I'm here to help!",
      "Interesting... Tell me more.",
      "Can you explain that a bit further?",
      "I'm not sure I understand. Could you rephrase?",
      "That's cool! Anything else you'd like to ask?",
    ];
  
    const lower = userInput.toLowerCase();
  
    if (lower.includes("hello") || lower.includes("hi")) {
      return "Hello there! 👋";
    } else if (lower.includes("help")) {
      return "Sure! I'm here to assist you. What do you need help with?";
    } else if (lower.includes("weather")) {
      return "I can't check the weather yet, but I'd recommend bringing an umbrella just in case! ☔";
    }
  
    // Default random reply
    return responses[Math.floor(Math.random() * responses.length)];
  };
  
const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi there! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    setTimeout(() => {
      const botReply = getMockBotResponse(input);  
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: botReply },
      ]);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={toggleChat}
        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg focus:outline-none"
      >
        💬
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="w-[360px] h-[640px] bg-blue-500 rounded-2xl shadow-xl flex flex-col overflow-hidden border -b border-gray-300 text-white">
              <div className="flex justify-between items-center p-4 bg-blue-600">
                <span className="text-lg font-semibold">Chatbot</span>
                <button
                  onClick={toggleChat}
                  className="text-gray-500 text-xl font-bold hover:text-gray-100 focus:outline-none"
                  aria-label="Close chat"
                >
                   &times;
                </button>
              </div>
              {messages.length === 1 && messages[0].from === "bot" ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <div className="text-6xl mb-4">🤖</div>
                  <p className="text-lg font-semibold">How can I help you today?</p>
                </div>
              ) : (
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {messages.map((msg, i) => (
                    <div key={i} className="flex flex-col">
                      <span 
                        className={`text-xs mb-1 font-semibold ${
                            msg.from === "user" ? "text-right self-end" : "text-left self-start"
                        }`}
                        >
                        {msg.from === "user" ? "You" : "Bot"}
                      </span>
                      <div
                        className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm shadow-sm whitespace-pre-line ${
                          msg.from === "user"
                            ? "bg-white text-gray-800 self-end ml-auto"
                            : "bg-blue-700 text-white self-start mr-auto"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
              <div className="p-4">
                <div className="bg-white rounded-full px-4 py-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask"
                    className="flex-1 text-gray-800 outline-none bg-transparent"
                  />
                  <button className="text-blue-500 text-xl">🎤</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatbotWidget;
