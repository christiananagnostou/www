import { BrokenGlass, MoneyMagnify, Receipt, TCDBScout } from '../../components/SVG/bookmarklets'
import { BASE_URL } from '../constants'

export const bookmarkletsData = [
  {
    id: 'hotbids',
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
  {
    id: 'tcdb-scout',
    title: 'TCDB Scout',
    description: 'Scans TCDB collection pages and prepares quick eBay searches for each card.',
    githubUrl: 'https://github.com/christiananagnostou/www/blob/master/public/scripts/tcdb-scout.js',
    icon: TCDBScout,
    code: /*js*/ `
      javascript:(function(){
        var s = document.getElementById('tcdb-scout-script');
        if (!s) {
          s = document.createElement('script');
          s.id = 'tcdb-scout-script';
          s.src = '${BASE_URL}/scripts/tcdb-scout.js';
          s.onload = function(){
            if (window.TCDBScout) window.TCDBScout();
          };
          document.body.appendChild(s);
        } else if (window.TCDBScout) {
          window.TCDBScout();
        }
      })();`,
    instructions: `
      TCDB Scout pulls card titles from your TCDB collection page and gives you one-click eBay searches for active and sold listings.
      -
      Instructions:
      1. Open your TCDB collection page.
      2. Click the TCDB Scout bookmarklet.
      3. Use the Active or Sold buttons, or Open all with a limit.`,
  },
  {
    id: 'ebay-purchase-history',
    title: 'BayTally',
    description:
      'Collects item prices from your eBay Purchase History across pages and shows totals with search + sorting.',
    githubUrl: 'https://github.com/christiananagnostou/www/blob/master/public/scripts/baytally.js',
    icon: Receipt,
    code: /*js*/ `
      javascript:(function(){
        var s = document.getElementById('baytally-script');
        if (!s) {
          s = document.createElement('script');
          s.id = 'baytally-script';
          s.src = '${BASE_URL}/scripts/baytally.js';
          s.onload = function(){
            if (window.BayTally) window.BayTally();
          };
          document.body.appendChild(s);
        } else if (window.BayTally) {
          window.BayTally();
        }
      })();`,
    instructions: `
      BayTally records item prices on your eBay Purchase History page and adds them up into a running total.
      -
      Notes:
      - Data persists in your browser until you click Clear in the modal.
      - If eBay uses full page reload pagination, click the bookmarklet again on each page (it will keep the same running list).
      -
      Instructions:
      1. Open your eBay Purchase History page.
      2. Click the BayTally bookmarklet.
      3. Page/scroll through your history and use Search/Sort as needed.`,
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
    id: 'glassbreaker',
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
