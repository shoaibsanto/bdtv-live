function resolveBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  // Provided automatically on Vercel for the production deployment.
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

// Total live channels — keep in sync with lib/channels.ts (used in copy & schema).
export const CHANNEL_COUNT = 200;

export const site = {
  url: resolveBaseUrl(),
  name: "BDTV Live",
  title: "BDTV Live — বাংলাদেশি টিভি চ্যানেল লাইভ দেখুন Free HD | 200+ Live TV",
  shortName: "BDTV Live",
  description:
    "বাংলা টিভি লাইভ দেখুন ফ্রিতে — NTV, Somoy TV, Jamuna TV, Channel i, ATN News, খেলা ও সংবাদসহ ২০০+ বাংলাদেশি ও জনপ্রিয় লাইভ টিভি চ্যানেল। HD কোয়ালিটি, মোবাইল ফ্রেন্ডলি, কোনো অ্যাপ বা সাইন-আপ লাগবে না।",
  descriptionEn:
    "Watch 200+ Bangladeshi & popular live TV channels online free in HD — NTV, Somoy TV, Jamuna TV, Channel i, ATN News, plus live sports, news, movies & more. No app, no signup, mobile friendly.",
  locale: "bn_BD",
  keywords: [
    "bangla tv live",
    "বাংলা টিভি লাইভ",
    "live tv bangladesh",
    "bd tv live",
    "bdtv live",
    "bangladeshi tv channels live",
    "online tv bangla",
    "অনলাইন টিভি",
    "free bangla tv online",
    "watch bangla channel online",
    "NTV live",
    "Somoy TV live",
    "Jamuna TV live",
    "Channel i live",
    "ATN News live",
    "bangla news live",
    "live sports channel",
    "cricket live",
    "খেলা লাইভ",
    "bangla natok live",
  ],
};
