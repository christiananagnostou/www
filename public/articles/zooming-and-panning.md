---
title: 'Zooming & Panning'
dateCreated: 'Jun 25, 2023'
summary: 'Summary of the article. Keep between 80 and 120 characters. That is roughly the length of this line of text.'
hidden: true
# categories: 'Guides,Frontend'
---

Zooming and panning: to two common user interactions that allow users to manipulate and navigate content on a webpage.

Zooming involves changing the scale or magnification level of the content, making it appear larger or smaller. Zooming can be implemented using CSS properties like `transform: scale()` and some added JavaScript to modify the size and layout of the elements dynamically.

Panning involves moving the visible area of content within a fixed viewport. This allows users to explore content that exceeds the available space by dragging or swiping in any direction. Typically, panning is implement by utilizing `transform: translate(x,y)` with JavaScript to capture user input and adjust the content's position within the container.

---

![Window Drawing](/img/articles/zooming-scaling/window-drawing.webp)

The image above shows a zoomed out and panned canvas. When initially opening the canvas, the whole screen would be covered with the blue diagonal lines. After zomming out and panning towards the top left, we end up with the layout in the image.

The image also shows the cursor position and the x and y values used to get its position. Those variables can be used to zoom into the location of the cursor. We'll come back to that later.

Using the CSS property `transform` with its `scale` and `translate` values, zooming and panning can be combined into one CSS line with two dynamic variables.

```JavaScript
let scale = 0.0

const zoomPos = { x: 0, y: 0 }

const transform = `scale(${scale}) translate(${zoomPos.x}px, ${zoomPos.y}px)`
```

---

## Panning

To pan, all we need to do is change the `zoomPos` values based on how far the mouse moves and in which direction by listening for the `mousedown`, `mousemove` and `mouseup` events. Mouse down and mouse up only toggle a variable to let the mouse move event know that the mouse is pressed while moving - dragging, so the bulk of the work is done by mouse move.

To move the initial window, start by attempting to use a stored value, `prevMouseMove`, which at first doesn't exist, so default to the current mouse position. Subtract the first existing of those two from the current mouse position and the result is the difference in which the mouse moved to move the initial window.

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

The intended user experience for zooming depends on the application, but I find it nice when you zoom in and the window hones in on the location of the cursor. To do that, both scale and transform are needed since it requires the window to move in relation to the cursor while zooming in/out.

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

Typically, zooming is handled by the scroll of the mouse wheel, so we listen for the `wheel` event on the `window`. The window wheel event contains information about the direction of the wheel (or trackpad) and, depending on the browser, the information varies in output. The safest way I've found to capure wheel direction is by clamping the scroll between -1 and +1 so that +1 is zoom in and -1 is zoom out.

```javascript
const delta = e.wheelDelta || e.originalEvent.detail // Chrome || Firefox

const clampedDelta = Math.max(-1, Math.min(1, d))
```

#### Scale

To calculate the new scale, we use our current scale multiplied by the zoom factor to get the next _step_ of zoom. We then multiply that by the zoom direction (-/+). Finally, we add that to the current scale and clamp the result between the min and max scale config variables.

```JavaScript
const scale = scale + (delta * zoomFactor * scale)

const clampedScale = Math.max(minScale, Math.min(maxScale, s))
```

---

### Calculating Transform

```javascript
// Cursor pos relative to center of window
const zoomPointX = e.clientX - window.innerWidth / 2
const zoomPointY = e.clientY - window.innerHeight / 2

// Calc the point where cursor is on screen
const { screenX, screenY } = await canvasToScreen(zoomPointX, zoomPointY)

state.zoomPos.x = -screenX * state.scale + zoomPointX
state.zoomPos.y = -screenY * state.scale + zoomPointY
```
