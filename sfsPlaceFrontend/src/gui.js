import kaboom from "kaboom"
import * as api from "./api"

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
    window.placedParts = await api.getParts()
})();

var hoverPart = ""
var hoverDelete = ""
var selectPart = ""
var selectPos = {
    x: 0,
    y: 0
}

var placedPartSprite = "RCS"
var placedPartTexture = "no_texture"
var placedPartPosX = 1
var placedPartPosY = 1
var placedPartRot = 0
var placedPartScaleX = 1
var placedPartScaleY = 1

var arrowFactor = 0

export function addArrowFactor(arrFact) {
    arrowFactor = arrFact
    // console.log(arrowFactor)
}

export function drawGui(k) {
    drawRect({
        width: k.width(),
        height: 256,
        pos: toWorld(vec2(k.width() / 2, k.height())),
        opacity: 0.5,
        radius: 32,
        color: BLACK,
        origin: "center"
    })

    drawRect({
        width: k.width() * 0.95,
        height: k.height() * 0.25,
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
        pos: toWorld(vec2(k.width() / 2, k.height() * 0.0625)),
        origin: "center",
        color: WHITE,
    })

    drawText({
        text: "Parts at position X:" + Math.round(selectPos.x / 32) + " Y:" + + Math.round(selectPos.y / 32),
        size: 24,
        font: "sink",
        width: k.width() / 2,
        pos: toWorld(vec2(k.width() / 2, k.height() * 0.125)),
        origin: "center",
        color: WHITE,
    })

    var deleteIndent = 0

    for (part in window.placedParts) {
        partObj = window.placedParts[part]

        if (Math.round(partObj.position.x / 32) == Math.round(selectPos.x / 32) && Math.round(partObj.position.y / 32) == Math.round(selectPos.y / 32)) {
            // console.log(partObj.owner)

            position = toWorld(vec2(128 + (deleteIndent * 256) + (arrowFactor * 16), 256))
            partWH = vec2(0, 0)
            for (partArrayObj in parts) {
                if (partObj.name == parts[partArrayObj].name) {
                    partWH = vec2(parts[partArrayObj].width, parts[partArrayObj].height)
                }
            }
            // console.log(partWH)

            drawRect({
                width: 96,
                height: 96,
                pos: position,
                opacity: 0.6,
                radius: 16,
                color: BLACK,
                outline: { color: BLACK, width: 4 },
                origin: "center"
            })
            if (partWH.x >= partWH.y) {
                drawSprite({
                    sprite: partObj.name,
                    pos: position,
                    width: 64,
                    origin: "center"
                })
            } else if (partWH.x < partWH.y) {
                drawSprite({
                    sprite: partObj.name,
                    pos: position,
                    height: 64,
                    origin: "center"
                })
            }

            drawText({
                text: partObj.owner,
                size: 16,
                font: "sink",
                width: 256,
                pos: vec2(position.x + 128, position.y - 16),
                origin: "center",
                color: BLACK,
            })

            var rectPosition = toScreen(vec2(position.x + 64, position.y + 4))
            if (testRectPoint(new Rect(rectPosition, vec2(rectPosition.x + 128, rectPosition.y + 24)), mousePos())) {
                hoverDelete = partObj.identifier
                console.log(hoverDelete)
                if (isMousePressed("left")) {
                    api.deletePart(partObj.identifier)
                }
            } else {
                hoverDelete = ""
            }
            drawRect({
                width: 128,
                height: 24,
                pos: vec2(position.x + 128, position.y + 16),
                opacity: (() => {
                    if (hoverDelete == partObj.identifier) {
                        return 0.3
                    } else {
                        return 0.6
                    }
                })(),
                radius: 16,
                color: RED,
                outline: { color: BLACK, width: 4 },
                origin: "center"
            })
            deleteIndent += 1
        }
    }

    if (isMousePressed("left")) {
        selectPos.x = toWorld(mousePos()).x
        selectPos.y = toWorld(mousePos()).y
        // console.log(selectPos)
    }

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

    drawRect({
        width: k.width() * 0.95,
        height: 128,
        pos: toWorld(vec2(k.width() / 2, k.height() - 224)),
        opacity: 0.5,
        radius: 32,
        color: BLACK,
        origin: "center"
    })

    var hoveringPlace
    var rectPositionPlace = vec2(k.width() * 0.0625, k.height() - 288)
    if (testRectPoint(new Rect(rectPositionPlace, vec2(rectPositionPlace.x + k.width() * 0.375, rectPositionPlace.y + 96)), mousePos())) {
        hoveringPlace = true
        if (isMousePressed()) {
            api.placePart(placedPartSprite, placedPartScaleX, placedPartRot, placedPartTexture, placedPartPosX, placedPartPosY)
        }
    }
    drawRect({
        width: k.width() * 0.375,
        height: 96,
        pos: toWorld(vec2(k.width() * 0.25, k.height() - 224)),
        opacity: (() => {
            if (hoveringPlace == true) {
                return 0.3
            } else {
                return 0.5
            }
        })(),
        radius: 32,
        color: GREEN,
        outline: { color: BLACK, width: 4 },
        origin: "center"
    })
    drawText({
        text: "Place",
        size: 64,
        font: "sink",
        width: k.width() / 2,
        pos: toWorld(vec2(k.width() * 0.25, k.height() - 224)),
        origin: "center",
        color: BLACK,
    })
    if (window.placeTimer != undefined) {
        var minutes = 4 - window.placeTimer.sinceTimeout.minutes
        var seconds = 60 - window.placeTimer.sinceTimeout.seconds
        if (minutes < 0) {
            window.placeTimer = undefined
        }

        drawText({
            text: (() => {
                if (seconds == 60) {
                    seconds = "00"
                    minutes += 1
                } else if (seconds < 10) {
                    seconds = "0" + seconds
                }
                return minutes + ":" + seconds
            })(),
            size: 64,
            font: "sink",
            width: k.width() / 2,
            pos: toWorld(vec2(k.width() / 2, k.height() - 224)),
            origin: "center",
            color: WHITE,
        })
    }
    drawRect({
        width: 96,
        height: 96,
        pos: toWorld(vec2(k.width() * 0.95, k.height() - 224)),
        opacity: (() => {
            if (true) {
                return 0.3
            } else {
                return 0.5
            }
        })(),
        radius: 32,
        color: BLACK,
        outline: { color: BLACK, width: 4 },
        origin: "center"
    })
}


export function drawPlacedParts(k) {
    if (window.placedParts == undefined) {
        return;
    }
    if (isMousePressed("left")) {
        var mouseClickPos = toWorld(mousePos())
        // debug.log(Math.round(mouseClickPos.x / 32) + " " + Math.round(mouseClickPos.y / 32))
        if (mousePos().y < k.height() - 288 && selectPart != "") {
            placedPartSprite = selectPart
            placedPartPosX = toWorld(mousePos()).x
            placedPartPosY = toWorld(mousePos()).y

            // part.sprite = selectPart
            // part.pos = toWorld(mousePos())
            // partsPlaced.push(part)
            // placedPart = part
        }
    }
    // if (selectPart != ""){
    if (placedPartSprite != "") {
        drawSprite({
            sprite: placedPartSprite,
            pos: vec2(Math.round(placedPartPosX / 32) * 32, Math.round(placedPartPosY / 32) * 32),
            opacity: 0.5,
            origin: "center"
        })
    }
    for (let part of window.placedParts) {
        drawSprite({
            sprite: part.name,
            pos: vec2(Math.round(part.position.x / 32) * 32, Math.round(part.position.y / 32) * 32),
            origin: "center"
        })
    }
}