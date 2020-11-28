const { solve2x3, getExpectedValue } = require('../index')

function validPuzzle(puzzle) {
    const n = puzzle.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (puzzle[i][j] !== getExpectedValue(puzzle, i, j)) return false
        }
    }
    return true
}
function permutation(arr) {
    if (arr.length === 1) return [[arr[0]]]

    const result = []
    for (let i = 0; i < arr.length; i++) {
        const others = arr.slice(0, i).concat(arr.slice(i + 1))
        permutation(others).forEach(prev => {
            result.push([arr[i]].concat(prev))
        })
    }
    return result
}

let puzzle
let n
describe('solve2x3', () => {
    beforeEach(() => {
        puzzle = [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 0, 0, 0],
            [13, 0, 0, 0],
        ]
        n = puzzle.length
    })
    afterEach(() => {
        solve2x3(puzzle, [])
        expect(validPuzzle(puzzle)).toBeTruthy()
    })

    permutation([10, 11, 12, 14, 15]).forEach(row => {
        it(row.toString(), () => {
            puzzle[n - 2][n - 3] = row[0]
            puzzle[n - 2][n - 2] = row[1]
            puzzle[n - 2][n - 1] = row[2]
            puzzle[n - 1][n - 3] = row[3]
            puzzle[n - 1][n - 2] = 'X'
            puzzle[n - 1][n - 1] = row[4]
        })
    })
});
