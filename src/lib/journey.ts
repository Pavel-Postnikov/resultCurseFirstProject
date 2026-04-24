import fs from "fs";
import path from "path";
import type { Journey } from "@/types/journey";

const JOURNEYS_DIR = path.join(process.cwd(), "content/journeys");

export function getAllJourneys(): Journey[] {
  const files = fs.readdirSync(JOURNEYS_DIR).filter((f) => f.endsWith(".json"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(JOURNEYS_DIR, file), "utf-8");
    return JSON.parse(raw) as Journey;
  });
}

export function getJourney(id: string): Journey | null {
  const all = getAllJourneys();
  return all.find((j) => j.id === id) ?? null;
}
