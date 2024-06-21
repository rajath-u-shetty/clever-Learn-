import { ExtendedQuiz } from "@/types/prisma";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from "next/link";

export function AttemptsTable({ quiz }: { quiz: ExtendedQuiz }) {
  return (
    <Table>
      <TableCaption>All your attempts.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {quiz.attempts
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .map((attempt) => (
            <TableRow key={attempt.id} className="relative">
              <TableCell>
                {new Date(attempt.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>{Number(attempt.score) * 100}%</TableCell>{" "}
              <Link
                href={`/quizzes/${quiz.id}/attempt/${attempt.id}`}
                className="absolute inset-0"
              />
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
