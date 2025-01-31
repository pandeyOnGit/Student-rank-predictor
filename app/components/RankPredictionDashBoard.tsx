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

const RankPredictionDashboard: React.FC = () => {
  const [submissionData, setSubmissionData] = useState<QuizSubmission | null>(
    null
  );
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissionData = async () => {
    try {
      const response = await fetch("/historicalSubmissions.json");
      const data = await response.json();
      setSubmissionData(data[0]);
    } catch (err) {
      console.error("Error fetching submission data:", err);
      setError("Failed to fetch submission data");
    }
  };

  useEffect(() => {
    fetchSubmissionData().then(() => setLoading(false));
  }, []);

  const calculateOverallStats = useCallback(
    (submission: QuizSubmission): OverallStats => {
      return {
        totalQuestions: submission.total_questions,
        correctAnswers: submission.correct_answers,
        incorrectAnswers: submission.incorrect_answers,
        accuracy: submission.accuracy || "0 %",
        finalScore: submission.final_score || "0.0",
        duration: submission.duration || "0:00",
        speed: `${submission.speed || "0"}%`,
        mistakesCorrected: submission.mistakes_corrected || 0,
        rank: submission.rank_text || "N/A",
        betterThan: submission.better_than || 0,
      };
    },
    []
  );

  const generatePerformanceMetrics = useCallback(
    (submission: QuizSubmission): PerformanceTrendPoint[] => {
      return [
        { metric: "Accuracy", value: parseFloat(submission.accuracy) || 0 },
        { metric: "Score", value: parseFloat(submission.final_score) || 0 },
        { metric: "Speed", value: parseFloat(submission.speed) || 0 },
        {
          metric: "Initial Mistakes",
          value: submission.initial_mistake_count || 0,
        },
      ];
    },
    []
  );

  useEffect(() => {
    if (submissionData) {
      try {
        const stats = calculateOverallStats(submissionData);
        const metrics = generatePerformanceMetrics(submissionData);

        setAnalysisData({
          overallStats: stats,
          performanceMetrics: metrics,
        });
      } catch (err) {
        setError("An error occurred while analyzing data"+err);
      }
    }
  }, [submissionData, calculateOverallStats, generatePerformanceMetrics]);

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
          <CardTitle>Quiz Analysis</CardTitle>
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
