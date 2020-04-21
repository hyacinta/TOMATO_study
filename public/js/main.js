let goals = [];
let todos = [];

const $todoList = document.querySelector('.todoList');
const $todayGoal = document.querySelector('.todayGoal > p');
const $todayPercent = document.querySelector('.todayPercent > p');
const $categorySelect = document.querySelector('.categorySelect');
const $totalTime = document.querySelector('.todayInformation > .totalTime');
const $timerPopup = document.querySelector('div.timer');
const $addTodosPopup = document.querySelector('.addTodos');

const renderGoals = () => {
  let html = '<option value="All">목표 전체보기</option>';
  goals.forEach(goal => {
    html += `<option value="${goal.id}">${goal.content} <span class="dDay" style="font-size: 1.6rem;">D-30</span></option>`;
  });
  $categorySelect.innerHTML = html;
};

const progressBar = (done, goal) => {
  const doneArr = [...done].filter(num => num !== ':');
  const goalArr = [...goal].filter(num => num !== ':');

  const [doneHour, doneMin] = [+(doneArr[0] + doneArr[1]), +(doneArr[2] + doneArr[3])];
  const [goalHour, goalMin] = [+goalArr[0], +(goalArr[1] + goalArr[2])];

  console.log(doneHour, doneMin, goalHour, goalMin);

  let percent = Math.round(((doneHour * 60 + doneMin) / (goalHour * 60 + goalMin)) * 100);
  if (isNaN(percent)) percent = 0; 
  return percent = percent > 100 ? 101 : percent;
};

const render = () => {
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
      <div class="progressBar" style="width : ${progressBar(todo.done, todo.goalTime)}%"></div>
    </div>
  </li>`;
  });
  $todoList.innerHTML = html;
};

$categorySelect.onchange = () => {
  render();
};

const getTodayDone = () => {
  let [hour, min, sec] = [0, 0, 0];
  todos.forEach(todo => {
    const timeArray = [...todo.done].filter(num => num !== ':');
    
    hour += +(timeArray[0] + timeArray[1]);
    min += +(timeArray[2] + timeArray[3]);
    sec += +(timeArray[4] + timeArray[5]);
  });
  if (sec > 59) {
    min += Math.floor(sec / 60);
    sec %= 60;
  }
  if (min > 59) {
    hour += Math.floor(sec / 60);
    min %= 60;
  }
  if (hour > 24) {
    hour = 24;
  }
  hour = hour.length > 1 || hour > 9 ? hour : '0' + hour;
  min = min.length > 1 || min > 9 ? min : '0' + min;
  sec = sec.length > 1 || sec > 9 ? sec : '0' + sec;
  $totalTime.textContent = `${hour}:${min}:${sec}`;

  return [hour, min];
};

const getTodayGoalTIme = () => {
  let [hour, min] = [0, 0];
  todos.forEach(todo => {
    const timeArray = [...todo.goalTime].filter(num => num !== ':');
    hour += +timeArray[0];
    min += +(timeArray[1] + timeArray[2]);
  });
  min = min.length > 1 || min > 9 ? min : '0' + min;
  $todayGoal.textContent = `${hour}시간 ${min}분`;
  return [hour, min];
};

const getTodayPersent = () => {

  const [goalHour, goalMin] = getTodayGoalTIme();
  const [nowHour, nowMin] = getTodayDone();
  let percent = Math.round(((nowHour * 60 + nowMin) / (goalHour * 60 + goalMin)) * 100);
  percent = percent > 9 ? percent : '0' + percent;
  percent = isNaN(percent) ? '00' : percent;
  $todayPercent.textContent = `${percent}%`;
};


const getTodos = async () => {
  try {
    console.log(fetch('/goals').then(res => res.json()));
    goals = await fetch('/goals').then(res => res.json());
    renderGoals();

    todos = await fetch('/todos').then(res => res.json());

  } catch (e) {
    console.error('Error:', e);
  }

  await fetch('/todos')
    .then(res => res.json())
    .then(data => data.filter(todo => {
      const today = new Date();
      const month = today.getMonth() + 1 > 9 ? today.getMonth() + 1 : `0${today.getMonth() + 1}`;
      return todo.date === `${today.getFullYear()}-${month}-${today.getDate() + 1}`; // --
    }))
    .then(_todos => todos = _todos)
    .then(getTodayDone)
    .then(render)
    .then(getTodayGoalTIme)
    .then(getTodayPersent)
    .catch(error => console.error('Error:', error));
};

window.onload = getTodos;

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
  if (popupControl.containPlay()) return;
  
  const timer = setInterval(() => {
    // console.log(popupControl.containPlay());

    if (popupControl.containPlay()) {
      clearInterval(timer);
      return;
    }
    if (!$timerPopup.classList.contains('active')) {
      clearInterval(timer);
      return;
    }
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
  startStopWatch();
};

const addDetail = target => {
  // todos.forEach(todo => todo.id === +target.id ? todo.com)
  target.parentNode.classList.toggle('ing');
  console.log(target);
};

const toggleCheck = target => {
  const matchId = +target.parentNode.parentNode.parentNode.id;
  const important = !todos.find(todo => todo.id === matchId).important;

  fetch(`todos/${matchId}`, {
    method: 'PATCH',
    body: JSON.stringify({ important }),
    headers: { 'Content-Type': 'application/json' },
  })
    .then(res => res.json())
    .then(data => todos = todos.map(todo => (todo.id === +matchId ? data : todo)))
    .then(() => target.classList.toggle('impCheck'))
    // .then(render)
    .catch(error => console.error('Error:', error));
};


const deleteTodo = target => {

  fetch(`/todos/${target.parentNode.id}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(() => todos = todos.filter(todo => todo.id !== +target.parentNode.id))
    .then(render)
    .catch(error => console.error('Error:', error));
    
  console.log(target.parentNode);
};

const editTodo = target => {
  $addTodosPopup.classList.add('active');

  
  $addTodosPopup.innerHTML = `
  <h3>할일 추가</h3>
    <button class="btnClosed">닫기</button>
    <ul class="addInput">
      <li class="category">
        <label for="" class="a11yHidden">목표 선택</label>
        <select id="categorySelect" class="categorySelect">
          <option value="">목표를 선택하세요</option>
        </select>
      </li>
      <li class="todoInput">
        <label for="" class="a11yHidden">할일 입력</label>
        <input type="text" placeholder="할일을 입력하세요">
      </li>
      <li class="impSelect"><label for="test" class="a11yHidden">text</label>
        <button class="btnImp" id="test">중요</button>
      </li>
      <li class="startDate">
        <label for="">시작 날짜</label>
        <input type="date" name="" id="">
      </li>
      <li class="endDate">
        <label for="">종료 날짜</label>
        <input type="date" name="" id="">
      </li>
      <li class="startTime">
        <label for="">공부 시작시간</label>
        <input type="number" name="" id="" placeholder="시">
        <select name="country" id="countrySelectBox">
          <option value="">00분</option>
          <option value="">10분</option>
          <option value="">20분</option>
          <option value="">30분</option>
          <option value="">40분</option>
          <option value="">50분</option>
        </select>
      </li>
      <li class="goalTime">
        <label for="">목표 공부시간</label>
        <select name="country" id="countrySelectBox">
          <option value="">30분</option>
          <option value="">1시간</option>
          <option value="">1시간 30분</option>
          <option value="">2시간</option>
          <option value="">2시간 30분</option>
          <option value="">3시간</option>
          <option value="">3시간 30분</option>
          <option value="">4시간</option>
          <option value="">4시간 30분</option>
          <option value="">5시간</option>
        </select>
      </li>
      <li class="contentInput">
        <label for="" class="a11yHidden">상세 내용 입력</label>
        <textarea name="" id="" cols="30" rows="10" placeholder="상세 내용을 입력하세요"></textarea>
      </li>
    </ul>
    <button class="btnCancel">취소</button>
    <button class="btnRegister">등록</button>
  </div>
  <div class="dimd"></div>`;

};

const removeEdit = () => {
  $addTodosPopup.classList.remove('active');
};

$addTodosPopup.onclick = e => {
  if (e.target.matches('.addTodos > .btnCancel')) removeEdit();
  if (e.target.matches('.addTodos > .btnClosed')) removeEdit();
  // if (e.target.matches('.addTodos > .btnRegister')) removeEdit();
};

// 투두리스트 클릭 > 1.스탑워치 시작 버튼
$todoList.onclick = e => {
  if (e.target.matches('.todoList > li > .btnStopWatch')) renderPopup(e.target);
  if (e.target.matches('.todoList > li > a > h4 > .icoImp')) toggleCheck(e.target);
  if (e.target.matches('.todoList > li > .todoTitSet')) addDetail(e.target);
  if (e.target.matches('.todoList > li > .todoTitSet > *')) addDetail(e.target.parentNode);
  if (e.target.matches('.todoList > li > .btnDelete')) deleteTodo(e.target);
  if (e.target.matches('.todoList > li > .btnEdit')) editTodo(e.target);
};

const patchTimer = target => {
  const matchId = +target.parentNode.firstElementChild.id;
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
  }
  if (e.target.matches('.timer > .stopTimer > .btnStopWatch')) {
    e.target.classList.toggle('play');
    if (!popupControl.containPlay()) startStopWatch();
  }
};
