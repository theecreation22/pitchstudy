import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getQuiz, quizzes } from "@/lib/quizzes";
import { QuizRunner } from "@/components/quiz/QuizRunner";

export function generateStaticParams() {
  return quizzes.map((quiz) => ({ slug: quiz.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const quiz = getQuiz(slug);

  return {
    title: quiz ? `${quiz.title} Quiz · PitchStudy` : "Quiz · PitchStudy",
    description: quiz?.tagline,
  };
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const quiz = getQuiz(slug);

  if (!quiz) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-10 sm:px-8 sm:py-16">
      <Link
        href="/quiz"
        className="font-mono text-xs uppercase tracking-widest text-pitch-touchline hover:text-pitch-marker"
      >
        ← Back to quizzes
      </Link>

      <header className="flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-widest text-pitch-marker">Quiz</p>
        <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight text-pitch-line sm:text-6xl">
          {quiz.title}
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-pitch-touchline">{quiz.tagline}</p>
      </header>

      <QuizRunner key={quiz.slug} quiz={quiz} />
    </div>
  );
}
