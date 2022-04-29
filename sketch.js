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
var bmudo;

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
  triste.playing = true;
  triste.looping = false;

}

function setup() 
{
  //createCanvas(500,700);

  //comando para ajustar tela para celular
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(isMobile){
    canW = displayWidth; 
    canH = displayHeight; 
    createCanvas(displayWidth+80, displayHeight);
  } 
  else {
    canW = windowWidth; 
    canH = windowHeight; 
    createCanvas(windowWidth, windowHeight);
  }
  frameRate(80); //alterado, geralmente ele é 30 frames/seg

  //som de fundo
  somFundo.setVolume(0.2);
  somFundo.play();
  
  
  //inserindo atraso na animação 
  piscando.frameDelay = 30;
  comendo.frameDelay = 20;

  engine = Engine.create();
  world = engine.world;

  //criação do objeto ground a partir da classe 
  ground = new Ground(200,canH,600,20);

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
  soprador.position(90,260);
  soprador.size(90,90);
  soprador.mouseClicked(soprar);

  bmudo = createImg('mute.png');
  bmudo.position(440,40);
  bmudo.size(40,40);
  bmudo.mouseClicked(mutar);

  //criação do sprite do coelho
  rabbit = createSprite(300,canH-120,20,20);
  rabbit.addAnimation('piscando', piscando);
  rabbit.addAnimation('comendo', comendo);
  rabbit.addAnimation('triste', triste);
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

  image(bg_img,width/2,height/2,canW,canH);

  if(fruit!=null){
    image(food,fruit.position.x,fruit.position.y,70,70);
  }
  rope.show();
  Engine.update(engine);
  //ground.show();

  if(collide(fruit,rabbit)==true)
  {
    //rope.break();
    //World.remove(engine.world,fruit);
    fruit = null;
    rabbit.changeAnimation('comendo');
    somComendo.setVolume(0.2);
    somComendo.play();
  }

  if(fruit!= null && fruit.position.y >= 650){
    rabbit.changeAnimation('triste');
    somFundo.stop();
    somTriste.setVolume(0.2);
    somTriste.play();
    fruit = null;
  }
  

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
  somAr.play();
}

function mutar()
{
  if(somFundo.isPlaying())
  {
    somFundo.stop();
  }
   else
   {
    somFundo.setVolume(0.2);
     somFundo.play();
   }
}

function collide(body,sprite)
{
  if(body!=null)
        {
         var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
          if(d<=80)
            {
               return true; 
            }
            else{
              return false;
            }
         }
}