---
title: 'Bookmarklets in React'
dateCreated: 'Apr 05, 2025'
summary: 'A quick and practical guide to creating bookmarklets in React'
coverImg: '/img/articles/bookmarklets/bookmarklets.webp'
hidden: false
categories: 'frontend'
---

In a nutshell, Bookmarklets are JavaScript snippets that you run on any webpage just by clicking a bookmark. I find them to be quite useful so I'll break down why they're great, where they fall short, and how to work around React's built-in security to implement them effectively.

---

## So, What's a Bookmarklet?

A bookmarklet is a bookmark stuffed with JavaScript code instead of a normal URL. Clicking it runs the code immediately on the current page. This lets you easily add custom functionality without installing full browser extensions. But this power isn't without its issues—especially security-wise.

---

## Why Should You Care?

Bookmarklets make you feel like a true hacker, which that alone makes them worth using. Along with that, they are particularly useful for:

- Instantly tweaking pages or automating repetitive tasks
- Quickly testing scripts or adjusting styles
- Handy utilities that run anywhere without needing browser extensions

However, since bookmarklets run arbitrary JavaScript, there's a real security risk if they're mishandled. Plus, React doesn't let you directly set `javascript:` URLs in JSX, as a safety measure against potential XSS attacks.

---

## React Doesn’t Like `javascript:` URLs

React specifically blocks direct assignment of `javascript:` URLs to `href` attributes because of security reasons. Try adding this code to your component:

```html
<a href="javascript:">Bookmarklet</a>
```

And you'll see an error like this:

![Javascript Blocked Error](/img/articles/bookmarklets/javascript-blocked.webp)

The workaround? Set the `href` attribute using a React ref after the component has mounted. That way, React won't complain, and your bookmarklet link will work as expected.

---

## The Solution: React ref

Here's a quick example component to handle bookmarklets with React and TypeScript:

```tsx
import React, { useRef, useEffect, AnchorHTMLAttributes, JSX, PropsWithChildren } from 'react'

type BookmarkletLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  code: string
}

export function BookmarkletLink({ code, children, ...props }: PropsWithChildren<BookmarkletLinkProps>): JSX.Element {
  const linkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (linkRef.current) {
      // Set the javascript: URL after the component mounts
      linkRef.current.setAttribute('href', code)
    }
  }, [code])

  return (
    <a ref={linkRef} {...props}>
      {children}
    </a>
  )
}
```

### Using the Component

Here's how you'd actually use this in your React app. Say you have a bookmarklet that outlines every element on a page:

```tsx
import React from 'react'
import { BookmarkletLink } from './BookmarkletLink'

const highlightCode = `javascript:(function(){
  document.querySelectorAll('*').forEach(el => {
    el.style.outline = '2px solid red';
  });
})();`

export default function App() {
  return (
    <div>
      <p>Drag the link below to your bookmarks bar:</p>

      <BookmarkletLink code={highlightCode}>Highlight Page Elements</BookmarkletLink>
    </div>
  )
}
```

The JavaScript URL gets set after mounting, bypassing React's security measures.

---

## Pros and Cons

### Why They're Great

- Run them on any website instantly
- Trigged with a quick click
- Great for scripted plugins, custom UI, and debugging

### Downsides to Remember

- You're running arbitrary code
- Might break if a site's structure changes
- Directly embedding `javascript:` URLs isn’t allowed

---

## When Bookmarklets Make Sense

Bookmarklets really shine when you need quick hacks or customizations, especially handy for developers tweaking third-party sites or rapidly testing new scripts. However, if you need a stable, long-term solution, look into browser extensions or directly integrating the functionality into your app.

---

## Wrapping Up

Bookmarklets can seriously level up your productivity for quick tasks and debugging, but React’s safety checks make implementing them slightly tricky. Using refs to set `href` post-mount solves this neatly.

Hope this was helpful! If you’ve got questions or thoughts, hit me up on X [@javascramble](https://x.com/javascramble).
