import React, { useState, useRef } from 'react';
import { Prediccion } from './utils/prediccion';
import { MessageSquare, Send, Sparkles } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState<Array<{ user: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const [predictions, setPredictions] = useState<string[]>([]);
  const prediccionRef = useRef(new Prediccion());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { user: 'User', content: input };
    setMessages(prev => [...prev, newMessage]);
    prediccionRef.current.addMessage(newMessage.user, newMessage.content);
    setInput('');
    setPredictions([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    if (value.trim()) {
      const newPredictions = prediccionRef.current.getPredictions(value);
      setPredictions(newPredictions);
    } else {
      setPredictions([]);
    }
  };

  const usePrediction = (prediction: string) => {
    setInput(prediction);
    setPredictions([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="bg-indigo-600 p-4 flex items-center gap-2">
          <MessageSquare className="text-white" />
          <h1 className="text-xl font-semibold text-white">Sistema de Predicción</h1>
        </div>
        
        <div className="h-[500px] overflow-y-auto p-4 flex flex-col gap-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.user === 'User' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.user === 'User'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        {predictions.length > 0 && (
          <div className="px-4 py-2 bg-gray-50 flex gap-2 overflow-x-auto">
            {predictions.map((prediction, index) => (
              <button
                key={index}
                onClick={() => usePrediction(prediction)}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm hover:bg-indigo-200 transition-colors"
              >
                <Sparkles size={14} />
                {prediction}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Escribe un mensaje..."
              className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;