import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getJourney, getAllJourneys } from "@/lib/journey";
import { JourneyClient } from "../JourneyClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const journeys = getAllJourneys();
  return journeys.map((j) => ({ id: j.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const journey = getJourney(id);
  return { title: journey ? `${journey.topic} — Journey` : "Journey" };
}

export default async function JourneyPage({ params }: Props) {
  const { id } = await params;
  const journey = getJourney(id);
  if (!journey) notFound();
  return <JourneyClient journey={journey} />;
}
