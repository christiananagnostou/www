---
title: 'Zooming & Panning'
dateCreated: 'Jun 25, 2023'
summary: 'Turn your browser window into a 2D canvas that you can explore with zooming and panning'
coverImg: '/img/articles/zooming-scaling/window-drawing.webp'
hidden: false
# categories: 'Guides,Frontend'
---

Zooming and panning: to two common user interactions that allow users to manipulate and navigate content on a webpage.

Zooming involves changing the scale or magnification level of the content, making it appear larger or smaller. Zooming can be implemented using CSS properties like `transform: scale()` and some added JavaScript to modify the size and layout of the elements dynamically.

Panning involves moving the visible area of content within a fixed viewport. This allows users to explore content that exceeds the available space by dragging or swiping in any direction. Typically, panning is implemented by utilizing `transform: translate(x,y)` with JavaScript to capture user input and adjust the content's position within the container.

---

![Window Drawing](/img/articles/zooming-scaling/window-drawing.webp)

The image above shows a zoomed out and panned canvas. When initially opening the canvas, the whole screen would be covered with the blue diagonal lines. After zooming out and panning towards the top left, we end up with the layout in the image.

The image also shows the cursor position and the x and y values used to get its position. Those variables can be used to zoom into the location of the cursor. We'll implement that later.

Using the CSS property `transform` with its `scale` and `translate` values, zooming and panning can be combined into one CSS line with two dynamic variables.

```JavaScript
let scale = 1

const zoomPos = { x: 0, y: 0 }

const transform = `scale(${scale}) translate(${zoomPos.x}px, ${zoomPos.y}px)`
```

---

## Panning

To pan, all we need to do is change the `zoomPos` values based on how far the mouse moves as well as the direction in which it moved. Do this by listening for the `mousedown`, `mousemove` and `mouseup` events. Mouse down and mouse up only toggle a variable to let the mouse move event know that the mouse is pressed while moving - dragging, so the bulk of the work is done by mouse move.

To move the initial window, start by attempting to use a stored value, `prevMouseMove`, which at first doesn't exist, so default to the current mouse position. Subtract the first non-null value of those two from the current mouse position and the result is the distance that the mouse moved. Finally, add that to the current zoom position.

```javascript
let prevMouseMove = null

if (mouseDown) {
  zoomPos.x += clientX - (prevMouseMove?.clientX || clientX)
  zoomPos.y += clientY - (prevMouseMove?.clientY || clientY)
}

prevMouseMove = { clientX, clientY }
```

---

## Zooming

The intended user experience for zooming depends on the application, but I find it nice when you zoom in and the window hones in on the location of the cursor, so we'll implement that approach. To do that, both scale and transform need to be updated since the window must move in relation to the cursor while zooming in/out.

### Calculating Scale

The steps to calculate the scale are:

1. Set some config variables
2. Determine the zoom direction (in or out)
3. Adjust the scale based on zoom direction

#### Config Vars

The config variables allow us to control the behaivor of the zooming:

```javascript
const maxScale = 4 // Max zoom (400%)
const minScale = 0.1 // Min zoom (10%)
const zoomFactor = 0.05 // Zoom speed (higher is faster)
```

#### Zoom Direction

Typically, zooming is handled by the scroll of the mouse wheel, so we listen for the `wheel` event on the `window`. The window wheel event contains information about the direction of the wheel (or trackpad) and, depending on the browser, the information varies in output. The safest way I've found to capture wheel direction is by clamping the scroll between -1 and 1 so that the positive one is zooming in and the negative one is zooming out.

```javascript
const delta = e.wheelDelta || e.originalEvent.detail // Chrome || Firefox

const clampedDelta = Math.max(-1, Math.min(1, d))
```

#### Scale

To calculate the new scale, we use our current scale multiplied by the zoom factor to get the next _step_ of zoom. We then multiply that by the zoom direction (-/+). Finally, we add that to the current scale and clamp the result between the min and max scale config variables.

```JavaScript
const scale = scale + (delta * zoomFactor * scale)

const clampedScale = Math.max(minScale, Math.min(maxScale, scale))
```

---

### Calculating Transform

Now that the scale has been adjusted, we can use it to modify the values of zoom position x and y. We need to first get the distance between the cursor and the center of the window. Then that same distance needs to be removed from the previous zoom position and scaled down to a px value relative to the initial window.

If that was a lot, picture it like this...

Imagine being zoomed out really far with the initial window as a small square in the center of the screen. If you were to click at the top left of the screen it may be just a few hundred pixels away from the initial window, but if you were to zoom back in and try to click the same spot on the canvas, it would be thousands of pixels up and to the left. That's what screenX and screenY represent.

The next step would be to update the scale value described in the section above. With scale being updated, move the window towards the location of the cursor keeping the relative distance from the center of the screen constant.

```javascript
const zoomPointX = e.clientX - window.innerWidth / 2
const zoomPointY = e.clientY - window.innerHeight / 2

const screenX = (zoomPointX - zoomPos.x) / prevScale
const screenY = (zoomPointY - zoomPos.y) / prevScale

... // update scale value

zoomPos.x = -screenX * scale + zoomPointX
zoomPos.y = -screenY * scale + zoomPointY
```

Note: `prevScale` doesn't refer to a separate variable, it's just showing that they will be different values.

---

## All Together

Combining the zoom scale and transform into one event callback looks like the code below. There are several similar lines that could be extracted to auxiliary functions, but I'll leave that to you for the sake of keeping actions contained.

```typescript
let scale = 1
const zoomPos = { x: 0, y: 0 }

const maxScale = 4 // Max zoom (400%)
const minScale = 0.1 // Min zoom (10%)
const zoomFactor = 0.05 // Zoom speed (higher is faster)

let prevMouseMove = null

canvas.addEventListener('mousedown', ({ clientX, clientY }: MouseEvent) => {
  prevMouseMove = { clientX, clientY }
})

canvas.addEventListener('mouseup', () => {
  prevMouseMove = null
})

canvas.addEventListener('mousemove', ({ clientX, clientY }: MouseEvent) => {
  if (prevMouseMove) {
    // Pan canvas by distance from prevMouseMove
    zoomPos.x += clientX - (prevMouseMove?.clientX || clientX)
    zoomPos.y += clientY - (prevMouseMove?.clientY || clientY)
  }

  // Update to track next distance change
  prevMouseMove = { clientX, clientY }
})

window.addEventListener('wheel', (e: Event) => {
  const zoomPointX = e.clientX - window.innerWidth / 2
  const zoomPointY = e.clientY - window.innerHeight / 2

  const screenX = (zoomPointX - zoomPos.x) / scale
  const screenY = (zoomPointY - zoomPos.y) / scale

  // Determine if zooming in or out
  const d = e.wheelDelta || e.originalEvent.detail // Chrome || Firefox
  const delta = Math.max(-1, Math.min(1, d)) // Cap the delta to [-1,1] for cross browser consistency

  const updatedScale = scale + delta * zoomFactor * scale
  scale = Math.max(minScale, Math.min(maxScale, updatedScale))

  zoomPos.x = -screenX * delta + zoomPointX
  zoomPos.y = -screenY * delta + zoomPointY
})
```

## Wrap Up Notes

The important thing to remember about zooming is that there are two types of pixel _units_: canvas and screen. Converting between the two is often needed when building on a surface that scales. Knowing when to use each unit is key to understanding the relationship between the screen and the canvas.

Below I've added my implementations to convert from canvas to screen and vice versa. This comes from an open source project of mine called [Qwikdraw](https://www.qwikdraw.app/) where you can draw shapes and add images to a canvas and orient, rotate, and modify them.

```typescript
const screenToCanvas = $((screenX: number, screenY: number) => {
  return {
    canvasX: (screenX - zoomPos.x - (window.innerWidth / 2) * (1 - scale)) / scale,
    canvasY: (screenY - zoomPos.y - (window.innerHeight / 2) * (1 - scale)) / scale,
  }
})

const canvasToScreen = $((canvasX: number, canvasY: number) => {
  return {
    screenX: (canvasX - zoomPos.x) / scale,
    screenY: (canvasY - zoomPos.y) / scale,
  }
})
```

---

Hope this article was helpful to you! If it was, let me know on Twitter [@coderdevguy](https://twitter.com/coderdevguy).
