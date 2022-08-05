# 🎉 React Party
![npm version](https://img.shields.io/npm/v/@stevent-team/react-party)
![minzip size](https://img.shields.io/bundlephobia/minzip/@stevent-team/react-party)


Discord-inspired canvas confetti effect for React.

![react-party-confetti](https://user-images.githubusercontent.com/8862273/182039150-b133b41c-ec3b-498c-947b-958f8a2601cf.png)

## Installation

```bash
yarn add @stevent-team/react-party
```

## Usage

Use the built in `Canvas` component and pass the `canvasRef` returned from the hook into it.

```jsx
import { useConfetti, Canvas } from '@stevent-team/react-party'

const MyComponent = () => {
  const { createConfetti, canvasRef } = useConfetti()

  return <>
    <Canvas ref={canvasRef} />
    <button onClick={createConfetti}>Click Me!</button>
  </>
}
```

## Examples

### Custom options

Customise the behaviour of the confetti by passing options to `useConfetti`

```jsx
import { useConfetti, Canvas } from '@stevent-team/react-party'

const MyComponent = () => {
  const { createConfetti, canvasRef } = useConfetti({
    // Control the distribution of shapes
    shapeWeights: {
      triangle: 2,
      circle: 2,
      square: 3,
      star: 1,
    },

    // Speed up the movement
    speed: 1.2,

    // Decrease gravity,
    gravity: 6,

    // Use your own colors #vampireconfetti
    colors: [
      'red',
      'orange',
      'darkred',
      'black',
    ]
  })

  return <>
    <Canvas ref={canvasRef} />
    <button onClick={createConfetti}>Click Me!</button>
  </>
}
```

### Change the source

You can pass a `sourceRef` to `createConfetti()` to customise where the confetti appears from.

```jsx
import { useConfetti, Canvas } from '@stevent-team/react-party'

const MyComponent = () => {
  const holeRef = useRef()
  const { createConfetti, canvasRef } = useConfetti()

  return <>
    <Canvas ref={canvasRef} />
    <AHoleInTheWall ref={holeRef}>
    <button onClick={() => createConfetti({ sourceRef: holeRef })}>Click Me!</button>
  </>
}
```

### Use your own canvas

The `Canvas` component just wraps a html `canvas` with some simple styles to position the canvas absolutely on the page. Use your own canvas to apply custom styles.

```jsx
import { useConfetti } from '@stevent-team/react-party'

const MyComponent = () => {
  const { createConfetti, canvasRef } = useConfetti()

  return <>
    <canvas style={{ height: 200, width: 200 }} ref={canvasRef} />
    <button onClick={createConfetti}>Click Me!</button>
  </>
}
```

### Use images for confetti

React Party supports custom particle drawing functions, including images.

```jsx
import { useRef } from 'react'
import { useConfetti, Canvas, loadImage, drawImageParticle } from '@stevent-team/react-party'

const MyComponent = () => {
  // Use a react ref to store the image
  const imageRef = useRef()
  useEffect(() => {
    loadImage('https://example.com/image.svg')
      .then(img => imageRef.current = img)
  }, [])

  const { createConfetti, canvasRef } = useConfetti({
    // Set up a custom image particle
    shapeFunctions: {
      myCustomImage: drawImageParticle(imageRef.current),
    },

    // Tell the library to use your custom particle function
    shapeWeights: {
      myCustomImage: 1,
    },

    // Stop the confetti from rotating or flipping
    twirlMax: 0,
    initialAngleMax: 0,
    angleIncrementMin: 0,
    angleIncrementMax: 0,
    initialFlipMax: 0,
    flipIncrementMin: 0,
    flipIncrementMax: 0,
  })

  return <>
    <Canvas ref={canvasRef} />
    <button onClick={createConfetti}>Click Me!</button>
  </>
}
```

## API

### `useConfetti` options


| Property                      | Type            | Default                                          | Description                                                                                                                                                                                 |
|-------------------------------|-----------------|--------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `gravity`                     | Number          | `9.8`                                            | A number representing the gravity applied to each particle.                                                                                                                                 |
| `wind`                        | Number          | `0`                                              | A number between `-1` and `1` that applies wind to each particle.                                                                                                                           |
| `speed`                       | Number          | `1`                                              | The speed of the simulation.                                                                                                                                                                |
| `killDistance`                | Number          | `100`                                            | The number of pixels past the edges of the canvas that particles will be deleted.                                                                                                           |
| `count`                       | Number          | `75`                                             | The amount of particles that will be spawned on each call to `createConfetti`.                                                                                                              |
| `duration`                    | Number          | `0`                                              | Distributes confetti over this many milliseconds on each call to `createConfetti`.                                                                                          |
| `initialVelocity`             | Vector          | `[0, -3]`                                        | A vector representing the initial `x` and `y` velocity of each particle.                                                                                                                    |
| `initialVelocitySpread`       | Vector          | `[5, 7]`                                         | A vector representing an `x` and `y` velocity spread that's applied to the `initialVelocity` values to randomise the spread of confetti.                                                    |
| `diameter`                    | Tuple or number | `[10, 30]`                                       | Minimum and maximum values for the diameter of each particle in pixels. Set to a number to use the same value for every particle.                                                           |
| `twirl`                       | Tuple or number | `[0, 0.2]`                                       | Minimum and maximum values for the twirl of each particle between 0 and 1. Offsets the centerpoint of each particle. Set to a number to use the same value for every particle.              |
| `initialAngle`                | Tuple or number | `[0, 360]`                                       | Minimum and maximum values for the initial angle of each particle in degrees. Set to a number to use the same value for every particle.                                                     |
| `angleIncrement`              | Tuple or number | `[-10, 10]`                                      | Minimum and maximum values for the angle increment every frame of each particle in degrees. Set to a number to use the same value for every particle.                                       |
| `initialFlip`                 | Tuple or number | `[0, 360]`                                       | Minimum and maximum values for the initial flip of each particle in degrees. Set to a number to use the same value for every particle.                                                      |
| `flipIncrement`               | Tuple or number | `[-10, 10]`                                      | Minimum and maximum values for the flip increment every frame of each particle in degrees. Set to a number to use the same value for every particle.                                        |
| `rotationVelocityCoefficient` | Number          | `0.8`                                            | A number that is multiplied with the velocity of the particle to adjust the flip each frame. Essentially causes a particle to flip faster if its velocity is higher. Set to `0` to disable. |
| `colors`                      | Array           | `DEFAULT_COLORS`                                 | An array of CSS colors.                                                                                                                                                                     |
| `shapeFunctions`              | Object          | `DEFAULT_SHAPE_FUNCTIONS`                        | An object of functions for each shape that is used to draw them. See below for more details.                                                                                                |
| `shapeWeights`                | Object          | `{ triangle: 1, circle: 1, star: 1, square: 1 }` | An object mapping shapes to their weights. A higher weight will cause that shape to appear more often. All keys in this array must also appear in `shapeFunctions` object.                  |

### `createConfetti` options

| Property    | Type      | Default | Description                                                                                                                 |
|-------------|-----------|---------|-----------------------------------------------------------------------------------------------------------------------------|
| `count`     | Number    | `75`    | The amount of particles that will be spawned. Overrides the `count` property in the options passed to `useConfetti`.        |
| `duration`  | Number    | `0`     | Distributes confetti over this many milliseconds. Overrides the `duration` property in the options passed to `useConfetti`. |
| `sourceRef` | React ref |         | Pass in a ref to use as the source of the confetti. By default, `document.activeElement` will be used if this isn't set.    |

### Default shape functions

The following shapes are provided by default:

- `line`
- `circle`
- `triangle`
- `square`
- `pentagon`
- `hexagon`
- `heptagon`
- `octagon`
- `diamond`
- `star`
- `hexagram`

You can define your own functions inside the `shapeFunctions` option. Spread in the default shapes that are exported if you'd simply like to add a function without removing the defaults.

Each function receives an object with `p` and `ctx` as parameters, and you can use these to render a custom shape.

```js
import { DEFAULT_SHAPE_FUNCTIONS } from '@stevent-team/react-party'

const shapeFunctions = {
  ...DEFAULT_SHAPE_FUNCTIONS,
  myCustomShape: ({ p, ctx }) => {
    // Draw a square
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.rect(
      -p.diameter * p.twirl, -p.diameter * p.twirl,
      p.diameter, p.diameter,
    )
    ctx.fill()
  },
}
```

Check out [drawing.js](./lib/util/drawing.js) to see the currently implemented particle drawing functions, which are also exported from this library.

## Development

To test the components in this library, follow the steps below:

1. Clone the repo onto your machine
2. Run `yarn` to install dependencies
3. Run `yarn dev` to start the sample project

Build the library to `dist` using `yarn build`. You can build the sample project using `yarn build:sample`.

## Contributing

Issue contributions and PRs are greatly welcomed and appreciated!

## License

`@stevent-team/react-party` is licensed under MIT

*Created with love by the [Stevent Team](https://stevent.club)* 💙
