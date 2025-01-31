"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface QuizSubmission {
  accuracy: string;
  better_than: number;
  correct_answers: number;
  duration: string;
  final_score: string;
  incorrect_answers: number;
  initial_mistake_count: number;
  mistakes_corrected: number;
  negative_score: string;
  rank_text: string;
  response_map: Record<string, number>;
  speed: string;
  total_questions: number;
  trophy_level: number;
}

interface Quiz {
  id: number;
  correct_answer_marks: string;
  negative_marks: string;
  duration: number;
  title: string;
  daily_date: string;
  topic: string;
  questions_count: number;
}

interface PerformanceTrendPoint {
  metric: string;
  value: number;
}

interface OverallStats {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: string;
  finalScore: string;
  duration: string;
  speed: string;
  mistakesCorrected: number;
  rank: string;
  betterThan: number;
}

interface AnalysisData {
  overallStats: OverallStats;
  performanceMetrics: PerformanceTrendPoint[];
}

interface DashboardProps {
  quizData?: Quiz;
  submissionData?: QuizSubmission;
}

const RankPredictionDashboard: React.FC<DashboardProps> = () => {
  const [quizData, setQuizData] = useState<Quiz | null>(null);
  const [submissionData, setSubmissionData] = useState<QuizSubmission | null>(
    null
  );
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuizData = async () => {
    try {
      const response = await fetch("/currentQuiz.json");
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);
      const data = await response.json();
      console.log("Parsed data:", data);
      setQuizData(data);
    } catch (err) {
      console.error("Detailed error:", err);
    }
  };

  const fetchSubmissionData = async () => {
    try {
      const response = await fetch("/historicalSubmissions.json");
      const data = await response.json();

      // Select the most recent submission
      const latestSubmission = data[0]; // Assumes data is sorted by created_at

      console.log("Latest Submission:", latestSubmission);
      setSubmissionData(latestSubmission);
    } catch (err) {
      console.error("Error fetching submission data:", err);
      setError("Failed to fetch submission data");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchQuizData();
      await fetchSubmissionData();
    };

    fetchData();
  }, []);

  const calculateOverallStats = useCallback(
    (quiz?: Quiz, submission?: QuizSubmission): OverallStats | null => {
      if (!quiz || !submission) {
        return null;
      }

      try {
        return {
          totalQuestions: submission.total_questions || quiz.questions_count,
          correctAnswers: submission.correct_answers || 0,
          incorrectAnswers: submission.incorrect_answers || 0,
          accuracy: submission.accuracy || "0 %",
          finalScore: submission.final_score || "0.0",
          duration: submission.duration || "0:00",
          speed: `${submission.speed || "0"}%`,
          mistakesCorrected: submission.mistakes_corrected || 0,
          rank: submission.rank_text || "N/A",
          betterThan: submission.better_than || 0,
        };
      } catch (err) {
        console.error("Error calculating stats:", err);
        return null;
      }
    },
    []
  );

  const generatePerformanceMetrics = useCallback(
    (submission?: QuizSubmission): PerformanceTrendPoint[] => {
      if (!submission) return [];

      try {
        return [
          { metric: "Accuracy", value: parseFloat(submission.accuracy) || 0 },
          { metric: "Score", value: parseFloat(submission.final_score) || 0 },
          { metric: "Speed", value: parseFloat(submission.speed) || 0 },
          {
            metric: "Initial Mistakes",
            value: submission.initial_mistake_count || 0,
          },
          {
            metric: "Mistakes Corrected",
            value: submission.mistakes_corrected || 0,
          },
        ];
      } catch (err) {
        console.error("Error generating metrics:", err);
        return [];
      }
    },
    []
  );

  const analyzeQuizData = useCallback(() => {
    try {
      if (!quizData || !submissionData) {
        throw new Error("Quiz or submission data is missing");
      }

      const stats = calculateOverallStats(quizData, submissionData);
      if (!stats) {
        throw new Error("Failed to calculate statistics");
      }

      const metrics = generatePerformanceMetrics(submissionData);

      setAnalysisData({
        overallStats: stats,
        performanceMetrics: metrics,
      });
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while analyzing data"
      );
    } finally {
      setLoading(false);
    }
  }, [
    quizData,
    submissionData,
    calculateOverallStats,
    generatePerformanceMetrics,
  ]);

  useEffect(() => {
    if (quizData && submissionData) {
      analyzeQuizData();
    }
  }, [quizData, submissionData, analyzeQuizData]);

  if (loading) {
    return <div className="p-4">Loading analysis...</div>;
  }

  if (error || !analysisData) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>
          {error || "Unable to load analysis data"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {quizData?.title || "Quiz Analysis"} - {quizData?.daily_date}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Performance Summary
              </h3>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span>Total Questions:</span>
                  <span className="font-medium">
                    {analysisData.overallStats.totalQuestions}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Correct Answers:</span>
                  <span className="font-medium text-green-600">
                    {analysisData.overallStats.correctAnswers}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Incorrect Answers:</span>
                  <span className="font-medium text-red-600">
                    {analysisData.overallStats.incorrectAnswers}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Accuracy:</span>
                  <span className="font-medium">
                    {analysisData.overallStats.accuracy}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Final Score:</span>
                  <span className="font-medium">
                    {analysisData.overallStats.finalScore}
                  </span>
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Additional Metrics</h3>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">
                    {analysisData.overallStats.duration}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Speed:</span>
                  <span className="font-medium">
                    {analysisData.overallStats.speed}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Mistakes Corrected:</span>
                  <span className="font-medium">
                    {analysisData.overallStats.mistakesCorrected}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Rank:</span>
                  <span className="font-medium">
                    {analysisData.overallStats.rank}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Better Than:</span>
                  <span className="font-medium">
                    {analysisData.overallStats.betterThan} students
                  </span>
                </p>
              </div>
            </div>
          </div>

          {analysisData.performanceMetrics.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">
                Performance Metrics
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analysisData.performanceMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#8884d8"
                      name="Value"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
         

          {parseFloat(analysisData.overallStats.accuracy) < 70 && (
            <Alert className="mt-6">
              <AlertDescription>
                <strong>Areas for Improvement:</strong>
                <ul className="mt-2 list-disc pl-4">
                  <li>
                    Work on improving accuracy (currently{" "}
                    {analysisData.overallStats.accuracy})
                  </li>
                  <li>
                    Focus on mistake correction (corrected{" "}
                    {analysisData.overallStats.mistakesCorrected} mistakes)
                  </li>
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RankPredictionDashboard;
