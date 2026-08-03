# WWW

This repo houses my personal site, www.christiancodes.co. It’s a straightforward Next.js app with TypeScript, Apple Health workout imports, Styled Components for styling, and Framer Motion for a bit of polish — nothing fancy, just a clean log of what I’ve been up to.

## Tech Stack

- [Next.js](https://github.com/vercel/next.js), [React](https://github.com/facebook/react), [TypeScript](https://github.com/microsoft/TypeScript)
- [Styled Components](https://github.com/styled-components/styled-components), [Framer Motion](https://github.com/framer/motion)
- [Health Auto Export](https://healthyapps.dev/apps/health-auto-export) workout imports
- [rehype](https://github.com/rehypejs/rehype) / [remark](https://github.com/remarkjs/remark)

## Setup and Running

It’s a standard Next.js setup—clone it, install deps, run it. Figure it out; you’ve seen one, you’ve seen ‘em all.

Fitness imports require `REDIS_URL` and `FITNESS_IMPORT_TOKEN`. Configure Health Auto Export to send Version 2 workout JSON to `/api/fitness/import` with an `Authorization: Bearer <FITNESS_IMPORT_TOKEN>` header. Route export should remain disabled until location privacy filtering is implemented.

## Contributing

This is my personal gig, but if you catch a bug or have a tweak in mind, I’m not above a solid PR or issue. Knock yourself out.

## License

MIT License. Check the LICENSE file if you care.
