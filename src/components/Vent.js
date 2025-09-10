import React, { useState, useRef, useEffect } from 'react';
import OpenAI from 'openai';

const Vent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userContent = input;
    const userMessage = { role: 'user', content: userContent };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const apiKey = localStorage.getItem('openrouter_api_key');
    if (!apiKey) {
      alert('請先設定 OpenRouter API Key');
      setLoading(false);
      return;
    }

    const tempAssistantMessage = { 
      role: 'assistant', 
      content: 'AI 正在承受你的攻擊，並且努力轉換中...', 
      loading: true 
    };
    setMessages(prev => [...prev, tempAssistantMessage]);

    const openai = new OpenAI({
      apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
      dangerouslyAllowBrowser: true,
    });

    try {
      const apiMessages = [
        {
          role: 'system',
          content: '你是一位情侶溝通專家。請將用戶的訊息轉譯成更溫和、建設性的表達方式。只回傳轉譯後的版本，不要添加額外建議、回應或解釋。保持原意，聚焦改善溝通。不用太冗長。',
        },
        ...newMessages.map(m => ({ role: m.role, content: m.content })),
      ];

      const completion = await openai.chat.completions.create({
        model: 'openrouter/sonoma-sky-alpha',
        messages: apiMessages,
      });

      const response = completion.choices[0].message.content;

      setMessages(prev => {
        const updated = prev.slice(0, -1);
        const assistant = { 
          role: 'assistant', 
          content: response, 
          pairedUser: userContent 
        };
        return [...updated, assistant];
      });
    } catch (error) {
      console.error(error);
      setMessages(prev => {
        const updated = prev.slice(0, -1);
        const assistant = { 
          role: 'assistant', 
          content: '轉譯失敗，請檢查 API Key', 
          pairedUser: userContent 
        };
        return [...updated, assistant];
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('建議已複製到剪貼簿！');
  };

  const handleSave = (original, translation) => {
    const entry = {
      date: new Date().toLocaleString('zh-TW'),
      original,
      translation,
    };
    let history = JSON.parse(localStorage.getItem('ventHistory') || '[]');
    history.unshift(entry);
    localStorage.setItem('ventHistory', JSON.stringify(history));
    alert('已儲存到歷史紀錄');
  };

  return (
    <div className="h-screen flex flex-col max-w-4xl mx-auto bg-gradient-to-br from-pink-50 to-lavender-50">
      <div className="p-4 bg-gradient-to-r from-rose-400 to-lavender-400 border-b shadow-lg">
        <h2 className="text-xl font-bold text-white">💕 情緒發洩區 - 與 AI 聊天 💕</h2>
      </div>
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 relative"
        style={{
          backgroundImage: "url('cute-man-woman-have-fight-quarrel-angry-offended-girl-cross-hands-brown-background-conflict-divorce-80807469.jpg-2.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>
        <div className="relative z-10">
          {messages.length === 0 && (
            <div className="text-center text-lavender-600 py-12">
              <p className="text-lg font-medium">💖 開始發洩你的情緒</p>
              <p className="mt-2 text-rose-500">像傳訊息一樣告訴 AI...</p>
            </div>
          )}
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`p-4 rounded-lg shadow-md ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-sky-400 to-lavender-400 text-white ml-4 rounded-br-sm'
                    : 'bg-gradient-to-r from-pink-100 to-rose-100 text-gray-800 mr-4 rounded-bl-sm border border-sky-200'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  {message.role === 'assistant' && !message.loading && message.pairedUser && (
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-lavender-200">
                      <button
                        onClick={() => handleCopy(message.content)}
                        className="text-xs bg-sky-100 hover:bg-sky-200 text-sky-600 px-3 py-1 rounded font-medium transition-colors"
                      >
                        📋 複製
                      </button>
                      <button
                        onClick={() => handleSave(message.pairedUser, message.content)}
                        className="text-xs bg-rose-100 hover:bg-rose-200 text-rose-600 px-3 py-1 rounded font-medium transition-colors"
                      >
                        💾 儲存
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 bg-gradient-to-r from-white to-pink-50 border-t shadow-sm">
        <div className="flex space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="把你的情緒告訴 AI... 💭"
            className="flex-1 p-3 border border-lavender-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 bg-white/50"
            rows="1"
            disabled={loading}
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className={`flex-shrink-0 px-4 py-3 rounded-lg text-white font-medium ${
              loading || !input.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-sky-500 to-lavender-500 hover:from-sky-600 hover:to-lavender-600'
            } transition-all`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                發送中...
              </span>
            ) : (
              '💬 發送'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Vent;