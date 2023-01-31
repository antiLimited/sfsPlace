import kaboom from "kaboom"

async function getPartList() {
    let dataFetch = await fetch("/data/parts.json", {});
    let partJson = await dataFetch.json();

    return partJson.parts;
}
(async () => {
    let parts = await getPartList();
    window.parts = parts;
    for (let part in window.parts) {
        loadSprite(window.parts[part].name, window.parts[part].sprite)
    }
})();

var partsPlaced = []
var hoverPart = ""
var selectPart = ""

export function drawGui(k) {
    drawRect({
        width: k.width(),
        height: 256,
        pos: toWorld(vec2(k.width() / 2, k.height())),
        opacity: 0.5,
        color: BLACK,
        origin: "center"
    })

    drawRect({
        width: k.width() * 0.95,
        height: k.height() * 0.375,
        pos: toWorld(vec2(k.width() / 2, 0)),
        opacity: 0.5,
        radius: 32,
        color: BLACK,
        outline: { color: BLACK, width: 4 },
        origin: "center"
    })

    drawText({
        text: "sfsPlace",
        size: 96,
        font: "sink",
        width: k.width() / 2,
        pos: toWorld(vec2(k.width() / 2, k.height() * 0.09375)),
        origin: "center",
        color: WHITE,
    })

    if (window.parts == undefined) {

    } else {
        var indent = 0
        var hoverCount = 0
        for (let part of window.parts) {
            var position = toWorld(vec2(((k.width() + 64) - k.width()) + (indent * 128), k.height() - 64))

            drawRect({
                width: 96,
                height: 96,
                pos: position,
                opacity: (() => {
                    if (hoverPart == part.name) {
                        return 0.3
                    } else {
                        return 0.6
                    }
                })(),
                radius: 16,
                color: (() => {
                    if (selectPart == part.name) {
                        return CYAN
                    } else {
                        return BLACK
                    }
                })(),
                outline: { color: BLACK, width: 4 },
                origin: "center"
            })

            var rectPosition = toScreen(vec2(position.x - 48, position.y - 48))
            if (testRectPoint(new Rect(rectPosition, vec2(rectPosition.x + 96, rectPosition.y + 96)), mousePos())) {
                hoverPart = part.name
                if (isMousePressed("left")) {
                    if (selectPart == part.name) {
                        selectPart = ""
                    } else {
                        selectPart = part.name
                    }
                }
            } else {
                hoverCount += 1
            }

            if (part.width >= part.height) {
                drawSprite({
                    sprite: part.name,
                    pos: position,
                    width: 64,
                    origin: "center"
                })
            } else if (part.width < part.height) {
                drawSprite({
                    sprite: part.name,
                    pos: position,
                    height: 64,
                    origin: "center"
                })
            }
            indent += 1
        }
        if (hoverCount == window.parts.length) {
            hoverPart = ""
        }
    }
}

export function drawPlacedParts(k) {
    if (isMousePressed("left")) {
        var mouseClickPos = toWorld(mousePos())
        debug.log(Math.round(mouseClickPos.x / 32) + " " + Math.round(mouseClickPos.y / 32))
        if (mousePos().y < k.height() - 128 && selectPart != "") {
            var part = {}
            part.sprite = selectPart
            part.pos = toWorld(mousePos())
            partsPlaced.push(part)
        }
    }
    for (let part of partsPlaced) {
        drawSprite({
            sprite: part.sprite,
            pos: vec2(Math.round(part.pos.x / 32) * 32, Math.round(part.pos.y / 32) * 32),
            origin: "center"
        })
    }
}