"use client"
import React, { useState } from "react";


interface CurrentQuiz {
  quiz: {
    topic: string;
    questions_count: number;
  };
  response_map: Record<string, string>; // Assuming question_id is a string and selected_option_id is a string
  final_score: string;
  negative_score: string;
}

interface HistoricalSubmission {
  quiz: {
    topic: string;
  };
  accuracy: string; // Assuming this is a string that needs to be parsed to float
  rank_text: string; // Assuming rank is in the format "#123"
  speed: string;     // Assuming this is a string that needs to be parsed to float
  better_than: string; // Assuming this is a string that needs to be parsed to float
}

interface ParsedData {
  current: {
    topic: string;
    totalQuestions: number;
    responseMap: Record<string, string>;
    scoreDetails: {
      finalScore: number;
      negativeImpact: number;
    };
  };
  history: Array<{
    topic: string;
    accuracy: number;
    rank: number;
    speed: number;
    betterThan: number;
  }>;
}
interface RankData {
  rank: number;
  score: number;
}

// Simulate an API call for historical data, as JSON files would be fetched
const fetchHistoricalData = async (): Promise<HistoricalSubmission[]> => {
  // Example data (should be fetched from an API or local file)
  return [
    {
      quiz: { topic: "Math" },
      accuracy: "90",
      rank_text: "#1",
      speed: "30",
      better_than: "85",
    },
    // Add other historical submissions as needed
  ];
};
// Function to parse and standardize performance data
function parseData(
  currentQuiz: CurrentQuiz,
  historicalSubmissions: HistoricalSubmission[]
): ParsedData {
  return {
    current: {
      topic: currentQuiz.quiz.topic,
      totalQuestions: currentQuiz.quiz.questions_count,
      responseMap: currentQuiz.response_map,
      scoreDetails: {
        finalScore: parseFloat(currentQuiz.final_score),
        negativeImpact: parseFloat(currentQuiz.negative_score),
      },
    },
    history: historicalSubmissions.map((sub) => ({
      topic: sub.quiz.topic,
      accuracy: parseFloat(sub.accuracy),
      rank: parseInt(sub.rank_text.split("#")[1]),
      speed: parseFloat(sub.speed),
      betterThan: parseFloat(sub.better_than),
    })),
  };
}

// Function to calculate rank based on the input
function calculateRank(parsedData: ParsedData, historicalRanks: RankData[]): number {
  // Example rank calculation
  const compositeScore = parsedData.current.scoreDetails.finalScore;
  const closestRank = historicalRanks.reduce((prev, curr) =>
    Math.abs(curr.score - compositeScore) < Math.abs(prev.score - compositeScore)
      ? curr
      : prev
  );
  return closestRank.rank;
}

const RankPredictionApp = () => {
  const [studentMarks, setStudentMarks] = useState<number | null>(null);
  const [rank, setRank] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch historical data and perform rank prediction
  const handleCalculate = async () => {
    if (studentMarks === null || studentMarks < 0 || studentMarks > 720) {
      setError("Please enter valid marks between 0 and 720.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch historical data (Replace with actual data fetch)
      const historicalData = await fetchHistoricalData();

      // Mock current quiz data (Replace with actual data input)
      const currentQuiz: CurrentQuiz = {
        quiz: { topic: "Math", questions_count: 50 },
        response_map: { "1": "A", "2": "B", "3": "C" }, // Example data
        final_score: "450", // Example score
        negative_score: "10", // Example negative score
      };

      const parsedData = parseData(currentQuiz, historicalData);
      
      // Mock historical ranks data (Replace with actual data)
      const historicalRanks = [
        { rank: 1, score: 500 },
        { rank: 2, score: 450 },
        { rank: 3, score: 400 },
      ];

      // Calculate predicted rank based on parsed data
      const predictedRank = calculateRank(parsedData, historicalRanks);

      setRank(predictedRank);
    } catch (err) {
      setError("Error occurred while calculating rank."+err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <div className="w-96 border rounded-lg h-12">
        <input
          type="number"
          placeholder="Enter your marks between 0 to 720"
          className="w-full h-full flex items-center justify-center p-2"
          value={studentMarks ?? ""}
          onChange={(e) => setStudentMarks(parseInt(e.target.value, 10))}
        />
      </div>

      <button
        className="mt-4 w-67 p-2 bg-blue-500 text-white rounded"
        onClick={handleCalculate}
        disabled={loading}
      >
        {loading ? "Calculating..." : "Calculate Rank"}
      </button>

      {rank !== null && (
        <div className="mt-4 text-lg">
          Your Estimated Rank: <strong>{rank}</strong>
        </div>
      )}

      {error && (
        <div className="mt-4 text-lg text-red-500">
          {error}
        </div>
      )}
    </div>
  );
};

export default RankPredictionApp;
