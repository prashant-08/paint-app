const canvas = document.getElementById("my-canvas");
const ctx = canvas.getContext("2d");
let isDragging = false;
let mc = false; // mouse is clicked or not
let isEmpty = false;

document.addEventListener("DOMContentLoaded", setupCanvas);

function setupCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpi = window.devicePixelRatio;

  canvas.width = rect.width * dpi;
  canvas.height = rect.height * dpi;

  canvas.addEventListener("mousedown", handleMouseDown, false);
  canvas.addEventListener("mousemove", handleMouseMove, false);
  canvas.addEventListener("mouseup", handleMouseUp, false);
  canvas.addEventListener("dblclick", handleMouseDoubleClick, false);

  aTriangle = []; // array of triangles
  index = 0;
  canvas.onselectstart = function () {
    return false;
  };
}

function getRandomColor() {
  return "#" + Math.floor(Math.random() * (16 ** 6).toString(16));
}

function handleMouseDown(e) {
  const pos = getMousePosition(e);
  mc = true;
  // detect if left click(mousedown) on existig triangle or not
  // id on existing triangle start dragging it else start drawing new triangle
  index = findTriangleIndex(aTriangle, pos);
  if (index !== -1) {
    isDragging = true;
    canvas.style.cursor = "move";
  } else canvas.style.cursor = "crosshair";
  mousedownx = pos.x;
  mousedowny = pos.y;
}

function handleMouseMove(e) {
  const pos = getMousePosition(e);
  if (!mc) return; // just to check we are not just hovering , actually dragging/drawing
  locx = pos.x;
  locy = pos.y;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (isDragging) {
    const dx = pos.x - mousedownx;
    const dy = pos.y - mousedowny;
    mousedownx = pos.x;
    mousedowny = pos.y;
    aTriangle[index].X += dx;
    aTriangle[index].Y += dy;
    drawStoredTriangle();
  } else drawTriangle();
}

function handleMouseUp() {
  mc = false;
  isDragging = false;
  canvas.style.cursor = "default";
  if (isEmpty) {
    const randomColor = getRandomColor();
    ctx.fillStyle = randomColor;
    ctx.fill();
    aTriangle.push({
      X: 0,
      Y: 0,
      x0: mousedownx,
      y0: mousedowny,
      x1: locx,
      y1: locy,
      x2: mousedownx - (locx - mousedownx),
      y2: locy,
      col: randomColor,
    });
    isEmpty = false;
  }
}

function handleMouseDoubleClick(e) {
  const pos = getMousePosition(e);
  const index = findTriangleIndex(aTriangle, pos);
  if (index !== -1) {
    aTriangle.splice(index, 1);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStoredTriangle();
  }
}

// it helps to draw new triangles
function drawTriangle() {
  // draw old triangle
  drawStoredTriangle();
  // draw path of new empty triangle
  ctx.beginPath();
  ctx.moveTo(mousedownx, mousedowny);
  ctx.lineTo(locx, locy);
  ctx.lineTo(mousedownx - (locx - mousedownx), locy);
  ctx.closePath();
  ctx.stroke();
  // set triangle is empty
  isEmpty = true;
}

// function to find index in array of triangles
function findTriangleIndex(aTriangle, pos) {
  for (let i = 0; i < aTriangle.length; i++) {
    intializePath(aTriangle[i]);
    if (ctx.isPointInPath(pos.x, pos.y)) {
      return i;
    }
  }
  return -1;
}

function redraw(triangle) {
  intializePath(triangle);
  // fill colour in triangle
  ctx.fillStyle = triangle.col;
  ctx.fill();
}

// draws path of triangles
function intializePath(triangle) {
  ctx.beginPath();
  ctx.moveTo(triangle.x0 + triangle.X, triangle.y0 + triangle.Y);
  ctx.lineTo(triangle.x1 + triangle.X, triangle.y1 + triangle.Y);
  ctx.lineTo(triangle.x2 + triangle.X, triangle.y2 + triangle.Y);
  ctx.closePath();
}

function drawStoredTriangle() {
  aTriangle.forEach((item) => redraw(item));
}

// it returns position of current mouse relative to window
function getMousePosition(e) {
  const rect = canvas.getBoundingClientRect(),
    scaleX = canvas.width / rect.width,
    scaleY = canvas.height / rect.height;

  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  };
}

// reset the canvas
function reset() {
  aTriangle = [];
  isEmpty = false;
  isDragging = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
