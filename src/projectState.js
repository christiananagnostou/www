//Import Images
import neologosMobile1 from "./img/neologos-mobile1.png";
import neologosDesktop1 from "./img/neologos-desktop1.png";
// import neologosMobile2 from "./img/neologos-mobile2.png";
// import neologosDesktop2 from "./img/neologos-desktop2.png";
import lofiMobile from "./img/lofiwaves-mobile.png";
import lofiDesktop from "./img/lofiwaves-desktop.png";
import spotalistMobile from "./img/spotalist-mobile.png";
import spotalistDesktop from "./img/spotalist-desktop.png";

export const ProjectState = () => {
  return [
    {
      title: "NeoLogos",
      desktopImg: neologosDesktop1,
      mobileImg: neologosMobile1,
      projectLink: "https://neologos.herokuapp.com/",
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
    {
      title: "LofiWaves",
      desktopImg: lofiDesktop,
      mobileImg: lofiMobile,
      projectLink: "http://lofiwaves.surge.sh/",
      url: "/work/lofiwaves",
      details: [
        {
          title: "Front-end",
          description:
            "This project was written entirely in React using tools such as: React Router and SCSS.",
        },
        {
          title: "Lofi library",
          description:
            "The library consists of lofi beats that I like to listen to while I code. Sit up, zone-in, and code away!",
        },
        {
          title: "Custom controls",
          description:
            "The app features autoplay and easy-to-use controls for the music player as well as a fully optimized mobile site.",
        },
      ],
    },
    {
      title: "Spot-A-List",
      desktopImg: spotalistDesktop,
      mobileImg: spotalistMobile,
      projectLink: "http://spotalist.surge.sh/",
      url: "/work/spotalist",
      details: [
        {
          title: "Front-end",
          description:
            "This project was entirely written in React using tools like React Router and SCSS",
        },
        {
          title: "Fresh look on a brutal sport.",
          description:
            "“Lorem Ipsum is simply dummy text of the printing and typesetting industry.”",
        },
        {
          title: "It’s okay lmao.",
          description:
            "“Lorem Ipsum is simply dummy text of the printing and typesetting industry.”",
        },
      ],
    },
  ];
};
