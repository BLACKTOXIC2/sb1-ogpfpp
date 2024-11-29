import React, { useState } from 'react';
import { Youtube, Brain } from 'lucide-react';
import { generateQuestionsFromText } from '../services/api';
import { Question, QuizState } from '../types';
import QuizGame from '../components/QuizGame';
import { saveQuizToHistory } from '../utils/storage';
import VideoSummarizer from '../components/Video/VideoSummarizer';

function VideoQuiz() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestion: 0,
    score: 0,
    isComplete: false,
  });

  const handleSummaryGenerated = (videoSummary: string) => {
    setSummary(videoSummary);
  };

  const handleGenerateQuiz = async () => {
    if (!summary) {
      setError('Please generate a video summary first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const questions = await generateQuestionsFromText(summary, 5);
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

  const handleAnswer = (answer: string) => {
    const currentQuestion = quizState.questions[quizState.currentQuestion];
    const isCorrect = answer === currentQuestion.correctAnswer;
    const scoreChange = isCorrect ? 4 : -1;

    const newState = {
      ...quizState,
      score: quizState.score + scoreChange,
      currentQuestion: quizState.currentQuestion + 1,
      isComplete: quizState.currentQuestion + 1 >= quizState.questions.length,
    };

    setQuizState(newState);

    if (newState.isComplete) {
      saveQuizToHistory({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        score: newState.score,
        totalQuestions: quizState.questions.length,
        questions: quizState.questions.map((q, i) => ({
          question: q.question,
          userAnswer: i === quizState.currentQuestion ? answer : '',
          correctAnswer: q.correctAnswer,
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
    setSummary('');
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Youtube className="w-12 h-12 text-red-600" />
          <h1 className="text-4xl font-bold text-gray-800">Video MCQ Generator</h1>
        </div>
        <p className="text-gray-600">Generate MCQs from YouTube video content</p>
      </header>

      <main className="flex flex-col items-center justify-center">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {quizState.questions.length === 0 ? (
          <div className="w-full max-w-2xl space-y-6">
            <VideoSummarizer 
              onSummaryGenerated={handleSummaryGenerated}
              isLoading={isLoading}
            />

            {summary && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Video Summary</h2>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <p className="text-gray-700 whitespace-pre-wrap">{summary}</p>
                </div>
                <button
                  onClick={handleGenerateQuiz}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  <Brain className="w-6 h-6" />
                  Generate MCQ from Summary
                </button>
              </div>
            )}
          </div>
        ) : (
          <QuizGame
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

export default VideoQuiz;