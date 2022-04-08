console.log('Bem-vindo ao Flappy Bird do Uriel Belo 🚀')
const sprites = new Image()
sprites.src = './sprites.png'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const qBirds = 500
const birds = []
const jumpSize = -2.5
var colision = false
let frames = 0
let geralFrames = 0
let birdLiving = 0
let endGame = false
let currentPipe = {
    positionX: 0,
    center: 0
}

function playBirds(){
    birds.forEach( (bird) => {
        const h1 = bird.xDistanceToCurrentPipe * bird.p1
        const h2 = bird.xDistanceToCurrentPipe * bird.p3
        const v1 = bird.yDistanceToCurrentPipe * bird.p2
        const v2 = bird.yDistanceToCurrentPipe * bird.p4

        const l1 = h1 + v1
        const l2 = h2 + v2

        const lr1 = l1 <= 0 ? 0 : l1
        const lr2 = l2 <= 0 ? 0 : l2

        const lh1 = lr1 * bird.p5
        const lv1 = lr2 * bird.p6

        const result = lh1 + lv1
        if(result > 0){
            bird.jump()
        }
    })
}

class cBird {
    p1 = getRandomInclusive(-1000,1000)
    p2 = getRandomInclusive(-1000,1000)
    p3 = getRandomInclusive(-1000,1000)
    p4 = getRandomInclusive(-1000,1000)
    p5 = getRandomInclusive(-1000,1000)
    p6 = getRandomInclusive(-1000,1000)

    xDistanceToCurrentPipe = 0
    yDistanceToCurrentPipe = 0

    gravityAcceleration = 0.1
    widthSprite = 33
    heightSprite = 24
    PositionX = 20
    PositionY = 100
    velocity = 0
    isLive = true
    states = [
        {positionXSprite: 0, positionYSprite: 0},
        {positionXSprite: 0, positionYSprite: 26},
        {positionXSprite: 0, positionYSprite: 52},
    ]
    getCurrentState = (frames) => {
        if (frames > 10 && frames < 20) {
            return 1
        } else if (frames > 20) {
            return 2
        } else {
            return 0
        }
    }
    jump = () => {
        this.velocity = jumpSize
    }
    draw = () => {
        ctx.drawImage(sprites, this.states[this.getCurrentState(frames)].positionXSprite, this.states[this.getCurrentState(frames)].positionYSprite, this.widthSprite, this.heightSprite, this.PositionX, this.PositionY, this.widthSprite, this.heightSprite)
    }
    updateState = () => {
        this.xDistanceToCurrentPipe = currentPipe.positionX - this.PositionX
        this.yDistanceToCurrentPipe = currentPipe.center - this.PositionY
        this.velocity = this.velocity + this.gravityAcceleration
        this.PositionY = this.PositionY + this.velocity
    } 
}

for(var i=0; i < qBirds; i++){
    birds.push(new cBird)
}

const ground = {
    positionXSprite: 0,
    positionYSprite: 610,
    widthSprite: 224,
    heightSprite: 112,
    PositionX: 0,
    PositionY: canvas.height - 112,
    update(){
        this.PositionX = this.PositionX - 1
        if(this.PositionX <= -224){
            this.PositionX = 0
        }
    },
    draw(){
        ctx.drawImage(sprites, this.positionXSprite, this.positionYSprite, this.widthSprite, this.heightSprite, this.PositionX, this.PositionY, this.widthSprite, this.heightSprite)
        ctx.drawImage(sprites, this.positionXSprite, this.positionYSprite, this.widthSprite, this.heightSprite, this.PositionX+this.widthSprite, this.PositionY, this.widthSprite, this.heightSprite)
        ctx.drawImage(sprites, this.positionXSprite, this.positionYSprite, this.widthSprite, this.heightSprite, this.PositionX+this.widthSprite+this.widthSprite, this.PositionY, this.widthSprite, this.heightSprite)
    }
}
const background = {
    positionXSprite: 390,
    positionYSprite: 0,
    widthSprite: 275,
    heightSprite: 204,
    PositionX: 0,
    PositionY: canvas.height - 204,
    update(){
        this.PositionX = this.PositionX - 0.20
        if(this.PositionX <= -275){
            this.PositionX = 0
        }
    },
    draw(){
        ctx.fillStyle = '#70c5ce'
        ctx.fillRect(0,0, canvas.width, canvas.height)
        ctx.drawImage(sprites, this.positionXSprite, this.positionYSprite, this.widthSprite, this.heightSprite, this.PositionX, this.PositionY, this.widthSprite, this.heightSprite)
        ctx.drawImage(sprites, this.positionXSprite, this.positionYSprite, this.widthSprite, this.heightSprite, this.PositionX+this.widthSprite, this.PositionY, this.widthSprite, this.heightSprite)
        ctx.drawImage(sprites, this.positionXSprite, this.positionYSprite, this.widthSprite, this.heightSprite, this.PositionX+this.widthSprite+this.widthSprite, this.PositionY, this.widthSprite, this.heightSprite)
    }
}
const pipes = {
    pairs : [],
    groundPipe: {
        positionXSprite: 0,
        positionYSprite: 169,
    },
    skyPipe: {
        positionXSprite: 52,
        positionYSprite: 169,
    },
    widthSprite: 52,
    heightSprite: 400,
    testColision(pair){
        var sameSpace = false
        birds.forEach( (bird) => {
            if(bird.PositionX + bird.widthSprite >= pair.positionX){
                if(bird.PositionY <= (pair.skyY + this.heightSprite) || (bird.PositionY + bird.heightSprite) >= (pair.groundY)){
                    if(pair.positionX + this.widthSprite > bird.PositionX){
                        sameSpace = true
                        bird.isLive = false
                        bird.gravityAcceleration = 0
                        bird.PositionY = 1000
                    }
                }
            }
        })
        return sameSpace
    },
    draw(){
        this.pairs.forEach( (pair) => {
            ctx.drawImage(sprites, this.skyPipe.positionXSprite, this.skyPipe.positionYSprite, this.widthSprite, this.heightSprite, pair.positionX, pair.skyY, this.widthSprite, this.heightSprite)
            ctx.drawImage(sprites, this.groundPipe.positionXSprite, this.groundPipe.positionYSprite, this.widthSprite, this.heightSprite, pair.positionX, pair.groundY, this.widthSprite, this.heightSprite)
        })
    },
    update(){
        const modFrames = geralFrames % 200 === 0
        if(modFrames || geralFrames == 0){
            var gap = getRandomInclusive(110,140)
            var randomPosition = getRandomInclusive(50,280)
            this.pairs.push(
                {   
                    positionX: 400,
                    groundY: (400 + gap) - randomPosition,
                    skyY: 0 - randomPosition,
                    center: (400 + (gap/2)) - randomPosition
                }
            )
        }
        if(this.pairs[0].positionX < -40){
            currentPipe = this.pairs[1]
        }else{
            currentPipe = this.pairs[0]
        }
        this.pairs.forEach( (pair) => {
            pair.positionX--
            if(pair.positionX < -70){
                this.pairs.shift()
            }
            if(this.testColision(pair)){
                colision = true
            }
        })
    }
}
function testColision(objectA,objectB){
    const objectAY = objectA.PositionY + objectA.heightSprite
    const objectBY = objectB.PositionY

    if(objectAY >= objectBY){
        return true
    }else{
        return false
    }
}
function getRandomInclusive(min,max){
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function loop(){
    playBirds()
    background.update()
    background.draw()
    pipes.update()
    pipes.draw()
    ground.update()
    ground.draw()
    birds.forEach((bird) => {
        if(testColision(bird,ground)){
            bird.isLive = false
            bird.gravityAcceleration = 0
            colision = true
            bird.PositionY = 1000
        }
        if(bird.PositionY < 0){
            bird.isLive = false
            bird.gravityAcceleration = 0
            colision = true
            bird.PositionY = 1000
        }
        bird.draw()
        bird.updateState()
    })
    if(colision == true){
        birdLiving = 0
        birds.forEach( (bird) => {
            if(bird.isLive == true){
                birdLiving++
            }
        })
        if(birdLiving == 0){
            endGame = true
        }
    }
    if(endGame == true){
        console.log('Game Over!!')
        return
    }

    if(frames < 30){
        frames++
    }else{
        frames = 0
    }
    geralFrames++
    requestAnimationFrame(loop)
}

loop()