'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Loader2, X, Send, Edit2, Waves } from 'lucide-react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import VoiceWaveform from './VoiceWaveform';
import AnimatedMicIcon from './AnimatedMicIcon';
import SpeakingAnimation from './SpeakingAnimation';

interface VoiceArchitectureExplanationProps {
  projectId: number;
  onClose?: () => void;
}

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

const VoiceArchitectureExplanation = ({ projectId, onClose }: VoiceArchitectureExplanationProps) => {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [finalTranscript, setFinalTranscript] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [explanation, setExplanation] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [browserInfo, setBrowserInfo] = useState<{ name: string; supportsSpeech: boolean; supportsSynthesis: boolean } | null>(null);

  // Enhanced browser detection
  const detectBrowser = useCallback(() => {
    if (typeof window === 'undefined') return null;

    const userAgent = navigator.userAgent.toLowerCase();
    let browserName = 'Unknown';
    
    if (userAgent.includes('edg/') || userAgent.includes('edge/')) {
      browserName = 'Microsoft Edge';
    } else if (userAgent.includes('chrome/') && !userAgent.includes('edg/')) {
      browserName = 'Google Chrome';
    } else if (userAgent.includes('safari/') && !userAgent.includes('chrome/')) {
      browserName = 'Safari';
    } else if (userAgent.includes('firefox/')) {
      browserName = 'Firefox';
    } else if (userAgent.includes('opera/') || userAgent.includes('opr/')) {
      browserName = 'Opera';
    }

    // Check for Speech Recognition support (Chrome, Edge, Safari)
    const supportsSpeechRecognition = 
      'SpeechRecognition' in window || 
      'webkitSpeechRecognition' in window ||
      (window as any).SpeechRecognition !== undefined ||
      (window as any).webkitSpeechRecognition !== undefined;

    // Check for Speech Synthesis support (all modern browsers)
    const supportsSynthesis = 'speechSynthesis' in window;

    return {
      name: browserName,
      supportsSpeech: supportsSpeechRecognition,
      supportsSynthesis,
    };
  }, []);

  // Check browser support
  const isSupported = typeof window !== 'undefined' && 
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) &&
    'speechSynthesis' in window;

  useEffect(() => {
    const browser = detectBrowser();
    setBrowserInfo(browser);

    // Load voices when available (they may load asynchronously)
    const loadVoices = () => {
      // Voices are now available
      if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
      }
    };
    
    loadVoices();
    if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    if (!isSupported) {
      if (browser?.name === 'Firefox') {
        setError('Firefox doesn\'t support speech recognition. You can still use "Explain Flow" to hear explanations, or type your questions in the text input below.');
      } else {
        setError(`Voice input is not fully supported in ${browser?.name || 'your browser'}. You can still use "Explain Flow" to hear explanations. For full voice features, please use Chrome, Edge, or Safari.`);
      }
      // Don't set error state - allow text input fallback
      return;
    }

    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true; // Keep listening until manually stopped
      recognition.interimResults = true; // Show real-time transcript
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setVoiceState('listening');
        setError(null);
        setInterimTranscript('');
        setFinalTranscript('');
        setTranscript('');
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = '';
        let newFinal = '';

        // Process all results
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            newFinal += transcript + ' ';
          } else {
            interim += transcript;
          }
        }

        // Update transcripts properly
        if (newFinal) {
          setFinalTranscript((prev) => {
            const updated = prev + newFinal;
            setTranscript(updated.trim()); // Update editable transcript
            return updated;
          });
          setInterimTranscript(''); // Clear interim when we get final
        } else {
          setInterimTranscript(interim);
          // Update display transcript with final + interim
          setFinalTranscript((prev) => {
            setTranscript((prev + interim).trim());
            return prev; // Don't change final yet
          });
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          // Don't show error for no-speech, just stop
          setVoiceState('idle');
        } else if (event.error === 'not-allowed') {
          setError('Microphone permission denied. Please allow microphone access.');
          setVoiceState('error');
        } else if (event.error === 'aborted') {
          // User stopped manually, this is fine
          setVoiceState('idle');
        } else {
          setError(`Speech recognition error: ${event.error}`);
          setVoiceState('error');
        }
      };

      recognition.onend = () => {
        // Only auto-stop if we were listening and have no transcript
        if (voiceState === 'listening' && !transcript.trim()) {
          setVoiceState('idle');
        } else if (voiceState === 'listening' && transcript.trim()) {
          // We have a transcript, keep it ready for editing/sending
          setVoiceState('idle');
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors when stopping
        }
      }
      stopSpeaking();
    };
  }, [isSupported, detectBrowser]);

  const stopSpeaking = useCallback(() => {
    try {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
          window.speechSynthesis.cancel();
        }
      }
    } catch (err) {
      // Silently handle errors when stopping
      console.warn('Error stopping speech:', err);
    }
    
    if (voiceState === 'speaking') {
      setVoiceState('idle');
    }
  }, [voiceState]);

  const speakText = useCallback((text: string) => {
    if (isMuted) return;

    // Check if speech synthesis is available
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.warn('Speech synthesis not available');
      setError('Text-to-speech is not available in your browser.');
      return;
    }

    try {
      stopSpeaking(); // Stop any ongoing speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0; // Slightly faster for younger voice
      utterance.pitch = 1.4; // Higher pitch for young girl voice
      utterance.volume = 1.0;
      utterance.lang = 'en-US';
      
      // Try to find and use a young female voice
      const voices = window.speechSynthesis.getVoices();
      
      // Priority order: young-sounding voices first
      const youngFemaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('zira') || // Windows - young female
        voice.name.toLowerCase().includes('samantha') || // macOS - young female
        voice.name.toLowerCase().includes('karen') || // Australian - young female
        voice.name.toLowerCase().includes('alloy') || // OpenAI-style young voice
        voice.name.toLowerCase().includes('nova') || // Google young voice
        voice.name.toLowerCase().includes('aria') || // Young female voice
        voice.name.toLowerCase().includes('emma') || // Young female voice
        (voice.name.toLowerCase().includes('google') && voice.name.toLowerCase().includes('female'))
      ) || voices.find(voice => 
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('susan') || // UK female voice
        voice.name.toLowerCase().includes('victoria') || // US female voice
        (voice.localService === false && voice.lang.startsWith('en') && voice.gender === 'female')
      );
      
      if (youngFemaleVoice) {
        utterance.voice = youngFemaleVoice;
        utterance.pitch = 1.5; // Even higher pitch for young girl voice
      } else {
        // Fallback: use very high pitch to simulate young girl voice
        utterance.pitch = 1.6;
      }

      utterance.onstart = () => {
        setVoiceState('speaking');
      };

      utterance.onend = () => {
        setVoiceState('idle');
      };

      utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
        // Silently handle common errors without throwing
        const errorType = event.error || 'unknown';
        
        // Only show user-facing errors for critical issues
        if (errorType === 'not-allowed' || errorType === 'network') {
          setError('Unable to play audio. Please check your browser settings.');
        }
        
        // Don't log to console.error to avoid Next.js error handling
        // Just reset state
        setVoiceState('idle');
      };

      synthesisRef.current = utterance;
      
      // Check if speechSynthesis is in a valid state
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        // Small delay to ensure cancellation completes
        setTimeout(() => {
          window.speechSynthesis.speak(utterance);
        }, 100);
      } else {
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      // Catch any synchronous errors
      console.warn('Failed to start speech synthesis:', err);
      setVoiceState('idle');
      setError('Unable to play audio. The text explanation is still available above.');
    }
  }, [isMuted, stopSpeaking]);

  const handleVoiceQuestion = useCallback(async (question: string) => {
    setVoiceState('processing');
    setError(null);
    setExplanation('');
    setIsEditing(false);

    try {
      const response = await fetch('/api/architecture-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          question: question.trim() || undefined, // If empty, will get general explanation
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get explanation');
      }

      setExplanation(data.explanation);
      speakText(data.explanation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process your question');
      setVoiceState('error');
    }
  }, [projectId, speakText]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError('Speech recognition not available. Please use the text input below or try a different browser.');
      return;
    }
    
    setTranscript('');
    setInterimTranscript('');
    setFinalTranscript('');
    setExplanation('');
    setError(null);
    setIsEditing(false);
    
    try {
      recognitionRef.current.start();
    } catch (err: any) {
      console.warn('Failed to start recognition:', err);
      if (err?.message?.includes('already started')) {
        // Recognition already running, ignore
        return;
      }
      setError('Failed to start voice recognition. Please check microphone permissions and try again.');
      setVoiceState('error');
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        // Ignore errors when stopping
      }
    }
    
    // If we have a transcript, show it for editing
    setFinalTranscript((prev) => {
      const combined = (prev + interimTranscript).trim();
      if (combined) {
        setTranscript(combined);
        setIsEditing(true);
      }
      return combined ? combined : prev;
    });
    setInterimTranscript('');
    setVoiceState('idle');
  }, [interimTranscript]);
  
  const handleSendQuestion = useCallback(() => {
    const questionToSend = transcript.trim() || finalTranscript.trim();
    if (!questionToSend) return;
    
    setIsEditing(false);
    handleVoiceQuestion(questionToSend);
  }, [transcript, finalTranscript, handleVoiceQuestion]);
  
  const handleEditTranscript = useCallback(() => {
    setIsEditing(true);
    setVoiceState('idle');
  }, []);
  
  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setTranscript('');
    setInterimTranscript('');
    setFinalTranscript('');
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      if (!prev) {
        stopSpeaking();
      }
      return !prev;
    });
  }, [stopSpeaking]);

  const handleExplainFlow = useCallback(() => {
    handleVoiceQuestion(''); // Empty question = general explanation
  }, [handleVoiceQuestion]);

  if (!isSupported && voiceState === 'error') {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="voice-explanation-container rounded-xl border border-white/10 bg-zinc-900/50 p-4 space-y-4 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.h4
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm font-semibold text-white"
          >
            Voice Explanation
          </motion.h4>
          <div className="flex items-center gap-2">
            {voiceState === 'listening' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2"
              >
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-xs text-red-400 font-medium">Listening</span>
              </motion.div>
            )}
            {voiceState === 'speaking' && <SpeakingAnimation isSpeaking={true} />}
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close voice explanation"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Animated Waveform when listening */}
      {voiceState === 'listening' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <VoiceWaveform isActive={true} intensity={0.7} />
        </motion.div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <motion.button
          type="button"
          onClick={voiceState === 'listening' ? stopListening : startListening}
          disabled={voiceState === 'processing' || voiceState === 'speaking'}
          whileHover={{ scale: voiceState !== 'listening' ? 1.05 : 1 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
            voiceState === 'listening'
              ? 'border-red-500/60 bg-red-500/15 text-red-400 shadow-lg shadow-red-500/20'
              : 'border-white/10 bg-white/5 text-white hover:border-primary/50 hover:text-primary hover:shadow-lg hover:shadow-primary/20'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label={voiceState === 'listening' ? 'Stop listening' : 'Start voice input'}
        >
          {voiceState === 'listening' ? (
            <>
              <AnimatedMicIcon isListening={true} size={16} />
              <span>Stop Listening</span>
            </>
          ) : (
            <>
              <Mic size={16} />
              <span>Ask by Voice</span>
            </>
          )}
        </motion.button>

        <motion.button
          type="button"
          onClick={handleExplainFlow}
          disabled={voiceState === 'processing' || voiceState === 'speaking'}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white hover:border-primary/50 hover:text-primary hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Volume2 size={16} />
          <span>Explain Flow</span>
        </motion.button>

        {(voiceState === 'speaking' || explanation) && (
          <button
            type="button"
            onClick={isMuted ? toggleMute : stopSpeaking}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white hover:border-white/20 transition-colors"
            aria-label={isMuted ? 'Unmute' : 'Stop speaking'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            <span>{isMuted ? 'Unmute' : 'Stop'}</span>
          </button>
        )}
      </div>

      {/* Real-time Transcript Display */}
      <AnimatePresence mode="wait">
        {(transcript || voiceState === 'listening') && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="rounded-lg border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-4 space-y-3 backdrop-blur-sm shadow-lg"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-white/50">
                {voiceState === 'listening' ? 'Listening...' : isEditing ? 'Edit your question:' : 'Your question:'}
              </p>
              {voiceState === 'listening' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex items-center gap-2"
                >
                  <span className="text-xs text-red-400 font-medium">● Recording</span>
                  <motion.div
                    className="flex gap-1"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    <span className="text-red-400">●</span>
                    <span className="text-red-400">●</span>
                    <span className="text-red-400">●</span>
                  </motion.div>
                </motion.div>
              )}
            </div>
            
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  rows={3}
                  placeholder="Edit your question here..."
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSendQuestion}
                    disabled={!transcript.trim() || voiceState === 'processing'}
                    className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    Send Question
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={voiceState === 'processing'}
                    className="px-4 py-2 rounded-lg border border-white/20 bg-white/5 text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-white/90 leading-relaxed min-h-[2rem]">
                  {finalTranscript || (voiceState === 'listening' && 'Speak your question...')}
                  {voiceState === 'listening' && interimTranscript && (
                    <span className="text-white/50 italic"> {interimTranscript}</span>
                  )}
                </p>
                {finalTranscript && voiceState !== 'listening' && (
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleEditTranscript}
                      className="px-3 py-1.5 rounded-lg border border-white/20 bg-white/5 text-white hover:bg-white/10 transition-colors text-xs"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={handleSendQuestion}
                      disabled={voiceState === 'processing'}
                      className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                    >
                      Send
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      <AnimatePresence>
        {voiceState === 'processing' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-3 text-sm text-white/60 py-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 size={16} className="text-primary" />
            </motion.div>
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Processing your question...
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      {error && voiceState === 'error' && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Explanation */}
      <AnimatePresence>
        {explanation && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="rounded-lg border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-4 space-y-2 backdrop-blur-sm shadow-lg shadow-primary/10"
          >
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-2"
            >
              <p className="text-xs uppercase tracking-widest text-primary/70">Explanation:</p>
              {voiceState === 'speaking' && !isMuted && <SpeakingAnimation isSpeaking={true} />}
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap"
            >
              {explanation}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Text Input Fallback for unsupported browsers */}
      {!isSupported && (
        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-300">
            <p className="font-medium mb-1">Voice input not available</p>
            <p className="text-xs text-yellow-300/80">
              {browserInfo?.name === 'Firefox' 
                ? 'Firefox doesn\'t support speech recognition. You can type your questions below or use "Explain Flow" to hear explanations.'
                : `Voice input is limited in ${browserInfo?.name || 'this browser'}. You can still type questions or use "Explain Flow".`}
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && transcript.trim()) {
                  handleVoiceQuestion(transcript);
                }
              }}
              placeholder="Type your question about the architecture..."
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-colors"
            />
            <button
              type="button"
              onClick={() => transcript.trim() && handleVoiceQuestion(transcript)}
              disabled={!transcript.trim() || voiceState === 'processing'}
              className="px-4 py-2 rounded-lg border border-primary/50 bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Ask
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      {voiceState === 'idle' && !explanation && !error && isSupported && (
        <div className="text-xs text-white/50 space-y-1">
          <p>• Click &quot;Ask by Voice&quot; to ask a question about the architecture</p>
          <p>• Click &quot;Explain Flow&quot; to hear a general explanation of Box 1 → Box 6</p>
          <p>• Make sure your microphone is enabled</p>
          {browserInfo && (
            <p className="text-white/40 mt-2">Detected: {browserInfo.name}</p>
          )}
        </div>
      )}
    </motion.div>
  );
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
  
  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    abort(): void;
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  }
  
  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
  }
  
  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
  }
  
  interface SpeechSynthesisErrorEvent extends Event {
    error?: string;
    charIndex?: number;
    charLength?: number;
    type?: string;
  }
  
  interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }
  
  interface SpeechRecognitionResult {
    length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
    isFinal: boolean;
  }
  
  interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
  }
}

export default VoiceArchitectureExplanation;

