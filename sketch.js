class Thumb {
  constructor(slider) {
    this.slider = slider;
    this.x = slider.x + slider.w / 2;
    this.y = slider.y + slider.h / 2;
    this.d = slider.w;
    this.dragging = false;
  }

  display() {
    fill(this.dragging ? "#efefefef" : 255);
    circle(this.x, this.y, this.d);
  }

  move() {
    if (mouseIsPressed && this.isMouseOver()) {
      this.dragging = true;
    } else if (!mouseIsPressed) {
      this.dragging = false;
    }

    if (this.dragging) {
      this.y = constrain(mouseY, this.slider.y + this.d / 2, this.slider.y + this.slider.h - this.d / 2);
    }
  }

  isMouseOver() {
    return (
      dist(mouseX, mouseY, this.x, this.y) < this.d / 2
    );
  }

  getVal() {
    let pos = this.y;
    return floor(map(pos, this.slider.y + this.d / 2, this.slider.y + this.slider.h - this.d / 2, 100, 0));
  }

  setVal(val) {
    this.y = map(val, 100, 0, this.slider.y + this.d / 2, this.slider.y + this.slider.h - this.d / 2);
  }
}

class Slider {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.thumb = new Thumb(this);
  }

  display() {
    fill(0);
    rect(this.x, this.y, this.w, this.h, this.w, this.w, this.w, this.w);
    this.thumb.display();
  }

  move() {
    this.thumb.move();
  }

  getVal() {
    return this.thumb.getVal();
  }

  setVal(val) {
    this.thumb.setVal(val);
  }
}

let volSlider, brightSlider;
let bg = 255;
let song;
let songVol = 0.5;
let swap = false;
let font;


function preload() {
  song = loadSound("song.mp3");
  font = loadFont("Maax Mono - Regular-205TF.otf")
}

function setup() {
  createCanvas(700, 900);

  volSlider = new Slider((width / 2) + 165, height / 3, 30, 400);
  brightSlider = new Slider((width / 2) - 200, height / 3, 30, 400);

  song.play();

  textFont(font);
  textSize(24);
}

function draw() {
  background(bg);


  if (frameCount % 200 === 0) {
    swap = !swap;
  }

  brightSlider.display();
  brightSlider.move();
  volSlider.display();
  volSlider.move();

  if (swap) {
    songVol = map(volSlider.getVal(), 0, 100, 0, 100);
    bg = map(brightSlider.getVal(), 0, 100, 0, 255);
  } else {
    songVol = map(brightSlider.getVal(), 0, 100, 0, 100);
    bg = map(volSlider.getVal(), 0, 100, 0, 255);
  }

  song.amp(songVol / random(50, 200));


  fill(0);
  text("Brightness: " + brightSlider.getVal(), brightSlider.x - 80, brightSlider.y + brightSlider.h + 50);
  text("Volume: " + volSlider.getVal(), volSlider.x - 55, volSlider.y + volSlider.h + 50);

  if (volSlider.getVal() === 0 && brightSlider.getVal() === 0) {
    fill(255)
    text("almost ;)", width / 2, height / 2);

    setTimeout(() => {
      brightSlider.setVal(100);
      volSlider.setVal(100);

    }, 1000)

  }

}
