import { physics, value } from 'popmotion';
import styler from 'stylefire';

const mainEl = document.getElementById('svg-canvas');

const colors = ['#6007B3', '#FFB33D', '#9323FF', '#08CC4C', '#36B361'];

function drawLines() {
  return window
    .fetch('https://api.noopschallenge.com/vexbot?count=10')
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

        const vectorStyler = styler(vectorEl);
        let anchorPoint = 'y1';
        if (vectorEl.getAttribute('y1') > vectorEl.getAttribute('y2')) {
          anchorPoint = 'y2';
        }
        physics({ acceleration: 100, restSpeed: false }).start(v => {
          vectorStyler.set({ [anchorPoint]: v });
        });
      });
    });
}

function init() {
  drawLines();
  window.setInterval(drawLines, 2000);
}

init();
