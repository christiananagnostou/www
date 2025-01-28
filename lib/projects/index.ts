import { Project } from '../../types'

// Jukebox
import JukeboxArtists from '/public/img/projects/jukebox/artists.webp'
import JukeboxCollage from '/public/img/projects/jukebox/collage.webp'
import JukeboxLibrary from '/public/img/projects/jukebox/library.webp'
import JukeboxShortcuts from '/public/img/projects/jukebox/shortcuts.webp'
// QwikDraw
import QwikDesignHero from '/public/img/projects/qwikdraw/design-hero.webp'
// Electriq Dashboard
import Calendar from '/public/img/projects/electriq-app/calendar.png'
import DashboardComposed from '/public/img/projects/electriq-app/dashboard-composed.webp'
import GanttChart from '/public/img/projects/electriq-app/gantt-chart.png'
import KanbanChart from '/public/img/projects/electriq-app/kanban-chart.webp'
// Soylent
import SoylentCarousel from '/public/img/projects/soylent/carousel.webp'
import SoylentCollage from '/public/img/projects/soylent/collage.webp'
import SoylentCollection from '/public/img/projects/soylent/collection.webp'
import SoylentHomepage from '/public/img/projects/soylent/homepage.webp'
import SoylentPDP from '/public/img/projects/soylent/pdp.webp'
//Scentfill
import ScentfillCarouselMobile from '/public/img/projects/scentfill/carousel.webp'
import SentfillCollage from '/public/img/projects/scentfill/collage.webp'
import SentfillPDPMobile from '/public/img/projects/scentfill/pdp-mobile.webp'
import SentfillPDP from '/public/img/projects/scentfill/pdp.webp'
import SentfillScents from '/public/img/projects/scentfill/scents.webp'
import SentfillWheel from '/public/img/projects/scentfill/wheel.webp'
// Electriq Website
import ElectriqHeroMain from '/public/img/projects/electriq-home/hero-main.png'
import ElectriqWebsite from '/public/img/projects/electriq-home/homepage-composed.webp'
// Lift Club
import LiftClubMain from '/public/img/projects/liftclub/liftclub-main.jpeg'
import LiftClubPurpose from '/public/img/projects/liftclub/liftclub-purpose.png'
import LiftClubUserProfile from '/public/img/projects/liftclub/user-profile.png'
import LiftClubLog from '/public/img/projects/liftclub/workout-log-2.png'
// Photo Shop
import PhotoDesktop1 from '/public/img/projects/awildchristian/desktop1.jpg'
import PhotoDesktop2 from '/public/img/projects/awildchristian/desktop2.jpg'
import PhotoDesktop3 from '/public/img/projects/awildchristian/desktop3.jpg'
import PhotoMain from '/public/img/projects/awildchristian/main.jpeg'
import PhotoMobile1 from '/public/img/projects/awildchristian/mobile1.jpg'
import PhotoMobile2 from '/public/img/projects/awildchristian/mobile2.jpg'
// NeoLogos
import NeoLogosDesktop1 from '/public/img/projects/neologos/neologos-desktop1.jpg'
import NeoLogosDesktop2 from '/public/img/projects/neologos/neologos-desktop2.jpg'
import NeoLogosDesktop3 from '/public/img/projects/neologos/neologos-desktop3.jpg'
import NeoLogosMain from '/public/img/projects/neologos/neologos-main.jpeg'
import NeoLogosMobile1 from '/public/img/projects/neologos/neologos-mobile1.jpg'
import NeoLogosMobile2 from '/public/img/projects/neologos/neologos-mobile2.jpg'
// LofiWaves
import LofiWavesDesktop from '/public/img/projects/lofiwaves/lofiwaves-desktop.jpg'
import LofiWavesMain from '/public/img/projects/lofiwaves/lofiwaves-main.jpeg'
export const ProjectState: Project[] = [
  {
    title: 'Jukebox',
    date: 'Jun 2023',
    tags: ['personal'],
    desktopImgs: [JukeboxCollage, JukeboxLibrary, JukeboxArtists, JukeboxShortcuts],
    mobileImgs: [],
    externalLink: 'https://github.com/christiananagnostou/jukebox/releases',
    github: 'https://github.com/ChristianAnagnostou/jukebox',
    slug: 'jukebox',
    summary: 'Keyboard-centric desktop music player made with Tauri + Qwik',
    details: [
      {
        title: 'Overview',
        description:
          'Jukebox is a keyboard-centric desktop music player designed to offer a seamless and efficient music listening experience. Built using Tauri for a lightweight and secure application framework, combined with the Qwik framework for a highly responsive user interface.',
      },
      {
        title: 'Features',
        description:
          'Jukebox includes features such as library management, artist categorization, and customizable keyboard shortcuts to enhance user productivity. The application supports various audio formats and offers a minimalist design focused on usability.',
      },
      {
        title: 'Technologies Used',
        description:
          'The application leverages Tauri for building the desktop environment, ensuring low resource consumption and high performance. Qwik is utilized for its fine-grained reactivity, enabling rapid UI updates and a smooth user experience.',
      },
      {
        title: 'Future Enhancements',
        description:
          'Future updates will include mobile image support, integration with streaming services, and advanced playlist management. Additionally, plans are in place to incorporate user authentication and cloud synchronization for personalized settings across devices.',
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
    details: [
      {
        title: 'Objective',
        description:
          "QwikDraw was developed to explore the capabilities of the Qwik framework by creating a challenging and interactive design tool. Initially conceptualized as a grid-based shape builder, the project evolved into a versatile shape and image manipulation canvas to better demonstrate Qwik's performance and scalability.",
      },
      {
        title: 'Challenges',
        description:
          'One of the primary challenges was adhering to the constraint of not using any external libraries beyond the Qwik framework itself. This necessitated the development of custom solutions for complex features such as the color picker, zooming and panning functionalities, keyboard shortcuts, and dynamic resizing of elements. Overcoming these challenges required in-depth understanding of Qwik’s reactive system and efficient state management.',
      },
      {
        title: 'Technologies Used',
        description:
          'The application is built entirely with the Qwik framework, leveraging its fine-grained reactivity for optimal performance. Custom CSS and JavaScript were utilized to implement interactive features without relying on third-party libraries.',
      },
      {
        title: 'Future Enhancements',
        description:
          'Planned future enhancements include multi-select functionality, allowing users to rearrange multiple elements simultaneously, and the addition of new shape types such as triangles. There is also consideration for migrating the rendering logic to the HTML5 Canvas API or WebGL to improve performance and expand graphical capabilities.',
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
        description:
          'Electriq Dashboard is a project management tool designed to integrate seamlessly with Linear. It provides enhanced data visualization capabilities, allowing teams to gain deeper insights into their projects through interactive timelines, Kanban boards, Gantt charts, and calendar views.',
      },
      {
        title: 'Motivation',
        description:
          'Linear lacks native timeline support for project planning, which can hinder the ability to visualize project schedules and dependencies effectively. Electriq Dashboard addresses this gap by offering robust timeline features and additional visualization tools to facilitate better project management and planning.',
      },
      {
        title: 'Key Features',
        description:
          'The dashboard includes real-time data sync with Linear, interactive Gantt charts for project scheduling, Kanban boards for task management, and calendar integrations for deadline tracking. Additionally, it offers live feedback mechanisms, enabling team members to communicate directly within the dashboard, enhancing collaboration and workflow efficiency.',
      },
      {
        title: 'Technologies Used',
        description:
          'Developed using modern web technologies, Electriq Dashboard utilizes React for the frontend, Node.js for the backend, and integrates with Linear’s API for data retrieval. Data visualization components are fully custom with interactive and responsive designs.',
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
    details: [
      {
        title: 'Overview',
        description:
          'Scentfill is an innovative platform developed for a leading client in the fragrance industry. The website serves as both an e-commerce platform and a brand showcase, highlighting Scentfill’s diverse range of products and services.',
      },
      {
        title: 'Features',
        description:
          'The website features an interactive scent wheel for product exploration, detailed product pages with high-resolution images, and a mobile-optimized carousel for an enhanced browsing experience on smaller devices. Additional functionalities include user account management, secure checkout, and real-time order tracking.',
      },
      {
        title: 'Technologies Used',
        description:
          'Utilized modern web technologies such as React for building a dynamic frontend, coupled with a robust backend powered by Node.js and Express. Integrated with payment gateways and inventory management systems to ensure seamless operations.',
      },
      {
        title: 'Design and UX',
        description:
          'Worked collaboratively with the client’s design team to create a luxurious and engaging user interface. Employed responsive design techniques to guarantee that the website delivers a consistent experience across all devices.',
      },
      {
        title: 'Maintenance and Optimization',
        description:
          'Implemented SEO best practices to improve search engine visibility and drive organic traffic. Provided ongoing maintenance services, including performance optimization and feature enhancements based on user feedback and evolving business needs.',
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
    details: [
      {
        title: 'Purpose',
        description:
          "Electriq's website serves as the digital face for Electriq's marketing agency. The primary goal was to effectively showcase the agency's portfolio, services, and expertise to attract potential clients and establish a strong online presence.",
      },
      {
        title: 'Design and Development',
        description:
          'Collaborated closely with the in-house design team to develop a cohesive rebranding strategy. The website features parallax scrolling animations, dynamic content sections, and an interactive ThreeJS-animated sphere to engage visitors and highlight key aspects of the agency’s offerings.',
      },
      {
        title: 'Technologies Used',
        description:
          'Built using modern web technologies including React for the frontend, ThreeJS for interactive 3D animations, and CSS3 for advanced styling and responsive design. The website is optimized for performance and accessibility across all devices.',
      },
      {
        title: 'Features',
        description:
          'Key features include a responsive design ensuring optimal viewing on all devices, interactive animations to enhance user engagement, and a content management system (CMS) integration for easy updates and maintenance by the agency’s team.',
      },
      {
        title: 'Outcome',
        description:
          'The revamped website successfully enhanced Electriq’s online presence, providing an engaging platform that effectively communicates the agency’s value proposition and attracts new clients. User feedback has been overwhelmingly positive, citing the site’s modern design and intuitive navigation.',
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
    slug: 'liftclub',
    summary: 'Track your workout progress with little effort and gain big insights',
    details: [
      {
        title: 'Purpose',
        description:
          'Lift Club is a social fitness application designed to empower users to discover well-structured workouts and meticulously track their progress over time. By fostering a community-driven environment, Lift Club encourages consistent training and mutual support among fitness enthusiasts.',
      },
      {
        title: 'Features',
        description:
          'Users can build personalized workouts from an extensive library of default exercises or create their own custom exercises. The app allows scheduling workouts on a built-in calendar, organizing routines into manageable plans, and assembling teams where members can follow and support each other’s fitness journeys.',
      },
      {
        title: 'Progress Tracking',
        description:
          'Lift Club provides detailed analytics and insights into workout performance, enabling users to monitor their improvements and adjust their training plans accordingly. Visual progress charts and milestone achievements help maintain motivation and accountability.',
      },
      {
        title: 'Technologies Used',
        description:
          'Developed as a Progressive Web App (PWA) using React for the frontend, ensuring a native-like experience without the need for downloads. Utilized modern web technologies to enable offline access, push notifications, and seamless synchronization across devices.',
      },
      {
        title: 'User Experience',
        description:
          'Designed with a focus on simplicity and ease of use, Lift Club offers an intuitive interface that allows users to quickly set up and manage their workouts. The lightweight PWA ensures fast loading times and smooth interactions, enhancing overall user satisfaction.',
      },
      {
        title: 'Documentation',
        description:
          'Comprehensive documentation is available in the README.md file within the GitHub repository, providing detailed instructions on installation, usage, and contribution guidelines. This ensures that users and developers can easily navigate and utilize the application’s features.',
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
          'Utilizes Next.js to deliver fast page loading times, improved SEO, and granular control over server-side versus client-side rendering. The frontend is designed to provide a visually appealing and responsive interface for showcasing photography portfolios.',
      },
      {
        title: 'Back-end',
        description:
          'The backend is managed by Strapi, a headless CMS, enabling seamless management of product listings, orders, and customer data. This allows for easy content updates and scalability as the business grows.',
      },
      {
        title: 'Features',
        description:
          'Incorporates password-less authentication using Magic.link for secure and user-friendly access. Payment processing is handled through Stripe, ensuring reliable and secure transactions. The platform also includes features such as image galleries, shopping carts, and order tracking to enhance the user experience.',
      },
      {
        title: 'E-commerce Integration',
        description:
          'Designed to support the sale of physical prints, the website allows users to browse, select, and purchase photographs with ease. Integration with inventory management systems ensures real-time stock updates and efficient order fulfillment.',
      },
      {
        title: 'Responsive Design',
        description:
          'The website is fully responsive, providing an optimal viewing experience across a wide range of devices, from desktops to mobile phones. High-resolution images are optimized for fast loading without compromising quality.',
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
    summary: 'Ever made up a word for something? Well now you know where to put it.',
    details: [
      {
        title: 'Front-end',
        description:
          'Built with React and Redux, the frontend of NeoLogos provides a dynamic and interactive user interface. The application features a night mode for user comfort and is fully responsive, ensuring compatibility across various devices and screen sizes.',
      },
      {
        title: 'Back-end',
        description:
          'The backend is developed using Express.js and Mongoose, facilitating the creation of a robust server and structured database schemas. This combination ensures efficient data handling and scalability as the application grows.',
      },
      {
        title: 'Deployment',
        description:
          'Deployed on Heroku, leveraging its seamless integration with GitHub for continuous deployment. This setup allows for automatic updates upon committing changes to the repository, ensuring that the live application remains up-to-date with the latest codebase.',
      },
      {
        title: 'Features',
        description:
          'Users can create, edit, and categorize newly coined words, providing definitions and usage examples. The platform encourages community engagement through word suggestions and voting, fostering a collaborative environment for language enthusiasts.',
      },
      {
        title: 'User Experience',
        description:
          'Designed with simplicity and usability in mind, NeoLogos offers an intuitive navigation system and clean layout. Users can easily search for existing words, browse categories, and contribute new entries with minimal effort.',
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
    summary: 'Like lofi? So do I, so why not check out some of my favorites here',
    details: [
      {
        title: 'Front-end',
        description:
          'Developed entirely in React, the Music Player application leverages React Router for seamless navigation and SCSS for modular and maintainable styling. The frontend is optimized for performance and user engagement.',
      },
      {
        title: 'Lofi Library',
        description:
          'Features a curated library of lofi beats that are perfect for coding, studying, or relaxing. Users can browse through a diverse selection of tracks, each meticulously selected to enhance focus and productivity.',
      },
      {
        title: 'Custom Controls',
        description:
          'Includes intuitive playback controls such as play, pause, skip, and volume adjustment. The application also supports autoplay functionality, ensuring continuous music playback without user intervention. Additionally, the site is fully optimized for mobile devices, providing a smooth and responsive experience on the go.',
      },
      {
        title: 'User Experience',
        description:
          'Designed with a minimalist aesthetic to reduce distractions and create a calming environment. The interface is user-friendly, allowing easy navigation through the music library and effortless control over playback settings.',
      },
      {
        title: 'Technologies Used',
        description:
          'Built with React for a dynamic and responsive user interface. Utilizes React Router for efficient client-side routing and SCSS for advanced styling capabilities. The application is deployed using Surge, ensuring quick and reliable access for users.',
      },
    ],
  },
]
