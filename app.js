const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let photo = new Image();
let frame = new Image();

let zoom = 1;

document.getElementById('photoInput').addEventListener('change', e => {
  const reader = new FileReader();
  reader.onload = ev => {
    photo.src = ev.target.result;
    photo.onload = draw;
  };
  reader.readAsDataURL(e.target.files[0]);
});

document.getElementById('frameSelect').addEventListener('change', e => {
  frame.src = 'frames/' + e.target.value;
  frame.onload = draw;
});

document.getElementById('zoom').addEventListener('input', e => {
  zoom = parseFloat(e.target.value);
  draw();
});

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  if(photo.src) {
    const w = canvas.width * zoom;
    const h = canvas.height * zoom;

    ctx.drawImage(photo,(canvas.width-w)/2,(canvas.height-h)/2,w,h);
  }

  if(frame.src) {
    ctx.drawImage(frame,0,0,canvas.width,canvas.height);
  }
}

function downloadImage() {
  const link = document.createElement('a');
  link.download = 'twibbon.png';
  link.href = canvas.toDataURL();
  link.click();
}
