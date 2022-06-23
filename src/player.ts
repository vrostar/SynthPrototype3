import * as PIXI from "pixi.js";
import { Game } from "./game";
import { Seed } from "./seed";
import * as Matter from 'matter-js';

export class Player extends PIXI.Sprite {

  rigidBody: Matter.Body
  private xspeed = 0;
  private yspeed = 0;
  public gotSeed = false;
  private jumpsound: HTMLAudioElement
  seed: Seed
  game: Game

  constructor(texture: PIXI.Texture, game: Game, jump: HTMLAudioElement) {
    super(texture);
    this.jumpsound = jump
    this.game = game
    this.anchor.set(0.5)

    window.addEventListener("keydown", (e: KeyboardEvent) => this.onKeyDown(e))
    window.addEventListener("keyup", (e: KeyboardEvent) => this.onKeyUp(e))

    this.x = 100;
    this.y = 345;

    this.scale.set(0.2)

    const playerOptions: Matter.IBodyDefinition = {
      density: 0.001,
      friction: 0.7,
      frictionStatic: 0,
      frictionAir: 0.01,
      restitution: 0.5,
      inertia: Infinity,
      inverseInertia: Infinity,
      label: "Player"
    }
    this.rigidBody = Matter.Bodies.rectangle(this.x, this.y, 75, 100, playerOptions)
    Matter.Composite.add(game.engine.world, this.rigidBody)

  }

  //Activate this to shoot the seeds
  private shoot() {
    this.game.shootSeed(this.x, this.y);
  }

  private jump() {
    this.jumpsound.play()
    if (this.y >= 300) {
      let jumpforce = -0.2
      Matter.Body.applyForce(this.rigidBody, { x: this.rigidBody.position.x, y: this.rigidBody.position.y }, { x: 0, y: jumpforce })
    }

  }


  public hitseed(){
    this.gotSeed = true;
}

  update() {
    let mapwidth = 18000
    let mapheight = 600
    let centerx = 500
    let centery = 600

    if (this.xspeed != 0) {
      Matter.Body.setVelocity(this.rigidBody, { x: this.xspeed, y: this.rigidBody.velocity.y })
    }
    this.x = this.rigidBody.position.x
    this.y = this.rigidBody.position.y
    this.rotation = this.rigidBody.angle

    if (this.rigidBody.position.y > 500) this.resetPosition()

    this.x = this.clamp(this.x + this.xspeed, 0, mapwidth)
    this.y = this.clamp(this.y + this.yspeed, 0, mapheight)

    let mapx = this.clamp(this.x, centerx, mapwidth - 9000)
    let mapy = this.clamp(this.y, centery, mapheight - centery)

    this.game.pixi.stage.pivot.set(mapx - 500, mapy)
  }

  clamp(num: number, min: number, max: number) {
    return Math.min(Math.max(num, min), max)
  }

  onKeyDown(e: KeyboardEvent) {
    if (e.key === " " || e.key === "ArrowUp") {
      if (this.rigidBody.velocity.y > -0.4 && this.rigidBody.velocity.y < 0.4) {
        Matter.Body.applyForce(this.rigidBody, { x: this.rigidBody.position.x, y: this.rigidBody.position.y }, { x: 0, y: -0.25 })

      }
    }

    switch (e.key.toUpperCase()) {
      case "F":
        this.shoot(); 
        break;
      case "A":
        case "ARROWLEFT":
        this.xspeed = -7;
        this.scale.x = -0.2
        break;
      case "D":
        case "ARROWRIGHT":
        this.xspeed = 7;
        this.scale.x = 0.2
        break;
      case "W":
      case "ARROWUP":
      case " ":
        this.jump();
        break;
      case "S":
        case "ARROWDOWN":
        this.yspeed = 7;
        break;
    }
  }

  onKeyUp(e: KeyboardEvent) {
    switch (e.key.toUpperCase()) {
      case " ":
        break;
      case "A":
      case "D":
        case "ARROWLEFT":
        case "ARROWRIGHT":
        this.xspeed = 0;
        break;
      case "W":
      case "S":
        case "ARROWUP":
        case "ARROWDOWN":
        this.yspeed = 0;
        break;
    }
  }

  resetPosition() {
    Matter.Body.setPosition(this.rigidBody, { x: 100, y: 345 })
    Matter.Body.setVelocity(this.rigidBody, { x: 0, y: 0 })
    Matter.Body.setAngularVelocity(this.rigidBody, 0)
  }
}