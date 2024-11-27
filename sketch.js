// Thumb for slider
class Thumb {
  constructor(slider) {
    this.slider = slider; // Has a parent of slider
    // Adjust sizes based on slider size
    this.x = slider.x + slider.w / 2;
    this.y = slider.y + slider.h / 2;
    this.d = slider.w;
    // Dragging state for mouse interaction
    this.dragging = false;
  }

  // Display the thumb on canvas
  display() {

    // Fill based on dragging state
    fill(this.dragging ? "#efefefef" : 255);

    // Increase thumb size on mouse hover
    if (this.isMouseOver()) {
      this.d = this.slider.w + 10;
    } else {
      this.d = this.slider.w;
    }

    // Confuse the user by shifting thumb X position
    if (this.isMouseOver() && mouseIsPressed) {
      this.x = mouseX - random(-30, 30);
      this.y = mouseY;
    }

    circle(this.x, this.y, this.d);
  }

  // Move the thumb based on mouse interaction
  move() {
    // Set dragging state
    if (mouseIsPressed && this.isMouseOver()) {
      this.dragging = true;
    } else if (!mouseIsPressed) {
      this.dragging = false;
    }

    // Constrian thumb movement to height of slider
    if (this.dragging) {
      this.y = constrain(mouseY, this.slider.y + this.d / 2, this.slider.y + this.slider.h - this.d / 2);
    }
  }

  // Detect if mouse is over thumb
  isMouseOver() {
    return (
      dist(mouseX, mouseY, this.x, this.y) < this.d / 2
    );
  }

  // Return position of thumb
  getVal() {
    let pos = this.y;
    return floor(map(pos, this.slider.y + this.d / 2, this.slider.y + this.slider.h - this.d / 2, 100, 0));
  }

  // Programatically set position of thumb
  setVal(val) {
    this.y = map(val, 100, 0, this.slider.y + this.d / 2, this.slider.y + this.slider.h - this.d / 2);
  }
}

// Slider class
class Slider {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.thumb = new Thumb(this); // Has child of Thumb
  }

  // Display the slider on canvas
  display() {

    // Oscillator to make the slider wiggle
    let osc = map(sin(frameCount * 0.02), -1, 1, 0, 100);

    push()

    strokeWeight(this.w)
    stroke(0)

    // Draw the slider line through points
    for (let i = this.y; i < this.y + this.h; i += 1) {
      let xOffset = map(noise(i / 50, frameCount / 100), 0, 1, -osc, osc);
      point(this.x + xOffset, i);
    }

    // Approache without wiggle
    //rect(this.x, this.y, this.w, this.h, this.w, this.w, this.w, this.w);

    pop()

    // Make the thumb whiggle the same way as the slider
    let thumbXOffset = map(noise(this.thumb.y / 50, frameCount / 100), 0, 1, -osc, osc);
    this.thumb.x = this.x + thumbXOffset;

    // Display the thumb
    this.thumb.display();
  }

  // Access thumb move method from slider
  move() {
    this.thumb.move();
  }

  // Return thumb value
  getVal() {
    return this.thumb.getVal();
  }

  // Set thumb value
  setVal(val) {
    this.thumb.setVal(val);
  }
}

let volSlider, brightSlider;
let bg = 255;
let song;
let songVol = 0.5;
let swap = false; // Swap the sliders -> brightness controls volume and vice versa
let font;

function preload() {
  song = loadSound("./assets/song.mp3");
  font = loadFont("./assets/Maax Mono - Regular-205TF.otf")
}

function setup() {
  createCanvas(700, 900);

  volSlider = new Slider((width / 2) + 165, height / 3, 30, 400);
  brightSlider = new Slider((width / 2) - 200, height / 3, 30, 400);

  // Play Song initially
  song.play();

  textFont(font);
  textSize(24);
}

function draw() {
  background(bg);

  brightSlider.display();
  brightSlider.move();
  volSlider.display();
  volSlider.move();


  // Swap the sliders every 200 frames
  if (frameCount % 100 === 0) {
    swap = !swap;
  }

  if (swap) {
    songVol = map(volSlider.getVal(), 0, 100, 0, 100);
    bg = map(brightSlider.getVal(), 0, 100, 0, 255);
  } else {
    songVol = map(brightSlider.getVal(), 0, 100, 0, 100);
    bg = map(volSlider.getVal(), 0, 100, 0, 255);
  }

  // Set volume based on slider value;
  // add randomness to make it distorted
  song.amp(songVol / random(50, 200));


  // Display slider values
  fill(0);
  text("Brightness: " + brightSlider.getVal(), brightSlider.x - 80, brightSlider.y + brightSlider.h + 50);
  text("Volume: " + volSlider.getVal(), volSlider.x - 55, volSlider.y + volSlider.h + 50);

  // Set both sliders to 100% if user slides both to 0
  if (volSlider.getVal() === 0 && brightSlider.getVal() === 0) {
    fill(255)
    text("almost ;)", width / 2 - 65, height / 2);

    setTimeout(() => {
      brightSlider.setVal(100);
      volSlider.setVal(100);

    }, 1000)
  }

}
