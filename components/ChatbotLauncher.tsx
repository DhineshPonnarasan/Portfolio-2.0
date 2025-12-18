
import React, { useState, useEffect } from "react";

interface ChatbotLauncherProps {
  showIntro?: boolean;
}

export default function ChatbotLauncher({ showIntro = false }: ChatbotLauncherProps) {
  const [showPopup, setShowPopup] = useState(showIntro);

  useEffect(() => {
    if (showIntro) {
      const timer = setTimeout(() => setShowPopup(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [showIntro]);

  return (
    <>
      <button
        className="fixed bottom-8 right-8 z-50 bg-cyan-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-cyan-600 transition-all border-4 border-cyan-300 animate-glow"
        aria-label="Open Chatbot"
        style={{ boxShadow: "0 0 16px 4px #22d3ee" }}
      >
        <span className="text-3xl">💬</span>
      </button>
      {showPopup && (
        <div className="fixed bottom-28 right-8 z-50 bg-black text-white px-6 py-4 rounded-xl shadow-lg border border-cyan-400 animate-fade-in">
          <span className="font-semibold text-lg">Hi! I&apos;m your Chitti. Ask me anything about this portfolio.</span>
        </div>
      )}
    </>
  );
}
