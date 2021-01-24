const { solve, swap, getExpectedValue } = require('../index')

function randomPuzzle(size) {
    const puzzle = Array(size)
    for (let i = 0; i < size; i++) {
        puzzle[i] = []
        for (let j = 0; j < size; j++) {
            puzzle[i][j] = getExpectedValue(puzzle, i, j)
        }
    }

    let swaps = size * size
    while (swaps--) {
        const a = randomN(size * size) - 1
        const b = randomN(size * size) - 1
        if (a === b) continue

        swap(
            puzzle,
            Math.floor(a / size), a % size,
            Math.floor(b / size), b % size
        )
    }
    return puzzle
}
// https://www.cnblogs.com/starof/p/4988516.html
// returns 1 to n
function randomN(n) {
    return Math.floor(Math.random() * n) + 1
}

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

    it('5x5', () => {
        puzzle = [
            [2, 13, 'X', 5, 15],
            [16, 4, 3, 12, 9],
            [14, 11, 8, 6, 18],
            [1, 7, 17, 10, 24],
            [20, 22, 23, 21, 19],
        ]
    })
    it('5x5 - can be compressed', () => {
        puzzle = [
            [3, 7, 14, 15, 10],
            [1, 'X', 5, 9, 4],
            [16, 2, 11, 12, 8],
            [17, 6, 13, 18, 20],
            [21, 22, 23, 19, 24],
        ]
    })
    it.skip('random', () => {
        puzzle = randomPuzzle(10)
    })
})

describe('solve - not solvable', () => {
    afterEach(() => {
        expect(() => {
            puzzle = solve(puzzle)
        }).toThrow('not solvable')
    })

    it('4x4', () => {
        puzzle = [
            [2, 3, 4, 8],
            [5, 6, 7, 'X'],
            [9, 1, 10, 11],
            [12, 13, 14, 15],
        ]
    })
})
