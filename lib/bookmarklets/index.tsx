const HotBids = `
javascript:(function(){
  var s = document.createElement('script');
  s.src = 'https://christiancodes.co/api/hotbids';
  document.body.appendChild(s);
})();
`

const MoneyMagnify = (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="1em"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
    <path d="M21 21l-6 -6"></path>
    <path d="M12 7h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5"></path>
    <path d="M10 13v1m0 -8v1"></path>
  </svg>
)

export const bookmarkletsData = [
  {
    title: 'HotBids',
    description: 'Highlights eBay bids and provides a toolbar to quickly navigate through them.',
    code: HotBids,
    icon: MoneyMagnify,
    githubUrl: 'https://github.com/christiananagnostou/www/blob/master/public/scripts/hotbids.js',
    instructions: `
      Let's face it, someone else is probably faster at finding the hot deals on eBay. This bookmarklet simply helps you keep up with the competition by taking you straight to the hot items with a toolbar to quickly navigate through them. This works on mobile and desktop.
      -
      Instructions:
      1. Search for an item on eBay.
      2. Click the HotBids bookmarklet.
      3. Enjoy!`,
  },
]
