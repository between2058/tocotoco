import React, { useState, useEffect } from 'react';

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('ventHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">歷史紀錄中心</h2>
        <p className="text-gray-600">沒有紀錄，開始發洩吧！</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">歷史紀錄中心</h2>
      <div className="space-y-4">
        {history.map((entry, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded border">
            <h3 className="font-semibold mb-2">日期: {entry.date}</h3>
            <p className="text-sm text-gray-600 mb-2">原話: {entry.original.substring(0, 50)}...</p>
            <p className="text-sm text-green-600">建議: {entry.translation.substring(0, 50)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;