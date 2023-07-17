---
"@stevent-team/react-party": patch
---

Don't initialize DOMMatrix in ref

This would cause NextJS client components to try and call `new DOMMatrixReadOnly()` while statically rendering, which would error as DOMMatrix is not available in Node.
