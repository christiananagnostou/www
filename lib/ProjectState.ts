import { Project } from '../types'

// QwikDraw
import QwikDesignHero from '../public/img/projects/qwikdraw/design-hero.webp'
// Electriq Dashboard
import Calendar from '../public/img/projects/electriq-app/calendar.png'
import DashboardComposed from '../public/img/projects/electriq-app/dashboard-composed.webp'
import GanttChart from '../public/img/projects/electriq-app/gantt-chart.png'
import KanbanChart from '../public/img/projects/electriq-app/kanban-chart.webp'
// Soylent
import SoylentCarousel from '../public/img/projects/soylent/carousel.webp'
import SoylentCollage from '../public/img/projects/soylent/collage.webp'
import SoylentCollection from '../public/img/projects/soylent/collection.webp'
import SoylentHomepage from '../public/img/projects/soylent/homepage.webp'
import SoylentPDP from '../public/img/projects/soylent/pdp.webp'
//Scentfill
import ScentfillCarouselMobile from '../public/img/projects/scentfill/carousel.webp'
import SentfillCollage from '../public/img/projects/scentfill/collage.webp'
import SentfillPDPMobile from '../public/img/projects/scentfill/pdp-mobile.webp'
import SentfillPDP from '../public/img/projects/scentfill/pdp.webp'
import SentfillScents from '../public/img/projects/scentfill/scents.webp'
import SentfillWheel from '../public/img/projects/scentfill/wheel.webp'
// Electriq Website
import ElectriqHeroMain from '../public/img/projects/electriq-home/hero-main.png'
import ElectriqWebsite from '../public/img/projects/electriq-home/homepage-composed.webp'
// Lift Club
import LiftClubMain from '../public/img/projects/liftclub/liftclub-main.jpeg'
import LiftClubPurpose from '../public/img/projects/liftclub/liftclub-purpose.png'
import LiftClubUserProfile from '../public/img/projects/liftclub/user-profile.png'
import LiftClubLog from '../public/img/projects/liftclub/workout-log-2.png'
// Photo Shop
import PhotoDesktop1 from '../public/img/projects/awildchristian/desktop1.jpg'
import PhotoDesktop2 from '../public/img/projects/awildchristian/desktop2.jpg'
import PhotoDesktop3 from '../public/img/projects/awildchristian/desktop3.jpg'
import PhotoMain from '../public/img/projects/awildchristian/main.jpeg'
import PhotoMobile1 from '../public/img/projects/awildchristian/mobile1.jpg'
import PhotoMobile2 from '../public/img/projects/awildchristian/mobile2.jpg'
// NeoLogos
import NeoLogosDesktop1 from '../public/img/projects/neologos/neologos-desktop1.jpg'
import NeoLogosDesktop2 from '../public/img/projects/neologos/neologos-desktop2.jpg'
import NeoLogosDesktop3 from '../public/img/projects/neologos/neologos-desktop3.jpg'
import NeoLogosMain from '../public/img/projects/neologos/neologos-main.jpeg'
import NeoLogosMobile1 from '../public/img/projects/neologos/neologos-mobile1.jpg'
import NeoLogosMobile2 from '../public/img/projects/neologos/neologos-mobile2.jpg'
// LofiWaves
import LofiWavesDesktop from '../public/img/projects/lofiwaves/lofiwaves-desktop.jpg'
import LofiWavesMain from '../public/img/projects/lofiwaves/lofiwaves-main.jpeg'

export const ProjectState: Project[] = [
  {
    title: 'QwikDraw',
    date: 'April 2023',
    tags: ['personal'],
    desktopImgs: [QwikDesignHero],
    mobileImgs: [],
    externalLink: 'https://qwikdraw.vercel.app/',
    github: 'https://github.com/ChristianAnagnostou/qwikdraw',
    slug: 'qwikdraw',
    summary: 'A simple web-based design canvas built using the Qwik framework',
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
    summary: 'Showcasing one of my favorite clients',
    details: [],
  },
  {
    title: 'Scentfill',
    date: 'Jul 2022',
    tags: ['commercial'],
    desktopImgs: [SentfillCollage, SentfillWheel, SentfillPDP],
    mobileImgs: [SentfillPDPMobile, ScentfillCarouselMobile, SentfillScents],
    externalLink: 'https://scentfill.com/',
    slug: 'scentfill',
    summary: '...another favorite client',
    details: [],
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
    details: [
      {
        title: 'Purpose',
        description:
          "React web application to give PM's and clients the ability to visualize the progress and make changes to the web department's projects.",
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
    details: [
      {
        title: 'Purpose',
        description:
          'Lift club is a social fitness app that gives you the power to find well structured workouts and track your progress as you improve.',
      },
      {
        title: 'Join',
        description:
          'Best experienced as a lightweght PWA, meaning that there is no download required. By adding the web page to your home screen, users can access Lift Club and have a native-like app experience.',
      },
      {
        title: 'Features',
        description:
          'Build workouts from an extensive list of default exercises, create your own exercises, organize workouts on a calendar to create a schedule to follow, and assemble teams where others can follow your routine, and more.',
      },
      {
        title: 'Documantation',
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
    details: [
      {
        title: 'Front-end',
        description:
          'Utlizes NextJS for fast page loading times, improved SEO, and control over server-side vs client-side rendering.',
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
    details: [
      {
        title: 'Front-end',
        description:
          'I used React and Redux as the building blocks for creating the front-end and managing the state of the site. Also, the site features a night mode and is completely mobile friendly.',
      },
      {
        title: 'Back-end',
        description:
          'For the back-end, I used a combination of Express and Mongoose create my server and schemas for my database.',
      },
      {
        title: 'Deployment',
        description:
          'For this project, I choose to use Heroku as my hosting service as they have a great system for deploying right when you commit to github',
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
