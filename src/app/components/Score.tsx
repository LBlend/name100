import { GOAL_AMOUNT } from "@/consts";
import React from "react";

interface ScoreProps {
  matchesCount: number;
}

const Score: React.FC<ScoreProps> = ({ matchesCount }) => {
  return (
    <p className="text-xl">
      <span className="font-bold">{matchesCount}</span> / {GOAL_AMOUNT}
    </p>
  );
};

export default Score;
