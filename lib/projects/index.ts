import type { StaticImageData } from 'next/image'
// Jukebox
import JukeboxArtists from '../../public/img/projects/jukebox/artists.webp'
import JukeboxCollage from '../../public/img/projects/jukebox/collage.webp'
import JukeboxLibrary from '../../public/img/projects/jukebox/library.webp'
import JukeboxShortcuts from '../../public/img/projects/jukebox/shortcuts.webp'
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
//Scentfill
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
import LiftClubMain from '../../public/img/projects/liftclub/liftclub-main.jpeg'
import LiftClubPurpose from '../../public/img/projects/liftclub/liftclub-purpose.png'
import LiftClubUserProfile from '../../public/img/projects/liftclub/user-profile.png'
import LiftClubLog from '../../public/img/projects/liftclub/workout-log-2.png'
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

type CliShowcaseType = {
  type: 'cli'
  title: string
  description: string
  commands: Array<{
    label: string
    command: string
    output: string[]
  }>
}

export interface ProjectType {
  title: string
  date: string
  tags: string[]
  desktopImgs: StaticImageData[]
  mobileImgs: StaticImageData[]
  externalLink?: string
  externalLinkLabel?: string
  github?: string
  slug: string
  summary: string
  meta: Array<{ label: string; value: string }>
  showcase?: CliShowcaseType
  details: Array<{ title: string; description: string }>
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
            'Global Skills (5)',
            '  codex    → ~/.codex/skills',
            '',
            'git',
            '  agent-browser',
            '  create-pr',
            '  frontend-design',
            '  webapp-testing',
            '',
            'url',
            '  skillbox',
          ],
        },
        {
          label: 'Update',
          command: 'skillbox update',
          output: [
            'Updating 5 skills...',
            '',
            '  ✓ agent-browser',
            '  ✓ create-pr',
            '  ✓ frontend-design',
            '  ✓ webapp-testing',
            '  ✓ skillbox',
            '',
            'Updated 5 of 5 trackable skills.',
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
    desktopImgs: [],
    mobileImgs: [],
    externalLink: 'https://github.com/ChristianAnagnostou/imgpress#readme',
    externalLinkLabel: 'Readme',
    github: 'https://github.com/ChristianAnagnostou/imgpress',
    slug: 'imgpress',
    summary: 'Lightweight macOS menu bar app for batch image conversion and optimization',
    meta: [
      { label: 'Stack', value: 'Swift / SwiftUI' },
      { label: 'Platform', value: 'macOS menu bar' },
      { label: 'Formats', value: 'JPEG, PNG, WebP, AVIF' },
    ],
    details: [
      {
        title: 'Purpose',
        description:
          'ImgPress is a native menu bar utility for dragging in images or folders, choosing output formats, and running repeatable conversion workflows without opening a heavier editor.',
      },
      {
        title: 'Features',
        description:
          'It supports JPEG, PNG, WebP, AVIF, and RAW inputs, with batch processing, conversion progress, size comparisons, pause/resume controls, quick presets, and custom saved presets.',
      },
      {
        title: 'Implementation',
        description:
          "Built with Swift, SwiftUI, and Apple's ImageIO framework for a macOS-first workflow that stays close to the platform instead of wrapping a web app.",
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
    desktopImgs: [JukeboxCollage, JukeboxLibrary, JukeboxArtists, JukeboxShortcuts],
    mobileImgs: [],
    externalLink: 'https://github.com/christiananagnostou/jukebox/releases',
    externalLinkLabel: 'Releases',
    github: 'https://github.com/ChristianAnagnostou/jukebox',
    slug: 'jukebox',
    summary: 'Keyboard-centric desktop music player made with Tauri + Qwik',
    meta: [
      { label: 'Stack', value: 'Tauri / Qwik / Rust' },
      { label: 'Platform', value: 'macOS, Windows, Linux' },
      { label: 'Focus', value: 'Local music libraries' },
    ],
    details: [
      {
        title: 'Purpose',
        description:
          'Jukebox is a desktop music player for managing and playing local digital music collections without giving up the keyboard-first feel of a developer tool.',
      },
      {
        title: 'Library',
        description:
          'The app supports bulk music import, dedicated library views for tracks, artists, and albums, and advanced search so larger collections stay browsable.',
      },
      {
        title: 'Controls',
        description:
          'Keyboard shortcuts are a core part of the interaction model, making common playback and navigation flows fast without relying on pointer-heavy UI.',
      },
      {
        title: 'Shell',
        description:
          'Built with Tauri, Qwik, TypeScript, and Rust to keep the desktop wrapper lightweight while still using a web UI for the music library experience.',
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
    desktopImgs: [LiftClubMain, LiftClubPurpose],
    mobileImgs: [LiftClubUserProfile, LiftClubLog],
    externalLink: 'https://liftclub.app/',
    github: 'https://github.com/ChristianAnagnostou/liftclub',
    slug: 'liftclub',
    summary: 'Track your workout progress with little effort and gain big insights',
    meta: [
      { label: 'Stack', value: 'TypeScript / PWA' },
      { label: 'Focus', value: 'Workout tracking' },
      { label: 'Model', value: 'Social fitness app' },
    ],
    details: [
      {
        title: 'Purpose',
        description:
          'Lift club is a social fitness app that gives you the power to find well structured workouts and track your progress as you improve.',
      },
      {
        title: 'Join',
        description:
          'Best experienced as a lightweight PWA, meaning that there is no download required. By adding the web page to your home screen, users can access Lift Club and have a native-like app experience.',
      },
      {
        title: 'Features',
        description:
          'Build workouts from an extensive list of default exercises, create your own exercises, organize workouts on a calendar to create a schedule to follow, and assemble teams where others can follow your routine, and more.',
      },
      {
        title: 'Documentation',
        description:
          'Check out the README.md file in the Github repository for up-to-date documentation on how to install and use the app.',
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
