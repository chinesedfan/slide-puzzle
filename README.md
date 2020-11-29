## slide-puzzle-solver

Solver for [slide puzzle](https://en.wikipedia.org/wiki/Sliding_puzzle).

Note that not every puzzle is *solvable*. But this solver can solve every *solvable* puzzle with different sizes in limited time.

### Usage

```js
const { solve } = require('slide-puzzle-solver')

// 'X' stands for the empty slot
const puzzle = [
  [1, 4, 3],
  [8, 7, 6],
  [2, 'X', 5],
]
// The solution will be saved here
// Valid moves are 'L', 'R', 'U', 'D' to move the 'X' piece Left, Right, Up, and Down respectively
const steps = []

// Returns the solved puzzle, while the origin `puzzle` will not be changed
const solvedPuzzle = solve(puzzle, steps)
```
