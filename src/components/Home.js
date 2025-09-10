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
      <div className="max-w-md mx-auto py-12">
        <h2 className="text-2xl font-bold mb-4 text-center">設定 OpenRouter API Key</h2>
        <form onSubmit={handleKeySubmit} className="space-y-4">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="輸入你的 OpenRouter API Key"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            儲存
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-4 text-center">
          取得 API Key: <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">openrouter.ai/keys</a>
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <h2 className="text-3xl font-bold mb-4">歡迎來到罵完再說</h2>
      <p className="mb-8 text-gray-600">情緒發洩，智慧溝通</p>
      <div className="space-y-4">
        <Link
          to="/vent"
          className="block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          開始發洩
        </Link>
        <Link
          to="/history"
          className="block bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
        >
          查看歷史
        </Link>
      </div>
      <button
        onClick={() => setShowKeyInput(true)}
        className="mt-8 text-sm text-blue-500 underline"
      >
        變更 API Key
      </button>
    </div>
  );
};

export default Home;