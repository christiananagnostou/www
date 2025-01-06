export default function BookmarkAdder() {
  const bookmarkletCode = `
    javascript:(function(){
      var s = document.createElement('script');
      s.src = "https://christiancodes.co/api/bidfinder";
      document.body.appendChild(s);
    })();
  `

  return (
    <div>
      <p>Drag this link to your bookmarks bar or right-click to add:</p>
      <a href={bookmarkletCode} style={{ fontWeight: 'bold' }}>
        BidFinder
      </a>
    </div>
  )
}
