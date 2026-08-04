# WWW

This repo houses my personal site, www.christiancodes.co. It’s a straightforward Next.js app with TypeScript, Intervals.icu workout sync, Styled Components for styling, and Framer Motion for a bit of polish — nothing fancy, just a clean log of what I’ve been up to.

## Tech Stack

- [Next.js](https://github.com/vercel/next.js), [React](https://github.com/facebook/react), [TypeScript](https://github.com/microsoft/TypeScript)
- [Styled Components](https://github.com/styled-components/styled-components), [Framer Motion](https://github.com/framer/motion)
- [Intervals.icu](https://intervals.icu/) workout sync
- [rehype](https://github.com/rehypejs/rehype) / [remark](https://github.com/remarkjs/remark)

## Setup and Running

It’s a standard Next.js setup—clone it, install deps, run it. Figure it out; you’ve seen one, you’ve seen ‘em all.

Configure `NEXT_PUBLIC_BASE_URL` and the three `NEXT_PUBLIC_EMAILJS_*` variables for the site. Fitness sync requires `REDIS_URL`, `INTERVALS_ICU_API_KEY`, and a long random `CRON_SECRET`. Vercel calls `/api/fitness/sync` daily using the configured cron secret.

## Contributing

This is my personal gig, but if you catch a bug or have a tweak in mind, I’m not above a solid PR or issue. Knock yourself out.

## License

MIT License. Check the LICENSE file if you care.
