//Shooting seed (Jany code)
import * as PIXI from "pixi.js";
import { Game } from "./game";

//Shooting mechanic to shoot seeds
export class Seedshoot extends PIXI.Sprite {

  public mygame: Game;
  constructor(bx: number, by: number, mygame: Game, texture: PIXI.Texture) {
    super(texture);
    this.scale.set(0.7);
    this.x = bx + 20;
    this.y = by + -100;
    this.mygame = mygame;
  }

  public hit() {
    this.mygame.removeSeed(this);
    this.destroy();
  }

  update() {
    this.x += 10;

    if (this.x > window.innerWidth) {
      this.mygame.removeSeed(this);
      this.destroy();
    }
  }
}