const BidFinder = `
javascript:(function(){
  var s = document.createElement('script');
  s.src = 'https://christiancodes.co/api/bidfinder';
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
    title: 'BidFinder',
    description: 'Highlights eBay bids on the page and lets you scroll through them automatically.',
    code: BidFinder,
    icon: MoneyMagnify,
    githubUrl: 'https://github.com/christiananagnostou/www/blob/master/public/scripts/bidfinder.js',
    instructions:
      "1. Go to an eBay page showing auction items with bid counts.\n2. Click the 'BidFinder' bookmarklet to highlight and jump to each bid.\n3. Press 'n' for the next highlighted bid, or Shift+N for the previous one.\n4. Enable 'Auto Scroll' in the info box to cycle automatically, and set the interval in seconds.",
  },
]
