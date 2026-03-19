
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const overlayTextDiv = document.getElementById('overlayText');
const userNameInput = document.getElementById('userName');

let photo = new Image();
let frame = new Image();
let zoom = 1;
let offsetX = 0, offsetY = 0;
let drag = false;
let dragStart = {x: 0, y: 0};
let imgPos = {x: 0, y: 0};

document.getElementById('photoInput').addEventListener('change', e => {
  const reader = new FileReader();
  reader.onload = ev => {
    photo.src = ev.target.result;
    photo.onload = () => {
      imgPos = {x: 0, y: 0};
      draw();
    };
  };
  reader.readAsDataURL(e.target.files[0]);
});

document.getElementById('frameSelect').addEventListener('change', e => {
  frame.src = 'frames/' + e.target.value;
  frame.onload = () => {
    // Ubah ukuran canvas sesuai frame
    canvas.width = frame.naturalWidth;
    canvas.height = frame.naturalHeight;
    draw();
  };
});

document.getElementById('zoom').addEventListener('input', e => {
  zoom = parseFloat(e.target.value);
  draw();
});

userNameInput.addEventListener('input', draw);

// Drag & drop (mouse & touch)
const dragArea = document.getElementById('canvas-drag-area');
dragArea.addEventListener('mousedown', e => {
  drag = true;
  dragStart = {x: e.offsetX, y: e.offsetY};
});
dragArea.addEventListener('mousemove', e => {
  if (!drag) return;
  imgPos.x += e.offsetX - dragStart.x;
  imgPos.y += e.offsetY - dragStart.y;
  dragStart = {x: e.offsetX, y: e.offsetY};
  draw();
});
window.addEventListener('mouseup', () => { drag = false; });

// Touch events
dragArea.addEventListener('touchstart', e => {
  drag = true;
  const t = e.touches[0];
  const rect = dragArea.getBoundingClientRect();
  dragStart = {x: t.clientX - rect.left, y: t.clientY - rect.top};
});
dragArea.addEventListener('touchmove', e => {
  if (!drag) return;
  const t = e.touches[0];
  const rect = dragArea.getBoundingClientRect();
  const x = t.clientX - rect.left;
  const y = t.clientY - rect.top;
  imgPos.x += x - dragStart.x;
  imgPos.y += y - dragStart.y;
  dragStart = {x, y};
  draw();
  e.preventDefault();
}, {passive: false});
window.addEventListener('touchend', () => { drag = false; });

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Crop lingkaran untuk foto
  ctx.save();
  ctx.beginPath();
  ctx.arc(canvas.width/2, canvas.height/2, Math.min(canvas.width, canvas.height)/2, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.clip();

  if(photo.src && photo.naturalWidth && photo.naturalHeight) {
    // Jaga aspect ratio foto
    let baseScale = Math.max(
      canvas.width / photo.naturalWidth,
      canvas.height / photo.naturalHeight
    );
    let scale = baseScale * zoom;
    let w = photo.naturalWidth * scale;
    let h = photo.naturalHeight * scale;
    let x = (canvas.width - w) / 2 + imgPos.x;
    let y = (canvas.height - h) / 2 + imgPos.y;
    ctx.drawImage(photo, x, y, w, h);
  }
  ctx.restore();

  // Gambar frame memenuhi canvas
  if(frame.src && frame.naturalWidth && frame.naturalHeight) {
    ctx.drawImage(frame, 0, 0, frame.naturalWidth, frame.naturalHeight, 0, 0, canvas.width, canvas.height);
  }

  // Overlay nama user
  const name = userNameInput.value.trim();
  overlayTextDiv.textContent = name;
}

// Pengelolaan frame: Tambahkan file frame ke folder 'frames/' dan daftarkan manual di index.html dropdown.
function downloadImage() {
  const link = document.createElement('a');
  link.download = 'twibbon.png';
  link.href = canvas.toDataURL();
  link.click();
}


