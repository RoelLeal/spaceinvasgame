import { Object } from "./object.js";

export class Projectil {
    constructor(ctx, spritesheet, position, angle, type) {
        this.ctx = ctx;
        this.image = new Object(spritesheet, {x: 521, y: 229}, 16, 22, 0.7);
        //<SubTexture name="spaceEffects_006.png" x="1113" y="927" width="12" height="126"/>
        this.imageEff = new Object(spritesheet, {x: 1113, y: 927}, 12, 126, 0.5);
        this.type = type;
        if(type) {
            //<SubTexture name="spaceMissiles_002.png" x="1092" y="116" width="20" height="35"/>
            this.image = new Object(spritesheet, {x: 1092, y: 116}, 20, 35, 0.7)
        }
        this.position = position;
        this.angle = angle;
        this.speed = 13;
    }
    collision(canvas) {
        if(this.position.x - this.image.radio > canvas.width
            || this.position.x + this.image.radio < 0
            || this.position.y - this.image.radio > canvas.height
            || this.position.y + this.image.radio < 0) {
            return true;
        }
        return false;
    }
    draw() {
        this.ctx.save();
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.angle);
        this.ctx.translate(-this.position.x, -this.position.y);
        this.image.draw(this.ctx, this.position);
        if(!this.type) {
            this.imageEff.draw(this.ctx, {x: this.position.x, y: this.position.y + 25});
        }
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
        this.position.x += Math.cos(this.angle - Math.PI / 2) * this.speed;
        this.position.y += Math.sin(this.angle - Math.PI / 2) * this.speed;
    }
}