// http://www.kopf.com.br/kaplof/how-to-solve-any-slide-puzzle-regardless-of-its-size

function solve(puzzle, steps = []) {
    puzzle = puzzle.map(row => row.slice())

    const n = puzzle.length;
    for (let i = 0; i < n - 2; i++) {
        solveBar(puzzle, steps, i, i, true)
        if (i < n - 3) {
            solveBar(puzzle, steps, i + 1, i, false)
        }
    }

    solve2x3(puzzle, steps)
}
function solveBar(puzzle, steps, r, c, isRow) {
    const n = puzzle.length;
    if (isRow) {
        for (let i = c; c < n - 2; i++) {
            moveSlot(puzzle, steps, r, i)
            moveTile(puzzle, steps, getExpectedValue(puzzle, r, i), r, i)
        }
        moveSlot(puzzle, steps, r, n - 1)
        moveTile(puzzle, steps, getExpectedValue(puzzle, r, n - 2), r, n - 1)
        moveSlot(puzzle, steps, r + 1, n - 1)
        moveTile(puzzle, steps, getExpectedValue(puzzle, r, n - 1), r + 1, n - 1)
        // TODO: rotate
    } else {
        for (let i = r; r < n - 2; i++) {
            moveSlot(puzzle, steps, i, c)
            moveTile(puzzle, steps, getExpectedValue(puzzle, i, c), i, c)
        }
        moveSlot(puzzle, steps, n - 1, c)
        moveTile(puzzle, steps, getExpectedValue(puzzle, n - 2, c), n - 1, c)
        moveSlot(puzzle, steps, n - 1, c + 1)
        moveTile(puzzle, steps, getExpectedValue(puzzle, n - 1, c), n - 1, c + 1)
        // TODO: rotate
    }
}
function solve2x3(puzzle, steps) {
}

function moveTile(puzzle, steps, ch, r, c) {
    const [tr, tc] = getPosition(puzzle, ch)
    if (tc < c) {
        // left
    } else {
        
    }
}
function moveSlot(puzzle, steps, r, c) {
    const [sr, sc] = getPosition(puzzle, 'X')
    if (sr < r || sc < c) throw new Error('invalid slot target')

    const s1 = Array(sr - r).fill('R')
    const s2 = Array(sc - c).fill('D')
    applySteps(puzzle, steps, s1.concat(s2))
}

// r1, c1 - left top corner
// r2, c2 - right bottom corner
function rotate(puzzle, steps, r1, c1, r2, c2, stopFn, clockwise) {
}

function applySteps(puzzle, oldSteps, newSteps) {
    let [sr, sc] = getPosition(puzzle, 'X')
    newSteps.forEach(s => {
        switch (s) {
        case 'R':
            swap(puzzle, sr, sc, sr, ++sc)
            break
        case 'L':
            swap(puzzle, sr, sc, sr, --sc)
            break
        case 'D':
            swap(puzzle, sr, sc, ++sr, sc)
            break
        case 'U':
            swap(puzzle, sr, sc, --sr, sc)
            break
        }
    })

    oldSteps.push(...newSteps)
}
function swap(puzzle, r1, c1, r2, c2) {
    const temp = puzzle[r1][c1]
    puzzle[r1][c1] = puzzle[r2][c2]
    puzzle[r2][c2] = temp
}

function getStr(puzzle) {
    return puzzle.map(row => row.join(',')).join('\n')
}
function getPosition(puzzle, ch) {
    const n = puzzle.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (puzzle[i][j] === ch) return [i, j]
        }
    }
    throw new Error('not found')
}
function getExpectedValue(puzzle, r, c) {
    const n = puzzle.length;
    return (r + 1) * n + c + 1
}

module.exports = {
    solve,
    solveBar,
    solve2x3,

    moveTile,
    moveSlot,

    rotate,

    applySteps,

    getStr,
    getPosition,
    getExpectedValue,
}
