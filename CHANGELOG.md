# @stevent-team/react-party

## 0.3.3

### Patch Changes

- 0c3a4d6: Fix canvas context not being initialised

## 0.3.2

### Patch Changes

- 636a9bd: Update dependencies

## 0.3.1

### Patch Changes

- 590b6e3: Update dependencies
- 7f46497: Don't initialize DOMMatrix in ref

  This would cause NextJS client components to try and call `new DOMMatrixReadOnly()` while statically rendering, which would error as DOMMatrix is not available in Node.

## 0.3.0

### Minor Changes

- 1b8bcdb: Add more options for controlling the confetti spawn location and velocity
- 77e76fa: Add types to the npm package

### Patch Changes

- 6415bbe: Fix using createConfetti's default params causing an unitialised variable error
- 15c9137: Fix incorrect kill zone calculation

## 0.2.0

### Minor Changes

- bc956b5: Add support for a moon shape and custom shapes
- ae8ba24: Update confetti api to use canvas props (breaking change)
