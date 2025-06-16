import React from 'react';
import { TrendingUp, TrendingDown, Minus, Target, MessageSquare } from 'lucide-react';
import type { SentimentResult, SentimentConfidenceScores } from '../types/sentiment';

interface Props {
  result: SentimentResult;
}

const getSentimentColor = (sentiment: string) => {
  switch (sentiment.toLowerCase()) {
    case 'positive':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'negative':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'neutral':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getSentimentIcon = (sentiment: string) => {
  switch (sentiment.toLowerCase()) {
    case 'positive':
      return <TrendingUp className="w-4 h-4" />;
    case 'negative':
      return <TrendingDown className="w-4 h-4" />;
    case 'neutral':
      return <Minus className="w-4 h-4" />;
    default:
      return <Minus className="w-4 h-4" />;
  }
};

const translateSentiment = (sentiment: string): string => {
  switch (sentiment.toLowerCase()) {
    case 'positive':
      return 'Positivo';
    case 'negative':
      return 'Negativo';
    case 'neutral':
      return 'Neutro';
    default:
      return sentiment;
  }
};

const ConfidenceBar: React.FC<{ scores: SentimentConfidenceScores }> = ({ scores }) => {
  const total = scores.positive + scores.neutral + scores.negative;
  const positiveWidth = (scores.positive / total) * 100;
  const neutralWidth = (scores.neutral / total) * 100;
  const negativeWidth = (scores.negative / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex h-3 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="bg-green-500" 
          style={{ width: `${positiveWidth}%` }}
        />
        <div 
          className="bg-yellow-500" 
          style={{ width: `${neutralWidth}%` }}
        />
        <div 
          className="bg-red-500" 
          style={{ width: `${negativeWidth}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-600">
        <span>Positivo: {(scores.positive * 100).toFixed(1)}%</span>
        <span>Neutro: {(scores.neutral * 100).toFixed(1)}%</span>
        <span>Negativo: {(scores.negative * 100).toFixed(1)}%</span>
      </div>
    </div>
  );
};

export const SentimentResults: React.FC<Props> = ({ result }) => {
  return (
    <div className="space-y-6">
      {/* Overall Sentiment */}
      <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
        <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Sentimento Geral</span>
          </h2>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-full border ${getSentimentColor(result.overallSentiment)}`}>
              {getSentimentIcon(result.overallSentiment)}
              <span className="font-semibold">
                {translateSentiment(result.overallSentiment)}
              </span>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-gray-800 italic">"{result.documentText}"</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Distribuição de Confiança</h3>
            <ConfidenceBar scores={result.confidenceScores} />
          </div>
        </div>
      </div>

      {/* Sentence Analysis */}
      <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
        <div className="bg-linear-to-r from-blue-600 to-cyan-600 px-6 py-4">
          <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Análise por Frase</span>
          </h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {result.sentences.map((sentence, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-gray-800 mb-2">"{sentence.text}"</p>
                    <div className={`inline-flex items-center space-x-2 px-2 py-1 rounded-full border text-sm ${getSentimentColor(sentence.sentiment)}`}>
                      {getSentimentIcon(sentence.sentiment)}
                      <span className="font-medium">
                        {translateSentiment(sentence.sentiment)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <ConfidenceBar scores={sentence.confidenceScores} />
                </div>

                {/* Opinions Mining */}
                {sentence.opinions && sentence.opinions.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Opiniões Identificadas</h4>
                    <div className="space-y-2">
                      {sentence.opinions.map((opinion, opIndex) => (
                        <div key={opIndex} className="bg-gray-50 rounded-sm p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-gray-700">Alvo:</span>
                            <span className="text-sm text-gray-900">"{opinion.target.text}"</span>
                            <span className={`px-2 py-1 rounded-sm text-xs ${getSentimentColor(opinion.target.sentiment)}`}>
                              {translateSentiment(opinion.target.sentiment)}
                            </span>
                          </div>
                          {opinion.assessments.length > 0 && (
                            <div>
                              <span className="text-sm font-medium text-gray-700">Avaliações:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {opinion.assessments.map((assessment, assIndex) => (
                                  <span 
                                    key={assIndex}
                                    className={`px-2 py-1 rounded-sm text-xs ${getSentimentColor(assessment.sentiment)}`}
                                  >
                                    "{assessment.text}" ({translateSentiment(assessment.sentiment)})
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};