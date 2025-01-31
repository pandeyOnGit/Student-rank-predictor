"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Line } from "react-chartjs-2";

interface QuizData {
  accuracy: string;
  final_score: string;
  quiz: {
    title: string;
    topic: string;
  };
  rank_text: string;
  score: number;
}

const Dashboard: React.FC = () => {
  const [currentQuizData, setCurrentQuizData] = useState<QuizData | null>(null);
  const [historicalQuizData, setHistoricalQuizData] = useState<
    QuizData[] | null
  >(null);

  useEffect(() => {
    const fetchCurrentQuizData = async () => {
      try {
        const response = await fetch("https://jsonkeeper.com/b/LLQT");
        const data = await response.json();
        setCurrentQuizData(data);
      } catch (error) {
        console.error("Error fetching current quiz data", error);
      }
    };

    // Fetch Historical Quiz Data
    const fetchHistoricalQuizData = async () => {
      try {
        const response = await fetch("NEXT_PUBLIC_API_URL");
        const data = await response.json();
        setHistoricalQuizData(JSON.parse(data.contents));
      } catch (error) {
        console.error("Error fetching historical quiz data", error);
      }
    };
    fetchCurrentQuizData();
    fetchHistoricalQuizData();
  }, []);

  const calculateRankPrediction = (): number | null => {
    if (!historicalQuizData || historicalQuizData.length === 0) return null;
    const numberOfParticipants = 5000;
    const userScores = historicalQuizData.map((quiz) => quiz.score);
    const userAverage =
      userScores.reduce((sum, score) => sum + score, 0) / userScores.length;
    const mockPastScores = Array.from({ length: 1000 }, () =>
      Math.floor(Math.random() * 100)
    );

    // Combine mock data with user's average to simulate competition
    const allScores = [...mockPastScores, userAverage].sort((a, b) => b - a);

    // Find the rank of the user's average score
    const rank = allScores.findIndex((score) => score <= userAverage) + 1;

    // Scale rank to current participant count (simple proportional scaling)
    const scaledRank = Math.round(
      (rank / (allScores.length + 1)) * numberOfParticipants
    );

    return Math.min(scaledRank, numberOfParticipants);
  };

  const rankPrediction = calculateRankPrediction();

  const lineChartData = {
    labels: historicalQuizData?.map((quiz, index) => `Quiz ${index + 1}`) || [],
    datasets: [
      {
        label: "Scores",
        data: historicalQuizData?.map((quiz) => quiz.score) || [],
        fill: false,
        borderColor: "#4CAF50",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="p-4 grid gap-4 md:grid-cols-2">
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold">Current Quiz Performance</h2>
          {currentQuizData ? (
            <div>
              <p>
                <strong>Quiz Title:</strong> {currentQuizData.quiz.title}
              </p>
              <p>
                <strong>Topic:</strong> {currentQuizData.quiz.topic}
              </p>
              <p>
                <strong>Accuracy:</strong> {currentQuizData.accuracy}
              </p>
              <p>
                <strong>Final Score:</strong> {currentQuizData.final_score}
              </p>
            </div>
          ) : (
            <p>Loading current quiz data...</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-xl font-bold">Predicted Rank</h2>
          {rankPrediction ? (
            <p className="text-2xl font-semibold">#{rankPrediction}</p>
          ) : (
            <p>Loading rank prediction...</p>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardContent>
          <h2 className="text-xl font-bold">Performance Over Time</h2>
          {historicalQuizData ? (
            <Line data={lineChartData} />
          ) : (
            <p>Loading historical quiz data...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
