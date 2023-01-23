import kaboom from "kaboom"
import { drawGrid } from "./grid";

const k = kaboom({
    background: [61, 98, 152]
})

const LINE_SPACING = 32
var width = 400 * LINE_SPACING;
var height = 400 * LINE_SPACING;

var parts = []

camScale(vec2(1, 1))
var playerPos = vec2(width / 2, height / 2)
var playerSpeed = 32

onKeyPressRepeat("w", () => {
    playerPos.y -= playerSpeed
})
onKeyPressRepeat("a", () => {
    playerPos.x -= playerSpeed
})
onKeyPressRepeat("s", () => {
    playerPos.y += playerSpeed
})
onKeyPressRepeat("d", () => {
    playerPos.x += playerSpeed
})

// onKeyPress("up", () => {
// 	var scale = camScale()
// 	camScale(vec2(scale.x + 0.5, scale.y + 0.5))
// })
// onKeyPress("down", () => {
// 	var scale = camScale()
// 	camScale(vec2(scale.x - 0.5, scale.y - 0.5))
// })

onMousePress("left", () => {
    var part = {}
    part.name = "rect"
    part.pos = toWorld(mousePos())
    part.width = 4 * LINE_SPACING
    part.height = 4 * LINE_SPACING
    part.color = WHITE
    parts.push(part)
    console.log(parts)
})

onDraw(() => {
    camPos(playerPos)

    drawGrid(k, width, height, LINE_SPACING)
    // if (isMouseDown()) {
    //     var mouseClickPos = toWorld(mousePos())
    //     debug.log(Math.round(mouseClickPos.x / 32)+" "+Math.round(mouseClickPos.y / 32))
    //     drawRect({
    //         width: 4 * LINE_SPACING,
    //         height: 8 * LINE_SPACING,
    //         pos: vec2(Math.round(mouseClickPos.x / 32) * 32, Math.round(mouseClickPos.y / 32) * 32),
    //         color: YELLOW,
    //         outline: { color: BLACK, width: 4 },
    //     })
    // }
    for (let part of parts) {
        drawRect({
            width: part.width,
            height: part.height,
            pos: vec2(Math.round((part.pos.x - (part.width / 2)) / 32) * 32, Math.round((part.pos.y - (part.height / 2)) / 32) * 32),
            color: part.color,
        })
    }
})