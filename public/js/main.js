let todos = [];

const $totalTime = document.querySelector('.todayInformation > .totalTime');
const $todoList = document.querySelector('.todoList');
// const $btnStopWatch = document.querySelector('.todoList > li > .btnStopWatch');
const $timerPopup = document.querySelector('div.timer');
const $popupSimulationTime = document.querySelector('div.timer > .stopTimer > .simulationTime');
const $popupStopBtn = document.querySelector('.timer > .stopTimer > .btnStopWatch');
const $simulationTime = document.querySelector('.simulationTime');

// console.log($popupStopBtn, $timerPopup);

// const render = 


const getTodos = () => {
  fetch('/todos')
    .then(res => res.json())
    .then(data => todos = data)
    // .then(render)
    .catch(error => console.error('Error:', error));
};

window.onload = getTodos;

const addActive = () => {
  $timerPopup.classList.add('active');
};

const removeActive = () => {
  $timerPopup.classList.remove('active');
};

const timerClosure = (() => {
  const countTime = (elementName, [_hour, _min, _sec]) => {
    let [hour, min, sec] = [_hour, _min, _sec];
    sec++;
    if (sec > 99) {
      sec = 0;
      min++;
    }
    if (min > 59) {
      min = 0;
      hour++;
    }
    if (hour > 24) {
      hour = 24;
    }
    if (hour === 24 && min === 59 && sec === 99) {
      hour = 0;
      removeActive();
    }
    hour = hour.length > 1 || hour > 9 ? hour : '0' + hour;
    min = min.length > 1 || min > 9 ? min : '0' + min;
    sec = sec.length > 1 || sec > 9 ? sec : '0' + sec;
    elementName.textContent = `${hour}:${min}:${sec}`;
  };

  return {
    name(elementName) {
      const timeArray = [...elementName.textContent].filter(num => num !== ':');
      const times = [timeArray[0] + timeArray[1], timeArray[2] + timeArray[3], timeArray[4] + timeArray[5]];
      countTime(elementName, times);
    }
  };
})();

// 스탑워치 시작
const startStopWatch = () => {
  const timer = setInterval(() => {

    timerClosure.name($popupSimulationTime);
    timerClosure.name($totalTime);
    // timerClosure.name($simulationTime);
    
    // 뒷 배경도 같이 올라갈거면 추가해야함
    if ($popupStopBtn.classList.contains('play')) clearInterval(timer);
    if (!$timerPopup.classList.contains('active')) {
      clearInterval(timer);
    }
  }, 10);
};

// popupStopBtn 일시정지
const matchTargetColor = target => {
  const colorClass = ['red', 'yellow', 'green', 'blue', 'purple'];
  const popupStopBtn = $popupStopBtn.parentNode.classList;
  colorClass.forEach(color => {
    if (popupStopBtn.contains(color)) popupStopBtn.replace(color, target.parentNode.classList.item(0));
  });
};

// 투두리스트 클릭 > 1.스탑워치 시작 버튼
$todoList.onclick = e => {
  if (e.target.matches('.todoList > li > .btnStopWatch')) {
    addActive();
    startStopWatch();
    $popupStopBtn.classList.remove('play');
    matchTargetColor(e.target);
  }
};

// 타이머 팝업창 클릭 > 1. 종료 버튼 2. 일시정지 버튼
$timerPopup.onclick = e => {
  if (e.target.matches('.timer > .btnRegister')) {
    removeActive();
    $simulationTime.textContent = $popupSimulationTime.textContent; // --
  }
  if (e.target.matches('.timer > .stopTimer > .btnStopWatch')) e.target.classList.toggle('play', !e.target.classList.contains('play'));
};

$popupStopBtn.onclick = () => {
  startStopWatch();
};
