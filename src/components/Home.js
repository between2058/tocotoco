import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('openrouter_api_key');
    if (savedKey) {
      setShowKeyInput(false);
    } else {
      setShowKeyInput(true);
    }
  }, []);

  const handleKeySubmit = (e) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('openrouter_api_key', apiKey.trim());
      alert('API Key 已設定！');
      setShowKeyInput(false);
    }
  };

  if (showKeyInput) {
    return (
      <div className="max-w-md mx-auto py-12 bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-rose-200">
        <h2 className="text-2xl font-bold mb-4 text-center text-rose-600">💖 設定 OpenRouter API Key 💖</h2>
        <form onSubmit={handleKeySubmit} className="space-y-4">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="輸入你的 OpenRouter API Key"
            className="w-full p-3 border border-lavender-300 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-sky-400 bg-pink-50"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-rose-400 to-pink-400 text-white py-3 rounded-lg hover:from-rose-500 hover:to-pink-500 font-medium shadow-md transition-all"
          >
            💾 儲存
          </button>
        </form>
        <p className="text-xs text-gray-600 mt-4 text-center">
          取得 API Key: <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-sky-500 underline hover:text-sky-600">openrouter.ai/keys</a>
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-lavender-200">
      <h2 className="text-3xl font-bold mb-4 text-gradient bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">💕 歡迎來到罵完再說 💕</h2>
      <p className="mb-8 text-lavender-600 text-lg">情緒發洩，智慧溝通</p>
      <div className="space-y-4 max-w-md mx-auto">
        <Link
          to="/vent"
          className="block bg-gradient-to-r from-sky-400 to-lavender-400 text-white py-3 px-6 rounded-lg hover:from-sky-500 hover:to-lavender-500 font-medium shadow-lg transition-all transform hover:scale-105"
        >
          💬 開始發洩
        </Link>
        <Link
          to="/history"
          className="block bg-gradient-to-r from-rose-300 to-pink-300 text-rose-800 py-3 px-6 rounded-lg hover:from-rose-400 hover:to-pink-400 font-medium shadow-lg transition-all transform hover:scale-105"
        >
          📚 查看歷史
        </Link>
      </div>
      <button
        onClick={() => setShowKeyInput(true)}
        className="mt-8 text-sm text-sky-500 underline hover:text-sky-600 transition-colors"
      >
        🔑 變更 API Key
      </button>
    </div>
  );
};

export default Home;