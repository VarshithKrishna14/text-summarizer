'use client'

import { useState } from "react"

interface SummarizerState {
  inputText: string,
  summary: string,
  isLoading: boolean;
}

const Home: React.FC = () => {
  const [state, setState] = useState<SummarizerState>({
    inputText: '',
    summary: '',
    isLoading: false
  });

  const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState({ ...state, isLoading: true });
    try {
      const response = await fetch('/api/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputText: state.inputText })
      });

      const data = await response.json();
      setState({ ...state, summary: data.summary, isLoading: false });

    } catch (error) {
      console.error(error);
      setState({ ...state, isLoading: false })
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState({ ...state, inputText: e.target.value })
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Briefly:Text Summarizer</h1>
        <form onSubmit={handlesubmit} className="space-y-6">
          <textarea
            className="w-full p-4 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={8}
            value={state.inputText}
            onChange={handleInputChange}
            placeholder="Paste your text here..."
          />
          <div className="text-center">
            <button
              type="submit"
              className={`px-6 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 transition duration-300 ${state.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={state.isLoading}
            >
              {state.isLoading ? 'Summarizing...' : 'Generate Summary'}
            </button>
          </div>
        </form>

        {state.summary && (
          <div className="mt-8 p-4 bg-gray-700 rounded-md">
            <h2 className="text-2xl font-semibold">Summary:</h2>
            <p className="mt-2 text-gray-100 ">
              {state.summary}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
