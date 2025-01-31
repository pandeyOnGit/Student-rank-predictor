import React from "react";
import RankPredictionDashboard from "./components/RankPredictionDashBoard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Page = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-50">
      <div className="flex flex-col items-center w-full max-w-5xl space-y-8">
        <div className="w-3/4 h-2/5 bg-white shadow-xl rounded-2xl overflow-hidden">
          <RankPredictionDashboard />
        </div>
        <div className="mt-4">
          <Link href="/questions" passHref>
            <Button className="px-6 py-3 text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-2xl shadow-lg transition-all duration-200">
              View Questions
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
