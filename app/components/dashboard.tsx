"use client"
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
  const [historicalQuizData, setHistoricalQuizData] = useState<QuizData[] | null>(null);

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
        console.log("fetching Data")
        const response = await fetch("https://api.jsonserve.com/XgAgFJ");
        const data = await response.json();
        console.log(data);
        setHistoricalQuizData(data);
      } catch (error) {
        console.error("Error fetching historical quiz data", error);
      }
    };
    fetchCurrentQuizData();
    fetchHistoricalQuizData();
  }, []);

  const calculateRankPrediction = (): number | null => {
    if (!historicalQuizData) return null;
    const numberOfParticipants = 5000;
    // Calculate average score for rank prediction
    const scores = historicalQuizData.map((quiz) => quiz.score);
    const averageScore = scores.reduce((total, score) => total + score, 0) / scores.length;
    return numberOfParticipants-(Math.round((averageScore / 100) * numberOfParticipants)); // Assume 5000 as total participants
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
              <p><strong>Quiz Title:</strong> {currentQuizData.quiz.title}</p>
              <p><strong>Topic:</strong> {currentQuizData.quiz.topic}</p>
              <p><strong>Accuracy:</strong> {currentQuizData.accuracy}</p>
              <p><strong>Final Score:</strong> {currentQuizData.final_score}</p>
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

