const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground;
var fruit,rope;
var link;

var bg_img;
var food;
var rabbit, rabbitIMG;
var b1;
var piscando,comendo,triste;
var somFundo, somTriste, somCorda, somComendo, somAr;
var soprador;

function preload()
{
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  rabbitIMG = loadImage('Rabbit-01.png');
  piscando = loadAnimation("blink_1.png", "blink_2.png", "blink_3.png");
  comendo = loadAnimation("eat_0.png", "eat_1.png", "eat_2.png", "eat_3.png", "eat_4.png");
  triste = loadAnimation("sad_1.png", "sad_2.png", "sad_3.png");
  somFundo = loadSound("sound1.mp3");
  somTriste = loadSound("sad.wav");
  somCorda = loadSound("rope_cut.mp3");
  somComendo = loadSound("eating_sound.mp3");
  somAr = loadSound("air.wav");

  piscando.playing = true;
  piscando.looping = true;
  comendo.playing = true;
  comendo.looping = false;

}

function setup() 
{
  createCanvas(500,700);
  frameRate(80); //alterado, geralmente ele é 30 frames/seg
  
  //inserindo atraso na animação 
  piscando.frameDelay = 30;
  comendo.frameDelay = 20;

  engine = Engine.create();
  world = engine.world;

  //criação do objeto ground a partir da classe 
  ground = new Ground(200,680,600,20);

  //criação do objeto corda a partir da classe 
  rope = new Rope(7,{x:245,y:30});

  //criação do corpo fruta e adição ao composto 
  fruit = Bodies.circle(300,300,20);
  Matter.Composite.add(rope.body,fruit);

  //criação do botão para cortar a corda
  b1 = createImg('cut_btn.png');
  b1.position(220,30);
  b1.size(50,50);
  b1.mouseClicked(cair);

  //criação do botão para soprar a fruta
  soprador = createImg('balloon.png');
  soprador.position(220,300);
  soprador.size(50,50);
  soprador.mouseClicked(soprar);


  //criação do sprite do coelho
  rabbit = createSprite(300,600,20,20);
  rabbit.addAnimation('piscando', piscando);
  rabbit.addAnimation('comendo', comendo);
  rabbit.changeAnimation('piscando');
  rabbit.scale = 0.3;

  //criação do objeto link a partir da classe 
  link = new Link(rope,fruit);

  //configuração de imagem, desenhos e texto
  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
  imageMode(CENTER);
  
}

function draw() 
{
  background(51);

  image(bg_img,width/2,height/2,490,690);

  image(food,fruit.position.x,fruit.position.y,70,70);
  rope.show();
  Engine.update(engine);
  ground.show();

  drawSprites();
   
}

function cair()
{
  somCorda.play();
  rope.break();
  link.cortar();
  link = null;
}

function soprar()
{
  Matter.Body.applyForce(fruit, {x:0,y:0}, {x:0.01,y:0});
}