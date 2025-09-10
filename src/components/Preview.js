import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Preview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { original, translation } = location.state || {};

  if (!original || !translation) {
    return <div className="text-center">無預覽內容，請從發洩頁面開始。</div>;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(translation);
    alert('建議已複製到剪貼簿！');
  };

  const handleSave = () => {
    const entry = {
      date: new Date().toLocaleString('zh-TW'),
      original,
      translation,
    };
    let history = JSON.parse(localStorage.getItem('ventHistory') || '[]');
    history.unshift(entry); // Add to beginning for newest first
    localStorage.setItem('ventHistory', JSON.stringify(history));
    alert('已儲存到歷史紀錄');
    navigate('/history');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">AI 轉譯結果預覽</h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-red-100 p-4 rounded border">
          <h3 className="font-semibold mb-2 text-red-800">你的原話</h3>
          <p className="whitespace-pre-wrap">{original}</p>
        </div>
        <div className="bg-green-100 p-4 rounded border">
          <h3 className="font-semibold mb-2 text-green-800">AI 溫和建議訊息</h3>
          <p className="whitespace-pre-wrap">{translation}</p>
        </div>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleCopy}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          複製建議
        </button>
        <button
          onClick={handleSave}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          儲存歷史
        </button>
        <button
          onClick={() => navigate('/vent')}
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
        >
          再發洩一次
        </button>
      </div>
    </div>
  );
};

export default Preview;