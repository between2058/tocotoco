import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OpenAI from 'openai';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loveTeacherAnalyses, setLoveTeacherAnalyses] = useState({});
  const [zhangAilingAnalyses, setZhangAilingAnalyses] = useState({});
  const [loading, setLoading] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('ventHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const getApiKey = () => localStorage.getItem('openrouter_api_key');

  const callLLM = async (index, prompt, setAnalysis) => {
    if (!getApiKey()) {
      alert('請先設定 OpenRouter API Key');
      return;
    }

    setLoading(prev => ({ ...prev, [index]: prompt.includes('愛情小老師') ? 'loveTeacher' : 'zhangAiling' }));

    const openai = new OpenAI({
      apiKey: getApiKey(),
      baseURL: 'https://openrouter.ai/api/v1',
      dangerouslyAllowBrowser: true,
    });

    try {
      const completion = await openai.chat.completions.create({
        model: 'openrouter/sonoma-sky-alpha',
        messages: [
          {
            role: 'system',
            content: prompt,
          },
          {
            role: 'user',
            content: `原話: ${history[index].original}\n建議: ${history[index].translation}`,
          },
        ],
      });

      const response = completion.choices[0].message.content;
      setAnalysis(prev => ({ ...prev, [index]: response }));
    } catch (error) {
      console.error(error);
      setAnalysis(prev => ({ ...prev, [index]: '分析失敗，請檢查 API Key' }));
    } finally {
      setLoading(prev => ({ ...prev, [index]: null }));
    }
  };

  const handleLoveTeacher = (index) => {
    if (loveTeacherAnalyses[index]) return;
    const prompt = '你是一位愛情小老師。分析這段情緒發洩和建議的盲點，給予感情關係建議，並給一個總體愛意分數（滿分10分）。回應格式: 盲點: ... 建議: ... 愛意分數: X/10';
    callLLM(index, prompt, setLoveTeacherAnalyses);
  };

  const handleZhangAiling = (index) => {
    if (zhangAilingAnalyses[index]) return;
    const prompt = '你就是張愛玲。以第一人稱直接發言分析這段情緒發洩對話，像在寫散文般優雅而尖銳，引用你的所有作品的具體片段結合評語。保持詩意與諷刺，不用太冗長。必須包含建議。回應格式: 盲點: ... 建議: ...';
    callLLM(index, prompt, setZhangAilingAnalyses);
  };

  const toggleDropdown = (type, index) => {
    if (type === 'loveTeacher') {
      setLoveTeacherAnalyses(prev => ({ ...prev, [index]: prev[index] ? null : '' }));
    } else {
      setZhangAilingAnalyses(prev => ({ ...prev, [index]: prev[index] ? null : '' }));
    }
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-12 bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-sky-200">
        <h2 className="text-2xl font-bold mb-4 text-lavender-600">📚 歷史紀錄中心</h2>
        <p className="text-rose-500 text-lg">沒有紀錄，開始發洩吧！💕</p>
        <Link to="/vent" className="mt-6 inline-block bg-gradient-to-r from-pink-400 to-rose-400 text-white py-2 px-4 rounded-lg hover:from-pink-500 hover:to-rose-500 transition-all">
          💬 去發洩
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-lavender-200">
      <h2 className="text-2xl font-bold mb-6 text-sky-600">📚 歷史紀錄中心</h2>
      <div className="space-y-4">
        {history.map((entry, index) => (
          <div key={index} className="bg-gradient-to-r from-lavender-50 to-pink-50 p-4 rounded-lg border border-rose-200 shadow-sm">
            <h3 className="font-semibold mb-2 text-rose-600">💌 日期: {entry.date}</h3>
            <p className="text-sm text-lavender-700 mb-2">原話: {entry.original.substring(0, 50)}...</p>
            <p className="text-sm text-sky-600 font-medium">建議: {entry.translation.substring(0, 50)}...</p>
            <div className="flex space-x-2 mt-3">
              <button
                onClick={() => handleLoveTeacher(index)}
                disabled={loading[index] === 'loveTeacher'}
                className="text-xs bg-gradient-to-r from-sky-100 to-lavender-100 text-sky-600 px-3 py-1 rounded hover:bg-sky-200 disabled:opacity-50 transition-colors"
              >
                {loading[index] === 'loveTeacher' ? '分析中...' : '👩‍🏫❤️ 愛情小老師'}
              </button>
              <button
                onClick={() => handleZhangAiling(index)}
                disabled={loading[index] === 'zhangAiling'}
                className="text-xs bg-gradient-to-r from-rose-100 to-pink-100 text-rose-600 px-3 py-1 rounded hover:bg-rose-200 disabled:opacity-50 transition-colors"
              >
                {loading[index] === 'zhangAiling' ? '分析中...' : '📖 張愛玲專家評語'}
              </button>
            </div>
            {loveTeacherAnalyses[index] && (
              <div className="mt-3">
                <button
                  onClick={() => toggleDropdown('loveTeacher', index)}
                  className="text-xs text-sky-600 underline mb-1"
                >
                  {loveTeacherAnalyses[index] === '' ? '展開愛情小老師分析' : '收起愛情小老師分析'}
                </button>
                {loveTeacherAnalyses[index] !== '' && (
                  <div className="text-xs text-gray-700 p-2 bg-sky-50 rounded border border-sky-200 whitespace-pre-wrap">
                    {loveTeacherAnalyses[index]}
                  </div>
                )}
              </div>
            )}
            {zhangAilingAnalyses[index] && (
              <div className="mt-3">
                <button
                  onClick={() => toggleDropdown('zhangAiling', index)}
                  className="text-xs text-rose-600 underline mb-1"
                >
                  {zhangAilingAnalyses[index] === '' ? '展開張愛玲專家評語' : '收起張愛玲專家評語'}
                </button>
                {zhangAilingAnalyses[index] !== '' && (
                  <div className="text-xs text-gray-700 p-2 bg-rose-50 rounded border border-rose-200 whitespace-pre-wrap">
                    {zhangAilingAnalyses[index]}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;