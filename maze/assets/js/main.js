import { LEVEL_1, LEVEL_2, LEVEL_3 } from './mazes.js';

const main = document.querySelector('main');
const body = document.querySelector('body');

function maze(level) {
  // maze creation
  for (let i = 0; i < level.length; i++) {
    const section = document.createElement('section');
    section.classList.add('gameSection');

    main.append(section);

    level[i].forEach((element) => {
      const div = document.createElement('div');
      if (element.includes('*')) {
        div.classList.add('wall');
      } else if (element.includes('.')) {
        div.classList.add('path');
      } else if (element.includes('S')) {
        div.classList.add('start');
        div.classList.add('path');
        const hero = document.createElement('div');
        hero.classList.add('hero');
        div.append(hero);
      } else if (element.includes('T')) {
        div.classList.add('treasure');
        div.classList.add('path');
      } else if (element.includes('-')) {
        div.classList.add('border');
      } else if (element.includes('')) {
        div.classList.add('timer');
      }
      div.classList.add('block');
      section.append(div);
    });
  }

  // movements
  const hero = document.querySelector('.hero');

  body.addEventListener('keyup', function (event) {
    const heroSection = hero.parentNode.parentNode;
    const heroDownSection = hero.parentNode.parentNode.nextElementSibling;
    const heroAboveSection = hero.parentNode.parentNode.previousElementSibling;

    const heroSectionArray = Array.from(heroSection.children);
    const heroPosition = heroSectionArray.indexOf(hero.parentNode);

    const rightPath = hero.parentNode.nextElementSibling;
    const leftPath = hero.parentNode.previousElementSibling;
    const upPath = heroAboveSection.children[heroPosition];
    const downPath = heroDownSection.children[heroPosition];

    if (hero.parentNode.classList.contains('treasure')) {
      const gameSections = document.querySelectorAll('.gameSection');

      gameSections.forEach((section) => {
        section.parentNode.removeChild(section);
      });

      stopCounting();

      if (level === LEVEL_1) {
        maze(LEVEL_2);
      } else if (level === LEVEL_2) {
        maze(LEVEL_3);
      } else {
        alert('u have finished all my levels :(');
        body.style.background = 'url(./assets/images/popCatShut.png) 0 0';
      }
    } else {
      if (
        (event.key == 'd' || event.code == 'ArrowRight') &&
        rightPath.classList.contains('path')
      ) {
        rightPath.append(hero);
      } else if (
        (event.key == 'a' || event.code == 'ArrowLeft') &&
        leftPath.classList.contains('path')
      ) {
        leftPath.append(hero);
      } else if (
        (event.key == 's' || event.code == 'ArrowDown') &&
        downPath.classList.contains('path')
      ) {
        downPath.append(hero);
      } else if (
        (event.key == 'w' || event.code == 'ArrowUp') &&
        upPath.classList.contains('path')
      ) {
        upPath.append(hero);
      }
    }
  });

  const borders = document.querySelectorAll('.border');
  let currentBoxIndex = 0;

  function changeColor() {
    borders[currentBoxIndex].classList.toggle('active');
    currentBoxIndex = (currentBoxIndex + 1) % borders.length;
    setTimeout(changeColor, 100);
  }

  function popCat() {
    hero.classList.toggle('popCat');
    setTimeout(popCat, 500);
  }

  let initialValue = 0;
  let stopCounting = incrementingCounter(initialValue);
  const timer = document.querySelector('.timer');

  function incrementingCounter(initialValue) {
    let count = initialValue;

    const intervalId = setInterval(function () {
      count++;
      timer.textContent = `${count}s`;
    }, 1000);

    return function stopCounter() {
      clearInterval(intervalId);
    };
  }

  popCat();
  changeColor();
}

maze(LEVEL_1);
