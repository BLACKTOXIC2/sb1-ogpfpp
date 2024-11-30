import React, { useState } from 'react';
import { CheckSquare, Minus, Plus } from 'lucide-react';
import { TrueFalseQuestion, TrueFalseQuizState } from '../types/trueFalse';
import { generateTrueFalseQuestions } from '../services/trueFalseApi';
import QuizForm from '../components/QuizForm';
import TrueFalseGame from '../components/TrueFalse/TrueFalseGame';
import HistoryTabs from '../components/History/HistoryTabs';
import { saveTrueFalseQuizToHistory } from '../utils/storage';

function TrueFalseQuiz() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [numQuestions, setNumQuestions] = useState(5);
  const [quizState, setQuizState] = useState<TrueFalseQuizState>({
    questions: [],
    currentQuestion: 0,
    score: 0,
    isComplete: false,
  });

  const handleQuizSubmit = async (text: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const questions = await generateTrueFalseQuestions(text, numQuestions);
      setQuizState({
        questions,
        currentQuestion: 0,
        score: 0,
        isComplete: false,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (answer: boolean) => {
    const currentQuestion = quizState.questions[quizState.currentQuestion];
    const isCorrect = answer === currentQuestion.isTrue;
    const scoreChange = isCorrect ? 4 : -1;

    const newState = {
      ...quizState,
      score: quizState.score + scoreChange,
      currentQuestion: quizState.currentQuestion + 1,
      isComplete: quizState.currentQuestion + 1 >= quizState.questions.length,
    };

    setQuizState(newState);

    if (newState.isComplete) {
      saveTrueFalseQuizToHistory({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        score: newState.score,
        totalQuestions: quizState.questions.length,
        questions: quizState.questions.map((q, i) => ({
          statement: q.statement,
          userAnswer: i === quizState.currentQuestion ? answer : false,
          correctAnswer: q.isTrue,
          explanation: q.explanation,
          isCorrect: i === quizState.currentQuestion ? isCorrect : false
        }))
      });
    }
  };

  const resetQuiz = () => {
    setQuizState({
      questions: [],
      currentQuestion: 0,
      score: 0,
      isComplete: false,
    });
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <CheckSquare className="w-12 h-12 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-800">True/False Generator</h1>
        </div>
        <p className="text-gray-600">Generate true/false questions from text, images, or videos</p>
      </header>

      <main className="flex flex-col items-center justify-center">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {quizState.questions.length === 0 ? (
          <>
            <div className="w-full max-w-2xl space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Number of questions
                </label>
                <div className="inline-flex items-center space-x-2 bg-white border border-gray-300 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setNumQuestions(prev => Math.max(1, prev - 1))}
                    disabled={numQuestions <= 1}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  
                  <div className="relative w-20">
                    <input
                      type="number"
                      value={numQuestions}
                      onChange={(e) => setNumQuestions(Math.min(10, Math.max(1, Number(e.target.value))))}
                      min="1"
                      max="10"
                      className="w-full py-1 px-2 text-center text-sm font-medium border-0 focus:ring-0"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setNumQuestions(prev => Math.min(10, prev + 1))}
                    disabled={numQuestions >= 10}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="text-xs text-gray-500">Choose between 1-10 questions</div>
              </div>

              <QuizForm 
                onSubmit={handleQuizSubmit} 
                isLoading={isLoading}
              />
            </div>
            <HistoryTabs />
          </>
        ) : (
          <TrueFalseGame
            questions={quizState.questions}
            currentQuestion={quizState.currentQuestion}
            score={quizState.score}
            onAnswer={handleAnswer}
            isComplete={quizState.isComplete}
            onReset={resetQuiz}
          />
        )}
      </main>
    </div>
  );
}

export default TrueFalseQuiz;