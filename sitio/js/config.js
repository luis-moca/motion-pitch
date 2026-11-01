/*
  ARZE MEDIA — SITE CONFIG
  Edit this file to change prices, packages, contact info and key copy.
  Everything on the page is rendered from here. Save, refresh, done.
*/
window.ARZE = {
  brand: {
    name: "Arze Media",
    city: "Toronto, ON",
    base: "Based in Kensington Market"
  },

  contact: {
    // WhatsApp number in international format, digits only (no +, spaces or dashes)
    whatsapp: "14165550123",
    whatsappDisplay: "+1 416 555 0123",
    email: "contacto@arze.com",
    // Leave empty to hide. Example: "https://www.instagram.com/yourhandle"
    instagram: "",
    tiktok: "",
    // Where the contact form sends each request. FormSubmit (formsubmit.co) is free and needs no account:
    // the first message triggers a one-time "Activate form" email to this inbox. Click it once and every
    // request arrives by email. Leave empty to send the form through WhatsApp instead.
    formEndpoint: "https://formsubmit.co/ajax/contacto.arze@gmail.com"
  },

  // Default WhatsApp message for the generic "Book a shoot" buttons
  whatsappMessage: "Hi Arze Media! I run a restaurant in Toronto and I'd like to talk about videos.",

  currency: "CAD",

  hero: {
    kicker: "Your next regulars are scrolling right now",
    title: ["Videos", "that fill", "tables."],
    subtitle: "We shoot at your place, cut it into Reels and TikToks, and hand you a month of content your customers actually walk in for.",
    primaryCta: "Book a shoot",
    secondaryCta: "See the menu",
    // Line under the buttons, next to the clients' initials (taken from "clients" below)
    proof: "Trusted by local favourites across Toronto"
  },

  // The phone in the hero plays these, in order. "src" = file name in assets/video (no extension)
  reels: [
    { src: "lime",     handle: "@yourtaqueria",   caption: "Fresh lime on every single taco.",        sound: "Sample reel" },
    { src: "pastries", handle: "@yourbakery",     caption: "Out of the oven at 8. Gone by 11.",       sound: "Sample reel" },
    { src: "fudge",    handle: "@yourdessertbar", caption: "Hot fudge. Cold scoop. Order two.",      sound: "Sample reel" },
    { src: "martini",  handle: "@yourbar",        caption: "Friday starts at the bar.",               sound: "Sample reel" },
    { src: "dip",      handle: "@yourbirriaspot", caption: "Dip it. Every time.",                     sound: "Sample reel" },
    { src: "coffee",   handle: "@yourcafe",       caption: "First pour of the day.",                  sound: "Sample reel" }
  ],

  // Formats shown in the video wall
  formats: [
    { src: "latte",    name: "The craft",         note: "Baristas, bartenders, cooks. Skill on camera." },
    { src: "tacoplate", name: "The plate",        note: "Your best dish, styled and lit like a cover shot." },
    { src: "bartender", name: "Behind the bar",   note: "Drinks, glassware, the mood of the room." },
    { src: "kitchen",  name: "Rush hour",         note: "Service at full speed." },
    { src: "counter",  name: "The counter",       note: "Orders, smiles, regulars. Your team at work." },
    { src: "crowd",    name: "The line",          note: "Real customers, real buzz, real plates." }
  ],

  // THE MENU — packages. Prices are placeholders: confirm before launch.
  packages: [
    {
      id: "single",
      name: "The Single",
      count: 1,
      price: 50,
      billing: "one-time",
      tagline: "One video, one visit. Try us out.",
      includes: ["Short shoot at your place", "1 edited vertical video", "Captions and licensed music", "Ready for Instagram and TikTok"],
      preview: "plating"
    },
    {
      id: "order",
      name: "The Order",
      count: 4,
      price: 180,
      billing: "per month",
      tagline: "One a week. Stay in the feed.",
      includes: ["1 shoot day per month", "4 edited vertical videos", "Hooks, captions, licensed music", "Posting calendar for the month"],
      preview: "pasta"
    },
    {
      id: "combo",
      name: "The Combo",
      count: 8,
      price: 320,
      billing: "per month",
      tagline: "Twice a week. The house favourite.",
      includes: ["1 shoot day per month", "8 edited vertical videos", "Hooks, captions, licensed music", "Posting calendar for the month", "Monthly results recap"],
      preview: "drizzle",
      featured: true
    },
    {
      id: "platter",
      name: "The Family Platter",
      count: 12,
      price: 420,
      billing: "per month",
      tagline: "Three a week. Own your block.",
      includes: ["1 shoot day per month", "12 edited vertical videos", "Hooks, captions, licensed music", "Posting calendar for the month", "Monthly results recap", "Promo-code tracking setup"],
      preview: "diner"
    }
  ],

  // CLIENTS: names in the moving strip on the home page. Ask each client before the site goes public.
  clients: ["Taco House", "Berry Mexican", "647 Birria House", "La Bikina"],

  // TESTIMONIALS: "img" = file in assets/img (no extension). sample: true shows a small "Sample" tag.
  // Replace with real quotes from real clients and set sample: false.
  testimonials: [
    { img: "face-1", name: "Sofia R.", role: "Café owner", quote: "People walk in holding their phone, pointing at the croissant from the video.", sample: true },
    { img: "face-2", name: "Daniel M.", role: "Taquería owner", quote: "One shoot day and my feed was covered for the whole month.", sample: true },
    { img: "face-3", name: "Marcus J.", role: "Bar manager", quote: "Our cocktails finally look as good on Instagram as they do at the bar.", sample: true }
  ],

  // Break-even simulator defaults
  simulator: {
    ticket: 18,   // average spend per customer, CAD
    margin: 70,   // % of each sale the owner keeps after food cost (rule of thumb: food cost ~30%)
    package: "combo"
  },

  steps: [
    { title: "Plan", text: "A short call to pick what to show this month: best sellers, specials, the story behind the place.", img: "phonescreen" },
    { title: "Shoot", text: "One visit, a few hours, zero disruption. We capture a month of footage in a single day.", img: "filming" },
    { title: "Cut", text: "Strong first seconds, captions, licensed music, and formats made for Reels and TikTok.", img: "phoneshot" },
    { title: "Post", text: "You get ready-to-post videos and a simple calendar. Post them, and watch who walks in.", img: "dining" }
  ],

  // FAQ: "clip" is the video shown next to the open question (file name in assets/video), "tag" its label
  faq: [
    { q: "How fast do I get my videos?", clip: "kitchen", tag: "Rush hour", a: "Videos arrive in batches after your shoot day, on dates we agree on up front. You always know when the next ones are coming." },
    { q: "Do you post them for me?", clip: "crowd", tag: "The line", a: "We deliver ready-to-post files with captions and a calendar. If you'd rather have us handle posting, ask us and we'll set it up." },
    { q: "What do you need from me?", clip: "counter", tag: "The counter", a: "A few hours on shoot day and your best dishes. No script, no actors. We handle the rest." },
    { q: "Do you use trending songs?", clip: "bartender", tag: "Behind the bar", a: "Business accounts should use music licensed for commercial use. We pick from those libraries, so your videos stay up." },
    { q: "Is there a long contract?", clip: "tacoplate", tag: "The plate", a: "No long contracts. Monthly packages renew month to month." },
    { q: "Do you speak Spanish?", clip: "latte", tag: "The craft", a: "Yes. We work in English and Spanish, whatever is easier for you and your team." }
  ]
};
