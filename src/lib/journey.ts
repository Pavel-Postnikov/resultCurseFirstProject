import type { Journey } from "@/types/journey";
import data from "../../content/journeys/js-interview.json";

export function getJourney(): Journey {
  return data as Journey;
}
