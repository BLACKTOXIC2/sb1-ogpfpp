import React, { useState } from 'react';
import { Youtube, Brain, Award } from 'lucide-react';
import { generateQuestionsFromText } from '../services/api';
import { Question, QuizState } from '../types';
import QuizGame from '../components/QuizGame';
import { saveQuizToHistory } from '../utils/storage';
import VideoSummarizer from '../components/Video/VideoSummarizer';
import { VideoSummary } from '../types/video';
import QuestionQuantity from '../components/QuestionControl/QuestionQuantity';
import VideoQuizHistory from '../components/History/VideoQuizHistory';
import { QuizHistoryEntry } from '../types/history';

function VideoQuiz() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoSummary, setVideoSummary] = useState<VideoSummary | null>(null);
  const [numQuestions, setNumQuestions] = useState(5);
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestion: 0,
    score: 0,
    isComplete: false,
  });
  const [selectedQuiz, setSelectedQuiz] = useState<QuizHistoryEntry | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<{
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[]>([]);

  const handleSummaryGenerated = (summary: VideoSummary) => {
    setVideoSummary(summary);
  };

  const handleGenerateQuiz = async () => {
    if (!videoSummary) {
      setError('Please generate a video summary first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const questions = await generateQuestionsFromText(videoSummary.summary, numQuestions);
      setQuizState({
        questions,
        currentQuestion: 0,
        score: 0,
        isComplete: false,
      });
      setAnsweredQuestions([]);
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

    const newAnsweredQuestion = {
      question: currentQuestion.question,
      userAnswer: answer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect
    };

    setAnsweredQuestions(prev => [...prev, newAnsweredQuestion]);

    const newState = {
      ...quizState,
      score: quizState.score + scoreChange,
      currentQuestion: quizState.currentQuestion + 1,
      isComplete: quizState.currentQuestion + 1 >= quizState.questions.length,
    };

    setQuizState(newState);

    if (newState.isComplete && videoSummary) {
      const quizHistory: QuizHistoryEntry = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        score: newState.score,
        totalQuestions: quizState.questions.length,
        type: 'video',
        videoTitle: videoSummary.videoDetails.title,
        videoDetails: videoSummary.videoDetails,
        questions: [...answeredQuestions, newAnsweredQuestion]
      };
      
      saveQuizToHistory(quizHistory);
    }
  };

  const resetQuiz = () => {
    setQuizState({
      questions: [],
      currentQuestion: 0,
      score: 0,
      isComplete: false,
    });
    setVideoSummary(null);
    setError(null);
    setSelectedQuiz(null);
    setAnsweredQuestions([]);
  };

  if (selectedQuiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setSelectedQuiz(null)}
            className="mb-6 text-blue-600 hover:text-blue-700 flex items-center gap-2"
          >
            ← Back to Video Quiz
          </button>
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">{selectedQuiz.videoTitle}</h2>
              <p className="text-gray-600">
                Completed on {new Date(selectedQuiz.date).toLocaleDateString()} at{' '}
                {new Date(selectedQuiz.date).toLocaleTimeString()}
              </p>
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-500" />
                <span className="text-xl font-semibold">
                  Final Score: {selectedQuiz.score} / {selectedQuiz.totalQuestions * 4}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-700">Question Review</h3>
              {selectedQuiz.questions.map((q, idx) => (
                <div key={idx} className={`p-4 rounded-lg ${q.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                  <p className="font-medium text-gray-800 mb-2">
                    Question {idx + 1}: {q.question}
                  </p>
                  <div className="space-y-1">
                    <p className={`${q.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      Your answer: {q.userAnswer || '(No answer)'}
                    </p>
                    {!q.isCorrect && (
                      <p className="text-green-600">
                        Correct answer: {q.correctAnswer}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={resetQuiz}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Start New Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

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

            {videoSummary && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Video Summary</h2>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-700">Video Details:</h3>
                    <p className="text-gray-600">Title: {videoSummary.videoDetails.title}</p>
                    <p className="text-gray-600">Channel: {videoSummary.videoDetails.channelTitle}</p>
                    <p className="text-gray-600">Duration: {videoSummary.videoDetails.duration}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Summary:</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{videoSummary.summary}</p>
                  </div>
                </div>

                <QuestionQuantity 
                  quantity={numQuestions} 
                  onChange={setNumQuestions} 
                />

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

            <div className="mt-8">
              <VideoQuizHistory onSelectQuiz={setSelectedQuiz} />
            </div>
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