console.log('Bem-vindo ao Flappy Bird do Uriel Belo 🚀')
const sprites = new Image()
sprites.src = './sprites.png'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const qBirds = 1
const birds = []
const gravityAcceleration = 0.05
const jumpSize = -2.5
var colision = false

class cBird {
    positionXSprite = 0
    positionYSprite = 0
    widthSprite = 33
    heightSprite = 24
    PositionX = 20
    PositionY = 100
    velocity = 0
    jump = () => {
        this.velocity = jumpSize
    }
    draw = () => {
        ctx.drawImage(sprites, this.positionXSprite, this.positionYSprite, this.widthSprite, this.heightSprite, this.PositionX, this.PositionY, this.widthSprite, this.heightSprite)
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
    draw(){
        ctx.drawImage(sprites, this.positionXSprite, this.positionYSprite, this.widthSprite, this.heightSprite, this.PositionX, this.PositionY, this.widthSprite, this.heightSprite)
    }
}
const background = {
    positionXSprite: 390,
    positionYSprite: 0,
    widthSprite: 275,
    heightSprite: 204,
    PositionX: 0,
    PositionY: canvas.height - 204,
    draw(){
        ctx.fillStyle = '#70c5ce'
        ctx.fillRect(0,0, canvas.width, canvas.height)
        ctx.drawImage(sprites, this.positionXSprite, this.positionYSprite, this.widthSprite, this.heightSprite, this.PositionX, this.PositionY, this.widthSprite, this.heightSprite)
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
        console.log('Fez colisão')
        return true
    }else{
        return false
    }
}

function loop(){
    background.draw()
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

    requestAnimationFrame(loop)
}

loop()