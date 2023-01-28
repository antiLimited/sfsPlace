import kaboom from "kaboom"
import { drawGrid } from "./grid";
import { drawGui } from "./gui";

const k = kaboom({
    background: [61, 98, 152]
})

const LINE_SPACING = 32
var width = 400 * LINE_SPACING;
var height = 400 * LINE_SPACING;

loadSprite("rcs", "sprites/RCS.png")

var parts = []

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

onMousePress("left", () => {
    var mouseClickPos = toWorld(mousePos())
    debug.log(Math.round(mouseClickPos.x / 32) + " " + Math.round(mouseClickPos.y / 32))
    if (mousePos().y < k.height() - 128) {
        var part = {}
        part.sprite = "rcs"
        part.pos = toWorld(mousePos())
        parts.push(part)
    }
})

onDraw(() => {
    camPos(playerPos)

    drawGrid(k, width, height, LINE_SPACING)

    for (let part of parts) {
        drawSprite({
            sprite: "rcs",
            pos: vec2(Math.round(part.pos.x / 32) * 32, Math.round(part.pos.y / 32) * 32),
            origin: "center"
        })
    }

    drawGui(k)
})