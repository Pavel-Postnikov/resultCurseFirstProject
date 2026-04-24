import type { Metadata } from "next";
import { getJourney } from "@/lib/journey";
import { JourneyClient } from "./JourneyClient";

export const metadata: Metadata = {
  title: "Knowledge Journey",
};

export default function JourneyPage() {
  const journey = getJourney();
  return <JourneyClient journey={journey} />;
}
