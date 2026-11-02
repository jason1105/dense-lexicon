import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DayView from "@/components/DayView";
import { getAllDates, getDay, getLatest } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllDates().map((date) => ({ date }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>;
}): Promise<Metadata> {
  const { date } = await params;
  if (date === getLatest()) {
    return { title: { absolute: "每日三词" } };
  }
  return { title: date };
}

export default async function DayPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const day = getDay(date);
  if (!day) notFound();
  return <DayView day={day} />;
}
