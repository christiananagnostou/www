import { BrokenGlass, MoneyMagnify, Pokeball } from '../../components/SVG/bookmarklets'
import { BASE_URL } from '../constants'

export const bookmarkletsData = [
  {
    title: 'HotBids',
    description: 'Highlights eBay bids and provides a toolbar to quickly navigate through them.',
    githubUrl: 'https://github.com/christiananagnostou/www/blob/master/public/scripts/hotbids.js',
    icon: MoneyMagnify,
    code: /*js*/ `
      javascript:(function(){
        var s = document.createElement('script');
        s.src = '${BASE_URL}/api/hotbids';
        document.body.appendChild(s);
      })();`,
    instructions: `
      Let's face it, someone else is probably faster at finding the hot deals on eBay. This bookmarklet simply helps you keep up with the competition by taking you straight to the hot items with a toolbar to quickly navigate through them. This works on mobile and desktop.
      -
      Instructions:
      1. Search for an item on eBay.
      2. Click the HotBids bookmarklet.
      3. Enjoy!`,
  },
  // {
  //   title: 'PokeBattle',
  //   description:
  //     'Simplifies the Pokémon Vortex battle interface by hiding unnecessary elements and enlarging buttons for quicker navigation.',
  //   icon: Pokeball,
  //   code: /*css*/ `
  //     javascript:(function(){
  //       var style = document.createElement('style');
  //       style.innerHTML = \`
  //         /* Style buttons for easier clicking */
  //         .button-small:not([value="Use Item"]),
  //         .menu-tab:first-of-type {
  //           width: 100%;
  //           background: linear-gradient(#d10101, #900101);
  //           padding: 5rem !important;
  //           position: fixed;
  //           bottom: 0;
  //           left: 0;
  //           z-index: 999999;
  //           border: 5px solid black !important;
  //         }
  //         #loading {
  //           background-image: none !important;
  //         }
  //       \`;
  //       document.head.appendChild(style);
  //     })();`,
  //   instructions: `
  //     Like a true nerd, I've been playing Pokemon Vortex, an OG web-based pokemon game, since the game debuted as Pokemon Crater 2007. To make the game a little easier for those that need *bigger buttons*, this bookmarklet is just what you need. It makes the buttons bigger so that you can fly through battles and get that precious XP.
  //     -
  //     Instructions:
  //     1. Start a battle in Pokemon Vortex.
  //     2. Click the PokeBattle bookmarklet.
  //     3. The interface will be simplified, hiding unnecessary elements and enlarging buttons for easier clicking.`,
  // },
  {
    title: 'GlassBreaker',
    description:
      'Bypasses the content wall popup and fixes scrolling issues on Glassdoor, allowing uninterrupted access to reviews.',
    icon: BrokenGlass,
    code: /*css*/ `
      javascript:(function(){
        var style = document.createElement('style');
        style.innerHTML = \`
          #HardsellOverlay {
            display: none;
          }
          body {
            overflow: auto !important;
            position: static !important;
            height: auto !important;
          }
        \`;
        document.head.appendChild(style);
      })();`,
    instructions: `
      Access Glassdoor reviews without interruptions by removing the content wall popup and fixing scrolling issues.
      -
      Instructions:
      1. Navigate to a Glassdoor review page.
      2. Click the Glassdoor Unblocker bookmarklet.
      3. The content wall will be hidden and scrolling will be restored...like it should be`,
  },
  // Add a bookmarklet that is a bookmarklet hosting widget. This widget should be an expandable and collapsable panel (similar to react-scan's widget) in the bottom right of the screen and when expanded, it should show a list of all the bookmarklets that I make
]
