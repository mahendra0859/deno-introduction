import {
  dayOfYear,
  currentDayOfYear,
} from "https://deno.land/std/datetime/mod.ts";
console.log("dayOfYear", dayOfYear(new Date()));
console.log("currentDayOfYear", currentDayOfYear());

// deno run dateTime.ts
