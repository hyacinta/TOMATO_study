let goals = [];
let todos = [];

const $todoList = document.querySelector('.todoList');
const $categorySelect = document.querySelector('.categorySelect');
const $totalTime = document.querySelector('.todayInformation > .totalTime');
// const $btnStopWatch = document.querySelector('.todoList > li > .btnStopWatch');
const $timerPopup = document.querySelector('div.timer');
// const $popupSimulationTime = document.querySelector('div.timer > .stopTimer > .simulationTime');
// const $popupStopBtn = document.querySelector('.timer > .stopTimer > .btnStopWatch');

// console.log($popupStopBtn, $timerPopup);

const renderGoals = () => {
  let html = '<option value="All">목표 전체보기</option>';
  goals.forEach(goal => {
    html += `<option value="${goal.id}">${goal.content} <span class="dDay" style="font-size: 1.6rem;">D-30</span></option>`;
  });
  $categorySelect.innerHTML = html;
};

const render = () => {
  console.log(123);
  let html = '';

  const _todos = todos.filter(todo => {
    if ($categorySelect.value === 'All') return true;
    return todo.goal === +$categorySelect.value;
  });

  _todos.forEach(todo => {
    html += `<li id="${todo.id}" class="${todo.color}">
    <button class="btnStopWatch">정지</button>
    <a class="todoTitSet">
      <h4 class="todoTit"><span class="icoImp${todo.important ? ' impCheck' : ''}">중요</span>${todo.content}</h4>
      <span class="todoSchedule">PM ${todo.startTime} ~ ${todo.goalTime} 예정</span>
    </a>
    <div class="simulationTime">${todo.done}</div>
    <div class="todoContent">
    ${todo.detail}
    </div>
    <button class="btnEdit">수정</button>
    <button class="btnDelete">삭제</button>
    <div class="progress">
      <div class="progressBar"></div>
    </div>
  </li>`;
  });
  $todoList.innerHTML = html;
};



const getTodos = async () => {

  await fetch('/goals')
    .then(res => res.json())
    .then(data => goals = data)
    .then(renderGoals)
    .catch(error => console.error('Error:', error));

  fetch('/todos')
    .then(res => res.json())
    .then(data => data.filter(todo => {
      const today = new Date();
      const month = today.getMonth() + 1 > 9 ? today.getMonth() + 1 : `0${today.getMonth() + 1}`;
      return todo.date === `${today.getFullYear()}-${month}-${today.getDate() + 1}`; // --
    }))
    .then(_todos => todos = _todos)
    .then(render)
    .catch(error => console.error('Error:', error));

};

window.onload = getTodos;

// const addActive = () => {
//   $timerPopup.classList.add('active');
// };

const removeActive = () => {
  $timerPopup.classList.remove('active');
};


const timerClosure = (() => {
  // let count = 0;
  const countTime = (elementName, [_hour, _min, _sec]) => {
    let [hour, min, sec] = [_hour, _min, _sec];

    if (!elementName.matches('.simulationTime') && !elementName.matches('.totalTime')) return;
    sec++;
    // count++;
    // if (count > 9) {
    //   count = 0;
    //   sec++;
    // }
    if (sec > 59) {
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
    if (hour === 24 && min === 59 && sec === 59) {
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
      if (elementName.matches('.simulationTime')) countTime(elementName, times);
      if (elementName.matches('.totalTime')) countTime(elementName, times);
    }
  };
})();

// const popupStopBtn = (() => {
const popupControl = (() => {
  return { 
    Btn() { 
      return document.querySelector('.timer > .stopTimer > .btnStopWatch');
    }, 
    containPlay() { 
      const $popupStopBtn = document.querySelector('.timer > .stopTimer > .btnStopWatch');
      return $popupStopBtn.classList.contains('play'); 
    },
    removePlay() { 
      const $popupStopBtn = document.querySelector('.timer > .stopTimer > .btnStopWatch');
      return $popupStopBtn.classList.remove('play'); 
    },
    simulationTime() {
      return document.querySelector('div.timer > .stopTimer > .simulationTime');
    }
  };
})();

// 스탑워치 시작
const startStopWatch = () => {
  // const $popupSimulationTime = document.querySelector('div.timer > .stopTimer > .simulationTime');
  // const $popupStopBtn = document.querySelector('.timer > .stopTimer > .btnStopWatch');
  // $popupStopBtn.classList.remove('play');
  if (popupControl.containPlay()) return;
  
  const timer = setInterval(() => {
    console.log(popupControl.containPlay());

    if (popupControl.containPlay()) {
      clearInterval(timer);
      return;
    }
    if (!$timerPopup.classList.contains('active')) {
      clearInterval(timer);
      return;
    }

    // (async () => {
    //   timerClosure.name($totalTime);
    //   await timerClosure.name($popupSimulationTime);
    // })();
    timerClosure.name($totalTime);
    timerClosure.name(popupControl.simulationTime());
  }, 1000);
};

const renderPopup = target => {
  $timerPopup.classList.add('active');
  todos.forEach(todo => {
    if (+target.parentNode.id === todo.id) {
      $timerPopup.innerHTML = `
        <a id="${todo.id}" class="todoTitSet">
          <h4 class="todoTit">${todo.content}</h4>
          <span class="todoSchedule">PM ${todo.startTime} ~ ${todo.goalTime} 예정</span>
        </a>
        <div class="stopTimer ${target.parentNode.classList.item(0)} ing">
          <button class="btnStopWatch">일시정지</button>
          <div class="simulationTime">${todo.done}</div>
        </div>
        <button class="btnRegister">종료</button>`;
    }
  });
  // if (document.querySelector('.btnStopWatch')) startStopWatch();
  startStopWatch();
};

// popupStopBtn 일시정지
// const matchTargetColor = target => {
//   const colorClass = ['red', 'yellow', 'green', 'blue', 'purple'];
//   const popupStopBtn = $popupStopBtn.parentNode.classList;
//   colorClass.forEach(color => {
//     if (popupStopBtn.contains(color)) popupStopBtn.replace(color, target.parentNode.classList.item(0));
//   });
// };

const toggleCheck = target => {
  const matchId = +target.parentNode.parentNode.parentNode.id;
  const important = !todos.filter(todo => todo.id === matchId).important;
  fetch(`todos/${matchId}`, {
    method: 'PATCH',
    body: JSON.stringify({ important }),
    headers: { 'Content-Type': 'application/json' },
  })
    .then(res => res.json())
    .then(data => todos = todos.map(todo => (todo.id === +matchId ? data : todo)))
    .then(render)
    .catch(error => console.error('Error:', error));
};

// 투두리스트 클릭 > 1.스탑워치 시작 버튼
$todoList.onclick = e => {

  if (e.target.matches('.todoList > li > .btnStopWatch')) {
    // removePlay();

    console.log('test', popupControl.containPlay());

    renderPopup(e.target);
    // if ($popupStopBtn.classList.contains('play')) return;
    // addActive();
    // startStopWatch();
    // e.target.classList.remove('play');
    // matchTargetColor(e.target);
  }

  if (e.target.matches('.todoList > li > a > h4 > .icoImp')) {
    toggleCheck(e.target);
  }
};



const patchTimer = target => {
  const matchId = +target.parentNode.firstElementChild.id;
  console.log(matchId, popupControl.simulationTime().textContent);
  fetch(`todos/${matchId}`, {
    method: 'PATCH',
    body: JSON.stringify({ done: `${popupControl.simulationTime().textContent}` }),
    headers: { 'Content-Type': 'application/json' },
  })
    .then(res => res.json())
    .then(data => todos = todos.map(todo => (todo.id === +matchId ? data : todo)))
    .then(render)
    .catch(error => console.error('Error:', error));
};

// 타이머 팝업창 클릭 > 1. 종료 버튼 2. 일시정지 버튼
$timerPopup.onclick = e => {
  if (e.target.matches('.timer > .btnRegister')) {
    removeActive();
    patchTimer(e.target);
    // $simulationTime.textContent = $popupSimulationTime.textContent; // --
  }
  if (e.target.matches('.timer > .stopTimer > .btnStopWatch')) {
    e.target.classList.toggle('play');
    if (!popupControl.containPlay()) startStopWatch();
    // e.target.classList.toggle('btnStopWatch');
  } // --
};

// $popupStopBtn.onclick = () => {
//   startStopWatch();
// };


$categorySelect.onchange = () => {
  render();
};