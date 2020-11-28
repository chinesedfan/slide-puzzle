const { moveTile } = require('../index')

function testSingle(puzzle, ch, r, c) {
    const steps = []
    moveTile(puzzle, steps, ch, r, c)
    expect(puzzle[r][c]).toEqual(ch)
}

let puzzle
let lockedPositions
let lockedValues
function getLockedValues() {
    return lockedPositions.map(([r, c]) => puzzle[r][c])
}

describe('moveTile - left top corner', () => {
    beforeEach(() => {
        puzzle = [
            ['X', 2, 3, 4],
            [5, 6, 7, 8],
            [9, 1, 10, 11],
            [12, 13, 14, 15],
        ]
    })
    it('from same row', () => {
        testSingle(puzzle, puzzle[0][2], 0, 0)
    })
    it('from same col', () => {
        testSingle(puzzle, puzzle[3][0], 0, 0)
    })
    it('from diff row and diff col', () => {
        testSingle(puzzle, puzzle[2][3], 0, 0)
    })
})
describe('moveTile - left bottom corner', () => {
    beforeEach(() => {
        puzzle = [
            [12, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 1, 10, 11],
            ['X', 13, 14, 15],
        ]
        lockedPositions = [[0, 0], [0, 1], [0, 2], [0, 3], [1, 0]]
        lockedValues = getLockedValues()
    })
    afterEach(() => {
        expect(getLockedValues()).toEqual(lockedValues)
    })
    it('from same row', () => {
        testSingle(puzzle, puzzle[3][3], 3, 0)
    })
    it('from previous row', () => {
        testSingle(puzzle, puzzle[2][3], 3, 0)
    })
    it('from other rows', () => {
        testSingle(puzzle, puzzle[1][3], 3, 0)
    })
    it('from same col', () => {
        testSingle(puzzle, puzzle[2][0], 3, 0)
    })
})
describe('moveTile - middle of first row', () => {
    beforeEach(() => {
        puzzle = [
            [2, 'X', 3, 4],
            [5, 6, 7, 8],
            [9, 1, 10, 11],
            [12, 13, 14, 15],
        ]
        lockedPositions = [[0, 0]]
        lockedValues = getLockedValues()
    })
    afterEach(() => {
        expect(getLockedValues()).toEqual(lockedValues)
    })
    it('from same row', () => {
        testSingle(puzzle, puzzle[0][3], 0, 1)
    })
    it('from same col', () => {
        testSingle(puzzle, puzzle[2][1], 0, 1)
    })
    it('from left bottom', () => {
        testSingle(puzzle, puzzle[2][0], 0, 1)
    })
    it('from right bottom', () => {
        testSingle(puzzle, puzzle[2][3], 0, 1)
    })
})
describe('moveTile - middle of first col', () => {
    beforeEach(() => {
        puzzle = [
            [2, 13, 14, 5, 15],
            [16, 4, 3, 12, 9],
            ['X', 11, 8, 6, 18],
            [1, 7, 17, 10, 24],
            [20, 22, 23, 21, 19],
        ]
        lockedPositions = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 0]]
        lockedValues = getLockedValues()
    })
    afterEach(() => {
        expect(getLockedValues()).toEqual(lockedValues)
    })
    it('from previous row', () => {
        testSingle(puzzle, puzzle[1][3], 2, 0)
    })
})
describe('moveTile - right top corner', () => {
    beforeEach(() => {
        puzzle = [
            [2, 3, 4, 'X'],
            [5, 6, 7, 8],
            [9, 1, 10, 11],
            [12, 13, 14, 15],
        ]
        lockedPositions = [[0, 0], [0, 1]]
        lockedValues = getLockedValues()
    })
    afterEach(() => {
        expect(getLockedValues()).toEqual(lockedValues)
    })
    it('from same row', () => {
        testSingle(puzzle, puzzle[0][2], 0, 3)
    })
    it('from same col', () => {
        testSingle(puzzle, puzzle[2][3], 0, 3)
    })
    it('from previous col', () => {
        testSingle(puzzle, puzzle[2][2], 0, 3)
    })
    it('from other cols', () => {
        testSingle(puzzle, puzzle[2][0], 0, 3)
    })
})
describe('moveTile - second of last col', () => {
    beforeEach(() => {
        puzzle = [
            [2, 3, 4, 8],
            [5, 6, 7, 'X'],
            [9, 1, 10, 11],
            [12, 13, 14, 15],
        ]
        lockedPositions = [[0, 0], [0, 1], [0, 3]]
        lockedValues = getLockedValues()
    })
    afterEach(() => {
        expect(getLockedValues()).toEqual(lockedValues)
    })
    it('from same row', () => {
        testSingle(puzzle, puzzle[1][0], 1, 3)
    })
    it('from same col', () => {
        testSingle(puzzle, puzzle[2][3], 1, 3)
    })
    it('from previous col', () => {
        testSingle(puzzle, puzzle[3][2], 1, 3)
    })
    it('from other cols', () => {
        testSingle(puzzle, puzzle[3][0], 1, 3)
    })
})
describe('moveTile - second of last row', () => {
    beforeEach(() => {
        puzzle = [
            [12, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 1, 10, 11],
            [13, 'X', 14, 15],
        ]
        lockedPositions = [[0, 0], [0, 1], [0, 2], [0, 3], [1, 0], [3, 0]]
        lockedValues = getLockedValues()
    })
    afterEach(() => {
        expect(getLockedValues()).toEqual(lockedValues)
    })
    it('from previous col', () => {
        testSingle(puzzle, puzzle[2][0], 3, 1)
    })
})
