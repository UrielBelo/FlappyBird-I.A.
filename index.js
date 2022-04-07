console.log('Bem-vindo ao Flappy Bird do Uriel Belo 🚀')
const sprites = new Image()
sprites.src = './sprites.png'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const qBirds = 1
const birds = []
const gravityAcceleration = 0.1
const jumpSize = -2.5
var colision = false
let frames = 0
let geralFrames = 0

class cBird {
    widthSprite = 33
    heightSprite = 24
    PositionX = 20
    PositionY = 100
    velocity = 0
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
        this.velocity = this.velocity + gravityAcceleration
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
        this.PositionX = this.PositionX - 2
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
        const modFrames = geralFrames % 300 === 0
        if(modFrames || geralFrames == 0){
            var gap = getRandomInclusive(110,140)
            var randomPosition = getRandomInclusive(50,280)
            this.pairs.push(
                {   
                    positionX: 400,
                    groundY: (400 + gap) - randomPosition,
                    skyY: 0 - randomPosition
                }
            )
        }
        this.pairs.forEach( (pair) => {
            pair.positionX--
            if(pair.positionX < -70){
                this.pairs.shift()
            }
            if(this.testColision(pair)){
                console.log('gameOver!!')
                colision = true
            }
        })
    }
}

document.addEventListener('mousedown', () => {
    birds.forEach((bird) => {
        bird.jump()
    })
})
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
    background.update()
    background.draw()
    pipes.update()
    pipes.draw()
    ground.update()
    ground.draw()
    birds.forEach((bird) => {
        if(testColision(bird,ground)){
            colision = true
        }
        bird.draw()
        bird.updateState()
    })
    if(colision == true){
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