const { solve, getExpectedValue } = require('../index')

function validPuzzle(puzzle) {
    const n = puzzle.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (puzzle[i][j] !== getExpectedValue(puzzle, i, j)) return false
        }
    }
    return true
}

let puzzle

// const steps = []
// puzzle = solve(
//     // paste the test game board here
//     []
//     , steps)
// console.log(puzzle)
// console.log(steps.length, steps.join(','))
// return

describe('solve', () => {
    afterEach(() => {
        puzzle = solve(puzzle)
        expect(validPuzzle(puzzle)).toBeTruthy()
    })

    it.skip('4x4', () => {
        // not solvable
        puzzle = [
            [2, 3, 4, 8],
            [5, 6, 7, 'X'],
            [9, 1, 10, 11],
            [12, 13, 14, 15],
        ]
    })
    it('5x5', () => {
        puzzle = [
            [2, 13, 'X', 5, 15],
            [16, 4, 3, 12, 9],
            [14, 11, 8, 6, 18],
            [1, 7, 17, 10, 24],
            [20, 22, 23, 21, 19],
        ]
    })
})
