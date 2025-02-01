"use client"
interface Option {
    id: number;
    description: string;
    is_correct: boolean;
    photo_url: string | null;
    question_id: number;
    unanswered: boolean;
  }
  
  interface Question {
    id: number;
    description: string;
    is_mandatory: boolean;
    type: string;
    topic: string;
    topic_id: number;
    detailed_solution: string;
    options: Option[];
  }
  
  interface QuizData {
    id: number;
    name: string | null;
    description: string;
    questions: Question[];
    daily_date: string;
    correct_answer_marks: string;
    negative_marks: string;
  }
  
  import React, { useState, useEffect } from 'react';
  import { Card } from '@/components/ui/card';
  
  const QuestionList: React.FC = () => {
    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
        const fetchQuizData = async () => {
          try {
            const response = await fetch("/currentQuiz.json");
            const data = await response.json();
            console.log("Parsed data:", data);
      
            if (!data.quiz || !Array.isArray(data.quiz.questions)) {
              throw new Error("Invalid data: 'quiz' or 'questions' is missing or not an array");
            }
      
            setQuizData(data.quiz); 
            setLoading(false);
          } catch (err) {
            console.error("Detailed error:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch quiz data");
            setLoading(false);
          }
        };
      
        fetchQuizData();
      }, []);      
  
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg">Loading quiz data...</div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-red-500">Error: {error}</div>
        </div>
      );
    }
  
    if (!quizData) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg">No quiz data available</div>
        </div>
      );
    }
  
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Questions List</h1>
          <div className="text-sm text-gray-500 space-y-1">
            <div>Date: {quizData.daily_date}</div>
            <div>Marks per question: {quizData.correct_answer_marks}</div>
            <div>Negative marks: {quizData.negative_marks}</div>
          </div>
        </div>
  
        {quizData?.questions?.map((question, index) => (
          <Card key={question.id} className="p-4 hover:bg-gray-50">
            <div className="space-y-4">
              {/* Question Header */}
              <div className="flex items-start gap-2">
                <span className="font-medium text-gray-600 min-w-[2rem]">
                  Q{index + 1}.
                </span>
                <h2 className="font-medium">{question.description}</h2>
              </div>
  
              {/* Question Details */}
              <div className="flex flex-wrap gap-2 text-sm text-gray-600 ml-8">
                <span className="bg-blue-100 px-2 py-1 rounded">
                  Topic: {question.topic}
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded">
                  Mandatory: {question.is_mandatory ? 'Yes' : 'No'}
                </span>
                {question.type && (
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    Type: {question.type}
                  </span>
                )}
              </div>
  
             
              <div className="ml-8 space-y-2">
                {question.options.map((option, optIndex) => (
                  <div 
                    key={option.id} 
                    className={`p-2 rounded ${
                      option.is_correct ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                    }`}
                  >
                    {String.fromCharCode(65 + optIndex)}. {option.description}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };
  
  export default QuestionList;