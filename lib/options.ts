import type { MutableRefObject } from 'react'
import { DEFAULT_COLORS } from './config'
import type { ShapeDrawingFunction, ShapeName } from './types'
import { DEFAULT_SHAPE_FUNCTIONS } from './util/drawing'

export type RangeArg = number | [number, number]
export type VectorArg = [number, number]

export interface CreateConfettiOptions {
  /** The amount of particles that will be spawned. Overrides the count property in the options passed to `useConfetti`. */
  count: number,
  
  /** Distributes confetti over this many milliseconds. Overrides the duration property in the options passed to `useConfetti`. */
  duration: number,
  
  /** Pass in a ref to use as the source of the confetti. By default, `document.activeElement` will be used if this isn't set. */
  sourceRef?: MutableRefObject<HTMLElement>
}

export interface ConfettiOptions {
  /* Physics Options */
  
    /** A number representing the gravity applied to each particle. Controls vertical acceleration. */
    gravity: number,
    
    /** A number between -1 and 1 that applies wind to each particle. Controls horizontal acceleration. */
    wind: number,
    
    /** The speed of the simulation. */
    speed: number,
    
    /** The number of pixels past the edges of the canvas that particles will be deleted. */
    killDistance: number,

    /** A vector representing the initial x and y velocity of each particle. */
    initialVelocity: VectorArg,

    /** A vector representing an x and y velocity spread that's applied to the initialVelocity values to randomise the spread of confetti. */
    initialVelocitySpread: VectorArg,

    /** Minimum and maximum values for the twirl of each particle between 0 and 1. Offsets the centerpoint of each particle. Set to a number to use the same value for every particle.  */
    twirl: RangeArg,
    
    /** Minimum and maximum values for the initial angle of each particle in degrees. Set to a number to use the same value for every particle. */
    initialAngle: RangeArg,
    
    /** Minimum and maximum values for the angle increment every frame of each particle in degrees. Set to a number to use the same value for every particle. */
    angleIncrement: RangeArg,
    
    /** Minimum and maximum values for the initial flip of each particle in degrees. Set to a number to use the same value for every particle. */
    initialFlip: RangeArg,
    
    /* Minimum and maximum values for the flip increment every frame of each particle in degrees. Set to a number to use the same value for every particle. */
    flipIncrement: RangeArg,

    /** A number that is multiplied with the velocity of the particle to adjust the flip each frame. Essentially causes a particle to flip faster if its velocity is higher. Set to 0 to disable. */
    rotationVelocityCoefficient: number,
    
  /* Defaults for Confetti Creation */

    /** The amount of particles that will be spawned on each call to createConfetti.
     * @note Can be overriden when calling createConfetti */
    count: number,

    /** Distributes confetti over this many milliseconds on each call to createConfetti. 
     * @note Can be overriden when calling createConfetti */
    duration: number,

  /* Drawing */
    
    /** An object of functions for each shape that is used to draw them. See README for more details. */
    shapeFunctions: Record<ShapeName, ShapeDrawingFunction>,
    
    /** An object mapping shapes to their weights. A higher weight will cause that shape to appear more often. All keys in this array must also appear in shapeFunctions object. */
    shapeWeights: Record<ShapeName, number>,
    
    /** An array of CSS colors sampled randomly to colour each particle. */
    colors: string[],
    
    /** Minimum and maximum values for the diameter of each particle in pixels. Set to a number to use the same value for every particle. */
    diameter: RangeArg,
}

export const DEFAULT_CONFETTI_OPTIONS: ConfettiOptions = {
  gravity: 9.8,
  wind: 0,
  speed: 1,
  killDistance: 100,
  initialVelocity: [0, -3],
  initialVelocitySpread: [5, 7],
  diameter: [10, 30],
  twirl: [0, .2],
  initialAngle: [0, 360],
  angleIncrement: [-10, 10],
  initialFlip: [0, 360],
  flipIncrement: [-10, 10],
  rotationVelocityCoefficient: .8,
  colors: DEFAULT_COLORS,
  shapeFunctions: DEFAULT_SHAPE_FUNCTIONS,
  shapeWeights: {
    triangle: 1,
    circle: 1,
    star: 1,
    square: 1,
  },
  count: 75,
  duration: 0,
}
