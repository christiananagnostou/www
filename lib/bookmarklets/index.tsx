import { MoneyMagnify } from '../../components/SVG/bookmarklets'

export const bookmarkletsData = [
  {
    title: 'HotBids',
    description: 'Highlights eBay bids and provides a toolbar to quickly navigate through them.',
    githubUrl: 'https://github.com/christiananagnostou/www/blob/master/public/scripts/hotbids.js',
    icon: MoneyMagnify,
    code: `
      javascript:(function(){
        var s = document.createElement('script');
        s.src = 'https://christiancodes.co/api/hotbids';
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
]
