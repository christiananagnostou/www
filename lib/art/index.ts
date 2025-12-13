/*

Steps to add a new image:
1. Export images from Lightroom
2. Convert images to webp format
    squish -f webp -r 0.4 -q 85 -o . *
3. Get image metadata: 
    mdls -attr _kMDItemDisplayNameWithExtensions -attr kMDItemContentCreationDate *.webp 
4. Add the images to the public/img/art/photography directory
5. Add the image to the ArtImages array below

*/

import { StaticImageData } from 'next/image'

import AdobeBNW from '../../public/img/art/photography/adobe_bnw.jpg'
import AdobeBuildings from '../../public/img/art/photography/adobe_buildings.jpg'
import Alan from '../../public/img/art/photography/alan.jpg'
import Angel from '../../public/img/art/photography/angel.jpg'
import ArrowUp from '../../public/img/art/photography/arrow_up.jpg'
import AsianFlute from '../../public/img/art/photography/asian_flute.jpg'
import BaseballLastOaklandGame from '../../public/img/art/photography/baseball_last_oakland_game.webp'
import BaseballOakland from '../../public/img/art/photography/baseball_oakland.webp'
import Basketball from '../../public/img/art/photography/basketball.jpg'
import BayBike from '../../public/img/art/photography/bay_bike.jpg'
import BeachCadillac from '../../public/img/art/photography/beach_cadillac.jpg'
import BikeWhiteBg from '../../public/img/art/photography/bike_white_bg.webp'
import BirdShit from '../../public/img/art/photography/bird_shit.jpg'
import Blizzard from '../../public/img/art/photography/blizzard.jpg'
import BNWBaseball from '../../public/img/art/photography/bnw_baseball.jpg'
import BrickWall from '../../public/img/art/photography/brick_wall.jpg'
import BuildingShadows from '../../public/img/art/photography/building_shadows.jpg'
import BurntCar from '../../public/img/art/photography/burnt_car.jpg'
import BurntCar2 from '../../public/img/art/photography/burnt_car2.jpg'
import Capitol from '../../public/img/art/photography/capitol.jpg'
import CapitolaWetsuit from '../../public/img/art/photography/capitola_wetsuit.jpg'
import Chair from '../../public/img/art/photography/chair.jpg'
import ChicagoCubs from '../../public/img/art/photography/chicago_cubs.webp'
import ChicagoDowntown from '../../public/img/art/photography/chicago_downtown.webp'
import ChineseBalloon from '../../public/img/art/photography/chinese_balloon.jpg'
import Church from '../../public/img/art/photography/church.jpg'
import CoastLighthouse from '../../public/img/art/photography/coast_lighthouse.jpg'
import CoastLighthouseHouse from '../../public/img/art/photography/coast_lighthouse_house.jpg'
import Coit from '../../public/img/art/photography/coit.jpg'
import Crow from '../../public/img/art/photography/crow.jpg'
import DadSoccer from '../../public/img/art/photography/dad_soccer.jpg'
import Denim from '../../public/img/art/photography/denim.jpg'
import DiabloSunrise from '../../public/img/art/photography/diablo_sunrise.jpg'
import DressyMan from '../../public/img/art/photography/dressy_man.jpg'
import Esclator from '../../public/img/art/photography/esclalator.jpg'
import FaloliPool from '../../public/img/art/photography/faloli_pool.jpg'
import FancyBag from '../../public/img/art/photography/fancy_bag.jpg'
import FoggyHike from '../../public/img/art/photography/foggy_hike.jpg'
import GeorgeSnow from '../../public/img/art/photography/george_snow.jpg'
import GoldenGate from '../../public/img/art/photography/golden_gate.jpg'
import Hawaii2Dolphins from '../../public/img/art/photography/hawaii_2_dolphins.webp'
import Hawaii2Farm from '../../public/img/art/photography/hawaii_2_farm.webp'
import Hawaii2Lizard from '../../public/img/art/photography/hawaii_2_lizard.webp'
import Hawaii2Rainbow from '../../public/img/art/photography/hawaii_2_rainbow.webp'
import Hawaii2Saplings from '../../public/img/art/photography/hawaii_2_saplings.webp'
import Hawaii2Tennis from '../../public/img/art/photography/hawaii_2_tennis.webp'
import HawaiiLeaves from '../../public/img/art/photography/hawaii_leaves.jpg'
import HawaiiWaterfall from '../../public/img/art/photography/hawaii_waterfall.jpg'
import HearstPools from '../../public/img/art/photography/hearst_pools.webp'
import HMBChess from '../../public/img/art/photography/hmb_chess.jpg'
import Horseshoe from '../../public/img/art/photography/horseshoe.jpg'
import IsolationRedVinyl from '../../public/img/art/photography/isolation_red-vinyl.webp'
import JessiePorch from '../../public/img/art/photography/jessie_porch.jpg'
import JessieSucc from '../../public/img/art/photography/jessie_succ.jpg'
import JessieVines from '../../public/img/art/photography/jessie_vines.jpg'
import Jesus from '../../public/img/art/photography/jesus.jpg'
import Levels from '../../public/img/art/photography/levels.jpg'
import Meadow from '../../public/img/art/photography/meadow.jpg'
import MilwaukeeBrewers from '../../public/img/art/photography/milwaukee_brewers.webp'
import MonumentValley from '../../public/img/art/photography/monument_valley.jpg'
import NYCentralPark from '../../public/img/art/photography/ny_central_park.webp'
import NYMetPainting from '../../public/img/art/photography/ny_met_painting.webp'
import OrangeWall from '../../public/img/art/photography/orange_wall.jpg'
import PacificaFisherman from '../../public/img/art/photography/pacifica_fisherman.jpg'
import Painter from '../../public/img/art/photography/painter.jpg'
import Painter2 from '../../public/img/art/photography/painter2.jpg'
import PhoebePouch from '../../public/img/art/photography/phoebe_pouch.jpg'
import PhoebeSleeping from '../../public/img/art/photography/phoebe_sleeping.jpg'
import ReadingMan from '../../public/img/art/photography/reading_man.jpg'
import Reflection from '../../public/img/art/photography/reflection.jpg'
import RockWave from '../../public/img/art/photography/rock_wave.jpg'
import Salesforce from '../../public/img/art/photography/salesforce.jpg'
import Satellite from '../../public/img/art/photography/satellite.jpg'
import SausalitoBoat from '../../public/img/art/photography/sausalito_boat.jpg'
import SeattleChelan from '../../public/img/art/photography/seattle_chelan.webp'
import SeattleGolden from '../../public/img/art/photography/seattle_golden.webp'
import SeattleGoldens from '../../public/img/art/photography/seattle_goldens.webp'
import SeattleMariners from '../../public/img/art/photography/seattle_mariners.webp'
import SeattleWineBar from '../../public/img/art/photography/seattle_wine_bar.webp'
import SFBuildings1 from '../../public/img/art/photography/sf_buildings_1.jpg'
import SFBuildings2 from '../../public/img/art/photography/sf_buildings_2.jpg'
import SFBuildings3 from '../../public/img/art/photography/sf_buildings_3.jpg'
import SFColorfulBuilding from '../../public/img/art/photography/sf_colorful_building.jpg'
import SFGiantsSunset from '../../public/img/art/photography/sf_giants_sunset.jpg'
import SFJapaneseHut from '../../public/img/art/photography/sf_japanese_hut.jpg'
import SFParkedCar from '../../public/img/art/photography/sf_parked_car.jpg'
import SFRockTree from '../../public/img/art/photography/sf_rock_tree.jpg'
import SFRustyCar from '../../public/img/art/photography/sf_rusty_car.webp'
import Skateboard from '../../public/img/art/photography/skateboard.jpg'
import SkiLift from '../../public/img/art/photography/ski_lift.jpg'
import SkylineHike from '../../public/img/art/photography/skyline_hike.jpg'
import SnowBridge from '../../public/img/art/photography/snow_bridge.jpg'
import SnowWatch from '../../public/img/art/photography/snow_watch.jpg'
import SonomaGrapes1 from '../../public/img/art/photography/sonoma_grapes_1.jpg'
import SonomaGrapes2 from '../../public/img/art/photography/sonoma_grapes_2.jpg'
import SonomaTruck from '../../public/img/art/photography/sonoma_truck.jpg'
import SonomaVineyardSunset from '../../public/img/art/photography/sonoma_vineyard_sunset.jpg'
import StairShadow from '../../public/img/art/photography/stair_shadow.jpg'
import Stipple from '../../public/img/art/photography/stipple.jpg'
import Symboism from '../../public/img/art/photography/symbolism.jpg'
import TahoeHazySunset from '../../public/img/art/photography/tahoe_hazy_sunset.jpg'
import TahoeMeadow from '../../public/img/art/photography/tahoe_meadow.webp'
import TahoeMeadowJessie from '../../public/img/art/photography/tahoe_meadow_jessie.webp'
import TowedCar from '../../public/img/art/photography/towed_car.jpg'
import Trolly from '../../public/img/art/photography/trolly.jpg'
import Umbrella from '../../public/img/art/photography/umbrella.jpg'
import WelcomeNewMexico from '../../public/img/art/photography/welcome_new_mexico.jpg'
import WhiteBus from '../../public/img/art/photography/white_bus.jpg'
import WindowWatcher from '../../public/img/art/photography/window_watcher.jpg'
import Zion1 from '../../public/img/art/photography/zion1.jpg'
import Zion2 from '../../public/img/art/photography/zion2.jpg'

export interface ArtImage {
  id: string
  title: string
  date: string // ISO date string
  tags: string[]
  image: StaticImageData
}

export const ArtImages: ArtImage[] = [
  // Bike
  {
    id: 'bike_white_bg',
    title: 'Byxbee Park',
    date: '2025-03-30T00:00:00Z',
    tags: ['Bike'],
    image: BikeWhiteBg,
  },
  {
    id: 'bay_bike',
    title: 'Bay Bike',
    date: '2024-07-01T00:00:00Z',
    tags: ['Bike'],
    image: BayBike,
  },
  // Hawaii - Sept 2023
  {
    id: 'hawaii_leaves',
    title: 'Hawaii Leaves',
    date: '2023-09-01T00:00:00Z',
    tags: ['Hawaii', 'Nature'],
    image: HawaiiLeaves,
  },
  {
    id: 'hawaii_waterfall',
    title: 'Hawaii Waterfall',
    date: '2023-09-01T00:00:00Z',
    tags: ['Hawaii', 'Nature'],
    image: HawaiiWaterfall,
  },
  // Filoli - May 2022
  {
    id: 'faloli_pool',
    title: 'Filoli Pool',
    date: '2022-05-01T00:00:00Z',
    tags: [],
    image: FaloliPool,
  },
  // Dogs - Jul 2021
  {
    id: 'phoebe_pouch',
    title: 'Phoebe Pouch',
    date: '2021-07-01T00:00:00Z',
    tags: ['Dogs'],
    image: PhoebePouch,
  },
  {
    id: 'phoebe_sleeping',
    title: 'Phoebe Sleeping',
    date: '2021-07-01T00:00:00Z',
    tags: ['Dogs'],
    image: PhoebeSleeping,
  },
  // Hikes - May 2021
  {
    id: 'foggy_hike',
    title: 'Foggy Hike',
    date: '2021-05-01T00:00:00Z',
    tags: ['Nature'],
    image: FoggyHike,
  },
  {
    id: 'skyline_hike',
    title: 'Skyline Hike',
    date: '2021-05-01T00:00:00Z',
    tags: ['Nature'],
    image: SkylineHike,
  },
  // Half Moon Bay - May 2021
  {
    id: 'hmb_chess',
    title: 'Half Moon Bay Chess',
    date: '2021-05-01T00:00:00Z',
    tags: [],
    image: HMBChess,
  },
  // Dogs - Jan 2021
  {
    id: 'jessie_porch',
    title: 'Jessie on the Porch',
    date: '2021-01-01T00:00:00Z',
    tags: ['Dogs'],
    image: JessiePorch,
  },
  {
    id: 'jessie_vines',
    title: 'Jessie in the Vines',
    date: '2021-01-01T00:00:00Z',
    tags: ['Dogs'],
    image: JessieVines,
  },
  // Tahoe - Dec 2020
  {
    id: 'angel',
    title: 'Tahoe Angel',
    date: '2020-12-01T00:00:00Z',
    tags: ['Tahoe'],
    image: Angel,
  },
  {
    id: 'blizzard',
    title: 'Tahoe Blizzard',
    date: '2020-12-01T00:00:00Z',
    tags: ['Tahoe'],
    image: Blizzard,
  },
  {
    id: 'george_snow',
    title: 'George Snow',
    date: '2020-12-01T00:00:00Z',
    tags: ['Tahoe'],
    image: GeorgeSnow,
  },
  {
    id: 'meadow',
    title: 'Tahoe Meadow',
    date: '2020-12-01T00:00:00Z',
    tags: ['Tahoe', 'Nature'],
    image: Meadow,
  },
  {
    id: 'ski_lift',
    title: 'Tahoe Ski Lift',
    date: '2020-12-01T00:00:00Z',
    tags: ['Tahoe'],
    image: SkiLift,
  },
  {
    id: 'snow_bridge',
    title: 'Tahoe Snow Bridge',
    date: '2020-12-01T00:00:00Z',
    tags: ['Tahoe'],
    image: SnowBridge,
  },
  {
    id: 'snow_watch',
    title: 'Tahoe Snow Watch',
    date: '2020-12-01T00:00:00Z',
    tags: ['Tahoe'],
    image: SnowWatch,
  },
  // Cars - Fall 2020
  {
    id: 'beach_cadillac',
    title: 'Beach Cadillac',
    date: '2020-10-01T00:00:00Z',
    tags: ['Cars'],
    image: BeachCadillac,
  },
  {
    id: 'burnt_car',
    title: 'Burnt Car',
    date: '2020-10-01T00:00:00Z',
    tags: ['Cars'],
    image: BurntCar,
  },
  {
    id: 'burnt_car2',
    title: 'Melted Glass',
    date: '2020-10-01T00:00:00Z',
    tags: ['Cars'],
    image: BurntCar2,
  },
  {
    id: 'sf_parked_car',
    title: 'Parkside',
    date: '2020-10-01T00:00:00Z',
    tags: ['Cars', 'SF'],
    image: SFParkedCar,
  },
  {
    id: 'symboism',
    title: 'Symbolism',
    date: '2020-10-01T00:00:00Z',
    tags: ['Cars', 'SF'],
    image: Symboism,
  },
  {
    id: 'towed_car',
    title: 'Towed Car',
    date: '2020-10-01T00:00:00Z',
    tags: ['Cars'],
    image: TowedCar,
  },
  {
    id: 'white_bus',
    title: 'White Bus',
    date: '2020-10-01T00:00:00Z',
    tags: ['Cars', 'SF'],
    image: WhiteBus,
  },
  // Sonoma - Fall 2020
  {
    id: 'sonoma_grapes1',
    title: 'Sonoma Grapes 1',
    date: '2020-10-01T00:00:00Z',
    tags: ['Sonoma'],
    image: SonomaGrapes1,
  },
  {
    id: 'sonoma_grapes2',
    title: 'Sonoma Grapes 2',
    date: '2020-10-01T00:00:00Z',
    tags: ['Sonoma'],
    image: SonomaGrapes2,
  },
  {
    id: 'sonoma_truck',
    title: 'Sonoma Truck',
    date: '2020-10-01T00:00:00Z',
    tags: ['Sonoma', 'Cars'],
    image: SonomaTruck,
  },
  {
    id: 'sonoma_vineyard_sunset',
    title: 'Sonoma Vineyard Sunset',
    date: '2020-10-01T00:00:00Z',
    tags: ['Sonoma'],
    image: SonomaVineyardSunset,
  },
  // SF - Sept 2020
  {
    id: 'sf_giants_sunset',
    title: 'SF Giants Sunset',
    date: '2020-09-01T00:00:00Z',
    tags: ['SF', 'Baseball'],
    image: SFGiantsSunset,
  },
  {
    id: 'sf_japanese_hut',
    title: 'SF Japanese Hut',
    date: '2020-09-01T00:00:00Z',
    tags: ['SF', 'Architecture'],
    image: SFJapaneseHut,
  },
  {
    id: 'sf_rock_tree',
    title: 'SF Rock Tree',
    date: '2020-09-01T00:00:00Z',
    tags: ['SF'],
    image: SFRockTree,
  },
  // Tahoe - Fall 2020 (second entry)
  {
    id: 'tahoe_hazy_sunset',
    title: 'Tahoe Hazy Sunset',
    date: '2020-10-01T00:00:00Z',
    tags: ['Tahoe'],
    image: TahoeHazySunset,
  },
  // Diablo - Jul 2020
  {
    id: 'diablo_sunrise',
    title: 'Diablo Sunrise',
    date: '2020-07-01T00:00:00Z',
    tags: [],
    image: DiabloSunrise,
  },
  // Shadow - Spring/Summer 2020
  {
    id: 'alan',
    title: 'Alan',
    date: '2020-05-01T00:00:00Z',
    tags: ['Shadow', 'People'],
    image: Alan,
  },
  {
    id: 'building_shadows',
    title: 'Building Shadows',
    date: '2020-05-01T00:00:00Z',
    tags: ['Shadow', 'Architecture'],
    image: BuildingShadows,
  },
  {
    id: 'chair',
    title: 'Chair Shadow',
    date: '2020-05-01T00:00:00Z',
    tags: ['Shadow'],
    image: Chair,
  },
  {
    id: 'chinese_balloon',
    title: 'Chinese Balloon',
    date: '2020-05-01T00:00:00Z',
    tags: ['Shadow'],
    image: ChineseBalloon,
  },
  {
    id: 'crow',
    title: 'Crow',
    date: '2020-05-01T00:00:00Z',
    tags: ['Shadow'],
    image: Crow,
  },
  {
    id: 'esclator',
    title: 'Escalator Shadow',
    date: '2020-05-01T00:00:00Z',
    tags: ['Shadow'],
    image: Esclator,
  },
  {
    id: 'jessie_succ',
    title: 'Jessie with the Succulent',
    date: '2020-05-01T00:00:00Z',
    tags: ['Shadow', 'Dogs'],
    image: JessieSucc,
  },
  {
    id: 'orange_wall',
    title: 'Orange Wall',
    date: '2020-05-01T00:00:00Z',
    tags: ['Shadow', 'SF'],
    image: OrangeWall,
  },
  {
    id: 'stair_shadow',
    title: 'Stair Shadow',
    date: '2020-05-01T00:00:00Z',
    tags: ['Shadow'],
    image: StairShadow,
  },
  // Isolation - Spring/Summer 2020
  {
    id: 'basketball',
    title: 'Basketball',
    date: '2020-05-01T00:00:00Z',
    tags: ['Isolation'],
    image: Basketball,
  },
  {
    id: 'brick_wall',
    title: 'Brick Wall',
    date: '2020-05-01T00:00:00Z',
    tags: ['Isolation'],
    image: BrickWall,
  },
  {
    id: 'capitola_wetsuit',
    title: 'Capitola Wetsuit',
    date: '2020-05-01T00:00:00Z',
    tags: ['Isolation'],
    image: CapitolaWetsuit,
  },
  {
    id: 'coast_lighthouse',
    title: 'Coast Lighthouse',
    date: '2020-05-01T00:00:00Z',
    tags: ['Isolation'],
    image: CoastLighthouse,
  },
  {
    id: 'coast_lighthouse_house',
    title: 'Coast Lighthouse House',
    date: '2020-05-01T00:00:00Z',
    tags: ['Isolation'],
    image: CoastLighthouseHouse,
  },
  {
    id: 'fancy_bag',
    title: 'Fancy Bag',
    date: '2020-05-01T00:00:00Z',
    tags: ['Isolation'],
    image: FancyBag,
  },
  {
    id: 'pacifica_fisherman',
    title: 'Pacifica Fisherman',
    date: '2020-05-01T00:00:00Z',
    tags: ['Isolation'],
    image: PacificaFisherman,
  },
  {
    id: 'sausalito_boat',
    title: 'Sausalito Boat',
    date: '2020-05-01T00:00:00Z',
    tags: ['Isolation'],
    image: SausalitoBoat,
  },
  {
    id: 'umbrella',
    title: 'Umbrella',
    date: '2020-05-01T00:00:00Z',
    tags: ['Isolation'],
    image: Umbrella,
  },
  // People - Spring/Summer 2020
  {
    id: 'asian_flute',
    title: 'Asian Flute',
    date: '2020-05-01T00:00:00Z',
    tags: ['People', 'SF'],
    image: AsianFlute,
  },
  {
    id: 'denim',
    title: 'Denim',
    date: '2020-05-01T00:00:00Z',
    tags: ['People', 'SF'],
    image: Denim,
  },
  {
    id: 'dressy_man',
    title: 'Dressy Man',
    date: '2020-05-01T00:00:00Z',
    tags: ['People', 'SF'],
    image: DressyMan,
  },
  {
    id: 'jeshua',
    title: 'Jeshua',
    date: '2020-05-01T00:00:00Z',
    tags: ['People', 'SF'],
    image: Jesus,
  },
  {
    id: 'painter',
    title: 'Painter',
    date: '2020-05-01T00:00:00Z',
    tags: ['People', 'SF'],
    image: Painter,
  },
  {
    id: 'painter2',
    title: 'Painter 2',
    date: '2020-05-01T00:00:00Z',
    tags: ['People', 'SF'],
    image: Painter2,
  },
  {
    id: 'reading_man',
    title: 'Reading Man',
    date: '2020-05-01T00:00:00Z',
    tags: ['People', 'SF'],
    image: ReadingMan,
  },
  {
    id: 'stipple',
    title: 'Stipple',
    date: '2020-05-01T00:00:00Z',
    tags: ['People', 'SF'],
    image: Stipple,
  },
  {
    id: 'window_watcher',
    title: 'Window Watcher',
    date: '2020-05-01T00:00:00Z',
    tags: ['People', 'SF'],
    image: WindowWatcher,
  },
  // SF - Spring 2020
  {
    id: 'capitol',
    title: 'Capitol',
    date: '2020-03-01T00:00:00Z',
    tags: ['SF', 'B&W'],
    image: Capitol,
  },
  {
    id: 'church',
    title: 'Church',
    date: '2020-03-01T00:00:00Z',
    tags: ['SF', 'Architecture'],
    image: Church,
  },
  {
    id: 'reflection',
    title: 'Reflection',
    date: '2020-03-01T00:00:00Z',
    tags: ['SF', 'Isolation'],
    image: Reflection,
  },
  {
    id: 'salesforce',
    title: 'Salesforce',
    date: '2020-03-01T00:00:00Z',
    tags: ['SF', 'Architecture'],
    image: Salesforce,
  },
  {
    id: 'sf_buildings1',
    title: 'SF Buildings 1',
    date: '2020-03-01T00:00:00Z',
    tags: ['SF', 'Architecture'],
    image: SFBuildings1,
  },
  {
    id: 'sf_buildings2',
    title: 'SF Buildings 2',
    date: '2020-03-01T00:00:00Z',
    tags: ['SF', 'Architecture'],
    image: SFBuildings2,
  },
  {
    id: 'sf_buildings3',
    title: 'SF Buildings 3',
    date: '2020-03-01T00:00:00Z',
    tags: ['SF', 'Architecture'],
    image: SFBuildings3,
  },
  {
    id: 'sf_colorful_building',
    title: 'SF Colorful Building',
    date: '2020-03-01T00:00:00Z',
    tags: ['SF', 'Architecture'],
    image: SFColorfulBuilding,
  },
  {
    id: 'trolly',
    title: 'Trolly',
    date: '2020-03-01T00:00:00Z',
    tags: ['SF'],
    image: Trolly,
  },
  // Southwest Roadtrip - May 2020
  {
    id: 'adobe_buildings',
    title: 'Adobe Buildings',
    date: '2020-05-01T00:00:00Z',
    tags: ['Southwest', 'Architecture'],
    image: AdobeBuildings,
  },
  {
    id: 'horseshoe',
    title: 'Horseshoe',
    date: '2020-05-01T00:00:00Z',
    tags: ['Southwest', 'Nature'],
    image: Horseshoe,
  },
  {
    id: 'monument_valley',
    title: 'Monument Valley',
    date: '2020-05-01T00:00:00Z',
    tags: ['Southwest', 'Nature'],
    image: MonumentValley,
  },
  {
    id: 'rock_wave',
    title: 'Rock Wave',
    date: '2020-05-01T00:00:00Z',
    tags: ['Southwest', 'Nature'],
    image: RockWave,
  },
  {
    id: 'welcome_new_mexico',
    title: 'Welcome New Mexico',
    date: '2020-05-01T00:00:00Z',
    tags: ['Southwest'],
    image: WelcomeNewMexico,
  },
  {
    id: 'zion1',
    title: 'Zion 1',
    date: '2020-05-01T00:00:00Z',
    tags: ['Southwest'],
    image: Zion1,
  },
  {
    id: 'zion2',
    title: 'Zion 2',
    date: '2020-05-01T00:00:00Z',
    tags: ['Southwest'],
    image: Zion2,
  },
  // B&W - Winter/Spring 2020
  {
    id: 'adobe_bnw',
    title: 'Adobe B&W',
    date: '2020-01-01T00:00:00Z',
    tags: ['B&W'],
    image: AdobeBNW,
  },
  {
    id: 'arrow_up',
    title: 'Arrow Up',
    date: '2020-01-01T00:00:00Z',
    tags: ['B&W'],
    image: ArrowUp,
  },
  {
    id: 'bird_shit',
    title: 'Bird Shit',
    date: '2020-01-01T00:00:00Z',
    tags: ['B&W'],
    image: BirdShit,
  },
  {
    id: 'bnw_baseball',
    title: 'B&W Baseball',
    date: '2020-01-01T00:00:00Z',
    tags: ['B&W'],
    image: BNWBaseball,
  },
  {
    id: 'coit',
    title: 'Coit',
    date: '2020-01-01T00:00:00Z',
    tags: ['B&W', 'SF'],
    image: Coit,
  },
  {
    id: 'field_walker',
    title: 'Field Walker',
    date: '2020-01-01T00:00:00Z',
    tags: ['B&W'],
    image: DadSoccer,
  },
  {
    id: 'golden_gate',
    title: 'Golden Gate',
    date: '2020-01-01T00:00:00Z',
    tags: ['B&W', 'SF'],
    image: GoldenGate,
  },
  {
    id: 'levels',
    title: 'Levels',
    date: '2020-01-01T00:00:00Z',
    tags: ['B&W'],
    image: Levels,
  },
  {
    id: 'satellite',
    title: 'Satellite',
    date: '2020-01-01T00:00:00Z',
    tags: ['B&W'],
    image: Satellite,
  },
  {
    id: 'skateboard',
    title: 'Skateboard',
    date: '2020-01-01T00:00:00Z',
    tags: ['B&W'],
    image: Skateboard,
  },
  {
    id: 'baseball_last_oakland_game',
    title: 'Last Oakland Game',
    date: '2024-09-25T02:34:24Z',
    tags: ['Baseball'],
    image: BaseballLastOaklandGame,
  },
  {
    id: 'baseball_oakland',
    title: "Oakland A's",
    date: '2021-08-21T22:38:21Z',
    tags: ['Baseball'],
    image: BaseballOakland,
  },
  {
    id: 'chicago_cubs',
    title: 'Chicago Cubs',
    date: '2022-09-09T22:27:49Z',
    tags: ['Baseball'],
    image: ChicagoCubs,
  },
  {
    id: 'chicago_downtown',
    title: 'Chicago Downtown',
    date: '2022-09-10T16:44:37Z',
    tags: ['Architecture'],
    image: ChicagoDowntown,
  },
  {
    id: 'hawaii_2_dolphins',
    title: 'Dolphins',
    date: '2024-07-17T18:45:12Z',
    tags: ['Hawaii'],
    image: Hawaii2Dolphins,
  },
  {
    id: 'hawaii_2_farm',
    title: 'Heavenly Hawaiian',
    date: '2024-07-15T16:18:11Z',
    tags: ['Hawaii'],
    image: Hawaii2Farm,
  },
  {
    id: 'hawaii_2_lizard',
    title: 'Hawaiian Lizard',
    date: '2024-07-19T17:55:57Z',
    tags: ['Hawaii'],
    image: Hawaii2Lizard,
  },
  {
    id: 'hawaii_2_rainbow',
    title: 'Waimea Rainbow',
    date: '2024-07-18T01:03:36Z',
    tags: ['Hawaii'],
    image: Hawaii2Rainbow,
  },
  {
    id: 'hawaii_2_saplings',
    title: 'Heavenly Saplings',
    date: '2024-07-15T17:22:45Z',
    tags: ['Hawaii'],
    image: Hawaii2Saplings,
  },
  {
    id: 'hawaii_2_tennis',
    title: 'Mauna  Tennis',
    date: '2024-07-15T01:55:03Z',
    tags: ['Hawaii'],
    image: Hawaii2Tennis,
  },
  {
    id: 'hearst_pools',
    title: 'Hearst Pools',
    date: '2024-03-10T21:27:58Z',
    tags: ['Architecture'],
    image: HearstPools,
  },
  {
    id: 'isolation_red_vinyl',
    title: 'Red Vinyl',
    date: '2021-05-09T16:21:02Z',
    tags: ['Isolation'],
    image: IsolationRedVinyl,
  },
  {
    id: 'milwaukee_brewers',
    title: 'Milwaukee Brewers',
    date: '2022-09-09T01:12:26Z',
    tags: ['Baseball'],
    image: MilwaukeeBrewers,
  },
  {
    id: 'ny_central_park',
    title: 'NY Central Park',
    date: '2022-08-02T00:39:30Z',
    tags: ['NY'],
    image: NYCentralPark,
  },
  {
    id: 'ny_met_painting',
    title: 'NY Met Painting',
    date: '2022-08-01T20:54:30Z',
    tags: ['NY'],
    image: NYMetPainting,
  },
  {
    id: 'seattle_chelan',
    title: 'Chelan',
    date: '2024-06-01T03:18:15Z',
    tags: ['Seattle'],
    image: SeattleChelan,
  },
  {
    id: 'seattle_golden',
    title: 'Majestic Golden',
    date: '2024-05-26T19:45:39Z',
    tags: ['Seattle', 'Dogs'],
    image: SeattleGolden,
  },
  {
    id: 'seattle_goldens',
    title: 'Battle Goldens',
    date: '2024-05-26T19:41:59Z',
    tags: ['Seattle', 'Dogs'],
    image: SeattleGoldens,
  },
  {
    id: 'seattle_mariners',
    title: 'Seattle Mariners',
    date: '2024-05-30T03:24:51Z',
    tags: ['Seattle', 'Baseball'],
    image: SeattleMariners,
  },
  {
    id: 'seattle_wine_bar',
    title: 'Seattle Wine Bar',
    date: '2024-09-28T05:01:20Z',
    tags: ['Seattle'],
    image: SeattleWineBar,
  },
  {
    id: 'sf_rusty_car',
    title: 'Rust Bucket',
    date: '2024-11-30T20:24:37Z',
    tags: ['SF', 'Cars'],
    image: SFRustyCar,
  },
  {
    id: 'tahoe_meadow',
    title: 'Tahoe Meadow',
    date: '2022-12-25T01:00:00Z',
    tags: ['Tahoe', 'Nature'],
    image: TahoeMeadow,
  },
  {
    id: 'tahoe_meadow_jessie',
    title: 'Jessie in the Meadow',
    date: '2022-12-24T16:55:15Z',
    tags: ['Tahoe', 'Dogs'],
    image: TahoeMeadowJessie,
  },
]

export const SortedArtImages = ArtImages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
