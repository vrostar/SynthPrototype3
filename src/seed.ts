import * as PIXI from 'pixi.js'
import { Player } from "./player"

export class Seed extends PIXI.Sprite {
public speed : number
player: Player

    constructor(texture: PIXI.Texture) {
        super(texture)
        this.speed = Math.random() * 5
        this.x = 1200
        this.y = 300
        this.anchor.set(0.5)
        this.scale.set(1)

    }

    public hitCapy(){
        this.x = 10000000000000000000000
   }
}