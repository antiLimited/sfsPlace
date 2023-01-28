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



export function drawGui(k) {
    drawRect({
        width: k.width(),
        height: 256,
        pos: toWorld(vec2(k.width() / 2, k.height())),
        opacity: 0.5,
        //radius: 16,
        color: BLACK,
        //outline: { color: BLACK, width: 4 },
        origin: "center"
    })

    if (window.parts == undefined) {

    } else {
        var indent = 0
        for (let part of window.parts) {
            drawRect({
                width: 96,
                height: 96,
                pos: toWorld(vec2(((k.width() + 64) - k.width()) + (indent * 128), k.height() - 64)),
                opacity: 0.5,
                radius: 16,
                color: BLACK,
                outline: { color: BLACK, width: 4 },
                origin: "center"
            })
            if (part.width >= part.height) {
                drawSprite({
                    sprite: part.name,
                    pos: toWorld(vec2(((k.width() + 64) - k.width()) + (indent * 128), k.height() - 64)),
                    width: 64,
                    origin: "center"
                })
            } else if (part.width < part.height) {
                drawSprite({
                    sprite: part.name,
                    pos: toWorld(vec2(((k.width() + 64) - k.width()) + (indent * 128), k.height() - 64)),
                    height: 64,
                    origin: "center"
                })
            }
            indent += 1
        }
    }
}