"use client";

import React, { useEffect, useState } from "react";
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

interface RankData {
  date: string;
  rank: number;
  topic: string;
  score: number;
  accuracy: number;
  betterThan?: number;
  rankDisplay?: string;
}

interface HistoricalData {
  accuracy: string;
  better_than: number;
  correct_answers: number;
  created_at: string;
  final_score: string;
  rank_text: string;
  quiz: {
    title: string;
  };
  total_questions: number;
}

const currentQuizData = {
  accuracy: "80 %",
  better_than: 24,
  correct_answers: 8,
  created_at: "2025-01-17T15:51:29.871+05:30",
  final_score: "30.0",
  rank_text: "Topic Rank - #2402",
  quiz: {
    title: "Structural Organisation in Animals and Plants (7)",
  },
  total_questions: 128,
};

const RankTrackingDashboard = () => {
  const [rankData, setRankData] = useState<RankData[]>([]);

  useEffect(() => {
   
    fetch("/historicalSubmissions.json")
      .then((response) => response.json())
      .then((data: HistoricalData[]) => {
        
        const transformedData = data.map((item) => {
          const rankMatch = item.rank_text.match(/#-?(\d+)/);
          const rank = rankMatch ? parseInt(rankMatch[1], 10) : 0;
          const accuracy = parseFloat(item.accuracy.replace("%", ""));

          return {
            date: new Date(item.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            rank: rank,
            topic: item.quiz.title,
            score: parseFloat(item.final_score),
            accuracy: accuracy,
            betterThan: item.better_than,
            rankDisplay:
              rank < 0
                ? `Better than ${Math.abs(rank)} students`
                : `Rank ${rank}`,
          };
        });

        const currentQuizTransformed = {
          date: new Date(currentQuizData.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          rank: parseInt(currentQuizData.rank_text.match(/#-?(\d+)/)?.[1] || "0", 10),
          topic: currentQuizData.quiz.title,
          score: parseFloat(currentQuizData.final_score),
          accuracy: parseFloat(currentQuizData.accuracy.replace("%", "")),
          betterThan: currentQuizData.better_than,
          rankDisplay:
            currentQuizData.better_than < 0
              ? `Better than ${Math.abs(currentQuizData.better_than)} students`
              : `Rank ${currentQuizData.better_than}`,
        };

        const combinedData = [...transformedData, currentQuizTransformed];

        const sortedData = combinedData.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        });

        setRankData(sortedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  if (rankData.length === 0) {
    return <div>Loading...</div>;
  }

  const bestRank = rankData.reduce((best, current) => {
    const currentBetterThan = current.betterThan ?? 0; 
    const bestBetterThan = best.betterThan ?? 0;
    return currentBetterThan > bestBetterThan ? current : best;
  });

  const latestRank = rankData[rankData.length - 1];
  return (
    <div className="space-y-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Rank Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rankData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis domain={["auto", "auto"]} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === "betterThan") {
                      return [`Better than ${value} students`, "Rank"];
                    }
                    return [value, name];
                  }}
                  contentStyle={{ fontSize: 12 }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="betterThan"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ stroke: "#8884d8", strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                  name="Rank Position"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Rank Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-lg font-semibold">Best Ranking</div>
              <div className="text-xl font-bold text-blue-600">
                {bestRank.rankDisplay || "N/A"}
              </div>
              <div className="text-sm text-gray-600">
                {bestRank.topic || "N/A"}
              </div>
              <div className="text-sm text-gray-600">
                {bestRank.accuracy || "N/A"}% accuracy
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-lg font-semibold">Latest Ranking</div>
              <div className="text-xl font-bold text-green-600">
                {latestRank.rankDisplay || "N/A"}
              </div>
              <div className="text-sm text-gray-600">
                {latestRank.topic || "N/A"}
              </div>
              <div className="text-sm text-gray-600">
                {latestRank.accuracy || "N/A"}% accuracy
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-lg font-semibold">Performance Trend</div>
              <div className="text-xl font-bold text-purple-600">
                {latestRank.betterThan && latestRank.betterThan > 0
                  ? "Consistently improving"
                  : "Needs improvement"}
              </div>
              <div className="text-sm text-gray-600">
                Last 3 attempts:{" "}
                {rankData
                  .slice(-3)
                  .map((item) => item.rankDisplay || "N/A")
                  .join(", ")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RankTrackingDashboard;