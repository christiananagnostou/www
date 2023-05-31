---
title: 'Virtual Lists are Beautiful'
dateCreated: 'May 31, 2023'
summary: "Ever tried scrolling down on a table with 100,000 rows? You can't. Virtual Lists unlock that ability."
hidden: false
# categories: 'Guide,Frontend'
---

In the world of frontend development, optimizing performance and enhancing user experience are kind of a big deal. When it comes to handling large amounts of data, a virtual list can allow you to efficiently render that data without sacrificing speed or consuming excessive resources. By rendering only the visible portion of a list and dynamically swapping in and out items as the user scrolls, virtual lists enable lightning-fast loading times and smooth scrolling experiences.

### What are Virtual Lists?

Virtual lists sit between your large list of data and the rendered view of your application. Rather than rendering all the items in a list, virtual lists handle rendering only the items that are visible within the viewport or screen area. As the user scrolls, the virtual list dynamically adds or removes items from the DOM, resulting in a more efficient and faster rendering process. This approach minimizes the memory footprint and avoids performance issues that can arise when dealing with large datasets.

---

### How to make one

To operate this implementation of a virtual list, there are a few limitations you should know. Each element in the list needs to be the same height and the height of the virtual list needs to be defined outside of the virtual list component (we'll go over a nifty trick for this at the end). With that in mind, here are the variables that need to be passed into the component:

### `numItems`

Number of elements that are in the list

### `itemHeight`

Height of the element in pixels

### `windowHeight`

Height of the wrapping element in pixels

### `renderItem({ index, style })`

Function that accepts the element index and style and returns a JSX element

### `overscan`

Number of elements above or below the screen that will pre-render (helps when scrolling really fast)

---

### Prop Types

With those parameters, we're able to construct our virtual list.
If we were to write them as TypeScript props for a React virtual list component, it would look something like this:

```tsx
type Props = {
  numItems: number
  itemHeight: number
  windowHeight: number
  renderItem: ({ index, style }: { index: number; style: React.CSSProperties }) => JSX.Element
  overscan?: number
}
```

---

### Internal State

The virtual list itself only needs to keep track of one variable. That being the [scrollTop](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTop) position. This is the number of pixels that an element's content is scrolled vertically. The initial value is 0 and would look like this:

```ts
const [scrollTop, setScrollTop] = useState(0)
```

---

### Calculate Starting and Ending Elements

The next step is to calculate the starting and ending indexes for the elements that should render.
The starting index is found by taking the scroll top position and dividing it by the height of the elements to get the index of the element at the top of the scroll container. From there all you do is subtract the overscan variable and you have the starting index to render. To get the ending index you add the scroll top position to the height of the scroll container and divide that by the height of the elements. Add the overscan this time and boom, there's your end index.

```ts
const startIndex = Math.max(
  0,
  Math.floor(scrollTop / itemHeight) - overscan
)

const endIndex = Math.min(
  numItems - 1,
  Math.floor((scrollTop + windowHeight) / itemHeight) + overscan
)
```

---

### Create List of Elements for Render

With our newly created index variables, we now know which range of elements to render. To do that, we can use a simple for loop and call the `renderItem` function being passed into the virtual list component. We make each element positioned absolutely and calculate its top position by its index in the list. This should return a JSX element and we add that to the items array to prep them for rendering.

```tsx
const items: JSX.Element[] = []

for (let i = startIndex; i <= endIndex; i++) {
  items.push(
    renderItem({
      index: i,
      style: { position: 'absolute', top: `${i * itemHeight}px`, width: '100%' },
    })
  )
}
```

---

### Render the elements

The JSX markup for the virtual list is quite minimal. You need an outer scrolling element and an inner element whose height is calculated by the total number of list elements multiplied by the height of the elements. The array of elements being rendered can be added directly into the markup as it's just an array of JSX elements.

```ts
const innerHeight = numItems * itemHeight
```

```tsx
<div className="scroll" style={{ overflowY: 'scroll', width: '100%' }} onScroll={onScroll}>
  <div className="inner" style={{ position: 'relative', height: `${innerHeight}px` }}>
    {items}
  </div>
</div>
```

You might have noticed that there is an `onScroll` property on the outer scrolling element. This is to track the scrollTop of the outer element and update the scrollTop state.

```ts
const onScroll = ({ currentTarget }) => setScrollTop(currentTarget.scrollTop)
```

---

### Fully Assembled

When we put all those steps together, you get a reusable component that will help you render looooong lists of data. There are limitations with this simple setup but you can modify it to fit your needs. Here is the code to do so:

```tsx
import React, { useState } from 'react'

type Props = {
  numItems: number
  itemHeight: number
  windowHeight: number
  renderItem: ({ index, style }: { index: number; style: React.CSSProperties }) => JSX.Element
  overscan?: number
}

const VirtualList = (props: Props) => {
  const { numItems, itemHeight, renderItem, windowHeight, overscan = 3 } = props

  const [scrollTop, setScrollTop] = useState(0)

  const innerHeight = numItems * itemHeight
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(numItems - 1, Math.floor((scrollTop + windowHeight) / itemHeight) + overscan)

  const items: JSX.Element[] = []

  for (let i = startIndex; i <= endIndex; i++) {
    items.push(
      renderItem({
        index: i,
        style: { position: 'absolute', top: `${i * itemHeight}px`, width: '100%' },
      })
    )
  }

  const onScroll = ({ currentTarget }) => setScrollTop(currentTarget.scrollTop)

  return (
    <div className="scroll" style={{ overflowY: 'scroll', width: '100%' }} onScroll={onScroll}>
      <div className="inner" style={{ position: 'relative', height: `${innerHeight}px` }}>
        {items}
      </div>
    </div>
  )
}

export default VirtualList
```

---

### Using the Virtual List

Since the virtual list needs its height defined, you can wrap it in an element with a React ref and use the clientHeight of the ref to make the height responsive to whatever the height is of its wrapping element.

The element being rendered is found by referencing the index in the list of all data and the styles are added inline on the list element itself.

```tsx
<div ref={virtualListContainer}>
  <VirtualList
    numItems={allData.length}
    itemHeight={30}
    windowHeight={virtualListContainer.current?.clientHeight || 0}
    renderItem={({ index, style }) => (
      <div key={allData[index].id} style={style}>
        {allData[index].title}
      </div>
    )}
  />
</div>
```

---

Hope you enjoyed reading through this article. If you happen to need a virtual list for Qwik, [here's my virtual list implementation](https://github.com/christiananagnostou/jukebox/blob/master/src/components/Shared/VirtualList.tsx) - it includes a few other added features that make for a nice utility component.
