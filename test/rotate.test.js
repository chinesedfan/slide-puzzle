const { rotate } = require('../index')

let puzzle
describe('rotate', () => {
    beforeEach(() => {
        puzzle = [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 'X', 10, 11],
            [12, 13, 14, 15],
        ]
    })
    it('when the slot is in the first row', () => {
        const [ch, r, c] = [10, 3, 2]
        rotate(puzzle, [], 2, 1, 3, 3, [ch, r, c])
        expect(puzzle[r][c]).toBe(ch)
    })
})
