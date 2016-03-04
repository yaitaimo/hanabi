var hanabi = hanabi || {};
!function() {
  'use strict';

  hanabi.funcs = {
    show: function(user) {
      init(user)
    }
  };

  var SCREEN_WIDTH = window.innerWidth
  var SCREEN_HEIGHT = window.innerHeight
  var MAX_PARTICLES = 400
  var SPEED = 10

  var canvas = document.createElement('canvas')
  var context = canvas.getContext('2d')
  var title = document.createElement('div')
  var particles = []
  var rockets = []
  var colorCode = 0
  var user = ""

  function init(user) {
    user = user
    document.body.appendChild(title);
    title.setAttribute('id', 'hanabi-title');
    document.body.appendChild(canvas);
    canvas.setAttribute('id', 'hanabi-canvas');
    canvas.width = SCREEN_WIDTH;
    canvas.height = SCREEN_HEIGHT;
    addCSS();
    launch()
  };

  function addCSS() {
  $('body').append([
    "<style>",
    "#hanabi-canvas {",
    "  position: absolute;",
    "  left: 0;",
    "  top: 0;",
    "  background: rgba(0, 0, 0, 0.25);",
    "}",
    "#hanabi-title {",
    "  position: relative;",
    "  z-index: 9999999;",
    "  text-align: center;",
    "  font-size: 28px;",
    "}",
    "#hanabi-title > span {",
    "  font-weight: bold;",
    "}",
    "</style>",
  ].join(""))
}

function launch() {
  createRocket(0, 0.7, SCREEN_HEIGHT/3);
  createRocket(SCREEN_WIDTH, 0.3, SCREEN_HEIGHT/3);
  setInterval(loop, SPEED);
}

function finish() {
  canvas.remove()
  title.remove()
}

function showTitle() {
  title.innerHTML = '<span>'+user+'</span>さんがマージされました👏'
}

function createRocket(x, angle, lifespan) {
  var rocket = new Rocket(x);
  rocket.explosionColor = Math.floor(Math.random() * 360 / 10) * 10;
  rocket.vel.y = -5.5;
  rocket.vel.x = angle * 6 - 3;
  rocket.size = 8;
  rocket.shrink = 0.999;
  rocket.gravity = 0.01;
  rocket.lifespan = lifespan;
  rockets.push(rocket);
}

function loop() {
  if (SCREEN_WIDTH != window.innerWidth) {
    canvas.width = SCREEN_WIDTH = window.innerWidth;
  }
  if (SCREEN_HEIGHT != window.innerHeight) {
    canvas.height = SCREEN_HEIGHT = window.innerHeight;
  }

  var existingRockets = [];

  for (var i = 0; i < rockets.length; i++) {
    rockets[i].update();
    rockets[i].render(context);

    if (rockets[i].pos.y < rockets[i].lifespan || rockets[i].vel.y >= 0) {
      showTitle()
      rockets[i].explode();
      setTimeout(finish, 1000);
    } else {
      existingRockets.push(rockets[i]);
    }
  }

  rockets = existingRockets;

  var existingParticles = [];

  for (var i = 0; i < particles.length; i++) {
    particles[i].update();

    if (particles[i].exists()) {
      particles[i].render(context);
      existingParticles.push(particles[i]);
    }
  }

  particles = existingParticles;
}

function Particle(pos) {
  this.pos = {
    x: pos ? pos.x : 0,
    y: pos ? pos.y : 0
  };
  this.vel = {
    x: 0,
    y: 0
  };
  this.shrink = .97;
  this.size = 2;

  this.resistance = 1;
  this.gravity = 0;

  this.flick = false;

  this.alpha = 1;
  this.fade = 0;
  this.color = 0;
}

Particle.prototype.update = function() {
  // apply resistance
  this.vel.x *= this.resistance;
  this.vel.y *= this.resistance;

  // gravity down
  this.vel.y += this.gravity;

  // update position based on speed
  this.pos.x += this.vel.x;
  this.pos.y += this.vel.y;

  // shrink
  this.size *= this.shrink;

  // fade out
  this.alpha -= this.fade;
};

Particle.prototype.render = function(c) {
  if (!this.exists()) {
    return;
  }

  c.save();

  c.globalCompositeOperation = 'lighter';

  var x = this.pos.x,
  y = this.pos.y,
  r = this.size / 2;

  var gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
  gradient.addColorStop(0.1, "rgba(255,255,255," + this.alpha + ")");
  gradient.addColorStop(0.8, "hsla(" + this.color + ", 100%, 50%, " + this.alpha + ")");
  gradient.addColorStop(1, "hsla(" + this.color + ", 100%, 50%, 0.1)");

  c.fillStyle = gradient;

  c.beginPath();
  c.arc(this.pos.x, this.pos.y, this.flick ? Math.random() * this.size : this.size, 0, Math.PI * 2, true);
  c.closePath();
  c.fill();

  c.restore();
};

Particle.prototype.exists = function() {
  return this.alpha >= 0.1 && this.size >= 1;
};

function Rocket(x) {
  Particle.apply(this, [{
    x: x,
    y: SCREEN_HEIGHT}]);

    this.explosionColor = 0;
  }

  Rocket.prototype = new Particle();
  Rocket.prototype.constructor = Rocket;

  Rocket.prototype.explode = function() {
    var count = Math.random() * 10 + 80;

    for (var i = 0; i < count; i++) {
      var particle = new Particle(this.pos);
      var angle = Math.random() * Math.PI * 2;

      // emulate 3D effect by using cosine and put more particles in the middle
      var speed = Math.cos(Math.random() * Math.PI / 2) * 15;

      particle.vel.x = Math.cos(angle) * speed;
      particle.vel.y = Math.sin(angle) * speed;

      particle.size = 10;

      particle.gravity = 0.2;
      particle.resistance = 0.92;
      particle.shrink = Math.random() * 0.05 + 0.93;

      particle.flick = true;
      particle.color = this.explosionColor;

      particles.push(particle);
    }
  };

  Rocket.prototype.render = function(c) {
    if (!this.exists()) {
      return;
    }

    c.save();

    c.globalCompositeOperation = 'lighter';

    var x = this.pos.x,
    y = this.pos.y,
    r = this.size / 2;

    var gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
    gradient.addColorStop(0.1, "rgba(255, 255, 255 ," + this.alpha + ")");
    gradient.addColorStop(1, "rgba(0, 0, 0, " + this.alpha + ")");

    c.fillStyle = gradient;

    var radius = 2

    c.beginPath();
    c.arc(this.pos.x, this.pos.y, radius, 0, Math.PI * 2, true);
    c.closePath();
    c.fill();

    c.restore();
  };

}();

hanabi.funcs.show()
