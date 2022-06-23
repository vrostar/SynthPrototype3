import * as PIXI from "pixi.js";
import Matter from "matter-js";
import { Game } from "./game";

//Create new Platform
export class Platform extends PIXI.Sprite {
  private rigidBody: Matter.Body;

  constructor(texture: PIXI.Texture, game: Game) {
    super(texture);
    this.x = 700;
    this.y = 150;
    this.anchor.set(0.5);
    this.width = 200
    this.height = 100
    this.rigidBody = Matter.Bodies.rectangle(this.x, this.y, this.width, this.height, {
      isStatic: true
    });
    Matter.Composite.add(game.engine.world, this.rigidBody);

    this.x = this.rigidBody.position.x;
    this.y = this.rigidBody.position.y;
  }
}

