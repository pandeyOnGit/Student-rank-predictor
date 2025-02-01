'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface RankData {
  date: string;
  rank: number;
  topic: string;
  score: number;
  accuracy: number;
  betterThan?: number;
  rankDisplay?: string;
}

const RankTrackingDashboard = () => {
  const rankData: RankData[] = [
    {date: "Jan 17", rank: -171, topic: "Human Physiology (15)", score: 105, accuracy: 90},
    {date: "Jan 17", rank: -9140, topic: "Human Physiology PYQ", score: 92, accuracy: 100},
    {date: "Jan 16", rank: -418, topic: "Human Physiology", score: 115, accuracy: 96},
    {date: "Jan 16", rank: -1598, topic: "Human Physiology PYQ", score: 35, accuracy: 90},
    {date: "Jan 15", rank: 2023, topic: "Human Physiology", score: 16, accuracy: 31},
    {date: "Jan 15", rank: 1810, topic: "Human Reproduction", score: 24, accuracy: 38},
    {date: "Jan 15", rank: -1598, topic: "Human Physiology PYQ", score: 27, accuracy: 50},
    {date: "Jan 13", rank: 2556, topic: "Principles of Inheritance", score: 5, accuracy: 30},
    {date: "Jan 13", rank: -8479, topic: "Microbes in Human Welfare", score: 76, accuracy: 100},
    {date: "Jan 13", rank: -2380, topic: "Reproductive Health", score: 40, accuracy: 100},
    {date: "Jan 11", rank: -5215, topic: "Human Health and Disease", score: 110, accuracy: 93},
    {date: "Jan 11", rank: -5764, topic: "Reproductive Health", score: 61, accuracy: 84}
  ];

  // Convert negative ranks to better than X students
  const transformedData = rankData.map(item => ({
    ...item,
    betterThan: item.rank < 0 ? Math.abs(item.rank) : 0,
    rankDisplay: item.rank < 0 ? `Better than ${Math.abs(item.rank)} students` : `Rank ${item.rank}`
  }));

  // Sort data by date using proper date parsing
  const sortedData = [...transformedData].sort((a, b) => {
    const dateA = new Date(`2024 ${a.date}`);
    const dateB = new Date(`2024 ${b.date}`);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="space-y-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Rank Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sortedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'betterThan') {
                      return [`Better than ${value} students`, 'Rank'];
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
                  dot={{ stroke: '#8884d8', strokeWidth: 2 }}
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
              <div className="text-xl font-bold text-blue-600">Better than 9,140 students</div>
              <div className="text-sm text-gray-600">Human Physiology PYQ</div>
              <div className="text-sm text-gray-600">100% accuracy</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-lg font-semibold">Latest Ranking</div>
              <div className="text-xl font-bold text-green-600">Better than 171 students</div>
              <div className="text-sm text-gray-600">Human Physiology</div>
              <div className="text-sm text-gray-600">90% accuracy</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-lg font-semibold">Performance Trend</div>
              <div className="text-xl font-bold text-purple-600">Consistently improving</div>
              <div className="text-sm text-gray-600">Last 3 attempts: All negative ranks</div>
              <div className="text-sm text-gray-600">(Better than other students)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RankTrackingDashboard;