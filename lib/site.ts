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

export const site = {
  url: resolveBaseUrl(),
  name: "BDTV Live",
  title: "BDTV Live — বাংলাদেশি টিভি চ্যানেল লাইভ (Free HD)",
  shortName: "BDTV Live",
  description:
    "বাংলাদেশের জনপ্রিয় টিভি চ্যানেলগুলো ফ্রিতে লাইভ দেখুন — NTV, Somoy TV, Jamuna TV, Channel i, ATN News সহ ২২টি চ্যানেল। HD কোয়ালিটি, মোবাইল ফ্রেন্ডলি, কোনো অ্যাপ লাগবে না।",
  descriptionEn:
    "Watch 22 popular Bangladeshi TV channels live for free in HD — NTV, Somoy TV, Jamuna TV, Channel i, ATN News and more. Fast, mobile friendly, no app required.",
  locale: "bn_BD",
  keywords: [
    "Bangla TV live",
    "বাংলা টিভি লাইভ",
    "Bangladeshi TV channels",
    "NTV live",
    "Somoy TV live",
    "Jamuna TV live",
    "Channel i live",
    "BTV live",
    "live tv bangladesh",
    "free bangla iptv",
  ],
};
