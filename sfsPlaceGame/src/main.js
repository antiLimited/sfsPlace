import kaboom from "kaboom"
import { drawGrid } from "./grid";

const k = kaboom({
	background: [61, 98, 152]
})

const LINE_SPACING = 32
var width = 400 * LINE_SPACING;
var height = 400 * LINE_SPACING;


camScale(vec2(1, 1))
var playerPos = vec2(width/2, height/2)
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

onDraw(() => {
	camPos(playerPos)
	
	drawGrid(k, width, height, LINE_SPACING)
})