"use client";

import { ExtendedQuiz } from "@/types/prisma";
import { LineChart, Line, Tooltip, ResponsiveContainer } from "recharts";

export function AttemptsGraph({ quiz }: { quiz: ExtendedQuiz }) {
  const data = quiz.attempts
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
    .map((attempt) => ({
      date: new Date(attempt.createdAt).toLocaleDateString(),
      score: Number(attempt.score) * 100,
    }));

  return (
    <div className="h-[200px]">
      <ResponsiveContainer height="100%" width="100%">
        <LineChart
          data={data}
          margin={{
            top: 15,
            right: 15,
            left: 15,
            bottom: 0,
          }}
        >
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                console.log(payload);
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="flex flex-col">
                        <span className="font-semibold uppercase text-muted-foreground">
                          Date
                        </span>
                        <span className="font-medium">
                          {payload[0].payload.date}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold uppercase text-muted-foreground">
                          Score
                        </span>
                        <span className="font-medium">
                          {payload[0].payload.score}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }

              return null;
            }}
          />
          <Line
            stroke="#fff"
            dataKey="score"
            type="monotone"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
