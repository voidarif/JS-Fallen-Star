const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)]
}

var shadowColor

function Star(x, y, radius, color) {
	this.x = x
	this.y = y
	this.radius = radius
	this.color = color
	this.velocity = {
		x: Math.random() - 0.5 * 10 + 3,
		y: 3
	}

	this.friction = 0.8
	this.gravity = 1

	this.draw = function(){
		c.save()
		c.beginPath()
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		c.fillStyle = this.color
		c.shadowColor =  this.color//'#e3eaef'
		c.shadowBlur = 20
		c.fill()
		c.closePath()
		c.restore()
	}

	this.update = function() {
		this.draw()

		if(this.y + this.radius + this.velocity.y > canvas.height - groundHeight ){
			this.velocity.y = -this.velocity.y * this.friction
			this.shatter()
		}else {
			this.velocity.y += this.gravity
		}

		//when hits side of screen
		if(this.x + this.radius + this.velocity.x > canvas.width || this.x - this.radius <= 0){
			this.velocity.x = -this.velocity.x * this.friction
			this.shatter()
		}

		this.x += this.velocity.x 
		this.y += this.velocity.y 
		
	}

	this.shatter = function(){
		this.radius -= 3
		for (var i =0; i < 8; i++) {
			miniStars.push(new miniStar(this.x, this.y, 2))
		}
	}
	/*console.log(miniStars)*/

}

function moon() {
		c.save()
		c.beginPath()
		c.fillStyle = 'white'
		c.arc(300, 100, 50, Math.PI * 2, false)
		c.shadowColor =  '#e3eaef'
		c.shadowBlur = 20
		c.fill()
		c.restore()
}


class FallenStar{
	constructor(x, y, velocity){
		this.x = x 
		this.y = y 
		this.velocity = velocity
	}
	draw() {
		c.save()
		c.beginPath()
		c.fillStyle = 'white'
		c.arc(this.x, this.y, 5, Math.PI * 2, false)
		c.shadowColor =  '#e3eaef'
		c.shadowBlur = 20
		c.fill()
		c.restore()
	}

	update(){
		this.draw()
		this.x += this.velocity

		if(this.x > canvas.width + 2000 || this.x < - 2000){
			this.velocity = - this.velocity
		}
	}

}
var x = 0
var y = 40
var velocity = 20

let fall = new FallenStar(x, y, velocity)


function miniStar(x, y, radius, color) {
	Star.call(this, x, y, radius, color)
	this.velocity = {
		x: randomIntFromRange(-5, 5),
		y: randomIntFromRange(-15, 15)
	}

	this.friction = 0.8
	this.gravity = 0.1
	this.ttl = 100
	this.opacity = 1 

this.draw = function(){
		c.save()
		c.beginPath()
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		c.fillStyle = shadowColor /*'rgba(255, 255, 255, '+ this.opacity + ')'*/
		c.shadowColor = shadowColor
		c.shadowBlur = 40
		c.fill()
		c.closePath()
		c.restore()
	}

	this.update = function() {
		this.draw()

		if(this.y + this.radius + this.velocity.y > canvas.height - groundHeight ){
			this.velocity.y = -this.velocity.y * this.friction
		}else {
			this.velocity.y += this.gravity
		}

		this.x += this.velocity.x 
		this.y += this.velocity.y 
		this.ttl -= 1
		this.opacity -= 1 / this.ttl
		
	}
}

function createMountainRange(mountainAmount, height, color) {
	for (var i =0 ; i < mountainAmount; i++) {
		const mountainWidth = canvas.width / mountainAmount
		c.beginPath()
		c.moveTo(i * mountainWidth, canvas.height)
		c.lineTo(i * mountainWidth + mountainWidth + 325, canvas.height)
		c.lineTo(i * mountainWidth + mountainWidth / 2, canvas.height - height)
		c.lineTo(i * mountainWidth - 325, canvas.height)
		c.fillStyle = color
		c.fill()
		c.closePath()
	}
}

//implementation
const backgroundGradient = c.createLinearGradient(0, 0, 0, canvas.height)
backgroundGradient.addColorStop(0, '#171e26')
backgroundGradient.addColorStop(1, '#3f586b')

var stars = []
var miniStars = []
var backgroundStars = []
var ticker = 0
var randomSpawnRate = 75
var groundHeight = 100
var elem = document.documentElement;

var colorArray = [
	'#04D939',
	'yellow',
	'white',
	'#aaff00',
	'#2acaea'
	]

var starColor = [
	'yellow',
	'white',
]

for(var i=0; i < 1; i++){
	stars.push(new Star(canvas.width / 2, 50, 30, '#e3eaef'))
}

for(var i=0; i < 150; i++){
	const x = Math.random() * canvas.width
	const y = Math.random() * canvas.height
	const radius = Math.random() * 4 + 1
	backgroundStars.push(new Star(x, y, radius, randomColor(starColor)))
}



function animate() {
	requestAnimationFrame(animate)
	c.fillStyle = backgroundGradient
	c.fillRect(0, 0, canvas.width, canvas.height)

	moon()


		fall.update()
	

	for(var i = 0; i < backgroundStars.length; i++){
		backgroundStars[i].draw()
	}

	createMountainRange(1, canvas.height - 50, '#384551')
	createMountainRange(2, canvas.height - 100, '#2b3843')
	createMountainRange(3, canvas.height - 300, '#26333e')
	c.fillStyle = '#182028'
	c.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight)

		for(var i = 0; i < stars.length; i++){
		stars[i].update()
		if (stars[i].radius == 0) {
			stars.splice(i,1)
		}
	}

	for(var i = 0; i < miniStars.length; i++){
		miniStars[i].update()
		if (miniStars[i].ttl == 0) {
			miniStars.splice(i,1)
		}
	}

	ticker++

	if(ticker % 30 == 0){
		const radius = 15
		const x = Math.max(radius, Math.random() * canvas.width - radius )
		stars.push(new Star(x, -100, radius, randomColor(colorArray)))
		randomSpawnRate = randomIntFromRange(75, 200)


		
	}
	if(ticker % 15 ==0){
		shadowColor = randomColor(colorArray)
	}

}

animate()

