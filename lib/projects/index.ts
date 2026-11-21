import type { StaticImageData } from 'next/image'
// ImgPress
import ImgPressPanel from '../../public/img/projects/imgpress/panel.webp'
import ImgPressResult from '../../public/img/projects/imgpress/conversion.webp'
// Jukebox
import JukeboxLibrary from '../../public/img/projects/jukebox/library-study.webp'
import JukeboxListen from '../../public/img/projects/jukebox/listen-study.webp'
import JukeboxRemote from '../../public/img/projects/jukebox/remote-study.webp'
// QwikDraw
import QwikDesignHero from '../../public/img/projects/qwikdraw/design-hero.webp'
// Electriq Dashboard
import Calendar from '../../public/img/projects/electriq-app/calendar.png'
import DashboardComposed from '../../public/img/projects/electriq-app/dashboard-composed.webp'
import GanttChart from '../../public/img/projects/electriq-app/gantt-chart.png'
import KanbanChart from '../../public/img/projects/electriq-app/kanban-chart.webp'
// Soylent
import SoylentCarousel from '../../public/img/projects/soylent/carousel.webp'
import SoylentCollage from '../../public/img/projects/soylent/collage.webp'
import SoylentCollection from '../../public/img/projects/soylent/collection.webp'
import SoylentHomepage from '../../public/img/projects/soylent/homepage.webp'
import SoylentPDP from '../../public/img/projects/soylent/pdp.webp'
// Scentfill
import ScentfillCarouselMobile from '../../public/img/projects/scentfill/carousel.webp'
import SentfillCollage from '../../public/img/projects/scentfill/collage.webp'
import SentfillPDPMobile from '../../public/img/projects/scentfill/pdp-mobile.webp'
import SentfillPDP from '../../public/img/projects/scentfill/pdp.webp'
import SentfillScents from '../../public/img/projects/scentfill/scents.webp'
import SentfillWheel from '../../public/img/projects/scentfill/wheel.webp'
// Electriq Website
import ElectriqHeroMain from '../../public/img/projects/electriq-home/hero-main.png'
import ElectriqWebsite from '../../public/img/projects/electriq-home/homepage-composed.webp'
// Lift Club
import LiftClubMain from '../../public/img/projects/liftclub/hero.webp'
import LiftClubCommunity from '../../public/img/projects/liftclub/community.webp'
import LiftClubProgress from '../../public/img/projects/liftclub/progress.webp'
// Photo Shop
import PhotoDesktop1 from '../../public/img/projects/awildchristian/desktop1.jpg'
import PhotoDesktop2 from '../../public/img/projects/awildchristian/desktop2.jpg'
import PhotoDesktop3 from '../../public/img/projects/awildchristian/desktop3.jpg'
import PhotoMain from '../../public/img/projects/awildchristian/main.jpeg'
import PhotoMobile1 from '../../public/img/projects/awildchristian/mobile1.jpg'
import PhotoMobile2 from '../../public/img/projects/awildchristian/mobile2.jpg'
// NeoLogos
import NeoLogosDesktop1 from '../../public/img/projects/neologos/neologos-desktop1.jpg'
import NeoLogosDesktop2 from '../../public/img/projects/neologos/neologos-desktop2.jpg'
import NeoLogosDesktop3 from '../../public/img/projects/neologos/neologos-desktop3.jpg'
import NeoLogosMain from '../../public/img/projects/neologos/neologos-main.jpeg'
import NeoLogosMobile1 from '../../public/img/projects/neologos/neologos-mobile1.jpg'
import NeoLogosMobile2 from '../../public/img/projects/neologos/neologos-mobile2.jpg'
// LofiWaves
import LofiWavesDesktop from '../../public/img/projects/lofiwaves/lofiwaves-desktop.jpg'
import LofiWavesMain from '../../public/img/projects/lofiwaves/lofiwaves-main.jpeg'

type ProjectMetaType = { label: string; value: string }
type ProjectDetailType = { title: string; description: string }
type CliCommandType = {
  label: string
  command: string
  output: string[]
}
export type ProjectShowcaseType = {
  type: 'cli'
  title: string
  description: string
  commands: CliCommandType[]
}

const SKILLBOX_GIT_SKILLS = ['agent-browser', 'create-pr', 'frontend-design', 'webapp-testing'] as const
const SKILLBOX_URL_SKILL = 'skillbox'
const SKILLBOX_VISIBLE_SKILLS = [...SKILLBOX_GIT_SKILLS, SKILLBOX_URL_SKILL] as const

export interface ProjectType {
  title: string
  themeColor: `#${string}`
  date: string
  tags: string[]
  desktopImgs: StaticImageData[]
  mobileImgs: StaticImageData[]
  externalLink?: string
  externalLinkLabel?: string
  github?: string
  slug: string
  summary: string
  meta: ProjectMetaType[]
  showcase?: ProjectShowcaseType
  details: ProjectDetailType[]
}

export const ProjectState: ProjectType[] = [
  {
    title: 'Skillbox',
    date: 'Jan 2026',
    tags: ['personal', 'open-source'],
    desktopImgs: [],
    mobileImgs: [],
    externalLink: 'https://www.npmjs.com/package/skillbox',
    externalLinkLabel: 'npm',
    github: 'https://github.com/ChristianAnagnostou/skillbox',
    slug: 'skillbox',
    themeColor: '#72c8b7',
    summary: 'Local-first, agent-agnostic skills manager for AI coding agents',
    meta: [
      { label: 'Stack', value: 'TypeScript CLI' },
      { label: 'Focus', value: 'Agent skills' },
      { label: 'Distribution', value: 'npm package' },
    ],
    showcase: {
      type: 'cli',
      title: 'Golden workflow',
      description: 'The core loop is intentionally small: list skills, update them, and preview a shared source.',
      commands: [
        {
          label: 'List',
          command: 'skillbox list',
          output: [
            `Global Skills (${SKILLBOX_VISIBLE_SKILLS.length})`,
            '  codex    → ~/.codex/skills',
            '',
            'git',
            ...SKILLBOX_GIT_SKILLS.map((skill) => `  ${skill}`),
            '',
            'url',
            `  ${SKILLBOX_URL_SKILL}`,
          ],
        },
        {
          label: 'Update',
          command: 'skillbox update',
          output: [
            `Updating ${SKILLBOX_VISIBLE_SKILLS.length} skills...`,
            '',
            ...SKILLBOX_VISIBLE_SKILLS.map((skill) => `  ✓ ${skill}`),
            '',
            `Updated ${SKILLBOX_VISIBLE_SKILLS.length} of ${SKILLBOX_VISIBLE_SKILLS.length} trackable skills.`,
          ],
        },
        {
          label: 'Add',
          command: 'skillbox add christiananagnostou/skillbox --list',
          output: ['Repo Skills: christiananagnostou/skillbox', '', 'Found 1 skill(s):', '  - skillbox'],
        },
        {
          label: 'Show',
          command: 'skillbox show skillbox',
          output: [
            'skillbox',
            'Manage skills with the skillbox CLI',
            '',
            'Source: github.com/christiananagnostou/skillbox',
            '',
            'Installs (2)',
            '  user/codex',
            '  user/opencode',
          ],
        },
      ],
    },
    details: [
      {
        title: 'Purpose',
        description:
          'Skillbox installs, updates, imports, and syncs reusable agent skills across Claude, Cursor, Codex, OpenCode, Amp, and Antigravity without tying the workflow to one tool.',
      },
      {
        title: 'Workflow',
        description:
          'The CLI focuses on the commands used most often: list installed skills, check for updates, update one or all skills, add skills from GitHub repositories or direct URLs, and register project-local skill folders.',
      },
      {
        title: 'Project Shape',
        description:
          'Built in TypeScript with machine-readable JSON output, GitHub-backed install flows, project inspection, configurable install modes, and release automation through npm.',
      },
    ],
  },
  {
    title: 'ImgPress',
    date: 'Nov 2025',
    tags: ['personal', 'open-source'],
    desktopImgs: [ImgPressPanel, ImgPressResult],
    mobileImgs: [],
    externalLink: 'https://github.com/ChristianAnagnostou/imgpress#readme',
    externalLinkLabel: 'Readme',
    github: 'https://github.com/ChristianAnagnostou/imgpress',
    slug: 'imgpress',
    themeColor: '#b9d8ed',
    summary: 'A little Mac menu bar app I built to get a folder of photos ready to share without opening an editor.',
    meta: [
      { label: 'Stack', value: 'Swift / SwiftUI' },
      { label: 'Platform', value: 'macOS menu bar' },
      { label: 'Formats', value: 'JPEG, PNG, WebP, AVIF' },
    ],
    details: [
      {
        title: 'Three photos from the Bay',
        description:
          'I ran these three gallery photos through Shareable JPEG at 50% dimensions. Pick a photo to see its original and export side by side.',
      },
      {
        title: 'Why show the sizes?',
        description:
          'At full dimensions, the same preset actually made these JPEGs bigger. That’s why I like having the result right in the panel: I can see what changed before I reach for the files in Finder.',
      },
    ],
  },
  {
    title: 'Knip HTML Reporter',
    date: 'Oct 2025',
    tags: ['personal', 'open-source'],
    desktopImgs: [],
    mobileImgs: [],
    externalLink: 'https://www.npmjs.com/package/knip-html-reporter',
    externalLinkLabel: 'npm',
    github: 'https://github.com/ChristianAnagnostou/knip-html-reporter',
    slug: 'knip-html-reporter',
    themeColor: '#a893d1',
    summary: 'Interactive HTML reporter that turns Knip output into navigable cleanup reports',
    meta: [
      { label: 'Stack', value: 'TypeScript' },
      { label: 'Output', value: 'Static HTML report' },
      { label: 'Distribution', value: 'npm package' },
    ],
    details: [
      {
        title: 'Purpose',
        description:
          'Knip HTML Reporter makes unused-file, dependency, and export analysis easier to review by converting Knip results into a searchable browser report.',
      },
      {
        title: 'Workflow',
        description:
          'Reports can be generated through Knip reporter options, saved to a custom output path, auto-opened locally, or uploaded as CI artifacts for team review.',
      },
      {
        title: 'Features',
        description:
          'The reporter includes issue-type filtering, full-text search across symbols and files, VS Code deep links to exact locations, custom styles, and zero runtime dependencies.',
      },
    ],
  },
  {
    title: 'Jukebox',
    date: 'Jun 2023',
    tags: ['personal'],
    desktopImgs: [JukeboxLibrary, JukeboxListen],
    mobileImgs: [JukeboxRemote],
    externalLink: 'https://github.com/christiananagnostou/jukebox/releases',
    externalLinkLabel: 'Releases',
    github: 'https://github.com/ChristianAnagnostou/jukebox',
    slug: 'jukebox',
    themeColor: '#a8c1eb',
    summary:
      'A desktop player for the music on your hard drive. I built Jukebox around two things: a local collection and a keyboard.',
    meta: [
      { label: 'Stack', value: 'Tauri / Qwik / Rust' },
      { label: 'Platform', value: 'macOS, Windows, Linux' },
      { label: 'Focus', value: 'Local music libraries' },
    ],
    details: [
      {
        title: 'From folder to library',
        description:
          'Drop in a folder and Jukebox reads the tracks, artists, albums, and cover art. I kept the folder view, too. Sometimes I remember where I put a record before I remember what it was called.',
      },
      {
        title: 'Picking the next song',
        description:
          'I wanted picking a song to feel closer to moving around a text editor. Search for an artist, move down a few tracks, then play one or add it to the queue without reaching for the mouse.',
      },
      {
        title: 'Back in rotation',
        description:
          'The Listen view puts three lists next to each other: what I played recently, what I keep coming back to, and what I haven’t played yet. They all come from the same library, but each gives me a different place to start.',
      },
      {
        title: 'Away from the desk',
        description:
          'I wanted the same records on my phone without keeping a second library. With remote listening turned on, my desktop serves the music and my phone plays it in the browser over my private Tailscale network. I can browse albums, queue the next track, or save a song for when I’m offline.',
      },
    ],
  },
  {
    title: 'QwikDraw',
    date: 'Apr 2023',
    tags: ['personal'],
    desktopImgs: [QwikDesignHero],
    mobileImgs: [],
    externalLink: 'https://qwikdraw.app/',
    github: 'https://github.com/ChristianAnagnostou/qwikdraw',
    slug: 'qwikdraw',
    themeColor: '#aba6a1',
    summary: 'A simple web-based design canvas built using the Qwik framework',
    meta: [
      { label: 'Stack', value: 'Qwik / TypeScript' },
      { label: 'Surface', value: 'Browser design tool' },
      { label: 'Controls', value: 'Shortcuts, zoom, undo' },
    ],
    details: [
      {
        title: 'Objective',
        description:
          "The only real objective with this was to take a completely new framework, Qwik, and build something challenging. It initially started as a grid-like shape builder, but that didn't look great so it morphed into a shape and image based design tool of sorts.",
      },
      {
        title: 'Challenges',
        description:
          'One requirement for this project was to not use any external libraries other than the frontend framework itself. Some of the more challenging parts were the color picker, zooming/panning, keyboard shortcuts, and resizing elements.',
        // I wrote an article on the details of those features that can be found <a href="/articles/challenges-of-building-a-design-tool">here</a>.s
      },
      {
        title: 'Future',
        description:
          "I'd like to be able to multi-select and rearrange elements as well as add triangles. Currently using DOM elements for shapes. Considering a rewrite using canvas (WebGL?), but I'm having fun :P",
      },
    ],
  },
  {
    title: 'Electriq Dashboard',
    date: 'Jul 2022',
    tags: ['commercial'],
    desktopImgs: [DashboardComposed, GanttChart, KanbanChart],
    mobileImgs: [Calendar],
    externalLink: 'https://electriq.app/',
    slug: 'electriq-app',
    themeColor: '#e3b342',
    summary: 'Visualize and manage Linear projects with timelines, kanbans, calendars, and much more',
    meta: [
      { label: 'Stack', value: 'React app' },
      { label: 'Data', value: 'Linear projects' },
      { label: 'Views', value: 'Timeline, kanban, calendar' },
    ],
    details: [
      {
        title: 'Purpose',
        description: 'A project management app that provides insights into Linear projects through data visualization.',
      },
      {
        title: 'Reason',
        description:
          "Linear doesn't have timelines for projects and doesn't plan to add them. This does that and more.",
      },
      {
        title: 'Features',
        description: 'The ability to send live feedback to the teams in charge is built in and incredibly intuitive.',
      },
    ],
  },
  {
    title: 'Soylent',
    date: '2022-2023',
    tags: ['commercial'],
    desktopImgs: [SoylentCollage, SoylentCarousel, SoylentPDP, SoylentCollection, SoylentHomepage],
    mobileImgs: [],
    externalLink: 'https://soylent.com/',
    slug: 'soylent',
    themeColor: '#74966b',
    summary: "A polished ecommerce storefront for Soylent's complete nutrition lineup",
    meta: [
      { label: 'Platform', value: 'Shopify storefront' },
      { label: 'Focus', value: 'Nutrition commerce' },
      { label: 'Surfaces', value: 'Home, collection, PDP' },
    ],
    details: [
      {
        title: 'Storefront',
        description:
          'Soylent needed a commerce experience that could make complete nutrition feel simple, practical, and easy to shop across homepage, collection, and product-detail flows.',
      },
      {
        title: 'Product Storytelling',
        description:
          'The page work balances dense product information with direct shopping paths, keeping nutrition benefits, flavors, subscriptions, and purchase decisions close together.',
      },
      {
        title: 'System',
        description:
          'The screenshots capture reusable storefront modules: product cards, carousel sections, collection layouts, and PDP content blocks built to scale across a large catalog.',
      },
    ],
  },
  {
    title: 'Scentfill',
    date: 'Jul 2022',
    tags: ['commercial'],
    desktopImgs: [SentfillCollage, SentfillWheel, SentfillPDP],
    mobileImgs: [SentfillPDPMobile, ScentfillCarouselMobile, SentfillScents],
    externalLink: 'https://scentfill.com/',
    slug: 'scentfill',
    themeColor: '#9cad47',
    summary:
      'A fragrance-focused storefront for browsing scents, subscribing to refills, and shopping Scentfill products',
    meta: [
      { label: 'Platform', value: 'Shopify storefront' },
      { label: 'Focus', value: 'Scent discovery' },
      { label: 'Surfaces', value: 'PDP, quiz, mobile' },
    ],
    details: [
      {
        title: 'Discovery',
        description:
          'Scentfill sells a large scent catalog, so the storefront needed browsing patterns that help shoppers narrow choices by fragrance family, product type, and preference.',
      },
      {
        title: 'Product Detail',
        description:
          'The PDP work emphasizes scent notes, compatibility, bundles, and purchase confidence while keeping add-to-cart behavior clear on both desktop and mobile.',
      },
      {
        title: 'Responsive System',
        description:
          'The project includes desktop commerce layouts and mobile-specific screens, making the shopping flow feel deliberate instead of simply squeezed down.',
      },
    ],
  },
  {
    title: "Electriq's Website",
    date: 'Feb 2022',
    tags: ['commercial'],
    desktopImgs: [ElectriqWebsite, ElectriqHeroMain],
    mobileImgs: [],
    externalLink: 'https://www.electriqmarketing.com/',
    slug: 'electriq-home',
    themeColor: '#6776e3',
    summary: "Collaborated with the agency's in-house design team to craft the rebranding of Electriq",
    meta: [
      { label: 'Stack', value: 'React' },
      { label: 'Focus', value: 'Agency rebrand' },
      { label: 'Surface', value: 'Marketing site' },
    ],
    details: [
      {
        title: 'Purpose',
        description:
          'A marketing site for the Electriq rebrand, built to give the agency a sharper public face and a more flexible surface for presenting services and work.',
      },
      {
        title: 'Collaboration',
        description:
          "I worked with the agency's in-house design team to translate the new brand direction into a production React experience with responsive page sections.",
      },
      {
        title: 'Implementation',
        description:
          'The build focused on reusable page composition, polished hero and content modules, and enough flexibility for the site to evolve as the agency repositioned itself.',
      },
    ],
  },
  {
    title: 'Lift Club',
    date: 'Apr 2021',
    tags: ['personal'],
    desktopImgs: [LiftClubMain, LiftClubCommunity],
    mobileImgs: [LiftClubProgress],
    externalLink: 'https://www.liftclub.app/',
    slug: 'liftclub',
    themeColor: '#4361ee',
    summary:
      'I started Lift Club in 2021 as a workout log for my cousin George and me. These days, more than 100 people use it, including a lot of our family and friends.',
    meta: [
      { label: 'Format', value: 'Installable web app' },
      { label: 'Focus', value: 'Strength training' },
    ],
    details: [
      {
        title: 'Why I built it',
        description:
          'I wanted to stop writing down every exercise by hand, so I built a log that remembered our last workout. George has pitched in along the way, from writing part of the workout guide to adding an option to see when an exercise was last saved.',
      },
      {
        title: 'Looking back at a lift',
        description:
          'The log is still the part I built everything around. It shows my last set while I’m entering the next one. The chart gives me the longer view: I can look at a single exercise over a few months instead of flipping back through pages of notes.',
      },
      {
        title: 'The club part',
        description:
          'When George logs a workout, it shows up in my feed. I can open his leg day and see exactly what he did. That’s still my favorite part: recognizing the person behind a workout.',
      },
      {
        title: 'Why I keep working on it',
        description:
          'Lift Club is profitable now, which is pretty cool for something that started with the two of us. A few people have emailed me to say they like using it and ask if I could change one thing. I like getting those emails. They give me a reason to open the project back up and make it a little better for the people who use it.',
      },
    ],
  },
  {
    title: 'Photo Shop',
    date: 'Mar 2021',
    tags: ['personal'],
    desktopImgs: [PhotoMain, PhotoDesktop1, PhotoDesktop2, PhotoDesktop3],
    mobileImgs: [PhotoMobile1, PhotoMobile2],
    externalLink: 'https://awildchristian.com/',
    github: 'https://github.com/ChristianAnagnostou/anagnostou-photography-frontend',
    slug: 'awildchristian',
    themeColor: '#828bc4',
    summary:
      "See the photos on my art page? I'll print them out, sign them, and send them to you if you send me a few shekels",
    meta: [
      { label: 'Stack', value: 'Next.js / Strapi' },
      { label: 'Commerce', value: 'Stripe checkout' },
      { label: 'Auth', value: 'Passwordless login' },
    ],
    details: [
      {
        title: 'Front-end',
        description:
          'Utilizes Next.js for fast page loading times, improved SEO, and control over server-side vs client-side rendering.',
      },
      {
        title: 'Back-end',
        description:
          'Backend controlled by the headless CMS, Strapi, for seamless management of product, order, and customer data.',
      },
      {
        title: 'Features',
        description: 'Password-less authentication with Magic.link and payment processing with Stripe.',
      },
    ],
  },
  {
    title: 'NeoLogos',
    date: 'Feb 2021',
    tags: ['personal'],
    desktopImgs: [NeoLogosMain, NeoLogosDesktop1, NeoLogosDesktop2, NeoLogosDesktop3],
    mobileImgs: [NeoLogosMobile1, NeoLogosMobile2],
    // externalLink: "https://neologos.herokuapp.com/",
    github: 'https://github.com/ChristianAnagnostou/NeoLogos',
    slug: 'neologos',
    themeColor: '#d6b24b',
    summary: 'Ever made of a word for something? Well now you know where to put it.',
    meta: [
      { label: 'Stack', value: 'React / Redux / Express' },
      { label: 'Data', value: 'MongoDB' },
      { label: 'Pattern', value: 'Dictionary + voting' },
    ],
    details: [
      {
        title: 'Front-end',
        description:
          'I used React and Redux as the building blocks for creating the front-end and managing the state of the site. Also, the site features a night mode and is completely mobile friendly.',
      },
      {
        title: 'Back-end',
        description:
          'For the back-end, I used a combination of Express and Mongoose to create my server and schemas for my database.',
      },
      {
        title: 'Deployment',
        description:
          'For this project, I chose to use Heroku as my hosting service as they have a great system for deploying right when you commit to GitHub.',
      },
    ],
  },
  {
    title: 'Music Player',
    date: 'Jan 2021',
    tags: ['personal'],
    desktopImgs: [LofiWavesMain, LofiWavesDesktop],
    mobileImgs: [],
    externalLink: 'http://lofiwaves.surge.sh/',
    github: 'https://github.com/ChristianAnagnostou/LofiWaves',
    slug: 'lofiwaves',
    themeColor: '#c09fd8',
    summary: 'Like lofi? So do I, so why not checkout out some of my faves here',
    meta: [
      { label: 'Stack', value: 'React / SCSS' },
      { label: 'Routing', value: 'React Router' },
      { label: 'Surface', value: 'Music player UI' },
    ],
    details: [
      {
        title: 'Front-end',
        description: 'This project was written entirely in React using tools such as: React Router and SCSS.',
      },
      {
        title: 'Lofi library',
        description:
          'The library consists of lofi beats that I like to listen to while I code. Sit up, zone-in, and code away!',
      },
      {
        title: 'Custom controls',
        description:
          'The app features autoplay and easy-to-use controls for the music player as well as a fully optimized mobile site.',
      },
    ],
  },
]
