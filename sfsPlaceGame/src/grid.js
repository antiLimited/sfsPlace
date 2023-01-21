import kaboom from "kaboom"

function drawXCenter(LINE_SPACING, CENTER_LINE_COLOR, width, lineXcount) {
    for (let i = 0; i < lineXcount; i++) {
        if (i * LINE_SPACING == width / 2) {
            drawLine({
                p1: vec2(i * LINE_SPACING, 0),
                p2: vec2(i * LINE_SPACING, width),
                width: 6,
                color: CENTER_LINE_COLOR
            })
        }
    }
}
function drawYCenter(LINE_SPACING, CENTER_LINE_COLOR, height, lineYcount) {
    for (let i = 0; i < lineYcount; i++) {
        if (i * LINE_SPACING == height / 2) {
            drawLine({
                p1: vec2(0, i * LINE_SPACING),
                p2: vec2(height, i * LINE_SPACING),
                width: 6,
                color: CENTER_LINE_COLOR
            })
        }
    }
}
function drawXNormal(LINE_SPACING, NORMAL_LINE_COLOR, width, lineXcount) {
    for (let i = 0; i < lineXcount; i++) {
        if (i * LINE_SPACING != width / 2 && i % 2 == 0) {
            drawLine({
                p1: vec2(i * LINE_SPACING, 0),
                p2: vec2(i * LINE_SPACING, width),
                width: 4,
                color: NORMAL_LINE_COLOR
            })
        }
    }
}
function drawYNormal(LINE_SPACING, NORMAL_LINE_COLOR, height, lineYcount) {
    for (let i = 0; i < lineYcount; i++) {
        if (i * LINE_SPACING != height / 2 && i % 2 == 0) {
            drawLine({
                p1: vec2(0, i * LINE_SPACING),
                p2: vec2(height, i * LINE_SPACING),
                width: 4,
                color: NORMAL_LINE_COLOR
            })
        }
    }
}
function drawXThin(LINE_SPACING, THIN_LINE_COLOR, width, lineXcount) {
    for (let i = 0; i < lineXcount; i++) {
        if (i % 2 != 0) {
            drawLine({
                p1: vec2(i * LINE_SPACING, 0),
                p2: vec2(i * LINE_SPACING, width),
                width: 2,
                color: THIN_LINE_COLOR
            })
        }
    }
}
function drawYThin(LINE_SPACING, THIN_LINE_COLOR, height, lineYcount) {
    for (let i = 0; i < lineYcount; i++) {
        if (i % 2 != 0) {
            drawLine({
                p1: vec2(0, i * LINE_SPACING),
                p2: vec2(height, i * LINE_SPACING),
                width: 2,
                color: THIN_LINE_COLOR
            })
        }
    }
}

export function drawGrid(kContext, width, height, LINE_SPACING) {
    const CENTER_LINE_COLOR = rgb(48, 79, 121)
    const NORMAL_LINE_COLOR = rgb(55, 88, 138)
    const THIN_LINE_COLOR = rgb(61, 92, 149)

    var lineXcount = width / LINE_SPACING
    var lineYcount = height / LINE_SPACING

    drawXThin(LINE_SPACING, THIN_LINE_COLOR, width, lineXcount)
    drawYThin(LINE_SPACING, THIN_LINE_COLOR, height, lineYcount)
    drawYNormal(LINE_SPACING, NORMAL_LINE_COLOR, height, lineYcount)
    drawXNormal(LINE_SPACING, NORMAL_LINE_COLOR, width, lineXcount)
    drawYNormal(LINE_SPACING, NORMAL_LINE_COLOR, height, lineYcount)
    drawXCenter(LINE_SPACING, CENTER_LINE_COLOR, width, lineXcount)
    drawYCenter(LINE_SPACING, CENTER_LINE_COLOR, height, lineYcount)
}