//import the engine things
import * as PIXI from 'pixi.js'
import Matter from 'matter-js'

//import classes
import { Seed } from './seed'
import { Bubble } from './bubble'
import { Player } from './player'
import { Spider } from './spider'
import { Foreground } from "./foreground"
import { Seedshoot } from "./shootseed"
import { Platform } from "./platform"
import { Platform2 } from "./platform2"

//import images
import fishImage from "./images/lostseed.png"
import deathScreen from "./images/gameover.png"
import spiderImage from "./images/spider.png"
import bubbleImage from "./images/sakura.png"
import waterImage from "./images/bgspring.png"
import playerImage from "./images/didi_sprite.png"
import foregroundImage from "./images/foreground.png"

//import music
import bgMusic from "url:./images/Ballad.mp3" 
import shootSound from "url:./images/vine-boom.mp3"
import jumpSound from "url:./images/jump.mp3"

export class Game {
    public pixi: PIXI.Application // canvas element in de html file
    private loader: PIXI.Loader
    private seeds: Seed[] = []
    private bubbles: Bubble[] = []
    private spiders: Spider[] = []
    private seedshot : Seedshoot[] = []

    private player: Player
    private spider: Spider
    private gameOverButton : PIXI.Sprite
    private foreground: Foreground;
    private platform: Platform;
    private platform2: Platform2;
    private score = 0

    public engine: Matter.Engine;
    

    constructor() {
        this.pixi = new PIXI.Application({ width: 1800, height: 450 })
        document.body.appendChild(this.pixi.view)
        this.loader = new PIXI.Loader()
        this.loader.add('fishTexture', fishImage)
            .add('bubbleTexture', bubbleImage)
            .add('spiderTexture', spiderImage)
            .add('waterTexture', waterImage)
            .add('playerTexture', playerImage)
            .add('foreground', foregroundImage)
            .add('death', deathScreen)
            .add("music", bgMusic)
            .add("shoot", shootSound)
            .add("jumpsound", jumpSound)
        this.loader.load(() => this.loadCompleted())
        this.engine = Matter.Engine.create()
    }

    private loadCompleted() {
        this.engine = Matter.Engine.create()

        let theme = this.loader.resources["music"].data!
        theme.play()

        let jump = this.loader.resources["jumpsound"].data!

        let shootSound = this.loader.resources["shoot"].data!

        const tilingSprite = new PIXI.TilingSprite(this.loader.resources["waterTexture"].texture!,
            this.pixi.screen.width,
            this.pixi.screen.height,
        );
        this.pixi.stage.addChild(tilingSprite);

        this.player = new Player(this.loader.resources["playerTexture"].texture!, this, jump)
        this.pixi.stage.addChild(this.player)

        let count = 0;

        this.pixi.ticker.add(() => {
            count += 0.005;

            tilingSprite.tileScale.x = 1;

            tilingSprite.tilePosition.x += -2;
        })

        for (let i = 0; i < 40; i++) {
            let bubble = new Bubble(this.loader.resources["bubbleTexture"].texture!)
            this.pixi.stage.addChild(bubble)
            this.bubbles.push(bubble)
        }

        let seed = new Seed(this.loader.resources["fishTexture"].texture!)
        this.pixi.stage.addChild(seed)
        this.seeds.push(seed)

        this.foreground = new Foreground(this.loader.resources["foreground"].texture!, this)
        this.pixi.stage.addChild(this.foreground)

        this.platform = new Platform(this.loader.resources["foreground"].texture!, this)
        this.pixi.stage.addChild(this.platform)

        this.platform2 = new Platform2(this.loader.resources["foreground"].texture!, this)
        this.pixi.stage.addChild(this.platform2)

        

        let spider = new Spider(this.loader.resources["spiderTexture"].texture!, this)
        this.pixi.stage.addChild(spider)
        this.spiders.push(spider)

        this.pixi.ticker.add((delta: number) => this.update(delta))
    }

    //Lets player shoot
    public shootSeed(bx: number, by: number) {
        let seedshot = new Seedshoot(
            bx,
            by,
            this,
            this.loader.resources["fishTexture"].texture!
        );
        this.pixi.stage.addChild(seedshot);
        this.seedshot.push(seedshot);
    }
    //Deletes the bullet/seed
    public removeSeed(seedshoot: Seedshoot) {
        this.seedshot = this.seedshot.filter((s) => s !== seedshoot);
    }

    private gameOver(){
        console.log("game over")
        this.pixi.stop()
        this.gameOverButton = new PIXI.Sprite(this.loader.resources["death"].texture!) // jouw eigen sprite hier
        this.gameOverButton.width = 350
        this.gameOverButton.height = 350
        this.gameOverButton.x = this.player.x
        this.gameOverButton.y = 100
        this.gameOverButton.interactive = true
        this.gameOverButton.buttonMode = true
        this.gameOverButton.on('pointerdown', () => this.resetGame())
        

        this.pixi.stage.addChild(this.gameOverButton)
    }


    //Reset the game for game over button
    private resetGame(){
        //deletes game over button
        this.gameOverButton.destroy() 
        //Reset player position
        this.player.resetPosition()
        this.pixi.start()
    }

    public update(delta: number) {
        Matter.Engine.update(this.engine, 1000 / 60)

        for (let seed of this.seeds) {
            if(this.collision(this.player, seed)){
                seed.hitCapy()
                this.player.hitseed()
                this.score++
                console.log(this.score)
            }
        }

        //If spider gets shot end him
        for (let spider of this.spiders) {
            spider.swim();
            for (let s of this.seedshot) {
                if (this.collision(s, spider)) {
                    s.hit();
                    spider.hit();
                }
            }
        }
        
        for (let spider of this.spiders) {
            if (this.collision(this.player, spider)) {
                this.gameOver()
            }
            
        }
        for (let seedshot of this.seedshot) {
            seedshot.update()
        }

        for (let spider of this.spiders) {
            if(this.collision(this.player, spider)){
                this.gameOver()
            }
        }
        for (let bubble of this.bubbles) {
            bubble.swim()
        }

        this.player.update()
        console.log(this.player.gotSeed)
    }

    collision(sprite1:PIXI.Sprite, sprite2:PIXI.Sprite) {
        const bounds1 = sprite1.getBounds()
        const bounds2 = sprite2.getBounds()

        return bounds1.x < bounds2.x + bounds2.width
            && bounds1.x + bounds1.width > bounds2.x
            && bounds1.y < bounds2.y + bounds2.height
            && bounds1.y + bounds1.height > bounds2.y;
    }
}

new Game()