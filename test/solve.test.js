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
describe('solve - 5x5', () => {
    it('simple', () => {
        puzzle = [
            [2, 13, 'X', 5, 15],
            [16, 4, 3, 12, 9],
            [14, 11, 8, 6, 18],
            [1, 7, 17, 10, 24],
            [20, 22, 23, 21, 19],
        ]
        solve(puzzle)
        expect(validPuzzle(puzzle)).toBeTruthy()
    })
})
