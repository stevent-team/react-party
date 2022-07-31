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
Use the handy `useConfetti` hook to setup react-party for your component.
1. Register the hook
2. Render the `<Confetti />` canvas component
3. Call `showConfetti()`
4. Confess :sunglasses: (confetti success)
```jsx
import { useConfetti } from '@stevent-team/react-party'

const MyComponent = () => {
  const { showConfetti, Confetti } = useConfetti()

  return <>
    <Confetti />
    <button onClick={showConfetti}>Click Me!</button>
  </>
}
```

Customise the behaviour of the confetti by passing options to `useConfetti`
```jsx
import { useConfetti } from '@stevent-team/react-party'

const MyComponent = () => {
  const { showConfetti, Confetti } = useConfetti({
    // Control the distribution of shapes
    shapeWeights: {
      triangle: 2,
      circle: 2,
      line: 3,
      star: 1,
    },

    // Speed up the movement
    simulationSpeed: 2,

    // Increase gravity,
    gravity: 2,

    // Use your own colors #vampireconfetti
    colors: [
      'red',
      'orange',
      'darkred',
      'black'
    ]
  })

  return <>
    <Confetti />
    <button onClick={showConfetti}>Click Me!</button>
  </>
}
```
([Check out `useConfetti` for all of the options](./lib/useConfetti.jsx))



You can also pass a `sourceRef` to `showConfetti()` to customise where the confetti appears from.
```jsx
import { useConfetti } from '@stevent-team/react-party'

const MyComponent = () => {
  const holeRef = useRef()
  const { showConfetti, Confetti } = useConfetti()

  return <>
    <Confetti />
    <AHoleInTheWall ref={holeRef}>
    <button onClick={() => showConfetti({ sourceRef: holeRef })}>Click Me!</button>
  </>
}
```

### Positioning the confetti canvas
The canvas that is used to render the confetti is positioned absolutely and will fill the available space. Place it in an element with `position: relative` to control where it displays.

### Available Confetti Shapes
- line
- circle
- triangle
- pentagon
- hexagon
- heptagon
- octagon
- star

## Development

To test the components in this library, follow the steps below:

1. Clone the repo onto your machine
2. Run `yarn` to install dependencies
3. Run `yarn dev` to start the sample project

## Contributing

Issue contributions and PRs are greatly welcomed + appreciated!

## License

`react-party` is licensed under MIT

*Created with love by the [Stevent Team](https://stevent.club)* 💙
