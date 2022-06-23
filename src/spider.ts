import * as PIXI from "pixi.js"
import { Game } from "./Game"
import Matter from 'matter-js'

export class Spider extends PIXI.Sprite {
    rigidBody: Matter.Body
    private xspeed = 0;
  private yspeed = 0;
    speed: number = 0
    game: Game

    constructor(texture: PIXI.Texture, game: Game) {
        super(texture)
        this.game = game
        this.anchor.set(0.5)

        window.addEventListener("keydown", (e: KeyboardEvent) => this.onKeyDown(e))
        window.addEventListener("keyup", (e: KeyboardEvent) => this.onKeyUp(e))
        this.xspeed = 0;
        this.yspeed = 0;
        this.x =  900;
        this.y =  368;

        this.scale.set(0.2)

        const playerOptions: Matter.IBodyDefinition = {
            density: 0.001,
            friction: 0.7,
            frictionStatic: 0,
            frictionAir: 0.01,
            restitution: 0.5,
            inertia: Infinity,
            inverseInertia: Infinity,
            label: "Enemy"
        }
        this.rigidBody = Matter.Bodies.rectangle(600, 230, 75, 100, playerOptions)
        Matter.Composite.add(game.engine.world, this.rigidBody)

        

        window.addEventListener("keydown", (e: KeyboardEvent) => this.onKeyDown(e))
        window.addEventListener("keyup", (e: KeyboardEvent) => this.onKeyUp(e))
    }


    public hit() {
        this.x = window.innerWidth + 10000000000000;
      }

      public hitSpider() {
        console.log("hit spider");
      }

      public swim() {
        this.x += this.xspeed;
        this.y += this.yspeed;
      }

    update() {
        if (this.speed != 0) {
            Matter.Body.setVelocity(this.rigidBody, { x: this.speed, y: this.rigidBody.velocity.y })
        if (this.x > 1500) {
            this.x = 0;
        } else if (this.x < -100) {
            this.x = 1500
        } else if (this.y < -20) {
            this.x = -100;
            this.y =  250;
        }
        this.x = this.rigidBody.position.x
        this.y = this.rigidBody.position.y
        this.rotation = this.rigidBody.angle

        if (this.rigidBody.position.y > 1500) this.resetPosition()
        } else if (this.speed == 0) {
            Matter.Body.setVelocity(this.rigidBody, { x: 0, y: 4 })
        }
        
    }

    onKeyDown(e: KeyboardEvent) {
        if (e.key === " " || e.key === "ArrowUp") {
            if (this.rigidBody.velocity.y > -0.4 && this.rigidBody.velocity.y < 0.4) {
                Matter.Body.applyForce(this.rigidBody, { x: this.rigidBody.position.x, y: this.rigidBody.position.y }, { x: 0, y: -0.25 })
                // this.jumpSound.play()
            }
        }
        switch (e.key) {
            case "ArrowLeft":
                this.speed = -5
                break
            case "ArrowRight":
                this.speed = 5
                break
        }
    }

    onKeyUp(e: KeyboardEvent) {
        switch (e.key) {
            case "ArrowLeft":
            case "ArrowRight":
                this.speed = 0
                break
        }
    }

    resetPosition() {
        Matter.Body.setPosition(this.rigidBody, { x: 120, y: 30 })
        Matter.Body.setVelocity(this.rigidBody, { x: 0, y: 0 })
        Matter.Body.setAngularVelocity(this.rigidBody, 0)
    }

    beforeUnload() {

    }
}