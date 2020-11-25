const { applySteps, getStr } = require('../index')

function testSingle(puzzle, steps, expected) {
    applySteps(puzzle, [], steps)
    expect(getStr(puzzle)).toEqual(getStr(expected))
}

let puzzle
describe('applySteps', () => {
    beforeEach(() => {
        puzzle = [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 'X', 10, 11],
            [12, 13, 14, 15],
        ]
    })
    it('should able to R', () => {
        testSingle(puzzle, ['R'], [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 'X', 11],
            [12, 13, 14, 15],
        ])
    })
    it('should able to L', () => {
        testSingle(puzzle, ['L'], [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            ['X', 9, 10, 11],
            [12, 13, 14, 15],
        ])
    })
    it('should able to D', () => {
        testSingle(puzzle, ['D'], [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 13, 10, 11],
            [12, 'X', 14, 15],
        ])
    })
    it('should able to U', () => {
        testSingle(puzzle, ['U'], [
            [1, 2, 3, 4],
            [5, 'X', 7, 8],
            [9, 6, 10, 11],
            [12, 13, 14, 15],
        ])
    })
})
