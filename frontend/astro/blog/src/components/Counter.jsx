import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter-container">
      <h2>React 计数器</h2>
      <p>当前计数: {count}</p>
      <div className="button-group">
        <button onClick={() => setCount(count - 1)}>减少</button>
        <button onClick={() => setCount(count + 1)}>增加</button>
      </div>
      <style jsx>{`
        .counter-container {
          border: 2px solid #4f46e5;
          border-radius: 8px;
          padding: 16px;
          margin: 20px 0;
          background-color: #f8fafc;
        }
        .button-group {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }
        button {
          background-color: #4f46e5;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        button:hover {
          background-color: #4338ca;
        }
      `}</style>
    </div>
  );
}