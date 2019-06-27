import { physics } from 'popmotion';
import styler from 'stylefire';

const mainEl = document.getElementById('svg-canvas');

const colors = ['#6007B3', '#FFB33D', '#9323FF', '#08CC4C', '#36B361'];

function getVectorLength({ a, b }) {
  const xLength = a.x - b.x;
  const yLength = a.y - b.y;
  return Math.sqrt(xLength * xLength + yLength * yLength);
}

let printed = false;
function drawLines() {
  return window
    .fetch('https://api.noopschallenge.com/vexbot?count=2')
    .then(response => response.json())
    .then(data => data)
    .then(({ vectors }) => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      vectors.forEach(vector => {
        const vectorEl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        vectorEl.setAttribute('x1', `${vector.a.x}`);
        vectorEl.setAttribute('y1', `${vector.a.y}`);
        vectorEl.setAttribute('x2', `${vector.b.x}`);
        vectorEl.setAttribute('y2', `${vector.b.y}`);
        vectorEl.setAttribute('stroke', color);
        mainEl.append(vectorEl);

        const vectorLength = getVectorLength(vector);
        const vectorStyler = styler(vectorEl);

        // The higher point falls
        let movingY = 'y1';
        let movingX = 'x1';
        let startingX = vector.a.x;
        let startingY = vector.a.y;
        let anchorX = vector.b.x;
        let anchorY = vector.b.y;
        if (vectorEl.getAttribute('y1') > vectorEl.getAttribute('y2')) {
          movingY = 'y2';
          movingX = 'x2';
          startingX = vector.b.x;
          startingY = vector.b.y;
          anchorX = vector.a.x;
          anchorY = vector.a.y;
        }

        const falling = physics({ acceleration: 400, restSpeed: false }).start(v => {
          const newY = startingY + v;
          const x = vectorLength * vectorLength - (newY - anchorY) * (newY - anchorY);
          const newX = Math.sqrt(x < 0 ? x * -1 : x) + anchorX;
          vectorStyler.set({ [movingY]: newY, [movingX]: newX });
        });

        if (vectorStyler.get('x1') === vectorStyler.get('x2')) {
          console.log('stopping');
          falling.stop();
        }
      });
    });
}

function init() {
  drawLines();
  // window.setInterval(drawLines, 2000);
}

init();
