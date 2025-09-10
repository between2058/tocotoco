import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OpenAI from 'openai';

const Vent = () => {
  const [ventText, setVentText] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const apiKey = localStorage.getItem('openrouter_api_key');
    if (!apiKey) {
      alert('請先設定 OpenRouter API Key');
      setLoading(false);
      return;
    }

    const openai = new OpenAI({
      apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
      dangerouslyAllowBrowser: true,
    });

    try {
      const completion = await openai.chat.completions.create({
        model: 'openrouter/sonoma-sky-alpha',
        messages: [
          {
            role: 'system',
            content: '你是一位情侶溝通專家。將用戶的情緒發洩轉化成有建設性、溫和的改善建議。保持正面、聚焦改善，100字以內。',
          },
          { role: 'user', content: ventText },
        ],
      });
      const translation = completion.choices[0].message.content;
      navigate('/preview', { state: { original: ventText, translation } });
    } catch (error) {
      console.error(error);
      alert('轉譯失敗，請檢查 API Key');
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">情緒發洩區</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={ventText}
          onChange={(e) => setVentText(e.target.value)}
          placeholder="把你的情緒告訴我..."
          className="w-full h-64 p-4 border border-gray-300 rounded resize-none mb-4"
          required
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className={`py-2 px-4 rounded ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'} text-white`}
        >
          {loading ? '轉譯中...' : '發洩完畢，讓AI幫忙'}
        </button>
      </form>
    </div>
  );
};

export default Vent;