import React, { useState } from 'react';
import { Send, AlertCircle, CheckCircle, Loader2, FileText, BarChart3 } from 'lucide-react';
import type { SentimentResult, ApiResponse } from '../types/sentiment';
import { SentimentResults } from './SentimentResults';

export const SentimentAnalyzer: React.FC = () => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Por favor, insira algum texto para análise.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/sentiment-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          language: 'pt'
        }),
      });

      const data: ApiResponse = await response.json();

      if (data.success && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || 'Erro desconhecido na análise');
      }
    } catch (err) {
      setError('Erro de conexão. Verifique a sua ligação à Internet.');
      console.error('Erro na análise:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    setText('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Análise de Sentimentos Azure AI
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Teste a análise de sentimentos do Azure AI inserindo texto ou frases. 
            Obtenha análises detalhadas de cada frase e do sentimento geral.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-white" />
                <h2 className="text-xl font-semibold text-white">Inserir Texto</h2>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6">
                <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
                  Texto para análise
                </label>
                <textarea
                  id="text-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Insira aqui o texto que deseja analisar... Por exemplo: 'O atendimento foi excelente, mas a comida estava fria.'"
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none text-gray-900 placeholder-gray-500"
                  disabled={isLoading}
                />
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {text.length} caracteres
                  </span>
                  {text.length > 0 && (
                    <button
                      type="button"
                      onClick={clearAll}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Limpar tudo
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading || !text.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 group"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>A analisar...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      <span>Analisar Sentimento</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Erro na Análise</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-green-800">
                Análise concluída com sucesso!
              </span>
            </div>
          )}

          {/* Results Display */}
          {result && <SentimentResults result={result} />}
        </div>
      </div>
    </div>
  );
};