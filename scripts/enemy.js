import { Object } from "./object.js";
import { Projectil } from "./projectil.js";

export class Enemy {
    constructor(ctx, spritesheet, canvas, ship) {
        this.ctx = ctx;
        this.spritesheet = spritesheet;
        //<SubTexture name="spaceShips_005.png" x="344" y="1050" width="136" height="84"/>
        this.image = new Object(spritesheet, {x: 344, y: 1050}, 136, 84, 0.44);
        //<SubTexture name="spaceParts_030.png" x="874" y="899" width="45" height="77"/>
        this.imagePart = new Object(spritesheet, {x: 874, y: 899}, 45, 77, 0.46);
        this.canvas = canvas;
        this.ship = ship;
        this.dead = false;
        this.position = {x: 500, y: 200};
        this.angle = 0;
        this.speed = 1.5;
    }
    generatePosition(canvas){
        let num = Math.floor(Math.random() * (4)) + 1;
        let x,y;
        switch(num){
            case 1:
                //parte superior
                x =  Math.random() * canvas.width;
                y =  - this.image.height;
                break;
            case 2:
                x = canvas.width + this.image.width;
                y = Math.random() * canvas.height;
                //parte derecha
                break;
            case 3:
                x = -this.image.width;
                y = Math.random() * canvas.height;
                //parte izquierda
                break;
            case 4:
                x = Math.random() * canvas.width;
                y = canvas.height+ this.image.height;
                break;
        }
        this.position = {x:x,y:y};
    }
    createProjectil(projectiles) {
        let num = Math.floor(Math.random() * (50)) + 1;
        if(num === 2) {
            let projectil = new Projectil(
                this.ctx, 
                this.spritesheet, 
                {
                    x: this.position.x + Math.cos(this.angle) * 14,
                    y: this.position.y + Math.sin(this.angle) * 14
                },
                this.angle + Math.PI / 2,
                true);
            projectil.speed = 7;
            projectiles.push(projectil);
        }
    }
    collision(canvas) {
        if((this.position.x - this.image.radio > canvas.width
            || this.position.x + this.image.radio < 0
            || this.position.y - this.image.radio > canvas.height
            || this.position.y + this.image.radio < 0) && this.death) {
            return true;
        }
        return false;
    }
    draw() {
        this.ctx.save();
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.angle + Math.PI / 2);
        this.ctx.translate(-this.position.x, -this.position.y);
        this.image.draw(this.ctx, this.position);
        this.imagePart.draw(this.ctx, {x: this.position.x + 20, y: this.position.y + 2})
        this.ctx.restore();
        this.ctx.save();
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.angle + Math.PI / 2);
        this.ctx.scale(-1, 1);
        this.ctx.translate(-this.position.x, -this.position.y);
        this.imagePart.draw(this.ctx, {x: this.position.x + 20, y: this.position.y + 2})
        this.ctx.restore();
    }
    hitBox() {
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, this.image.radio, 0, Math.PI * 2);
        this.ctx.strokeStyle = "red";
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
    update(boolean) {
        this.draw();
        if(boolean) this.hitBox();
        let v1 = {
            x: this.ship.position.x - this.position.x,
            y: this.ship.position.y - this.position.y
        }
        let mag = Math.sqrt(Math.pow(v1.x, 2) + Math.pow(v1.y, 2));
        let vUnit = {
            x: v1.x / mag,
            y: v1.y / mag
        }
        this.angle = Math.atan2(vUnit.y, vUnit.x);
        this.position.x += vUnit.x * this.speed;
        this.position.y += vUnit.y * this.speed;
    }
}