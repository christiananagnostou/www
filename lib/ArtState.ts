import { StaticImageData } from "next/image";

// Snow
import Angel from "../public/img/art/photography/angel.jpg";
import Blizzard from "../public/img/art/photography/blizzard.jpg";
import GeorgeSnow from "../public/img/art/photography/george_snow.jpg";
import Meadow from "../public/img/art/photography/meadow.jpg";
import SkiLift from "../public/img/art/photography/ski_lift.jpg";
import SnowBridge from "../public/img/art/photography/snow_bridge.jpg";
import SnowWatch from "../public/img/art/photography/snow_watch.jpg";

// Shadow
import Alan from "../public/img/art/photography/alan.jpg";
import BuildingShadows from "../public/img/art/photography/building_shadows.jpg";
import Chair from "../public/img/art/photography/chair.jpg";
import ChineseBalloon from "../public/img/art/photography/chinese_balloon.jpg";
import Crow from "../public/img/art/photography/crow.jpg";
import Esclator from "../public/img/art/photography/esclalator.jpg";
import JessieSucc from "../public/img/art/photography/jessie_succ.jpg";
import OrangeWall from "../public/img/art/photography/orange_wall.jpg";
import StairShadow from "../public/img/art/photography/stair_shadow.jpg";

// Isolation
import Basketball from "../public/img/art/photography/basketball.jpg";
import BrickWall from "../public/img/art/photography/brick_wall.jpg";
import FancyBag from "../public/img/art/photography/fancy_bag.jpg";
import Umbrella from "../public/img/art/photography/umbrella.jpg";

// People
import AsianFlute from "../public/img/art/photography/asian_flute.jpg";
import Denim from "../public/img/art/photography/denim.jpg";
import DressyMan from "../public/img/art/photography/dressy_man.jpg";
import Jesus from "../public/img/art/photography/jesus.jpg";
import Painter from "../public/img/art/photography/painter.jpg";
import Painter2 from "../public/img/art/photography/painter2.jpg";
import ReadingMan from "../public/img/art/photography/reading_man.jpg";
import Stipple from "../public/img/art/photography/stipple.jpg";
import WindowWatcher from "../public/img/art/photography/window_watcher.jpg";

// Cars
import BeachCadillac from "../public/img/art/photography/beach_cadillac.jpg";
import BurntCar from "../public/img/art/photography/burnt_car.jpg";
import BurntCar2 from "../public/img/art/photography/burnt_car2.jpg";
import Symboism from "../public/img/art/photography/symbolism.jpg";
import WhiteBus from "../public/img/art/photography/white_bus.jpg";

// City
import Capitol from "../public/img/art/photography/capitol.jpg";
import Church from "../public/img/art/photography/church.jpg";
import Reflection from "../public/img/art/photography/reflection.jpg";
import Salesforce from "../public/img/art/photography/salesforce.jpg";
import Trolly from "../public/img/art/photography/trolly.jpg";

// Earth
import Horseshoe from "../public/img/art/photography/horseshoe.jpg";
import MonumentValley from "../public/img/art/photography/monument_valley.jpg";
import RockWave from "../public/img/art/photography/rock_wave.jpg";
import Zion1 from "../public/img/art/photography/zion1.jpg";
import Zion2 from "../public/img/art/photography/zion2.jpg";

// B&W
import AdobeBNW from "../public/img/art/photography/adobe_bnw.jpg";
import ArrowUp from "../public/img/art/photography/arrow_up.jpg";
import BirdShit from "../public/img/art/photography/bird_shit.jpg";
import Coit from "../public/img/art/photography/coit.jpg";
import DadSoccer from "../public/img/art/photography/dad_soccer.jpg";
import GoldenGate from "../public/img/art/photography/golden_gate.jpg";
import Levels from "../public/img/art/photography/levels.jpg";
import Satalite from "../public/img/art/photography/satalite.jpg";
import Skateboard from "../public/img/art/photography/skateboard.jpg";

// Drawings

interface ArtStateType {
  [name: string]: StaticImageData[];
}

export const ArtState: ArtStateType = {
  Camera: [
    // Snow
    SkiLift,
    GeorgeSnow,
    Blizzard,
    Angel,
    SnowWatch,
    SnowBridge,
    Meadow,

    // Shadow
    Alan,
    BuildingShadows,
    Chair,
    StairShadow,
    JessieSucc,
    ChineseBalloon,
    Crow,
    OrangeWall,
    Esclator,

    // Isolation
    Umbrella,
    BrickWall,
    FancyBag,
    Basketball,

    // People
    Stipple,
    AsianFlute,
    Denim,
    WindowWatcher,
    DressyMan,
    ReadingMan,
    Painter,
    Painter2,
    Jesus,

    // Cars
    Symboism,
    BeachCadillac,
    BurntCar2,
    WhiteBus,
    BurntCar,

    // City
    Trolly,
    Salesforce,
    Reflection,
    Capitol,
    Church,

    // Earch
    MonumentValley,
    Horseshoe,
    RockWave,
    Zion1,
    Zion2,

    // B&W
    Coit,
    ArrowUp,
    Satalite,
    AdobeBNW,
    BirdShit,
    Levels,
    GoldenGate,
    Skateboard,
    DadSoccer,
  ],

  // Pencil: [TheBrokenTriplet],
};
