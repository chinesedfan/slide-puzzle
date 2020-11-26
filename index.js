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
    const n = puzzle.length
    const doneFn = (xch, xr, xc) => xch === ch && xr === r && xc === c

    let [tr, tc] = getPosition(puzzle, ch)
    let stopFn
    if (r === n - 1) {
        if (tc < c) {
            // last second of first col
        } else {
            // left bottom
            if (tr < r - 1) {
                applySteps(puzzle, steps, ['R'])

                // now the empty slot must in row `r - 1`
                stopFn = (xch, xr, xc) => xch === ch && xr === r
                rotate(puzzle, steps, tr, c + 1, r, Math.max(tc, c + 2), stopFn)
            }

            tc = getPosition(puzzle, ch)[1]
            rotate(puzzle, steps, r - 1, c, r, Math.max(c + 1, tc), doneFn)
        }
    } else if (c === n - 1) {
        if (tr < r) {
            // second of last col
        } else {
            // right top
            if (tc < c - 1) {
                applySteps(puzzle, steps, ['D'])

                // now the empty slot must in col `c - 1`
                stopFn = (xch, xr, xc) => xch === ch && xc === c
                rotate(puzzle, steps, r + 1, tc, Math.max(tr, r + 2), c, stopFn)
            }

            tr = getPosition(puzzle, ch)[0]
            rotate(puzzle, steps, r, c - 1, Math.max(r + 1, tr), c, doneFn)
        }
    } else {
        if (tc < c) {
            // middle of first row
            applySteps(puzzle, steps, ['D'])

            stopFn = (xch, xr, xc) => xch === ch && xc === c + 1
            rotate(puzzle, steps, r + 1, tc, Math.max(r + 2, tr), c + 1, stopFn)
            rotate(puzzle, steps, r, c, tr, c + 1, doneFn)
        } else {
            // left top
            rotate(puzzle, steps, r, c, Math.max(tr, r + 1), Math.max(tc, c + 1), doneFn)
        }
    }
}
function moveSlot(puzzle, steps, r, c) {
    const [sr, sc] = getPosition(puzzle, 'X')
    if (sr < r || sc < c) throw new Error('invalid slot target')

    const s1 = Array(sr - r).fill('U')
    const s2 = Array(sc - c).fill('L')
    applySteps(puzzle, steps, s1.concat(s2))
}

// r1, c1 - left top corner
// r2, c2 - right bottom corner
// stopFn(xch, xr, xc) - when to stop, with xch has moved to [xr, xc]
function rotate(puzzle, steps, r1, c1, r2, c2, stopFn, clockwise = true) {
    if (r1 >= r2 || c1 >= c2) throw new Error('invalid rotate')

    let [r, c] = getPosition(puzzle, 'X')
    let stop = false
    while (1) {
        if (!stop && r === r1) {
            while (c < c2) {
                applySteps(puzzle, steps, ['R'])
                if (stopFn(puzzle[r][c], r, c)) {
                    stop = true
                    break
                }
                c++
            }
        }
        if (!stop && c === c2) {
            while (r < r2) {
                applySteps(puzzle, steps, ['D'])
                if (stopFn(puzzle[r][c], r, c)) {
                    stop = true
                    break
                }
                r++
            }
        }
        if (!stop && r === r2) {
            while (c > c1) {
                applySteps(puzzle, steps, ['L'])
                if (stopFn(puzzle[r][c], r, c)) {
                    stop = true
                    break
                }
                c--
            }
        }
        if (!stop && c === c1) {
            while (r > r1) {
                applySteps(puzzle, steps, ['U'])
                if (stopFn(puzzle[r][c], r, c)) {
                    stop = true
                    break
                }
                r--
            }
        }

        if (stop) break
    }
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
