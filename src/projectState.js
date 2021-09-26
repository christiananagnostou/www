//Import Images

import liftclubMain from "./img/projects/liftclub-main.jpg";
import liftclubMobile1 from "./img/projects/liftclub-mobile1.jpg";
import liftclubMobile2 from "./img/projects/liftclub-mobile2.jpg";

import wildchristianDesktop1 from "./img/projects/awildchristian-desktop1.jpg";
import wildchristianDesktop2 from "./img/projects/awildchristian-desktop2.jpg";
import wildchristianDesktop3 from "./img/projects/awildchristian-desktop3.jpg";
import wildchristianMobile1 from "./img/projects/awildchristian-mobile1.jpg";
import wildchristianMobile2 from "./img/projects/awildchristian-mobile2.jpg";

import neologosDesktop1 from "./img/projects/neologos-desktop1.jpg";
import neologosDesktop2 from "./img/projects/neologos-desktop2.jpg";
import neologosDesktop3 from "./img/projects/neologos-desktop3.jpg";
import neologosMobile1 from "./img/projects/neologos-mobile1.jpg";
import neologosMobile2 from "./img/projects/neologos-mobile2.jpg";

import lofiMobile from "./img/projects/lofiwaves-mobile.jpg";
import lofiDesktop from "./img/projects/lofiwaves-desktop.jpg";

import vibetribeMobile from "./img/projects/vibetribe-mobile.jpg";
import vibetribeDesktop from "./img/projects/vibetribe-desktop.jpg";

export const projectState = [
  {
    title: "Lift Club",
    desktopImgs: [liftclubMain],
    mobileImgs: [liftclubMobile1, liftclubMobile2],
    externalLink: "https://workout-logger-omega.vercel.app/",
    github: "https://github.com/ChristianAnagnostou/workout-logger",
    url: "/work/liftclub",
    details: [
      {
        title: "Purpose",
        description:
          "Lift club is a social fitness app that gives you the power to find well structured workouts and track your progress as you improve.",
      },
      {
        title: "How to join",
        description:
          "Built to be used as a lightweght PWA, meaning that there is no download required. By adding the web page to your home screen, users can access Lift Club anytime, anywhere",
      },
      {
        title: "Features",
        description:
          "Build workouts from an extensive list of exercises, organize workouts on a calendar to create a schedule to follow, and assemble teams where others can follow your routine.",
      },
    ],
  },
  {
    title: "Photo e-commerce",
    desktopImgs: [wildchristianDesktop1, wildchristianDesktop2, wildchristianDesktop3],
    mobileImgs: [wildchristianMobile1, wildchristianMobile2],
    externalLink: "https://awildchristian.com/",
    github: "https://github.com/ChristianAnagnostou/anagnostou-photography-frontend",
    url: "/work/awildchristian",
    details: [
      {
        title: "Front-end",
        description:
          "Utlizes NextJS for fast page loading times, improved SEO, and control over server-side vs client-side rendering.",
      },
      {
        title: "Back-end",
        description:
          "Backend controlled by the headless CMS, Strapi, for seamless management of product, order, and customer data.",
      },
      {
        title: "Features",
        description:
          "Password-less authentication with Magic.link and payment processing with Stripe.",
      },
    ],
  },
  {
    title: "NeoLogos",
    desktopImgs: [neologosDesktop1, neologosDesktop2, neologosDesktop3],
    mobileImgs: [neologosMobile1, neologosMobile2],
    externalLink: "https://neologos.herokuapp.com/",
    github: "https://github.com/ChristianAnagnostou/NeoLogos",
    url: "/work/neologos",
    details: [
      {
        title: "Front-end",
        description:
          "I used React and Redux as the building blocks for creating the front-end and managing the state of the site. Also, the site features a night mode and is completely mobile friendly.",
      },
      {
        title: "Back-end",
        description:
          "For the back-end, I used a combination of Express and Mongoose create my server and schemas for my database.",
      },
      {
        title: "Deployment",
        description:
          "For this project, I choose to use Heroku as my hosting service as they have a great system for deploying right when you commit to github",
      },
    ],
  },
  // {
  //   title: "Spotify Playlist Creator",
  //   desktopImgs: [vibetribeDesktop],
  //   mobileImgs: [vibetribeMobile],
  //   externalLink: "http://vibetribe.surge.sh/",
  //   github: "https://github.com/ChristianAnagnostou/VibeTribe",
  //   url: "/work/vibetribe",
  //   details: [
  //     {
  //       title: "Front-end",
  //       description:
  //         "Initially made with React classes. Revisited an refactored to use functional components and redux.",
  //     },
  //     {
  //       title: "Spotify",
  //       description: "Features Spotify authentication and full playlist customization",
  //     },
  //     {
  //       title: "Documentation",
  //       description: "Fully documented git repository with a complete step-by-step build process",
  //     },
  //   ],
  // },
  // {
  //   title: "Music Player",
  //   desktopImgs: [lofiDesktop],
  //   mobileImgs: [lofiMobile],
  //   externalLink: "http://lofiwaves.surge.sh/",
  //   github: "https://github.com/ChristianAnagnostou/LofiWaves",
  //   url: "/work/lofiwaves",
  //   details: [
  //     {
  //       title: "Front-end",
  //       description:
  //         "This project was written entirely in React using tools such as: React Router and SCSS.",
  //     },
  //     {
  //       title: "Lofi library",
  //       description:
  //         "The library consists of lofi beats that I like to listen to while I code. Sit up, zone-in, and code away!",
  //     },
  //     {
  //       title: "Custom controls",
  //       description:
  //         "The app features autoplay and easy-to-use controls for the music player as well as a fully optimized mobile site.",
  //     },
  //   ],
  // },
];
