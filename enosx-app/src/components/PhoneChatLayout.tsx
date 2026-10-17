import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Plus } from "lucide-react";
import Sidebar from "./Sidebar";
import MessageBubble from "./MessageBubble";
import CommandBar, { type AIMode } from "./CommandBar";
import WelcomeScreen from "./WelcomeScreen";
import { Conversation, Message, VoiceState, type Attachment } from "@/lib/types";
import { useTheme } from "@/contexts/ThemeContext";

interface PhoneChatLayoutProps {
  conversations: Conversation[];
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  createNewChat: () => void;
  deleteConversation: (id: string) => void;
  messages: Message[];
  isLoading: boolean;
  handleSend: (text: string, aiMode?: AIMode) => void;
  voiceState: VoiceState;
  transcript: string;
  isVoiceSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  isFreeMode?: boolean;
  onFilesSelected?: (files: File[]) => void;
  attachments?: Attachment[];
  audioStream?: MediaStream | null;
  onSettingsClick?: () => void;
}

export default function PhoneChatLayout({
  conversations,
  activeId,
  setActiveId,
  createNewChat,
  deleteConversation,
  messages,
  isLoading,
  handleSend,
  voiceState,
  transcript,
  isVoiceSupported,
  startListening,
  stopListening,
  speak,
  stopSpeaking,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  messagesEndRef,
  isFreeMode = false,
  onFilesSelected,
  attachments = [],
  audioStream = null,
  onSettingsClick,
}: PhoneChatLayoutProps) {
  const { config } = useTheme();

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col relative bg-black overflow-hidden">
      {/* Mobile Header */}
      <header className="flex min-h-14 shrink-0 items-center justify-between gap-2 px-3 sm:px-4 pt-[env(safe-area-inset-top)] border-b border-white/10 z-20 bg-black/50 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(true)}
          aria-label="Open chat history and navigation"
          className="flex min-h-11 min-w-11 shrink-0 items-center justify-center p-2 -ml-1 text-white/70 hover:text-white transition-colors touch-manipulation"
        >
          <Menu size={24} />
        </button>
        <div className="min-w-0 truncate text-sm font-bold tracking-tighter text-white/90">
          ENOSX <span className="text-cyan-400">AI</span>
        </div>
        <button
          type="button"
          onClick={createNewChat}
          aria-label="Start a new chat"
          className="flex min-h-11 min-w-11 shrink-0 items-center justify-center p-2 -mr-1 text-white/70 hover:text-white transition-colors touch-manipulation"
        >
          <Plus size={24} />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain px-3 py-4 sm:px-4 scrollbar-hide">
        {messages.length === 0 ? (
          <WelcomeScreen onSuggestion={(p: string) => handleSend(p)} />
        ) : (
          <div className="flex min-w-0 flex-col gap-5 pb-6 sm:gap-6 sm:pb-8">
            {messages.map((msg, idx) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                index={idx}
                onSpeak={speak}
                onStopSpeak={stopSpeaking}
                isSpeaking={voiceState === "speaking"}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Mobile Command Bar */}
      <div className="phone-composer-dock relative z-30 w-full min-w-0 shrink-0 border-t border-white/10 bg-black/80 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 sm:px-3 backdrop-blur-xl">
        <CommandBar
          onSend={handleSend}
          isLoading={isLoading}
          voiceState={voiceState}
          transcript={transcript}
          isVoiceSupported={isVoiceSupported}
          onStartVoice={startListening}
          onStopVoice={stopListening}
          onStopSpeaking={stopSpeaking}
          isFreeMode={isFreeMode}
          onFilesSelected={onFilesSelected}
          attachments={attachments}
          audioStream={audioStream}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <Sidebar
            conversations={conversations}
            activeId={activeId}
            onSelect={(id) => { setActiveId(id); setIsMobileSidebarOpen(false); }}
            onNew={() => { createNewChat(); setIsMobileSidebarOpen(false); }}
            onDelete={deleteConversation}
            collapsed={false}
            isMobileOpen={true}
            onMobileClose={() => setIsMobileSidebarOpen(false)}
            onSettingsClick={() => {
              setIsMobileSidebarOpen(false);
              onSettingsClick?.();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
