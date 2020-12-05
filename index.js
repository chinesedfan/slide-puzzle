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

    compressSteps(steps)
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

        const stopCondition = [getExpectedValue(puzzle, r, n - 1), r, n - 1]
        rotate(puzzle, steps, r, n - 2, getPosition(puzzle, 'X')[0], n - 1, stopCondition)
    } else {
        for (let i = r; i < n - 2; i++) {
            moveSlot(puzzle, steps, i, c)
            moveTile(puzzle, steps, getExpectedValue(puzzle, i, c), i, c)
        }
        moveSlot(puzzle, steps, n - 1, c)
        moveTile(puzzle, steps, getExpectedValue(puzzle, n - 2, c), n - 1, c)
        moveSlot(puzzle, steps, n - 1, c + 1, true)
        moveTile(puzzle, steps, getExpectedValue(puzzle, n - 1, c), n - 1, c + 1)

        const stopCondition = [getExpectedValue(puzzle, n - 1, c), n - 1, c]
        rotate(puzzle, steps, n - 2, c, n - 1, getPosition(puzzle, 'X')[1], stopCondition)
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

function compressSteps(steps) {
    const opposite = {
        L: 'R',
        R: 'L',
        U: 'D',
        D: 'U',
    }

    let i = 0
    while (i < steps.length) {
        let j = i
        while (j && steps[j - 1] === opposite[steps[j]]) {
            j++
        }

        const dups = j - i
        if (dups) {
            steps.splice(i - dups, dups * 2)
        } else {
            i++
        }
    }
}

function moveTile(puzzle, steps, ch, r, c) {
    const n = puzzle.length
    const doneCondition = [ch, r, c]

    let [tr, tc] = getPosition(puzzle, ch)
    let stopCondition
    if (r === n - 1) {
        if (tc === c) {
            rotate(puzzle, steps, tr, c, r, c + 1, doneCondition)
        } else if (tc < c) {
            // second of last row
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
                stopCondition = [ch, r, -1]
                rotate(puzzle, steps, tr, c + 1, r, Math.max(tc, c + 2), stopCondition)
            }

            tc = getPosition(puzzle, ch)[1]
            rotate(puzzle, steps, r - 1, c, r, Math.max(c + 1, tc), doneCondition)
        }
    } else if (c === n - 1) {
        if (tr === r) {
            rotate(puzzle, steps, r, tc, r + 1, c, doneCondition)
        } else if (tr < r) {
            // second of last col
            rotateUnit(puzzle, steps, 2, true)
            rotateUnit(puzzle, steps, 1, true)
            rotateUnit(puzzle, steps, 2, false)
            rotateUnit(puzzle, steps, 1, false)
            applySteps(puzzle, steps, ['L'])
        } else if (r === n - 2) {
            // second of last col
            rotate(puzzle, steps, r, tc, tr, c, doneCondition)
        } else {
            // right top
            if (tc < c - 1) {
                applySteps(puzzle, steps, ['D'])

                // now the empty slot must in col `c - 1`
                stopCondition = [ch, -1, c]
                rotate(puzzle, steps, r + 1, tc, Math.max(tr, r + 2), c, stopCondition)
            }

            tr = getPosition(puzzle, ch)[0]
            rotate(puzzle, steps, r, c - 1, Math.max(r + 1, tr), c, doneCondition)
        }
    } else {
        if (tc < c) {
            // middle of first row
            applySteps(puzzle, steps, ['D'])

            stopCondition = [ch, -1, c + 1]
            rotate(puzzle, steps, r + 1, tc, Math.max(r + 2, tr), c + 1, stopCondition)

            tr = getPosition(puzzle, ch)[0]
            rotate(puzzle, steps, r, c, tr, c + 1, doneCondition)
        } else if (tr < r) {
            // middle of first col
            applySteps(puzzle, steps, ['R'])

            stopCondition = [ch, r + 1, -1]
            rotate(puzzle, steps, tr, c + 1, r + 1, Math.max(tc, c + 2), stopCondition)

            tc = getPosition(puzzle, ch)[1]
            rotate(puzzle, steps, r, c, r + 1, tc, doneCondition)
        } else {
            // left top
            rotate(puzzle, steps, r, c, Math.max(tr, r + 1), Math.max(tc, c + 1), doneCondition)
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

    if (puzzle[r][c] !== 'X') throw new Error('failed to moveSlot')
}

// r1, c1 - left top corner
// r2, c2 - right bottom corner
// stopCondition - [xch, xr, xc], when to stop, with xch has moved to [xr, xc]
function rotate(...args) {
    try {
        innerRotate(...args)
    } catch (e) {
        console.log(args.slice(2))
        console.log(getStr(args[0]))
        throw e
    }
}
function innerRotate(puzzle, steps, r1, c1, r2, c2, [xch, xr, xc], clockwise = true) {
    if (r1 >= r2 || c1 >= c2) throw new Error('invalid rotate')
    if ((xr >= 0 && (xr < r1 || xr > r2))
        || (xc >= 0 && (xc < c1 || xc > c2))) throw new Error('invalid rotate')

    let [r, c] = getPosition(puzzle, 'X')
    if (r < r1 || r > r2 || c < c1 || c > c2) throw new Error('invalid rotate')

    const [cr, cc] = getPosition(puzzle, xch)
    if (cr < r1 || cr > r2 || cc < c1 || cc > c2) throw new Error('invalid rotate')

    let stop = false
    const stopFn = getStopFn(xch, xr, xc)
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
    return (xch, xr, xc) => {
        return xch === ch
            && (r < 0 || xr === r)
            && (c < 0 || xc === c)
    }
}

module.exports = {
    solve,
    solveBar,
    solve2x3,

    moveTile,
    moveSlot,

    rotate,

    applySteps,
    swap,

    getStr,
    getPosition,
    getExpectedValue,
    getStopFn,
}
