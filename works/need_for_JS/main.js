const MAX_ENEMY = 20;  // количество машин противника, которое есть у нас
const HEIGHT_ELEM = 105; // Стандартный размер расстояния

const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div'),
    topScore = document.querySelector('#topScore');

const audio = document.createElement('embed'); // можно также использовать вместо embed - audio


audio.src = './audio.mp3'; //атрибуты элемента
audio.type  = 'audio/mp3';  //атрибуты элемента
audio.style.cssText = `position: absolute; top: -1000px;`  // стоб прописать несколько свойств
//audio.remove(); чтоб скрыть (остановить) проигрывание музыки

car.classList.add('car');

const countSection = Math.floor(document.documentElement.clientHeight / HEIGHT_ELEM); // задаем фиксированную высоту поля кратную высоте элементов

gameArea.style.height = countSection * HEIGHT_ELEM; // задаем фиксированную высоту поля кратную высоте элементов




// start.onclick = function () {     //обработчик событий слегда устарел
//     start.classList.add('hide');  //чаще и современие использовать слушатель addEventListener 
// };

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);


// Создаем обьект с названиями клавиш для управления автомобилем
const keys = {  // обьект для управления автомобтлем
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

// Обьект с первоначальными данными (запущена ли игра, количество очков  и скорость)
const setting = {
    start: false,
    score: 0,
    speed: 0,
    traffic: 0,
};


const result = parseInt(localStorage.getItem('nfjs_score', setting.score));
topScore.textContent = result ? result : 0;


const addLocalStorage = () => {
    if (result < setting.score) {
        localStorage.setItem('nfjs_score', setting.score);
        topScore.textContent = setting.score;   
    }
    
}

function getQuantityElements (heightElement) { //функция для подщета количесва элементов (линий, авто) сколько помещаеться на экране (по высоте)
    //return document.documentElement.clientHeight / heightElement + 1; считаем от высоты єкрана клиента
    return (gameArea.offsetHeight / heightElement) + 1; // терперь считаем от высоты игрового поля (которое кратное стандарнтым размерам)
}

function startGame(event){

    const target = event.target; 

    if (target === start) return;

    switch (target.id) { // 
        case 'easy':
            setting.speed = 3;
            setting.traffic = 4; 
            break;
        case 'medium':
            setting.speed = 5;
            setting.traffic = 3;           
            break;
        case 'hard':
            setting.speed = 8;
            setting.traffic = 2;            
            break;
    }

   




    start.classList.add('hide');
    gameArea.innerHTML = ''; // это еобходимо чтоб очистить игровое поле после дтп и начать игру заново

     for (let i = 0; i < getQuantityElements(HEIGHT_ELEM); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = `${i * HEIGHT_ELEM}px`; // -(тоже что и line.style.top = (i * 100) + 'px';)- шаблонная строка внутри которой испоользуеться интерполяция 
        line.y = i * HEIGHT_ELEM;
        line.style.height = (HEIGHT_ELEM / 2) + 'px';
        gameArea.appendChild(line);
    }

    for (let i = 0; i < getQuantityElements(HEIGHT_ELEM * setting.traffic); i++) {
        const enemy = document.createElement('div');
        const randomEnemy = Math.floor(Math.random() * MAX_ENEMY) + 1;
        enemy.classList.add('enemy');
        const periodEnemy = -HEIGHT_ELEM * setting.traffic * (i + 1);
        enemy.y = periodEnemy < 100 ? -HEIGHT_ELEM * setting.traffic * (i + 1) : periodEnemy;
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = `transparent url("./image/enemy${randomEnemy}.png") center / cover no-repeat`;
        gameArea.append(enemy);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - enemy.offsetWidth)) + 'px';
    }
    setting.score = 0;
    setting.start = true;    
    gameArea.append(car);
    car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2;
    car.style.top = 'auto';
    car.style.bottom = '10px';
    document.body.append(audio);
    setting.x = car.offsetLeft;   // через '.х' добавляем свойство х в обект setting. offsetleft - значение которое находиться в css - 125px
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame);// планировка запуска при следующем обновлении экрана
}

function playGame(){

    if (setting.start) {
        setting.score += setting.speed;
        //score.textContent = 'SCORE: ' + setting.score; - выводим текст в одну строку
        score.innerHTML = 'SCORE<br> ' + setting.score; // добавляем тег <br> чтоб было в две строки поэтому innerHTML

        moveRoad();
        moveEnemy();
        if (keys.ArrowLeft && setting.x > 0) {
            setting.x -= setting.speed;
        }

        if(keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
            setting.x += setting.speed;
        }
        
        if (keys.ArrowUp && setting.y > 0) {
            setting.y -= setting.speed;
        }

        if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
            setting.y += setting.speed;
        }
        
        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';
    

        requestAnimationFrame(playGame);
    } 
}


function startRun(event){  //добавили аргумент. теперь можем посмотреть обьект событие
    if (keys.hasOwnProperty(event.key)) {// Проверяем есть ли свойства (стрелки влево, вправо) внутри обьекта. hasOwnProperty проверяет внутри этого обьекта, не проверяет у наследников
        event.preventDefault(); // сбрасываем стандартное поведение браузера при нажатии клавиш
        keys[event.key] = true;
    }
    
}

function stopRun(event){
    if (keys.hasOwnProperty(event.key)) {// Проверяем есть ли свойства (стрелки влево, вправо) внутри обьекта. hasOwnProperty проверяет внутри этого обьекта, не проверяет у наследников
        event.preventDefault(); // сбрасываем стандартное поведение браузера
        keys[event.key] = false;
    }
}

function moveRoad () {
    let lines = document.querySelectorAll('.line');  // находим все лини в документе

    /* Вариант 1 с использованием цикла 'for'
    for (let i = 0; i < lines.length; i) {
        lines[i].y += setting.speed;
        lines[i].style.top = lines[i].y + 'px';  // для перемещения линий в соответствии со скоростью

        if (lines[i].y >= document.documentElement.clientHeight) { //условие: если "у" линии больш высоты экрана клиента
        lines[i].y = -100;
    }
    */

    /* Вариант 2 с использованием функции 'forEach'*/

    lines.forEach(function(line) {    //делаем цикл для каждой лини
        line.y += setting.speed;    // добавляем к лини коорденате линии по 'y' скорость 
        line.style.top = line.y + 'px';  // для перемещения линий в соответствии со скоростью

        if (line.y >= gameArea.offsetHeight) { //условие: если "у" линии больш высоты экрана клиента
            line.y = -HEIGHT_ELEM;
        }

    })

    /* Вариант 3 с использованием цикла 'for of' 
    for (const line of lines) {
        line.y += setting.speed;    // добавляем к лини коорденате линии по 'y' скорость 
        line.style.top = line.y + 'px';  // для перемещения линий в соответствии со скоростью

        if (line.y >= document.documentElement.clientHeight) { //условие: если "у" линии больш высоты экрана клиента
            line.y = -100;
        }
    }*/
}


function moveEnemy() { //Добаваляем скорость передвижения автомобілиям противника так же как и линиям
    let enemy = document.querySelectorAll('.enemy');

    enemy.forEach(function(item) {
        let carRect = car.getBoundingClientRect(); // метод getBoundingClientRect возвращает размеры и позиции элемента в виде обьекта
        //console.log('carRect: ', carRect) - чтоб посмотреть в консоли как работает метод 
        let enemyRect = item.getBoundingClientRect();

        if (carRect.top <= enemyRect.bottom &&
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top) {
                setting.start = false;
                audio.remove(); //метод для удаления музыки из DOM-дерева в случае аварии
                console.warn('DTP');
                start.classList.remove('hide');
                start.style.top = start.offsetHeight;
                addLocalStorage();
        }

        
        item.y += setting.speed / 2;
        item.style.top = item.y + 'px';

        if (item.y >= gameArea.offsetHeight) { //условие: если "у" линии больш высоты экрана клиента (document.documentElement.clientHeight) позже мы это усовершенствовали и заменили на gameArea.offsetHeight
            item.y = -HEIGHT_ELEM * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - item.offsetWidth)) + 'px';


        }
    });

    
}