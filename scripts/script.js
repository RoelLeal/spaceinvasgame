import { Asteroid } from './asteroid.js';
import { Enemy } from './enemy.js';
import { Label } from './label.js';
import { Object } from './object.js';
import { Ship } from './ship.js';
import { Star } from './star.js';

const canva = document.getElementById("canvas");
const ctx = canva.getContext("2d");

const spritesheet = document.getElementById("spritesheet");

const font = window.getComputedStyle(document.body).fontFamily;
const fontWeight = window.getComputedStyle(document.body).fontWeight;

canva.width = 900;
canva.height = 600;

const menu = document.querySelector(".menu");
const score = document.querySelector(".score");
const btnMenu = document.querySelector(".play-game");


let hitbox = false;

let scoreCount = 0;

let menuStatus = true;
let play = false;


const ship = new Ship(ctx, spritesheet, canva);
const asteroids = [];
const labels = []; 
const enemies = [];
const projectilesEnemies = [];
const stars = [];

btnMenu.addEventListener("click", () => {
    init();
});

document.addEventListener("keydown", (e) => {
    if ((e.key === " " || e.key === "Enter") && menuStatus === true) {
        init();
    }
});

document.addEventListener("keydown", (e) => {
    if(e.key === "P" || e.key === "p") {
        play = !play;
    }
});

function gameOver() {
    hitbox = true;
    play = false;
    setTimeout(() => {
        menu.style.display = "flex";
        menuStatus = true;
    }, 1500);
}

function init() {
    hitbox = false;
    scoreCount = 0;
    score.innerHTML = "SCORE: " + scoreCount;
    asteroids.length = 0;
    labels.length = 0;
    enemies.length = 0;
    projectilesEnemies.length = 0;
    ship.position = {x: 200, y: 200};
    ship.projectiles.length = 0;
    ship.angle = 0;
    ship.speed = 0;
    menu.style.display = "none";
    menuStatus = false;
    play = true;
}

function createStars() {
    for(let i = 0; i < 5; i++) {
        let radio = Math.floor((Math.random() * 1.5) + 1);
        let star = new Star(
            ctx, canva, {
            x: Math.random() * (canva.width), 
            y: Math.random() * (canva.height)
        }, radio, 1);
        stars.push(star);
    }
    for(let i = 0; i < 45; i++) {
        let radio = Math.floor((Math.random() * 1.5) + 1);
        let star = new Star(
            ctx, canva, {
            x: Math.random() * (canva.width), 
            y: Math.random() * (canva.height)
        }, radio, 2);
        stars.push(star);
    }
}

function genereateEnemies() {
    setInterval(() => {
        let enemy = new Enemy(ctx, spritesheet, canva, ship);
        enemy.generatePosition(canva);
        enemies.push(enemy);
        setTimeout(() => {
            enemy.dead = true;
        }, 3000);
    }, 7000);
}


function collision(object1, object2) {
    let v1 = object1.position;
    let v2 = object2.position;
    let v3 = {
        x: v1.x - v2.x,
        y: v1.y - v2.y
    }

    let distance = Math.sqrt(Math.pow(v3.x, 2) + Math.pow(v3.y, 2));
    if(distance < object1.image.radio + object2.image.radio) {
        return true;
    }
    return false;
}

function createMeteors(position) {
    let count = Math.floor(Math.random() * (5)) + 1;
    for(let i = 0; i < count; i++) {
        let meteor = new Asteroid(ctx, spritesheet, position, 3);
        meteor.death = true;
        asteroids.push(meteor);
    }
}

function collisionObjects() {

    for(let j = 0; j < asteroids.length; j++) {
        if(collision(asteroids[j], ship)) {
            gameOver();
        }
    }
    for(let i = 0; i < enemies.length; i++) {
        if(collision(enemies[i], ship)) {
            gameOver();
        }
    }
    for(let i = 0; i < projectilesEnemies.length; i++) {
        if(collision(projectilesEnemies[i], ship)) {
            gameOver();
        }
    }
    loop1:
    for(let i = 0; i < ship.projectiles.length; i++) {
        for(let j = 0; j < enemies.length; j++) {
            if(collision(ship.projectiles[i], enemies[j])) {
                setTimeout(() => {
                    let text = new Label(
                        ctx, enemies[j].position, 
                        "+20", "#36AAE9", font, fontWeight);
                    scoreCount += 20;
                    score.innerHTML = "SCORE: " + scoreCount;
                    labels.push(text);
                    ship.projectiles.splice(i, 1);
                    enemies.splice(j, 1);
                }, 0);
                break loop1;
            }
        }
    }
    loop2:
    for(let i = 0; i < ship.projectiles.length; i++) {
        for(let j = 0; j < asteroids.length; j++) {
            if(collision(ship.projectiles[i], asteroids[j])) {
                setTimeout(() => {
                    if(asteroids[j].type === 1 && asteroids[j].type !== null) {
                        let text = new Label(
                            ctx, asteroids[j].position, 
                            "+10", "#5CCB5F", font, fontWeight);
                        scoreCount += 10;
                        score.innerHTML = "SCORE: " + scoreCount;
                        labels.push(text);
                        ship.projectiles.splice(i, 1);
                        asteroids.splice(j, 1);
                    }
                    else if(asteroids[j].type === 2 && asteroids[j].type !== null) {
                        createMeteors(asteroids[j].position);
                        ship.projectiles.splice(i, 1);
                        asteroids.splice(j, 1);
                    }else if(asteroids[j].type !== null) {
                        let text = new Label(
                            ctx, asteroids[j].position, 
                            "+5", "white", 
                            font, fontWeight);
                        scoreCount += 5;
                        score.innerHTML = "SCORE: " + scoreCount;
                        labels.push(text);
                        ship.projectiles.splice(i, 1);
                        asteroids.splice(j, 1);
                    }
                }, 0);
                break loop2;
            }
        }
    }
}


function generateAsteroids() {
    setInterval(() => {
        let type = Math.floor(Math.random() * (2) + 1);
        let asteroid = new Asteroid(ctx, spritesheet, {x: 0, y: 0}, type);
        asteroid.generatePosition(canva);
        asteroids.push(asteroid);
        setTimeout(() => {
            asteroid.death = true;
        }, 3000);
    }, 400);
}

function updateObjects() {
    ship.update(hitbox);
    asteroids.forEach((asteroid, index)=> {
        asteroid.update(hitbox);
        if(asteroid.collision(canva)) {
            setTimeout(() => {
                asteroids.splice(index, 1);
            }, 0);
        }
    });
    labels.forEach((label, index) => {
        label.update();
        if(label.opacity <= 0) {
            setTimeout(() => {
                labels.splice(index, 1);
            }, 0);
        }
    });
    projectilesEnemies.forEach((projectilEnemy, index) => {
        projectilEnemy.update(hitbox);
        if(projectilEnemy.collision(canva) && projectilEnemy !== null) {
            setTimeout(() => {
                projectilesEnemies.splice(index, 1);
            }, 0);
        }
        
    });
    enemies.forEach((enemy, index) => {
        enemy.update(hitbox);
        enemy.createProjectil(projectilesEnemies);
        if(enemy.collision(canva)) {
            setTimeout(() => {
                enemies.splice(index, 1);
            }, 0);
        }
    });
}

function background () {
    ctx.fillStyle = "#130000";
    ctx.fillRect(0, 0, canva.width, canva.height);
    stars.forEach((star) => {
        star.update();
    });
}

background();
ship.draw();

function update() {
    if(menuStatus) {
        background();
    }else if(play) {
        background();
        collisionObjects();
        updateObjects();
    }
    requestAnimationFrame(update);
}
update();
generateAsteroids();
genereateEnemies();
createStars();