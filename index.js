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

    return puzzle
}
function solveBar(puzzle, steps, r, c, isRow) {
    const n = puzzle.length;
    if (isRow) {
        for (let i = c; i < n - 2; i++) {
            moveSlot(puzzle, steps, r, i, true)
            moveTile(puzzle, steps, getExpectedValue(puzzle, r, i), r, i)
        }
        moveSlot(puzzle, steps, r, n - 1, true)
        moveTile(puzzle, steps, getExpectedValue(puzzle, r, n - 2), r, n - 1)
        moveSlot(puzzle, steps, r + 1, n - 1)
        moveTile(puzzle, steps, getExpectedValue(puzzle, r, n - 1), r + 1, n - 1)

        const stopFn = getStopFn(getExpectedValue(puzzle, r, n - 1), r, n - 1)
        rotate(puzzle, steps, r, n - 2, getPosition(puzzle, 'X')[0], n - 1, stopFn)
    } else {
        for (let i = r; i < n - 2; i++) {
            moveSlot(puzzle, steps, i, c)
            moveTile(puzzle, steps, getExpectedValue(puzzle, i, c), i, c)
        }
        moveSlot(puzzle, steps, n - 1, c)
        moveTile(puzzle, steps, getExpectedValue(puzzle, n - 2, c), n - 1, c)
        moveSlot(puzzle, steps, n - 1, c + 1, true)
        moveTile(puzzle, steps, getExpectedValue(puzzle, n - 1, c), n - 1, c + 1)

        const stopFn = getStopFn(getExpectedValue(puzzle, n - 1, c), n - 1, c)
        rotate(puzzle, steps, n - 2, c, n - 1, getPosition(puzzle, 'X')[1], stopFn)
    }
}
// https://www.instructables.com/How-To-Solve-The-15-Puzzle/
function solve2x3(puzzle, steps) {
    const n = puzzle.length
    const ch1 = getExpectedValue(puzzle, n - 2, n - 3)
    const ch4 = getExpectedValue(puzzle, n - 1, n - 3)
    const ch5 = getExpectedValue(puzzle, n - 1, n - 2)
    // 4 ? ?
    // ? x ?
    moveSlot(puzzle, steps, n - 2, n - 3)
    moveTile(puzzle, steps, ch4, n - 2, n - 3)
    moveSlot(puzzle, steps, n - 1, n - 2, true)

    // 4 1 ?
    // ? x ?
    const [r1, c1] = getPosition(puzzle, ch1)
    if (c1 === n - 1) {
        rotateUnit(puzzle, steps, 3, r1 === n - 2)
    } else if (c1 === n - 3) {
        rotateUnit(puzzle, steps, 2, true)
        rotateUnit(puzzle, steps, 3, true)
        rotateUnit(puzzle, steps, 2, false)
        rotateUnit(puzzle, steps, 3, false)
    }

    // 1 ? ?
    // 4 x ?
    rotateUnit(puzzle, steps, 2, true)

    // rotate the right side
    const [r5, c5] = getPosition(puzzle, ch5)
    if (r5 === n - 2) {
        rotateUnit(puzzle, steps, 3, c5 === n - 2)
    // } else if () {
        // not solvable
        // TODO: swap 2 and 3
    }

    applySteps(puzzle, steps, ['R'])
}

function moveTile(puzzle, steps, ch, r, c) {
    const n = puzzle.length
    const doneFn = (xch, xr, xc) => xch === ch && xr === r && xc === c

    let [tr, tc] = getPosition(puzzle, ch)
    let stopFn
    if (r === n - 1) {
        if (tc < c) {
            // last second of first col
            rotateUnit(puzzle, steps, 2, false)
            rotateUnit(puzzle, steps, 3, true)
            rotateUnit(puzzle, steps, 2, true)
            rotateUnit(puzzle, steps, 3, false)
            applySteps(puzzle, steps, ['U'])
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
        if (tr === r) {
            rotate(puzzle, steps, r, tc, r + 1, c, doneFn)
        } else if (tr < r) {
            // second of last col
            rotateUnit(puzzle, steps, 2, true)
            rotateUnit(puzzle, steps, 1, true)
            rotateUnit(puzzle, steps, 2, false)
            rotateUnit(puzzle, steps, 1, false)
            applySteps(puzzle, steps, ['L'])
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
        } else if (tr < r) {
            // middle of first col
            applySteps(puzzle, steps, ['R'])

            stopFn = (xch, xr, xc) => xch === ch && xr === r + 1
            rotate(puzzle, steps, tr, c + 1, r + 1, Math.max(tc, c + 2), stopFn)

            tc = getPosition(puzzle, ch)[1]
            rotate(puzzle, steps, r, c, r + 1, tc, doneFn)
        } else {
            // left top
            rotate(puzzle, steps, r, c, Math.max(tr, r + 1), Math.max(tc, c + 1), doneFn)
        }
    }
}
function moveSlot(puzzle, steps, r, c, rowFirst) {
    const [sr, sc] = getPosition(puzzle, 'X')

    const s1 = sr < r ? Array(r - sr).fill('D') : Array(sr - r).fill('U')
    const s2 = sc < c ? Array(c - sc).fill('R') : Array(sc - c).fill('L')
    if (rowFirst) {
        applySteps(puzzle, steps, s2.concat(s1))
    } else {
        applySteps(puzzle, steps, s1.concat(s2))
    }
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


function rotateUnit(puzzle, steps, xpos, clockwise) {
    const moves = 'RDLU'
    const delta = clockwise ? 1 : -1
    // 0 1
    // 3 2
    const start = xpos + (clockwise ? 0 : 1) + moves.length

    const newSteps = []
    for (let i = 0; i < moves.length; i++) {
        newSteps[i] = moves[(start + i * delta) % moves.length]
    }
    applySteps(puzzle, steps, newSteps)
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
    if (r === n - 1 && c === n - 1) return 'X'
    return r * n + c + 1
}
function getStopFn(ch, r, c) {
    return (xch, xr, xc) => xch === ch && xr === r && xc === c
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
    getStopFn,
}
