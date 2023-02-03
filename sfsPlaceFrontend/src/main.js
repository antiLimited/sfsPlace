import kaboom from "kaboom"
import { drawGrid } from "./grid";
import { drawGui, drawPlacedParts } from "./gui";

const k = kaboom({
    background: [61, 98, 152]
})

const LINE_SPACING = 32
var width = 400 * LINE_SPACING;
var height = 400 * LINE_SPACING;

camScale(vec2(1, 1))
var playerPos = vec2(width / 2, height / 2)
var playerSpeed = 16

onKeyDown("w", () => {
    playerPos.y -= playerSpeed
})
onKeyDown("a", () => {
    playerPos.x -= playerSpeed
})
onKeyDown("s", () => {
    playerPos.y += playerSpeed
})
onKeyDown("d", () => {
    playerPos.x += playerSpeed
})

var preFrameMousePos
onMouseDown("left", () => {
    if (mousePos().y < k.height() - 288) {
        var mouseChange = vec2(preFrameMousePos.x - mousePos().x, preFrameMousePos.y - mousePos().y)
        debug.log(mouseChange)
        playerPos = (vec2(camPos().x + mouseChange.x, camPos().y + mouseChange.y))
    }
})

onDraw(() => {
    camPos(playerPos)
    drawGrid(k, width, height, LINE_SPACING)
    drawPlacedParts(k)
    drawGui(k)
    preFrameMousePos = mousePos()
})