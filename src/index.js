import { physics } from 'popmotion';
import styler from 'stylefire';

const mainEl = document.querySelector('svg');
const colors = ['#6007B3', '#FFB33D', '#9323FF', '#08CC4C', '#36B361'];

function getVectorLength({ a, b }) {
  const xLength = a.x - b.x;
  const yLength = a.y - b.y;
  return Math.sqrt(xLength * xLength + yLength * yLength);
}

function drawLines() {
  return window
    .fetch('https://api.noopschallenge.com/vexbot?count=20')
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

        const polygonEl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        polygonEl.setAttribute('points', `${vector.a.x}, ${vector.a.y} ${vector.b.x}, ${vector.b.y}`);

        const vectorStyler = styler(vectorEl);
        const falling = physics({ acceleration: 10 * vector.speed }).start(v => {
          vectorStyler.set({ y1: `${vector.a.y + v}`, y2: `${vector.b.y + v}` });
          if (vectorStyler.get('y1') > 100000) {
            falling.stop();
          }
        });
      });
    });
}

function init() {
  drawLines();
  window.setInterval(drawLines, 2000);
}

init();
