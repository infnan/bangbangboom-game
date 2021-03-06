import { NumberSprite } from "./NumberSprite"
import { Texture } from "pixi.js"
import { setPositionInfo, NumberSpriteInfo } from "./InfoType"
import { InfoSprite } from "./InfoSprite"
import { AnimationManager, CreatePixiTargetPropMapper } from "./Animation"

export class InfoNumberSprite extends NumberSprite {
    constructor(info: NumberSpriteInfo, textures: { [name: string]: Texture }) {
        super([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(x => x.toString()).map(x => textures[x]))
        if (info.fontSize !== undefined) this.fontSize = info.fontSize
        if (info.fontTint !== undefined) this.tint = parseInt(info.fontTint.replace("#", "0x"))
        if (info.fontPadding !== undefined) this.padding = info.fontPadding
        setPositionInfo(this as any, info.position)

        this.animation.targetPropMapper = CreatePixiTargetPropMapper(this)

        if (info.animations instanceof Object) {
            for (const prop in info.animations) {
                this.animation.animations.set(prop, info.animations[prop])
            }
        }

        if (info.children instanceof Array) {
            info.children.forEach(x => {
                const c = new InfoSprite(x, textures)
                this.addChild(c)
                this.infoSprites.push(c)
            })
        }
    }

    private infoSprites: InfoSprite[] = []

    animation = new AnimationManager()

    update = (dt: number) => {
        if (!this.visible) return
        this.animation.update(dt)
        this.infoSprites.forEach(x => (x as InfoSprite).update(dt))
    }

    resetAnim() {
        this.animation.currentTime = 0
        this.infoSprites.forEach(x => (x as InfoSprite).resetAnim())
    }

    allAnimEnd(): boolean {
        return this.animation.ended
            && this.infoSprites.findIndex(x => !(x as InfoSprite).allAnimEnd()) < 0
    }
}
