const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const shapeSelector = document.getElementById("shape-selector");
const shapeSizeSlider = document.getElementById("shape-size-slider");
const shapeCountSlider = document.getElementById("shape-count-slider");
const shapeCountValue = document.getElementById("shape-count-value");
const canvasSizeSelector = document.getElementById("canvas-size-selector");
const artStyleSelector = document.getElementById("art-style-selector");
const speedFactorSlider = document.getElementById("speed-factor-slider");
const speedFactorValue = document.getElementById("speed-factor-value");
const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");
const restartButton = document.getElementById("restart-button");
const downloadButton = document.getElementById("download-button");

let shapes = [];
let selectedShape = "circle";
let backgroundColor = "#000000";
let shapeSize = 20;
let shapeCount = 100;
let time = 0;
let artStyle = "swirl";
let speedFactor = 5;
let isAnimating = false;

function setCanvasSize() {
  const selectedSize = canvasSizeSelector.value.split("x");
  canvas.width = parseInt(selectedSize[0], 10);
  canvas.height = parseInt(selectedSize[1], 10);
  initShapes();
}

canvasSizeSelector.addEventListener("change", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

artStyleSelector.addEventListener("change", (event) => {
  artStyle = event.target.value;
  initShapes();
});

shapeCountSlider.addEventListener("input", (event) => {
  shapeCount = Number(event.target.value);
  shapeCountValue.textContent = shapeCount;
  initShapes();
});

shapeSelector.addEventListener("change", (event) => {
  selectedShape = event.target.value;
  initShapes();
});

shapeSizeSlider.addEventListener("input", (event) => {
  shapeSize = Number(event.target.value);
  document.getElementById("shape-size-value").textContent = shapeSize;
  initShapes();
});

speedFactorSlider.addEventListener("input", (event) => {
  speedFactor = Number(event.target.value);
  speedFactorValue.textContent = speedFactor;
  shapes.forEach((shape) => {
    shape.updateSpeed();
  });
});

class Shape {
  constructor(x, y, size, color, offset) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.offset = offset;

    this.angle = Math.random() * Math.PI * 2;
    this.radius = 0;
    this.angularSpeed = (0.05 + Math.random() * 0.05) * speedFactor;
    this.radialSpeed = (0.2 + Math.random() * 0.2) * speedFactor;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() * 0.05 - 0.025) * speedFactor;
  }

  updateSpeed() {
    this.angularSpeed = (0.05 + Math.random() * 0.05) * speedFactor;
    this.radialSpeed = (0.2 + Math.random() * 0.2) * speedFactor;
    this.rotationSpeed = (Math.random() * 0.05 - 0.025) * speedFactor;
  }

  update() {
    if (artStyle === "swirl") {
      this.angle += this.angularSpeed;
      this.radius += this.radialSpeed;
      this.x = canvas.width / 2 + this.radius * Math.cos(this.angle);
      this.y = canvas.height / 2 + this.radius * Math.sin(this.angle);
    } else if (artStyle === "random") {
      this.x += (Math.random() - 0.5) * 5;
      this.y += (Math.random() - 0.5) * 5;
    } else if (artStyle === "zigzag") {
      this.x += Math.sin(time * 2) * 2;
      this.y += Math.cos(time * 2) * 2;
    }
    this.rotation += this.rotationSpeed;

    this.draw();
  }

  draw() {}
}

class Circle extends Shape {
  draw() {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.rotation);
    context.beginPath();
    context.arc(0, 0, this.size, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
    context.restore();
  }
}

class Square extends Shape {
  draw() {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.rotation);
    context.beginPath();
    context.rect(-this.size / 2, -this.size / 2, this.size, this.size);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
    context.restore();
  }
}

class Triangle extends Shape {
  draw() {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.rotation);
    context.beginPath();
    context.moveTo(0, -this.size);
    context.lineTo(-this.size, this.size);
    context.lineTo(this.size, this.size);
    context.closePath();
    context.fillStyle = this.color;
    context.fill();
    context.restore();
  }
}

class Pentagon extends Shape {
  draw() {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.rotation);
    context.beginPath();
    for (let i = 0; i < 5; i++) {
      context.lineTo(
        this.size * Math.cos((i * 2 * Math.PI) / 5),
        this.size * Math.sin((i * 2 * Math.PI) / 5)
      );
    }
    context.closePath();
    context.fillStyle = this.color;
    context.fill();
    context.restore();
  }
}

class Hexagon extends Shape {
  draw() {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.rotation);
    context.beginPath();
    for (let i = 0; i < 6; i++) {
      context.lineTo(
        this.size * Math.cos((i * 2 * Math.PI) / 6),
        this.size * Math.sin((i * 2 * Math.PI) / 6)
      );
    }
    context.closePath();
    context.fillStyle = this.color;
    context.fill();
    context.restore();
  }
}

class Star extends Shape {
  draw() {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.rotation);
    context.beginPath();
    for (let i = 0; i < 5; i++) {
      context.lineTo(
        this.size * Math.cos((i * 2 * Math.PI) / 5),
        this.size * Math.sin((i * 2 * Math.PI) / 5)
      );
      context.lineTo(
        (this.size / 2) * Math.cos(((i + 0.5) * 2 * Math.PI) / 5),
        (this.size / 2) * Math.sin(((i + 0.5) * 2 * Math.PI) / 5)
      );
    }
    context.closePath();
    context.fillStyle = this.color;
    context.fill();
    context.restore();
  }
}

const colorSchemeSelector = document.getElementById("color-scheme-selector");
let currentColorScheme = "colorful";

// Handle color scheme change
colorSchemeSelector.addEventListener("change", (event) => {
  currentColorScheme = event.target.value;
  initShapes();
});

function getColor() {
  if (currentColorScheme === "colorful") {
    return `hsl(${Math.random() * 360}, 100%, 50%)`;
  } else {
    const grayValue = Math.random() * 100;
    return `hsl(0, 0%, ${grayValue}%)`;
  }
}

function initShapes() {
  shapes = [];
  for (let i = 0; i < shapeCount; i++) {
    const color = getColor();
    const offset = i * 0.01;

    switch (selectedShape) {
      case "circle":
        shapes.push(
          new Circle(
            canvas.width / 2,
            canvas.height / 2,
            shapeSize,
            color,
            offset
          )
        );
        break;
      case "square":
        shapes.push(
          new Square(
            canvas.width / 2,
            canvas.height / 2,
            shapeSize,
            color,
            offset
          )
        );
        break;
      case "triangle":
        shapes.push(
          new Triangle(
            canvas.width / 2,
            canvas.height / 2,
            shapeSize,
            color,
            offset
          )
        );
        break;
      case "pentagon":
        shapes.push(
          new Pentagon(
            canvas.width / 2,
            canvas.height / 2,
            shapeSize,
            color,
            offset
          )
        );
        break;
      case "hexagon":
        shapes.push(
          new Hexagon(
            canvas.width / 2,
            canvas.height / 2,
            shapeSize,
            color,
            offset
          )
        );
        break;
      case "star":
        shapes.push(
          new Star(
            canvas.width / 2,
            canvas.height / 2,
            shapeSize,
            color,
            offset
          )
        );
        break;
    }
  }
}

function animate() {
  if (!isAnimating) return;

  requestAnimationFrame(animate);

  shapes.forEach((shape) => {
    shape.update();
  });

  time += 0.01 * speedFactor;
}

startButton.addEventListener("click", () => {
  if (!isAnimating) {
    isAnimating = true;
    animate();
  }
});

stopButton.addEventListener("click", () => {
  isAnimating = false;
});

restartButton.addEventListener("click", () => {
  selectedShape = "circle";
  backgroundColor = "#000000";
  shapeSize = 20;
  shapeCount = 100;
  time = 0;
  artStyle = "swirl";
  speedFactor = 5;
  isAnimating = false;

  shapeSelector.value = "circle";
  shapeSizeSlider.value = 20;
  shapeCountSlider.value = 100;
  shapeCountValue.textContent = "100";
  canvasSizeSelector.value = "1920x1080";
  artStyleSelector.value = "swirl";
  speedFactorSlider.value = 5;
  speedFactorValue.textContent = "5";

  setCanvasSize();
  animate();
});

downloadButton.addEventListener("click", () => {
  const imageUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = imageUrl;
  link.download = "artwork.png";
  link.click();
});

setCanvasSize();
