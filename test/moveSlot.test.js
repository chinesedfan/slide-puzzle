const { moveSlot, applySteps, getStr } = require('../index')

function testSingle(puzzle, r, c) {
    const steps = []
    moveSlot(puzzle, steps, r, c)
    expect(puzzle[r][c]).toEqual('X')
}

let puzzle
describe('moveSlot', () => {
    beforeEach(() => {
        puzzle = [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 'X', 10, 11],
            [12, 13, 14, 15],
        ]
    })
    it('should move to same row', () => {
        testSingle(puzzle, 2, 0)
    })
    it('should move to same col', () => {
        testSingle(puzzle, 0, 1)
    })
    it('should move to diff row and diff col', () => {
        testSingle(puzzle, 0, 0)
    })
})
