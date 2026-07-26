import type { Metadata } from "next";
import Link from "next/link";
import { quizzes } from "@/lib/quizzes";
import { QuizBestScore } from "@/components/quiz/QuizBestScore";

export const metadata: Metadata = {
  title: "Quizzes — PitchIQ",
  description: "Short quizzes on formations, positions, and managers with instant feedback.",
};

export default function QuizIndexPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 py-10 sm:px-8 sm:py-16">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight text-pitch-line sm:text-6xl">
          Test yourself.
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-pitch-touchline sm:text-lg">
          Short quizzes with instant feedback — no accounts, no pressure, just a quick check on
          what stuck.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {quizzes.map((quiz) => (
          <Link
            key={quiz.slug}
            href={`/quiz/${quiz.slug}`}
            className="group flex flex-col gap-3 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-6 transition-colors hover:border-pitch-marker focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
          >
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-pitch-line group-hover:text-pitch-marker">
              {quiz.title}
            </h2>
            <p className="text-sm leading-relaxed text-pitch-touchline">{quiz.tagline}</p>
            <p className="font-mono text-xs text-pitch-touchline">
              {quiz.questions.length} questions
            </p>
            <QuizBestScore slug={quiz.slug} total={quiz.questions.length} />
          </Link>
        ))}
      </div>
    </div>
  );
}
