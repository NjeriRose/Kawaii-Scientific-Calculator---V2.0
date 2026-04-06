import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, 
  Delete, 
  RotateCcw, 
  Settings, 
  Sparkles, 
  Moon, 
  Sun, 
  Heart, 
  Star,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  ArrowRight,
  Calculator,
  Trash2,
  X,
  Plus,
  Send,
  Camera,
  Upload,
  Loader2,
  Image as ImageIcon,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Clipboard,
  Eraser,
  Menu,
  Monitor,
  Palette,
  Pencil,
  Save,
  Mouse,
  PawPrint,
  Clock,
  Waves,
  Flower,
  Variable
} from 'lucide-react';
import * as math from 'mathjs';
import { GoogleGenAI, Type, FunctionDeclaration, ThinkingLevel } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

type HistoryItem = {
  expression: string;
  result: string;
  timestamp: number;
};

type ThemeColors = {
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  cardBg: string;
  text: string;
  muted: string;
};

type Theme = {
  id: string;
  name: string;
  icon: React.ReactNode;
  light: ThemeColors;
  dark: ThemeColors;
};

const themes: Theme[] = [
  {
    id: 'minnie',
    name: 'Minnie',
    icon: <Heart size={16} />,
    light: {
      primary: '#FF69B4',
      secondary: '#FFB6C1',
      accent: '#E81D22',
      bg: '#FFF0F5',
      cardBg: 'rgba(255, 255, 255, 0.4)',
      text: '#D81B60',
      muted: '#F06292',
    },
    dark: {
      primary: '#FF85C1',
      secondary: '#5E2B4E',
      accent: '#E81D22',
      bg: '#121212',
      cardBg: 'rgba(255, 105, 180, 0.1)',
      text: '#F5F5F5',
      muted: '#FFB6C1',
    }
  },
  {
    id: 'mickey',
    name: 'Mickey',
    icon: <Mouse size={16} />,
    light: {
      primary: '#000000',
      secondary: '#DA0F10',
      accent: '#FFB321',
      bg: '#F5F5F5',
      cardBg: 'rgba(255, 255, 255, 0.4)',
      text: '#000000',
      muted: '#424242',
    },
    dark: {
      primary: '#FFFFFF',
      secondary: '#DA0F10',
      accent: '#FFB321',
      bg: '#121212',
      cardBg: 'rgba(255, 255, 255, 0.05)',
      text: '#F5F5F5',
      muted: '#BDBDBD',
    }
  },
  {
    id: 'pooh',
    name: 'Pooh',
    icon: <PawPrint size={16} />,
    light: {
      primary: '#E6B01E',
      secondary: '#F6A6C0',
      accent: '#D81C22',
      bg: '#FFF9E6',
      cardBg: 'rgba(255, 255, 255, 0.4)',
      text: '#5D4037',
      muted: '#8D6E63',
    },
    dark: {
      primary: '#F8C63D',
      secondary: '#F6A6C0',
      accent: '#D81C22',
      bg: '#121212',
      cardBg: 'rgba(248, 198, 61, 0.1)',
      text: '#F5F5F5',
      muted: '#A1887F',
    }
  },
  {
    id: 'cinderella',
    name: 'Cinderella',
    icon: <Clock size={16} />,
    light: {
      primary: '#74B0E0',
      secondary: '#E2F1F7',
      accent: '#182952',
      bg: '#F0F7FF',
      cardBg: 'rgba(255, 255, 255, 0.4)',
      text: '#1971C2',
      muted: '#4DABF7',
    },
    dark: {
      primary: '#9BC4E2',
      secondary: '#182952',
      accent: '#E2F1F7',
      bg: '#121212',
      cardBg: 'rgba(155, 196, 226, 0.1)',
      text: '#F5F5F5',
      muted: '#74C0FC',
    }
  },
  {
    id: 'ariel',
    name: 'Ariel',
    icon: <Waves size={16} />,
    light: {
      primary: '#2C9C85',
      secondary: '#9867C5',
      accent: '#D91E36',
      bg: '#E6FCF5',
      cardBg: 'rgba(255, 255, 255, 0.4)',
      text: '#087F5B',
      muted: '#38D9A9',
    },
    dark: {
      primary: '#2C9C85',
      secondary: '#862E9C',
      accent: '#D91E36',
      bg: '#121212',
      cardBg: 'rgba(44, 156, 133, 0.1)',
      text: '#F5F5F5',
      muted: '#63E6BE',
    }
  },
  {
    id: 'belle',
    name: 'Belle',
    icon: <Flower size={16} />,
    light: {
      primary: '#FFD700',
      secondary: '#6CB0D8',
      accent: '#1C3879',
      bg: '#FFF9DB',
      cardBg: 'rgba(255, 255, 255, 0.4)',
      text: '#E67700',
      muted: '#F59F00',
    },
    dark: {
      primary: '#FFD700',
      secondary: '#1C3879',
      accent: '#6CB0D8',
      bg: '#121212',
      cardBg: 'rgba(255, 215, 0, 0.1)',
      text: '#F5F5F5',
      muted: '#FCC419',
    }
  },
  {
    id: 'elsa',
    name: 'Elsa',
    icon: <Star size={16} />,
    light: {
      primary: '#4AA9C0',
      secondary: '#E8F7FA',
      accent: '#731D46',
      bg: '#F0F9FB',
      cardBg: 'rgba(255, 255, 255, 0.4)',
      text: '#1B4D5C',
      muted: '#4A9EB5',
    },
    dark: {
      primary: '#64CBE6',
      secondary: '#1B4D5C',
      accent: '#E8F7FA',
      bg: '#121212',
      cardBg: 'rgba(100, 203, 230, 0.1)',
      text: '#F5F5F5',
      muted: '#3E8AA1',
    }
  },
  {
    id: 'moana',
    name: 'Moana',
    icon: <Waves size={16} />,
    light: {
      primary: '#008891',
      secondary: '#D94B2B',
      accent: '#55A630',
      bg: '#F0F7F7',
      cardBg: 'rgba(255, 255, 255, 0.4)',
      text: '#004D52',
      muted: '#007078',
    },
    dark: {
      primary: '#008891',
      secondary: '#004D52',
      accent: '#D94B2B',
      bg: '#121212',
      cardBg: 'rgba(0, 136, 145, 0.1)',
      text: '#F5F5F5',
      muted: '#006169',
    }
  },
  {
    id: 'rapunzel',
    name: 'Rapunzel',
    icon: <Sun size={16} />,
    light: {
      primary: '#885FA6',
      secondary: '#D96C8E',
      accent: '#FCE883',
      bg: '#F8F0FC',
      cardBg: 'rgba(255, 255, 255, 0.4)',
      text: '#5F3DC4',
      muted: '#AE3EC9',
    },
    dark: {
      primary: '#885FA6',
      secondary: '#5F3DC4',
      accent: '#FCE883',
      bg: '#121212',
      cardBg: 'rgba(136, 95, 166, 0.1)',
      text: '#F5F5F5',
      muted: '#D0BFFF',
    }
  }
];

type FontStyle = {
  id: string;
  name: string;
  icon: string;
  primary: string;
  secondary: string;
};

const fontStyles: FontStyle[] = [
  {
    id: 'minnie',
    name: 'Minnie Playful',
    icon: '🎀',
    primary: "'Waltograph', sans-serif",
    secondary: "'Poppins', sans-serif"
  },
  {
    id: 'mickey',
    name: 'Mickey Classic',
    icon: '🐭',
    primary: "'Waltograph', sans-serif",
    secondary: "'Inter', sans-serif"
  },
  {
    id: 'pooh',
    name: 'Pooh Cozy',
    icon: '🐻',
    primary: "'Quicksand', sans-serif",
    secondary: "'Nunito', sans-serif"
  },
  {
    id: 'cinderella',
    name: 'Cinderella Elegant',
    icon: '👑',
    primary: "'Cinzel', serif",
    secondary: "'Lato', sans-serif"
  },
  {
    id: 'ariel',
    name: 'Ariel Ocean',
    icon: '🧜‍♀️',
    primary: "'The Little Mermaid', sans-serif",
    secondary: "'Open Sans', sans-serif"
  },
  {
    id: 'belle',
    name: 'Belle Royal',
    icon: '👸',
    primary: "'Playfair Display', serif",
    secondary: "'Lora', serif"
  },
  {
    id: 'elsa',
    name: 'Elsa Frosted',
    icon: '❄️',
    primary: "'Ice Kingdom', sans-serif",
    secondary: "'Montserrat', sans-serif"
  },
  {
    id: 'moana',
    name: 'Moana Adventurous',
    icon: '🌺',
    primary: "'Moana', sans-serif",
    secondary: "'Open Sans', sans-serif"
  },
  {
    id: 'rapunzel',
    name: 'Rapunzel Dreamy',
    icon: '🌸',
    primary: "'Tangled', sans-serif",
    secondary: "'Nunito', sans-serif"
  }
];

type Message = {
  role: 'user' | 'ai';
  content: string;
  image?: string;
  timestamp: number;
  feedback?: 'up' | 'down';
};

type ChatSession = {
  id: string;
  title: string;
  timestamp: number;
  messages: Message[];
};

export default function App() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [lastResult, setLastResult] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showClearHistoryConfirm, setShowClearHistoryConfirm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isScientific, setIsScientific] = useState(true);
  const [showLanding, setShowLanding] = useState(true);
  const [showAI, setShowAI] = useState(false);
  const [showConverter, setShowConverter] = useState(false);
  const [showEquationSolver, setShowEquationSolver] = useState(false);
  const [equationInput, setEquationInput] = useState('');
  const [equationSolution, setEquationSolution] = useState('');
  const [isSolving, setIsSolving] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('calculator-chat-sessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(() => {
    const saved = localStorage.getItem('calculator-chat-sessions');
    if (saved) {
      const sessions = JSON.parse(saved);
      if (sessions.length > 0) return sessions[0].id;
    }
    return null;
  });
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingSessionTitle, setEditingSessionTitle] = useState('');
  const [showChatHistoryDrawer, setShowChatHistoryDrawer] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [baseThemeId, setBaseThemeId] = useState(() => {
    const saved = localStorage.getItem('calculator-base-theme-id');
    return saved || 'minnie';
  });
  const [appearance, setAppearance] = useState<'light' | 'dark' | 'system'>(() => {
    const saved = localStorage.getItem('calculator-appearance');
    return (saved as 'light' | 'dark' | 'system') || 'system';
  });

  const [fontStyleId, setFontStyleId] = useState(() => {
    const saved = localStorage.getItem('calculator-font-style-id');
    return saved || 'minnie';
  });

  const [isSystemDark, setIsSystemDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsSystemDark(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsSystemDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const fontStyle = fontStyles.find(f => f.id === fontStyleId) || fontStyles[0];
    const root = document.documentElement;
    root.style.setProperty('--font-primary', fontStyle.primary);
    root.style.setProperty('--font-secondary', fontStyle.secondary);
    localStorage.setItem('calculator-font-style-id', fontStyleId);
  }, [fontStyleId]);

  const isDarkMode = appearance === 'system' ? isSystemDark : appearance === 'dark';
  const baseTheme = themes.find(t => t.id === baseThemeId) || themes[0];
  const theme = isDarkMode ? baseTheme.dark : baseTheme.light;

  const toggleAppearance = () => {
    const modes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const nextIndex = (modes.indexOf(appearance) + 1) % modes.length;
    setAppearance(modes[nextIndex]);
  };

  const [memory, setMemory] = useState<number>(0);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Unit Converter State
  const [convCategory, setConvCategory] = useState('length');
  const [convValue, setConvValue] = useState('1');
  const [convFrom, setConvFrom] = useState('m');
  const [convTo, setConvTo] = useState('cm');
  const [convResult, setConvResult] = useState('');

  const [buttonColors, setButtonColors] = useState(() => {
    const saved = localStorage.getItem('calculator-button-colors');
    return saved ? JSON.parse(saved) : {
      num: '#FFFFFF',
      op: '#FFB6C1',
      equals: '#FF69B4'
    };
  });

  const [decimalPlaces, setDecimalPlaces] = useState(() => {
    const saved = localStorage.getItem('calculator-decimal-places');
    return saved ? JSON.parse(saved) : 4;
  });
  const [isRoundingEnabled, setIsRoundingEnabled] = useState(() => {
    const saved = localStorage.getItem('calculator-rounding-enabled');
    return saved ? JSON.parse(saved) : true;
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('calculator-base-theme-id', baseThemeId);
  }, [baseThemeId]);

  useEffect(() => {
    localStorage.setItem('calculator-appearance', appearance);
  }, [appearance]);

  const currentSession = chatSessions.find(s => s.id === currentSessionId);
  const messages = currentSession ? currentSession.messages : [];

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      timestamp: Date.now(),
      messages: [],
    };
    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    return newSession.id;
  };

  const renameSession = (sessionId: string, newTitle: string) => {
    setChatSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return { ...session, title: newTitle };
      }
      return session;
    }));
    setEditingSessionId(null);
  };

  const generateTitle = async (sessionId: string, firstMessage: Message) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-preview",
        contents: [
          {
            role: 'user',
            parts: [
              { text: `Generate a very short, descriptive title (max 5 words) for a math chat starting with this message: "${firstMessage.content}". If the message contains a math problem, include the problem in the title. Return ONLY the title.` }
            ]
          }
        ],
        config: {
          maxOutputTokens: 20,
        }
      });

      const title = response.text.trim().replace(/^"|"$/g, '') || 'Math Problem';
      renameSession(sessionId, title);
    } catch (error) {
      console.error("Title generation error:", error);
    }
  };

  const updateSessionMessages = (sessionId: string, newMessages: Message[]) => {
    setChatSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return { ...session, messages: newMessages };
      }
      return session;
    }));
  };

  const groupSessionsByDate = (sessions: ChatSession[]) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const yesterday = new Date(today - 86400000).getTime();

    const groups: { [key: string]: ChatSession[] } = {
      'Today': [],
      'Yesterday': [],
      'Earlier': []
    };

    sessions.forEach(session => {
      const sessionDate = new Date(session.timestamp).setHours(0, 0, 0, 0);
      if (sessionDate === today) {
        groups['Today'].push(session);
      } else if (sessionDate === yesterday) {
        groups['Yesterday'].push(session);
      } else {
        groups['Earlier'].push(session);
      }
    });

    return groups;
  };

  const sessionGroups = groupSessionsByDate(chatSessions);

  useEffect(() => {
    localStorage.setItem('calculator-chat-sessions', JSON.stringify(chatSessions));
  }, [chatSessions]);

  useEffect(() => {
    localStorage.setItem('calculator-button-colors', JSON.stringify(buttonColors));
  }, [buttonColors]);

  useEffect(() => {
    localStorage.setItem('calculator-decimal-places', JSON.stringify(decimalPlaces));
  }, [decimalPlaces]);

  useEffect(() => {
    localStorage.setItem('calculator-rounding-enabled', JSON.stringify(isRoundingEnabled));
  }, [isRoundingEnabled]);
  const displayRef = useRef<HTMLDivElement>(null);

  const pastelOptions = [
    { name: 'Sakura', color: '#FFB6C1' },
    { name: 'Lavender', color: '#E6E6FA' },
    { name: 'Mint', color: '#BFFCC6' },
    { name: 'Sky', color: '#BAE1FF' },
    { name: 'Lemon', color: '#FFFFBA' },
    { name: 'Peach', color: '#FFD1DC' },
    { name: 'White', color: '#FFFFFF' },
    { name: 'Hot Pink', color: '#FF69B4' },
    { name: 'Purple', color: '#9370DB' },
  ];

  // Auto-scroll display to the right
  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollLeft = displayRef.current.scrollWidth;
    }
  }, [expression]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if landing page, settings or history is open
      if (showLanding || showSettings || showHistory) return;

      const key = e.key;

      // Prevent default for some keys
      if (['/', '*', '+', '-', 'Enter', '=', 'Backspace', 'Escape', '(', ')', '^', '%'].includes(key)) {
        // Only prevent if not typing in an input (though we don't have any other inputs yet)
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          // e.preventDefault(); // Removed to avoid blocking browser shortcuts unless necessary
        }
      }

      if (/[0-9]/.test(key)) {
        handleButtonClick(key);
      } else {
        switch (key) {
          case '+': handleButtonClick('+'); break;
          case '-': handleButtonClick('-'); break;
          case '*': handleButtonClick('×'); break;
          case '/': 
            e.preventDefault();
            handleButtonClick('÷'); 
            break;
          case '.': handleButtonClick('.'); break;
          case '(': handleButtonClick('('); break;
          case ')': handleButtonClick(')'); break;
          case '^': handleButtonClick('^'); break;
          case '%': handleButtonClick('%'); break;
          case '!': handleButtonClick('!'); break;
          case 'Enter':
          case '=':
            e.preventDefault();
            handleButtonClick('=');
            break;
          case 'Backspace':
            handleButtonClick('DEL');
            break;
          case 'Escape':
            handleButtonClick('AC');
            break;
          case 's':
          case 'S':
            handleButtonClick('sin(');
            break;
          case 'c':
          case 'C':
            handleButtonClick('cos(');
            break;
          case 't':
          case 'T':
            handleButtonClick('tan(');
            break;
          case 'l':
          case 'L':
            handleButtonClick('log(');
            break;
          case 'n':
          case 'N':
            handleButtonClick('ln(');
            break;
          case 'p':
          case 'P':
            handleButtonClick('π');
            break;
          case 'e':
          case 'E':
            handleButtonClick('e');
            break;
          case 'r':
          case 'R':
            handleButtonClick('√(');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLanding, showSettings, showHistory, expression, lastResult, memory, result, error]); // Include dependencies used in handleButtonClick

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAILoading]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFeedback = (timestamp: number, type: 'up' | 'down') => {
    if (!currentSessionId) return;
    const newMessages = messages.map(msg => 
      msg.timestamp === timestamp ? { ...msg, feedback: type } : msg
    );
    updateSessionMessages(currentSessionId, newMessages);
  };

  const handleAISubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiInput.trim() && !selectedImage) return;

    let sessionId = currentSessionId;
    if (!sessionId) {
      sessionId = createNewSession();
    }

    const userMessage: Message = {
      role: 'user',
      content: aiInput,
      image: selectedImage || undefined,
      timestamp: Date.now(),
    };

    const currentMessages = [...messages, userMessage];
    updateSessionMessages(sessionId, currentMessages);
    
    // Generate title if it's the first message
    if (messages.length === 0) {
      generateTitle(sessionId, userMessage);
    }

    setAiInput('');
    setSelectedImage(null);
    setIsAILoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const systemInstruction = `You are an advanced, multimodal AI math tutor designed to deliver a comprehensive learning experience.
You combine image recognition (OCR), symbolic math solving, step-by-step teaching, interactive tutoring, and personalized learning.

---

## CORE MODES

1. Solve Mode (default): Provide the solution and steps.
2. Teach Mode: Explain concepts deeply, focusing on the "why".
3. Interactive Mode: Guide the user through the problem without giving the answer immediately.

---

## RESPONSE STRUCTURE

### 1. Detected Problem
Display clean formatted math (LaTeX).

### 2. Final Answer
Clear and highlighted.

### 3. Step-by-Step Solution
- Each step must:
  - Show the transformation.
  - Include a clear explanation.

### 4. Alternative Methods
- Provide at least one different solving approach when applicable.

### 5. Concept Explanation
- Identify the math topic automatically.
- Explain: The rule used, why it works, and when to use it.

### 6. Practice Section
- Generate 2–3 similar problems (Easy, Medium, Hard).

---

## DARK MODE AWARENESS & TONE

- Ensure high-contrast math rendering (LaTeX).
- Tone: Friendly tutor, clear, structured, encouraging, never robotic.`;

      // Prepare contents with history
      const contents = currentMessages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [
          ...(msg.image ? [{
            inlineData: {
              data: msg.image.split(',')[1],
              mimeType: "image/png"
            }
          }] : []),
          { text: msg.content || (msg.image ? "Solve this math problem." : "") }
        ]
      }));

      // Add a placeholder AI message for streaming
      const placeholderAiMessage: Message = {
        role: 'ai',
        content: '',
        timestamp: Date.now(),
      };
      updateSessionMessages(sessionId, [...currentMessages, placeholderAiMessage]);

      const responseStream = await ai.models.generateContentStream({
        model: "gemini-3-flash-preview",
        contents,
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
        }
      });

      let fullText = '';
      for await (const chunk of responseStream) {
        fullText += chunk.text;
        // Update the last message with the current streamed text
        updateSessionMessages(sessionId, [...currentMessages, { ...placeholderAiMessage, content: fullText }]);
      }
    } catch (error) {
      console.error("AI Error:", error);
      updateSessionMessages(sessionId, [...currentMessages, {
        role: 'ai',
        content: "Oh no! Something went wrong with my magical brain. Please try again! (╥﹏╥)",
        timestamp: Date.now(),
      }]);
    } finally {
      setIsAILoading(false);
    }
  };

  // Equation Solver Logic
  const handleSolveEquation = async () => {
    if (!equationInput.trim()) return;
    setIsSolving(true);
    setEquationSolution('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Solve this math equation step-by-step and provide the final answer for the variable(s): ${equationInput}`,
        config: {
          systemInstruction: "You are a helpful math expert. Solve the given equation step-by-step using LaTeX for math formatting where appropriate. Be clear and concise.",
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
        }
      });
      setEquationSolution(response.text || "I couldn't solve that equation. Please check the input.");
    } catch (error) {
      console.error("Equation Solver Error:", error);
      setEquationSolution("An error occurred while solving the equation. Please try again.");
    } finally {
      setIsSolving(false);
    }
  };

  // Unit Converter Logic
  useEffect(() => {
    if (!showConverter) return;
    try {
      if (!convValue || isNaN(Number(convValue))) {
        setConvResult('');
        return;
      }
      const evaluated = math.evaluate(`${convValue} ${convFrom} to ${convTo}`);
      const numericValue = typeof evaluated === 'number' ? evaluated : evaluated.toNumber(convTo);
      
      let finalResult: string;
      if (Number.isInteger(numericValue)) {
        finalResult = numericValue.toString();
      } else if (isRoundingEnabled) {
        finalResult = numericValue.toFixed(decimalPlaces).replace(/\.?0+$/, '');
      } else {
        finalResult = numericValue.toString();
      }
      setConvResult(finalResult);
    } catch (err) {
      setConvResult('Error');
    }
  }, [convValue, convFrom, convTo, convCategory, showConverter, decimalPlaces, isRoundingEnabled]);

  const unitsByCategory: Record<string, string[]> = {
    length: ['m', 'cm', 'mm', 'km', 'inch', 'foot', 'yard', 'mile'],
    weight: ['kg', 'g', 'mg', 'lb', 'oz'],
    temperature: ['celsius', 'fahrenheit', 'kelvin'],
  };

  const handleButtonClick = (value: string) => {
    setError(false);
    setErrorMessage('');
    const lastChar = expression.slice(-1);
    const operators = ['+', '-', '×', '÷', '%', '^', '!'];
    const isOperator = (val: string) => operators.includes(val);

    if (value === 'AC') {
      setExpression('');
      setResult('');
    } else if (value === 'DEL') {
      setExpression(prev => prev.slice(0, -1));
    } else if (value === 'Ans') {
      if (lastResult && lastResult !== 'Error') {
        // Prevent Ans immediately after a number without operator
        if (expression && !isOperator(lastChar) && lastChar !== '(') {
          setExpression(prev => prev + '×' + lastResult);
        } else {
          setExpression(prev => prev + lastResult);
        }
      }
    } else if (value === 'Exp') {
      // Exp should follow a number
      if (/\d$/.test(expression)) {
        setExpression(prev => prev + '*10^');
      } else if (!expression || lastChar === '(') {
        setExpression(prev => prev + '1*10^');
      }
    } else if (value === '=') {
      calculateResult();
    } else if (value === 'MC') {
      setMemory(0);
    } else if (value === 'MR') {
      const memStr = memory.toString();
      if (expression && !isOperator(lastChar) && lastChar !== '(') {
        setExpression(prev => prev + '×' + memStr);
      } else {
        setExpression(prev => prev + memStr);
      }
    } else if (value === 'M+') {
      handleMemoryOperation('add');
    } else if (value === 'M-') {
      handleMemoryOperation('subtract');
    } else {
      // Validation for generic inputs
      
      // 1. Prevent multiple decimals in one number
      if (value === '.') {
        const parts = expression.split(/[\+\-×÷%\^\(\)]/);
        const lastPart = parts[parts.length - 1];
        if (lastPart.includes('.')) return;
        if (!expression || isOperator(lastChar) || lastChar === '(') {
          setExpression(prev => prev + '0.');
          return;
        }
      }

      // 2. Handle consecutive operators
      if (isOperator(value)) {
        if (!expression) {
          if (value === '-') setExpression('-');
          return;
        }
        if (isOperator(lastChar) && lastChar !== '!') {
          // Replace last operator with new one
          setExpression(prev => prev.slice(0, -1) + value);
          return;
        }
        // Prevent operator after ( except -
        if (lastChar === '(' && value !== '-') return;
      }

      // 3. Prevent invalid starting characters
      if (!expression && (value === ')' || value === '^' || value === '!' || value === '%')) {
        return;
      }

      // 4. Parentheses logic
      if (value === ')') {
        const openCount = (expression.match(/\(/g) || []).length;
        const closeCount = (expression.match(/\)/g) || []).length;
        if (openCount <= closeCount || lastChar === '(' || isOperator(lastChar)) return;
      }

      // 5. Implicit multiplication for functions, constants, and opening parentheses
      const isFunctionOrConst = value.includes('(') || value === 'π' || value === 'e';
      const lastIsNumOrConst = /\d$/.test(expression) || lastChar === ')' || lastChar === 'π' || lastChar === 'e';
      
      if (isFunctionOrConst && lastIsNumOrConst) {
        setExpression(prev => prev + '×' + value);
        return;
      }

      // 6. Prevent number immediately after constant or )
      if (/\d/.test(value) && (lastChar === ')' || lastChar === 'π' || lastChar === 'e')) {
        setExpression(prev => prev + '×' + value);
        return;
      }

      setExpression(prev => prev + value);
    }
  };

  const handleMemoryOperation = (op: 'add' | 'subtract') => {
    try {
      let valToUse = result || expression || '0';
      
      // If using expression, clean it up
      if (!result && expression) {
        while (['+', '-', '×', '÷', '%', '^', '('].includes(valToUse.slice(-1))) {
          valToUse = valToUse.slice(0, -1);
        }
        const openCount = (valToUse.match(/\(/g) || []).length;
        const closeCount = (valToUse.match(/\)/g) || []).length;
        if (openCount > closeCount) {
          valToUse += ')'.repeat(openCount - closeCount);
        }
      }

      // Replace symbols for mathjs
      let cleanExpr = valToUse
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/%/g, '/100')
        .replace(/π/g, 'pi')
        .replace(/√\(/g, 'sqrt(')
        .replace(/sin\(/g, 'sin(')
        .replace(/cos\(/g, 'cos(')
        .replace(/tan\(/g, 'tan(')
        .replace(/log\(/g, 'log10(')
        .replace(/ln\(/g, 'log(');
      
      const currentVal = math.evaluate(cleanExpr);
      if (typeof currentVal === 'number') {
        setMemory(prev => op === 'add' ? prev + currentVal : prev - currentVal);
      }
    } catch (err: any) {
      setError(true);
      setErrorMessage(err.message || 'Memory Error');
    }
  };

  const calculateResult = () => {
    if (!expression) return;
    try {
      // Remove trailing operators and balance parentheses for evaluation
      let exprToEval = expression;
      while (['+', '-', '×', '÷', '%', '^', '('].includes(exprToEval.slice(-1))) {
        exprToEval = exprToEval.slice(0, -1);
      }
      
      const openCount = (exprToEval.match(/\(/g) || []).length;
      const closeCount = (exprToEval.match(/\)/g) || []).length;
      if (openCount > closeCount) {
        exprToEval += ')'.repeat(openCount - closeCount);
      }

      // Replace symbols for mathjs
      let cleanExpr = exprToEval
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/%/g, '/100')
        .replace(/π/g, 'pi')
        .replace(/√\(/g, 'sqrt(')
        .replace(/sin\(/g, 'sin(')
        .replace(/cos\(/g, 'cos(')
        .replace(/tan\(/g, 'tan(')
        .replace(/log\(/g, 'log10(')
        .replace(/ln\(/g, 'log(');

      const evaluated = math.evaluate(cleanExpr);
      let finalResult: string;
      if (Number.isInteger(evaluated)) {
        finalResult = evaluated.toString();
      } else if (isRoundingEnabled) {
        finalResult = evaluated.toFixed(decimalPlaces).replace(/\.?0+$/, '');
      } else {
        finalResult = evaluated.toString();
      }
      
      setResult(finalResult);
      setLastResult(finalResult);
      setHistory(prev => [
        { expression, result: finalResult, timestamp: Date.now() },
        ...prev.slice(0, 19)
      ]);
    } catch (err: any) {
      setError(true);
      setResult('Error');
      setErrorMessage(err.message || 'Invalid Expression');
    }
  };

  const addToHistory = (item: HistoryItem) => {
    setExpression(item.expression);
    setResult(item.result);
  };

  const handleCopy = async () => {
    if (!result || result === 'Error') return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const buttons = [
    // Scientific Section (Rows 1-3)
    { label: 'sin', type: 'sci', value: 'sin(' },
    { label: 'cos', type: 'sci', value: 'cos(' },
    { label: 'tan', type: 'sci', value: 'tan(' },
    { label: 'log', type: 'sci', value: 'log(' },
    { label: 'ln', type: 'sci', value: 'ln(' },
    
    { label: '√', type: 'sci', value: '√(' },
    { label: '^', type: 'sci', value: '^' },
    { label: 'π', type: 'sci', value: 'π' },
    { label: 'e', type: 'sci', value: 'e' },
    { label: 'abs', type: 'sci', value: 'abs(' },

    { label: 'x!', type: 'sci', value: '!' },
    { label: 'eˣ', type: 'sci', value: 'exp(' },
    { label: '(', type: 'sci', value: '(' },
    { label: ')', type: 'sci', value: ')' },
    { label: '%', type: 'sci', value: '%' },

    { label: 'MR', type: 'mem', value: 'MR' },
    { label: 'MC', type: 'mem', value: 'MC' },
    { label: 'M+', type: 'mem', value: 'M+' },
    { label: 'M-', type: 'mem', value: 'M-' },
    { label: ' ', type: 'empty', value: '' },

    // Numeric Section (Rows 4-7)
    { label: '7', type: 'num', value: '7' },
    { label: '8', type: 'num', value: '8' },
    { label: '9', type: 'num', value: '9' },
    { label: 'DEL', type: 'action', value: 'DEL' },
    { label: 'AC', type: 'action', value: 'AC' },

    { label: '4', type: 'num', value: '4' },
    { label: '5', type: 'num', value: '5' },
    { label: '6', type: 'num', value: '6' },
    { label: '×', type: 'op', value: '×' },
    { label: '÷', type: 'op', value: '÷' },

    { label: '1', type: 'num', value: '1' },
    { label: '2', type: 'num', value: '2' },
    { label: '3', type: 'num', value: '3' },
    { label: '+', type: 'op', value: '+' },
    { label: '-', type: 'op', value: '-' },

    { label: '0', type: 'num', value: '0' },
    { label: '.', type: 'num', value: '.' },
    { label: 'Exp', type: 'op', value: 'Exp' },
    { label: 'Ans', type: 'op', value: 'Ans' },
    { label: '=', type: 'equals', value: '=' },
  ];

  const getButtonClass = (type: string) => {
    const base = "h-12 md:h-14 rounded-full font-bold text-sm transition-all flex items-center justify-center shadow-lg liquid-glass active:scale-95 hover:scale-105";
    
    switch (type) {
      case 'num': return `${base}`;
      case 'op': return `${base} text-white shimmer`;
      case 'sci': return `${base} text-xs`;
      case 'mem': return `${base} text-[10px]`;
      case 'action': return `${base}`;
      case 'equals': return `${base} text-white shimmer animate-pulse-glow`;
      case 'empty': return `h-12 md:h-14 opacity-0 pointer-events-none`;
      default: return base;
    }
  };

  const getButtonStyle = (type: string) => {
    const style: any = {
      borderColor: 'rgba(255, 255, 255, 0.2)',
      '--glow-color': `${theme.primary}4D`
    };

    switch (type) {
      case 'num': 
        style.backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.4)';
        style.color = theme.text;
        break;
      case 'op': 
        style.background = `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`;
        style.color = 'white';
        style.boxShadow = `0 4px 15px ${theme.primary}4D`;
        break;
      case 'sci': 
        style.backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.2)';
        style.color = theme.text;
        break;
      case 'mem': 
        style.backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.1)';
        style.color = theme.text;
        break;
      case 'action': 
        style.backgroundColor = theme.secondary;
        style.color = 'white';
        break;
      case 'equals': 
        style.background = `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`;
        style.color = 'white';
        style.boxShadow = `0 4px 20px ${theme.primary}66`;
        style['--glow-color'] = `${theme.primary}80`;
        break;
    }
    return style;
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500`} style={{ backgroundColor: theme.bg, fontFamily: 'var(--font-secondary)' }}>
      <AnimatePresence mode="wait">
        {showLanding ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="z-10 text-center max-w-md px-8 py-12 rounded-[50px] shadow-2xl glass-panel transition-colors duration-500"
            style={{ 
              backgroundColor: `${theme.cardBg}`,
            }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="mb-8 flex justify-center"
            >
              <div className={`p-6 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.2)]`} style={{ backgroundColor: theme.secondary }}>
                <Calculator size={80} style={{ color: theme.primary }} />
              </div>
            </motion.div>

            <h1 className={`text-4xl font-black mb-4 tracking-tight font-display`} style={{ color: theme.primary, fontFamily: 'var(--font-display)' }}>
              Kawaii Calc
            </h1>
            
            <p className={`text-lg mb-10 font-medium leading-relaxed`} style={{ color: theme.text, opacity: 0.8 }}>
              The most adorable scientific calculator for all your magical math needs!
            </p>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${theme.primary}66` }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLanding(false)}
              className={`w-full py-4 rounded-full text-xl font-bold shadow-lg transition-all flex items-center justify-center gap-3 text-white`}
              style={{ background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})` }}
            >
              Start Calculating
              <ArrowRight size={24} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${theme.primary}33` }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowLanding(false);
                setShowAI(true);
              }}
              className={`w-full py-4 mt-4 rounded-full text-xl font-bold shadow-lg transition-all flex items-center justify-center gap-3`}
              style={{ 
                backgroundColor: isDarkMode ? `${theme.primary}26` : `${theme.primary}0D`, 
                border: `2px solid ${theme.primary}`,
                color: theme.primary 
              }}
            >
              <Camera size={24} />
              Scan & Solve
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            key="calculator"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full max-w-md glass-panel rounded-[40px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden relative transition-all duration-300`}
            style={{ backgroundColor: `${theme.cardBg}` }}
          >
        {/* Header */}
        <div className={`p-6 flex items-center justify-between transition-colors duration-500`} style={{ color: theme.primary }}>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl backdrop-blur-md border" style={{ backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)', borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors`} style={{ backgroundColor: theme.secondary }}>
              <Calculator size={16} style={{ color: theme.primary }} />
            </div>
            <h1 className="font-display font-bold tracking-tight text-shadow-sm" style={{ fontFamily: 'var(--font-display)' }}>Kawaii Calc</h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowAI(true)}
              className={`p-2.5 rounded-2xl transition-all hover:scale-110 active:scale-95 shadow-[0_0_15px_rgba(250,204,21,0.3)] flex items-center justify-center border-2`}
              style={{ 
                background: `linear-gradient(135deg, ${theme.primary}26, ${theme.secondary}26)`,
                borderColor: `${theme.primary}4D`
              }}
              title="AI Math Assistant"
            >
              <Sparkles size={24} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)] animate-pulse" />
            </button>
            <button 
              onClick={() => setShowMenu(true)}
              className={`p-2 rounded-xl transition-all hover:scale-110 active:scale-95 shadow-sm flex items-center justify-center`}
              style={{ backgroundColor: `${theme.primary}1A`, color: theme.primary }}
              title="Menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>

        {/* Hamburger Menu Overlay */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className={`absolute inset-0 z-50 p-6 flex flex-col transition-colors duration-500`}
              style={{ backgroundColor: theme.bg, color: theme.text }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-2xl font-black flex items-center gap-3 text-shadow-sm px-5 py-2.5 rounded-2xl backdrop-blur-md border" style={{ color: theme.primary, fontFamily: 'var(--font-display)', backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)', borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                  <Menu size={24} /> Menu
                </h2>
                <button 
                  onClick={() => setShowMenu(false)}
                  className={`p-2 rounded-full transition-colors`}
                  style={{ backgroundColor: `${theme.primary}1A` }}
                >
                  <X size={28} />
                </button>
              </div>

              <div className="flex-1 space-y-6 overflow-y-auto pr-2 scrollbar-hide">
                {/* Theme Selection */}
                <div className="space-y-3">
                  <h3 className="font-display text-xs font-bold uppercase tracking-wider opacity-50 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
                    <Palette size={14} /> Themes
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setBaseThemeId(t.id);
                          setShowMenu(false);
                        }}
                        className={`p-2 rounded-2xl flex items-center gap-3 transition-all border-2`}
                        style={{ 
                          borderColor: baseThemeId === t.id ? theme.primary : 'transparent',
                          backgroundColor: baseThemeId === t.id ? `${theme.primary}1A` : `${theme.text}0D`
                        }}
                      >
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm shrink-0" 
                          style={{ 
                            backgroundColor: isDarkMode ? t.dark.primary : t.light.primary,
                            color: 'white'
                          }}
                        >
                          {t.icon}
                        </div>
                        <span className="text-sm font-bold truncate">{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px w-full opacity-10" style={{ backgroundColor: theme.text }} />

                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      setShowHistory(true);
                      setShowMenu(false);
                    }}
                    className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all liquid-glass`}
                    style={{ backgroundColor: `${theme.text}1A` }}
                  >
                    <History size={20} />
                    <span className="font-bold">History</span>
                  </button>

                  <button 
                    onClick={() => {
                      setShowEquationSolver(true);
                      setShowMenu(false);
                    }}
                    className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all liquid-glass`}
                    style={{ backgroundColor: `${theme.text}1A` }}
                  >
                    <Variable size={20} />
                    <span className="font-bold">Equation Solver</span>
                  </button>

                  <button 
                    onClick={() => {
                      setShowConverter(true);
                      setShowMenu(false);
                    }}
                    className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all liquid-glass`}
                    style={{ backgroundColor: `${theme.text}1A` }}
                  >
                    <RefreshCw size={20} />
                    <span className="font-bold">Unit Converter</span>
                  </button>

                  <button 
                    onClick={() => {
                      setShowSettings(true);
                      setShowMenu(false);
                    }}
                    className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all liquid-glass`}
                    style={{ backgroundColor: `${theme.text}1A` }}
                  >
                    <Settings size={20} />
                    <span className="font-bold">Customization</span>
                  </button>

                  <button 
                    onClick={toggleAppearance}
                    className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all liquid-glass`}
                    style={{ backgroundColor: `${theme.text}1A` }}
                  >
                    <div className="flex items-center gap-3">
                      {appearance === 'light' && <Sun size={20} />}
                      {appearance === 'dark' && <Moon size={20} />}
                      {appearance === 'system' && <Monitor size={20} />}
                      <span className="font-bold">
                        {appearance === 'light' && 'Light Mode'}
                        {appearance === 'dark' && 'Dark Mode'}
                        {appearance === 'system' && 'System Default'}
                      </span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider`} style={{ backgroundColor: theme.primary, color: 'white' }}>
                      Change
                    </div>
                  </button>

                  <button 
                    onClick={() => {
                      setIsScientific(!isScientific);
                      setShowMenu(false);
                    }}
                    className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all liquid-glass`}
                    style={{ backgroundColor: `${theme.text}1A` }}
                  >
                    <div className="flex items-center gap-3">
                      <Calculator size={20} />
                      <span className="font-bold">Scientific Mode</span>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative transition-colors`} style={{ backgroundColor: isScientific ? theme.primary : `${theme.text}33` }}>
                      <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${isScientific ? 'left-6' : 'left-1'}`} />
                    </div>
                  </button>
                </div>
              </div>

              <div className={`mt-auto p-4 rounded-2xl text-center text-xs font-medium opacity-50 liquid-glass`} style={{ backgroundColor: `${theme.text}1A` }}>
                Kawaii Calc v2.0 - Made with ❤️
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Display */}
        <div className="px-6 pb-6 text-right relative group glass-panel m-4 rounded-[30px] transition-all duration-500" style={{ backgroundColor: `${theme.cardBg}` }}>
          {memory !== 0 && (
            <div className={`absolute left-6 top-4 text-xs font-bold px-2 py-1 rounded-lg transition-colors liquid-glass`} style={{ backgroundColor: theme.secondary, color: theme.primary }}>
              M: {memory.toString().length > 10 ? memory.toExponential(2) : memory}
            </div>
          )}
          
          <button
            onClick={handleCopy}
            className={`absolute left-6 bottom-8 p-2 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 liquid-glass ${copied ? 'opacity-100 scale-110' : ''}`}
            style={{ backgroundColor: theme.secondary, color: theme.primary }}
            title="Copy result"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>

          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: 10, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: -10, x: '-50%' }}
                className={`absolute left-1/2 -top-4 px-3 py-1 rounded-full text-xs font-bold shadow-lg z-30 ${
                  isDarkMode ? 'bg-purple-600 text-white' : 'bg-pink-500 text-white'
                }`}
              >
                Copied!
              </motion.div>
            )}
          </AnimatePresence>

          <div 
            ref={displayRef}
            className={`text-2xl font-medium overflow-x-auto whitespace-nowrap scrollbar-hide h-10 mb-2 transition-colors opacity-60`}
            style={{ color: theme.text }}
          >
            {expression || '0'}
          </div>
          <div className={`text-6xl font-bold break-all transition-colors`} style={{ color: error ? '#F87171' : theme.text }}>
            {result || '0'}
          </div>

          <AnimatePresence>
            {error && errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 text-xs font-bold text-red-400 flex items-center justify-end gap-1"
              >
                <Star size={12} className="animate-pulse" />
                {errorMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Buttons Grid */}
        <div className={`p-6 rounded-t-[40px] transition-colors duration-500 backdrop-blur-md`} style={{ backgroundColor: `${theme.secondary}26` }}>
          {/* Scientific Section */}
          {isScientific && (
            <div className="grid grid-cols-5 gap-2 mb-4">
              {buttons.filter(b => b.type === 'sci' || b.type === 'mem' || b.type === 'empty').map((btn, i) => (
                <motion.button
                  key={`sci-${i}`}
                  whileHover={{ scale: 1.03, translateY: -2 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  onClick={() => handleButtonClick(btn.value)}
                  className={getButtonClass(btn.type)}
                  style={getButtonStyle(btn.type)}
                >
                  {btn.label}
                </motion.button>
              ))}
            </div>
          )}

          {/* Separator Line */}
          {isScientific && (
            <div className={`h-px w-full mb-4 opacity-20`} style={{ backgroundColor: theme.primary }} />
          )}

          {/* Numeric Section */}
          <div className="grid grid-cols-5 gap-2">
            {buttons.filter(b => b.type !== 'sci' && b.type !== 'mem' && b.type !== 'empty').map((btn, i) => (
              <motion.button
                key={`num-${i}`}
                whileHover={{ scale: 1.03, translateY: -2 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={() => handleButtonClick(btn.value)}
                className={getButtonClass(btn.type)}
                style={getButtonStyle(btn.type)}
              >
                {btn.label}
              </motion.button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className={`absolute inset-0 z-20 p-6 flex flex-col transition-all duration-300`}
              style={{ backgroundColor: theme.bg, color: theme.text }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold flex items-center gap-2 text-shadow-sm px-4 py-2 rounded-2xl backdrop-blur-md border" style={{ color: theme.primary, fontFamily: 'var(--font-display)', backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)', borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                  <Palette size={20} /> Customization
                </h2>
                <button 
                  onClick={() => setShowSettings(false)}
                  className={`p-2 rounded-full transition-colors`}
                  style={{ backgroundColor: `${theme.primary}1A` }}
                >
                  <ChevronRight size={24} className="rotate-90" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-8 pr-2 scrollbar-hide">
                {/* Appearance Toggle */}
                <section>
                  <h3 className="font-display text-sm font-bold mb-3 uppercase tracking-wider opacity-70" style={{ fontFamily: 'var(--font-display)' }}>Appearance</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {(['light', 'dark', 'system'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setAppearance(mode)}
                        className={`p-3 rounded-2xl flex flex-col items-center gap-2 transition-all border-2`}
                        style={{ 
                          borderColor: appearance === mode ? theme.primary : 'transparent',
                          backgroundColor: appearance === mode ? `${theme.primary}1A` : `${theme.text}0D`
                        }}
                      >
                        {mode === 'light' && <Sun size={18} />}
                        {mode === 'dark' && <Moon size={18} />}
                        {mode === 'system' && <Monitor size={18} />}
                        <span className="text-[10px] font-bold uppercase tracking-wider">{mode}</span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Themes */}
                <section>
                  <h3 className="font-display text-sm font-bold mb-3 uppercase tracking-wider opacity-70" style={{ fontFamily: 'var(--font-display)' }}>Active Theme</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setBaseThemeId(t.id)}
                        className={`p-2 rounded-2xl flex items-center gap-3 transition-all border-2`}
                        style={{ 
                          borderColor: baseThemeId === t.id ? theme.primary : 'transparent',
                          backgroundColor: baseThemeId === t.id ? `${theme.primary}1A` : `${theme.text}0D`
                        }}
                      >
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm shrink-0" 
                          style={{ 
                            backgroundColor: isDarkMode ? t.dark.primary : t.light.primary,
                            color: 'white'
                          }}
                        >
                          {t.icon}
                        </div>
                        <span className="text-sm font-bold truncate">{t.name}</span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Font Styles */}
                <section>
                  <h3 className="font-display text-sm font-bold mb-3 uppercase tracking-wider opacity-70" style={{ fontFamily: 'var(--font-display)' }}>Font Style</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {fontStyles.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFontStyleId(f.id)}
                        className={`p-4 rounded-2xl flex items-center justify-between transition-all border-2`}
                        style={{ 
                          borderColor: fontStyleId === f.id ? theme.primary : 'transparent',
                          backgroundColor: fontStyleId === f.id ? `${theme.primary}1A` : `${theme.text}0D`
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{f.icon}</span>
                          <div className="text-left">
                            <div className="text-sm font-bold" style={{ fontFamily: f.primary.replace(/'/g, '') }}>{f.name}</div>
                            <div className="text-[10px] opacity-60" style={{ fontFamily: f.secondary.replace(/'/g, '') }}>The quick brown fox jumps over the lazy dog</div>
                          </div>
                        </div>
                        {fontStyleId === f.id && <Check size={16} style={{ color: theme.primary }} />}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Calculation Settings */}
                <section>
                  <h3 className="font-display text-sm font-bold mb-3 uppercase tracking-wider opacity-70" style={{ fontFamily: 'var(--font-display)' }}>Calculation Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Decimal Places</span>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setDecimalPlaces(Math.max(0, decimalPlaces - 1))}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors`}
                          style={{ backgroundColor: `${theme.text}0D` }}
                        >
                          -
                        </button>
                        <span className="w-4 text-center font-bold">{decimalPlaces}</span>
                        <button 
                          onClick={() => setDecimalPlaces(Math.min(15, decimalPlaces + 1))}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors`}
                          style={{ backgroundColor: `${theme.text}0D` }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Enable Rounding</span>
                      <button 
                        onClick={() => setIsRoundingEnabled(!isRoundingEnabled)}
                        className={`w-12 h-6 rounded-full relative transition-colors`}
                        style={{ backgroundColor: isRoundingEnabled ? theme.primary : `${theme.text}33` }}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isRoundingEnabled ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                </section>
              </div>

              <button 
                onClick={() => {
                  setBaseThemeId('minnie');
                  setFontStyleId('minnie');
                  setAppearance('system');
                  setDecimalPlaces(4);
                  setIsRoundingEnabled(true);
                }}
                className={`mt-6 w-full py-3 rounded-2xl font-bold transition-colors flex items-center justify-center gap-2`}
                style={{ backgroundColor: `${theme.primary}1A`, color: theme.primary }}
              >
                <RotateCcw size={18} /> Reset All Settings
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className={`absolute inset-0 z-10 p-6 flex flex-col transition-all duration-300`}
              style={{ backgroundColor: theme.bg, color: theme.text }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold flex items-center gap-2 text-shadow-sm px-4 py-2 rounded-2xl backdrop-blur-md border" style={{ color: theme.primary, fontFamily: 'var(--font-display)', backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)', borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                  <History size={20} /> History
                </h2>
                <button 
                  onClick={() => setShowHistory(false)}
                  className={`p-2 rounded-full transition-colors`}
                  style={{ backgroundColor: `${theme.primary}1A` }}
                >
                  <ChevronRight size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
                {history.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center gap-4 opacity-30">
                    <RotateCcw size={64} />
                    <p>No history yet!</p>
                  </div>
                ) : (
                  history.map((item, i) => (
                    <motion.div
                      key={item.timestamp}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => {
                        setExpression(item.expression);
                        setResult(item.result);
                        setShowHistory(false);
                      }}
                      className={`p-4 rounded-2xl cursor-pointer transition-colors group`}
                      style={{ backgroundColor: `${theme.text}0D` }}
                    >
                      <div className="text-sm mb-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        {item.expression}
                      </div>
                      <div className="text-xl font-bold transition-colors" style={{ color: theme.primary }}>
                        = {item.result}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              <button 
                onClick={() => setShowClearHistoryConfirm(true)}
                className={`mt-6 w-full py-3 rounded-2xl font-bold transition-colors flex items-center justify-center gap-2`}
                style={{ backgroundColor: `${theme.primary}1A`, color: theme.primary }}
              >
                <Trash2 size={18} /> Clear History
              </button>

              <AnimatePresence>
                {showClearHistoryConfirm && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-[60] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="w-full max-w-xs p-6 rounded-[32px] shadow-2xl glass-panel"
                      style={{ backgroundColor: theme.cardBg, color: theme.text }}
                    >
                      <div className="flex flex-col items-center text-center gap-4">
                        <div 
                          className="w-16 h-16 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${theme.primary}1A`, color: theme.primary }}
                        >
                          <Trash2 size={32} />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold font-display" style={{ fontFamily: 'var(--font-display)' }}>Clear History?</h3>
                          <p className="text-sm opacity-70">
                            This will permanently delete all your calculation history. This action cannot be undone.
                          </p>
                        </div>
                        <div className="flex flex-col w-full gap-2 mt-2">
                          <button
                            onClick={() => {
                              setHistory([]);
                              setShowClearHistoryConfirm(false);
                            }}
                            className="w-full py-4 rounded-2xl font-bold transition-all liquid-glass"
                            style={{ backgroundColor: theme.primary, color: 'white' }}
                          >
                            Yes, Clear All
                          </button>
                          <button
                            onClick={() => setShowClearHistoryConfirm(false)}
                            className="w-full py-4 rounded-2xl font-bold transition-all"
                            style={{ backgroundColor: `${theme.text}0D` }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showEquationSolver && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className={`absolute inset-0 z-20 p-6 flex flex-col transition-all duration-300 glass-panel`}
              style={{ backgroundColor: `${theme.cardBg}`, color: theme.text }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold flex items-center gap-2 text-shadow-sm px-4 py-2 rounded-2xl backdrop-blur-md border" style={{ color: theme.primary, fontFamily: 'var(--font-display)', backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)', borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                  <Variable size={20} /> Equation Solver
                </h2>
                <button 
                  onClick={() => setShowEquationSolver(false)}
                  className={`p-2 rounded-full transition-colors liquid-glass`}
                  style={{ backgroundColor: `${theme.primary}1A` }}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 space-y-6 overflow-y-auto pr-2 scrollbar-hide">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase opacity-60">Enter Equation</label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={equationInput}
                      onChange={(e) => setEquationInput(e.target.value)}
                      placeholder="e.g., 2x + 5 = 15"
                      className={`w-full py-4 px-6 rounded-3xl text-xl font-bold outline-none transition-all glass-panel`}
                      style={{ backgroundColor: `${theme.text}0D`, color: theme.primary }}
                    />
                    {equationInput && (
                      <button 
                        onClick={() => setEquationInput('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 transition-opacity"
                      >
                        <Eraser size={20} />
                      </button>
                    )}
                  </div>
                </div>

                <button 
                  onClick={handleSolveEquation}
                  disabled={isSolving || !equationInput.trim()}
                  className={`w-full py-4 rounded-3xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg liquid-glass shimmer ${isSolving ? 'opacity-50' : ''}`}
                  style={{ backgroundColor: theme.primary, color: 'white' }}
                >
                  {isSolving ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Solving...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Solve Equation
                    </>
                  )}
                </button>

                {equationSolution && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="h-px w-full opacity-10" style={{ backgroundColor: theme.text }} />
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase opacity-60">Solution</label>
                      <div className={`p-6 rounded-[30px] glass-panel prose prose-sm max-w-none ${isDarkMode ? 'prose-invert' : ''}`} style={{ backgroundColor: `${theme.text}0D` }}>
                        <ReactMarkdown 
                          remarkPlugins={[remarkMath]} 
                          rehypePlugins={[rehypeKatex]}
                          components={{
                            h1: ({node, ...props}) => <h1 {...props} style={{ fontFamily: 'var(--font-display)' }} />,
                            h2: ({node, ...props}) => <h2 {...props} style={{ fontFamily: 'var(--font-display)' }} />,
                            h3: ({node, ...props}) => <h3 {...props} style={{ fontFamily: 'var(--font-display)' }} />,
                            p: ({node, ...props}) => <p {...props} style={{ fontFamily: 'var(--font-secondary)' }} />,
                            li: ({node, ...props}) => <li {...props} style={{ fontFamily: 'var(--font-secondary)' }} />,
                            code: ({node, ...props}) => <code {...props} style={{ fontFamily: 'var(--font-mono)' }} />
                          }}
                        >
                          {equationSolution}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showConverter && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className={`absolute inset-0 z-20 p-6 flex flex-col transition-all duration-300`}
              style={{ backgroundColor: theme.bg, color: theme.text }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold flex items-center gap-2 text-shadow-sm px-4 py-2 rounded-2xl backdrop-blur-md border" style={{ color: theme.primary, fontFamily: 'var(--font-display)', backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)', borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                  <RefreshCw size={20} /> Unit Converter
                </h2>
                <button 
                  onClick={() => setShowConverter(false)}
                  className={`p-2 rounded-full transition-colors`}
                  style={{ backgroundColor: `${theme.primary}1A` }}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 space-y-6 overflow-y-auto pr-2 scrollbar-hide">
                {/* Category Selection */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {Object.keys(unitsByCategory).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setConvCategory(cat);
                        setConvFrom(unitsByCategory[cat][0]);
                        setConvTo(unitsByCategory[cat][1]);
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-all whitespace-nowrap border-2`}
                      style={{ 
                        borderColor: convCategory === cat ? theme.primary : 'transparent',
                        backgroundColor: convCategory === cat ? theme.primary : `${theme.text}0D`,
                        color: convCategory === cat ? 'white' : theme.text
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Input Value */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase opacity-60">Value</label>
                  <input 
                    type="number"
                    value={convValue}
                    onChange={(e) => setConvValue(e.target.value)}
                    className={`w-full py-4 px-6 rounded-3xl text-2xl font-bold outline-none transition-all`}
                    style={{ backgroundColor: `${theme.text}0D`, color: theme.primary }}
                  />
                </div>

                {/* Conversion Selectors */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase opacity-60">From</label>
                    <select 
                      value={convFrom}
                      onChange={(e) => setConvFrom(e.target.value)}
                      className={`w-full py-3 px-4 rounded-2xl outline-none transition-all appearance-none cursor-pointer`}
                      style={{ backgroundColor: `${theme.text}0D`, color: theme.text }}
                    >
                      {unitsByCategory[convCategory].map(u => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase opacity-60">To</label>
                    <select 
                      value={convTo}
                      onChange={(e) => setConvTo(e.target.value)}
                      className={`w-full py-3 px-4 rounded-2xl outline-none transition-all appearance-none cursor-pointer`}
                      style={{ backgroundColor: `${theme.text}0D`, color: theme.text }}
                    >
                      {unitsByCategory[convCategory].map(u => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Result Display */}
                <div className={`p-8 rounded-[40px] text-center transition-all`} style={{ backgroundColor: `${theme.secondary}4D` }}>
                  <div className="text-sm font-bold uppercase opacity-60 mb-2">Result</div>
                  <div className="text-4xl font-black break-all" style={{ color: theme.primary }}>
                    {convResult || '0'}
                    <span className="text-lg ml-2 opacity-60">{convTo}</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (convResult && convResult !== 'Error') {
                      setExpression(convResult);
                      setShowConverter(false);
                    }
                  }}
                  className={`w-full py-4 rounded-full font-bold shadow-lg transition-all text-white`}
                  style={{ background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})` }}
                >
                  Use in Calculator
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat History Drawer */}
        <AnimatePresence>
          {showChatHistoryDrawer && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className={`absolute inset-0 z-30 p-6 flex flex-col transition-all duration-300 shadow-2xl`}
              style={{ backgroundColor: theme.bg, color: theme.text, width: '85%' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold flex items-center gap-2 text-shadow-sm px-4 py-2 rounded-2xl backdrop-blur-md border" style={{ color: theme.primary, fontFamily: 'var(--font-display)', backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)', borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                  <History size={20} /> Chat History
                </h2>
                <button 
                  onClick={() => setShowChatHistoryDrawer(false)}
                  className={`p-2 rounded-full transition-colors`}
                  style={{ backgroundColor: `${theme.primary}1A` }}
                >
                  <X size={24} />
                </button>
              </div>

              <button 
                onClick={() => {
                  createNewSession();
                  setShowChatHistoryDrawer(false);
                }}
                className={`w-full py-3 mb-6 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-white shadow-lg`}
                style={{ background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})` }}
              >
                <Plus size={20} /> New Chat
              </button>

              <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-hide">
                {chatSessions.length === 0 ? (
                  <div className="text-center py-10 opacity-30">
                    <p>No chat history yet.</p>
                  </div>
                ) : (
                  Object.entries(sessionGroups).map(([group, sessions]) => (
                    sessions.length > 0 && (
                      <div key={group} className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider opacity-50 px-2 font-display" style={{ fontFamily: 'var(--font-display)' }}>{group}</h3>
                        <div className="space-y-2">
                          {sessions.map(session => (
                            <div key={session.id} className="relative group">
                              <button
                                onClick={() => {
                                  if (editingSessionId !== session.id) {
                                    setCurrentSessionId(session.id);
                                    setShowChatHistoryDrawer(false);
                                  }
                                }}
                                className={`w-full p-4 rounded-2xl text-left transition-all border-2 flex flex-col gap-1 pr-12`}
                                style={{ 
                                  borderColor: currentSessionId === session.id ? theme.primary : 'transparent',
                                  backgroundColor: currentSessionId === session.id ? `${theme.primary}1A` : `${theme.text}0D`
                                }}
                              >
                                {editingSessionId === session.id ? (
                                  <input
                                    autoFocus
                                    value={editingSessionTitle}
                                    onChange={(e) => setEditingSessionTitle(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') renameSession(session.id, editingSessionTitle);
                                      if (e.key === 'Escape') setEditingSessionId(null);
                                    }}
                                    className="w-full bg-transparent font-bold outline-none border-b-2"
                                    style={{ borderBottomColor: theme.primary }}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                ) : (
                                  <span className="font-bold truncate">{session.title}</span>
                                )}
                                <span className="text-xs opacity-50">
                                  {session.messages.length} messages
                                </span>
                              </button>
                              
                              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                                {editingSessionId === session.id ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      renameSession(session.id, editingSessionTitle);
                                    }}
                                    className="p-2 rounded-lg hover:bg-green-500/20 text-green-500 transition-colors"
                                  >
                                    <Save size={16} />
                                  </button>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingSessionId(session.id);
                                      setEditingSessionTitle(session.title);
                                    }}
                                    className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    style={{ backgroundColor: `${theme.text}1A` }}
                                  >
                                    <Pencil size={16} />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showAI && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className={`absolute inset-0 z-20 p-6 flex flex-col transition-all duration-300 glass-panel`}
              style={{ backgroundColor: `${theme.cardBg}`, color: theme.text }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold flex items-center gap-2 text-shadow-sm px-4 py-2 rounded-2xl backdrop-blur-md border" style={{ color: theme.primary, fontFamily: 'var(--font-display)', backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)', borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                  <Sparkles size={20} className="text-yellow-400" /> AI Math Assistant
                </h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowChatHistoryDrawer(true)}
                    className={`p-2 rounded-full transition-colors`}
                    style={{ backgroundColor: `${theme.primary}1A` }}
                    title="Chat History"
                  >
                    <History size={20} />
                  </button>
                  <button 
                    onClick={() => createNewSession()}
                    className={`p-2 rounded-full transition-colors`}
                    style={{ backgroundColor: `${theme.primary}1A` }}
                    title="New Chat"
                  >
                    <Plus size={20} />
                  </button>
                  <button 
                    onClick={() => setShowAI(false)}
                    className={`p-2 rounded-full transition-colors`}
                    style={{ backgroundColor: `${theme.primary}1A` }}
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-4 opacity-30">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center animate-bounce`} style={{ backgroundColor: `${theme.primary}1A` }}>
                      <Sparkles size={48} className="text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Hi! I'm your AI Math Tutor!</p>
                      <p className="text-sm opacity-70">Upload or take a photo of a math problem to get started. ✨</p>
                    </div>
                  </div>
                )}
                
                {messages.map((msg, i) => (
                  <motion.div
                    key={msg.timestamp}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] p-4 rounded-[24px] shadow-lg glass-panel ${
                      msg.role === 'user' ? 'liquid-glass' : ''
                    }`}
                    style={{ 
                      backgroundColor: msg.role === 'user' ? theme.primary : `${theme.cardBg}`,
                      color: msg.role === 'user' ? 'white' : theme.text
                    }}>
                      {msg.image && (
                        <img 
                          src={msg.image} 
                          alt="Scanned math problem" 
                          className="w-full h-auto rounded-lg mb-2 border-2"
                          style={{ borderColor: `${theme.primary}33` }}
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className={`prose prose-sm prose-pink max-w-none overflow-x-auto ${isDarkMode ? 'prose-invert' : ''}`}>
                        <ReactMarkdown 
                          remarkPlugins={[remarkMath]} 
                          rehypePlugins={[rehypeKatex]}
                          components={{
                            h1: ({node, ...props}) => <h1 {...props} style={{ fontFamily: 'var(--font-display)' }} />,
                            h2: ({node, ...props}) => <h2 {...props} style={{ fontFamily: 'var(--font-display)' }} />,
                            h3: ({node, ...props}) => <h3 {...props} style={{ fontFamily: 'var(--font-display)' }} />,
                            p: ({node, ...props}) => <p {...props} style={{ fontFamily: 'var(--font-secondary)' }} />,
                            li: ({node, ...props}) => <li {...props} style={{ fontFamily: 'var(--font-secondary)' }} />,
                            code: ({node, ...props}) => <code {...props} style={{ fontFamily: 'var(--font-mono)' }} />
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                      
                      {msg.role === 'ai' && (
                        <div className={`mt-3 pt-3 border-t flex items-center justify-end gap-3 transition-colors`} style={{ borderColor: `${theme.text}1A` }}>
                          <button 
                            onClick={() => handleFeedback(msg.timestamp, 'up')}
                            className={`p-1.5 rounded-lg transition-all`}
                            style={{ 
                              backgroundColor: msg.feedback === 'up' ? theme.primary : `${theme.text}0D`,
                              color: msg.feedback === 'up' ? 'white' : theme.text
                            }}
                          >
                            <ThumbsUp size={14} />
                          </button>
                          <button 
                            onClick={() => handleFeedback(msg.timestamp, 'down')}
                            className={`p-1.5 rounded-lg transition-all`}
                            style={{ 
                              backgroundColor: msg.feedback === 'down' ? '#EF4444' : `${theme.text}0D`,
                              color: msg.feedback === 'down' ? 'white' : theme.text
                            }}
                          >
                            <ThumbsDown size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {isAILoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className={`p-4 rounded-2xl flex items-center gap-3`} style={{ backgroundColor: `${theme.text}0D` }}>
                      <Loader2 size={20} className="animate-spin" style={{ color: theme.primary }} />
                      <span className="text-sm font-medium">Thinking magically... ✨</span>
                    </div>
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* AI Input Area */}
              <div className="mt-4 space-y-3">
                {selectedImage && (
                  <div className="relative inline-block">
                    <img 
                      src={selectedImage} 
                      alt="Selected" 
                      className="h-20 w-auto rounded-lg border-2"
                      style={{ borderColor: theme.primary }}
                      referrerPolicy="no-referrer"
                    />
                    <button 
                      onClick={() => setSelectedImage(null)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
                
                <form onSubmit={handleAISubmit} className="flex items-center gap-2 glass-panel p-2 rounded-full" style={{ backgroundColor: `${theme.cardBg}` }}>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-3 rounded-full transition-colors liquid-glass`}
                    style={{ backgroundColor: `${theme.text}1A`, color: theme.primary }}
                    title="Scan Problem"
                  >
                    <Camera size={20} />
                  </button>
                  <div className="flex-1 relative flex items-center gap-2">
                    <div className="flex-1 relative">
                      <input 
                        type="text"
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        placeholder="Ask me a math question..."
                        className={`w-full py-3 pl-4 pr-10 rounded-full outline-none transition-all bg-transparent`}
                        style={{ color: theme.text }}
                      />
                      {aiInput && (
                        <button 
                          type="button"
                          onClick={() => setAiInput('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 transition-opacity"
                          title="Clear text"
                        >
                          <Eraser size={16} />
                        </button>
                      )}
                    </div>
                    <button 
                      type="button"
                      onClick={async () => {
                        try {
                          const text = await navigator.clipboard.readText();
                          setAiInput(prev => prev + text);
                        } catch (err) {
                          console.error('Failed to read clipboard:', err);
                        }
                      }}
                      className={`p-3 rounded-full transition-colors liquid-glass`}
                      style={{ backgroundColor: `${theme.text}1A`, color: theme.primary }}
                      title="Paste from clipboard"
                    >
                      <Clipboard size={20} />
                    </button>
                    <button 
                      type="submit"
                      disabled={isAILoading || (!aiInput.trim() && !selectedImage)}
                      className={`p-3 rounded-full text-white transition-all disabled:opacity-50 liquid-glass shimmer`}
                      style={{ backgroundColor: theme.primary }}
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </form>
                <div className="flex justify-end px-2">
                  <span className={`text-[10px] font-medium uppercase tracking-wider opacity-50`} style={{ color: theme.primary }}>
                    {aiInput.length} characters
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
