import { 
  generateId,
  openPopup,
  closePopup,
  popup
} from './common.js';

let goals = [];
let todos = [];
let todayTodos = [];
let targetId = null;
let play = false;

const now = new Date();
const oneHour = 3600000;
const oneDay = 86400000;

const $todoList = document.querySelector('.todoList');
const $todayGoal = document.querySelector('.todayGoal > p');
const $todayPercent = document.querySelector('.todayPercent > p');
const $categorySelect = document.querySelector('.categorySelect');
const $totalTime = document.querySelector('.todayInformation > .totalTime');
const $timerPopup = document.querySelector('div.timer');
const $addTodosPopup = document.querySelector('.editTodos');
const $deletePopup = document.querySelector('div.deleteTodo.popup');

const filterTodayTodos = () => {
  todayTodos = todos.filter(todo => {
    const today = new Date();
    const month = today.getMonth() + 1 > 9 ? today.getMonth() + 1 : `0${today.getMonth() + 1}`;
    const date = today.getDate() + 1 > 9 ? today.getDate() : `0${today.getDate()}`;
    return todo.date === `${today.getFullYear()}-${month}-${date}`; // --
  });
  console.log(todayTodos);
};

// 현재 날짜부터 남은 날짜 구하는 함수
const generateDday = date => Math.ceil((date - now) / oneDay);

const renderGoals = () => {
  let html = '<option value="All">목표 전체보기</option>';
  goals.forEach(goal => {
    html += `<option value="${goal.id}">${goal.content} <span class="dDay" style="font-size: 1.6rem;">D-${generateDday(new Date(goal.dDay) - (9 * oneHour))}</span></option>`;
  });
  $categorySelect.innerHTML = html;
};

const progressBar = (done, goal) => {
  const [doneHour, doneMin] = done.split(':');
  const [goalHour, goalMin] = goal.split(':');

  let percent = Math.round(((doneHour * 60 + +doneMin) / (goalHour * 60 + +goalMin)) * 100);
  if (isNaN(percent)) percent = 0; 
  return percent = percent > 100 ? 101 : percent;
};

const changePm = textArr => {
  return textArr[0] > 12 ? (textArr[0] - 12) + ':' + textArr[1] : textArr[0] + ':' + textArr[1];
};

const changeText = goalTime => {
  const [hour, min] = goalTime.split(':', 2);
  return `${min === '00' ? hour + '시간' : hour + '시간' + min + '분'}`;

};

const getTodayDone = () => {
  let [hour, min, sec] = [0, 0, 0];
  todayTodos.forEach(todo => {
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
  todayTodos.forEach(todo => {
    // const timeArray = [...todo.goalTime].filter(num => num !== ':');
    // hour += +timeArray[0];
    // min += +(timeArray[1] + timeArray[2]);
    const [goalHour, goalMin] = todo.goalTime.split(':', 2);
    hour += +goalHour;
    min += +goalMin;
  });
  hour += Math.floor(min / 60);
  min %= 60;
  min = min.length > 1 || min > 9 ? min : '0' + min;
  $todayGoal.textContent = `${hour}시간 ${min}분`;
  return [hour, min];
};

const getTodayPersent = () => {

  const [goalHour, goalMin] = getTodayGoalTIme();
  const [nowHour, nowMin] = getTodayDone();
  let percent = Math.round(((nowHour * 60 + +nowMin) / (goalHour * 60 + +goalMin)) * 100);
  percent = percent > 9 ? percent : '0' + percent;
  $todayPercent.textContent = `${percent}%`;
};

const render = () => {
  let html = '';
  
  const _todayTodos = todayTodos.filter(todo => {
    if ($categorySelect.value === 'All') return true;
    return todo.goal === +$categorySelect.value;
  });

  _todayTodos.forEach(todo => {
    const startTimeArr = todo.startTime.split(':', 2);
    html += `<li id="${todo.id}" class="${todo.color}">
    <button class="btnStopWatch">정지</button>
    <a class="todoTitSet">
      <h4 class="todoTit"><span class="icoImp${todo.important ? ' impCheck' : ''}">중요</span>${todo.content}</h4>
      <span class="todoSchedule">${startTimeArr[0] > 12 ? 'PM' : 'AM'} ${changePm(startTimeArr)} ~ ${changeText(todo.goalTime)}</span>
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
  getTodayGoalTIme();
  getTodayPersent();
};

$categorySelect.onchange = () => {
  render();
};

// const getToday = _todos => {
//   todos = _todos.filter(todo => {
//     const today = new Date();
//     const month = today.getMonth() + 1 > 9 ? today.getMonth() + 1 : `0${today.getMonth() + 1}`;
//     const date = today.getDate() + 1 > 9 ? today.getDate() : `0${today.getDate()}`;
//     return todo.date === `${today.getFullYear()}-${month}-${date}`; // --
//   });
// };

const getData = async () => {
  try {
    // console.log(fetch('/goals').then(res => res.json()));
    goals = await fetch('/goals').then(res => res.json());
    renderGoals();

    todos = await fetch('/todos').then(res => res.json());
    filterTodayTodos();
    // getToday(todos);
    getTodayDone();
    render();
    // getTodayGoalTIme();
    // getTodayPersent();
  } catch (e) {
    console.error('Error:', e);
  }
};

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
      const times = elementName.textContent.split(':', 3);
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
  if (!play) return;
  
  const timer = setInterval(() => {
    if (!play) {
      clearInterval(timer);
      return;
    }
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
    // (async () => {
    //   await timerClosure.name($totalTime);
    //   await timerClosure.name(popupControl.simulationTime());
    // })();
  }, 1000);
};

const renderPopup = target => {
  play = !play;
  $timerPopup.classList.add('active');
  todayTodos.forEach(todo => {
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
  target.parentNode.classList.toggle('ing');
};

const toggleCheck = target => {
  const matchId = +target.parentNode.parentNode.parentNode.id;
  const important = !todayTodos.find(todo => todo.id === matchId).important;

  fetch(`todos/${matchId}`, {
    method: 'PATCH',
    body: JSON.stringify({ important }),
    headers: { 'Content-Type': 'application/json' },
  })
    .then(res => res.json())
    .then(data => todayTodos = todayTodos.map(todo => (todo.id === +matchId ? data : todo)))
    .then(() => target.classList.toggle('impCheck'))
    // .then(render)
    .catch(error => console.error('Error:', error));
};

const selectGoals = todo => {
  const $selectGoals = document.querySelector('.editTodos .addInput .category select');
  let html = `<option value="${todo.goal}">${goals.find(goal => goal.id === +todo.goal).content}</option>`;
  goals.forEach(goal => {
    if (goal.id === todo.goal) return;
    html += `<option value="${goal.id}">${goal.content}</option>`;
  });
  $selectGoals.innerHTML = html;
};

const getGoalTime = ({ goalTime }) => {
  if (goalTime === '0:30') return 1;
  if (goalTime === '1:00') return 2;
  if (goalTime === '1:30') return 3;
  if (goalTime === '2:00') return 4;
  if (goalTime === '2:30') return 5;
  if (goalTime === '3:00') return 6;
  if (goalTime === '3:30') return 7;
  if (goalTime === '4:00') return 8;
  if (goalTime === '4:30') return 9;
  if (goalTime === '5:00') return 10;
};

const giveValue = todo => {
  const $startMin = document.querySelector('.editTodos .startTime select');
  const $startHour = document.querySelector('.editTodos .startTime input');
  const $goalTime = document.querySelector('.editTodos .goalTime select');
  const $startDate = document.querySelector('.editTodos li.startDate input');
  const $todoInput = document.querySelector('.editTodos .addInput > .todoInput input');
  // const $endDate = document.querySelector('.editTodos li.endDate input');

  $startMin.value = +todo.startTime[3] + 1;
  $startHour.value = todo.startTime[0] + todo.startTime[1];
  $goalTime.value = getGoalTime(todo);
  $startDate.value = todo.date;
  $todoInput.value = todo.content;
  // $endDate.value = 

  return {
    $startMin, $startHour, $goalTime, $startDate 
  };
};
const generateDate = time => `${time.getFullYear()}-${time.getMonth() > 9 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1)}-${time.getDate()}`;
const minDate = () => {
  [...document.querySelectorAll('input[type="date"]')].forEach(input => input.min = generateDate(new Date()));
};

const renderEditTodo = target => {
  $addTodosPopup.classList.add('active');

  todayTodos.forEach(todo => {
    if (todo.id !== +target.parentNode.id) return;
    $addTodosPopup.innerHTML = `
      <h3 id="${todo.id}">할일 수정</h3>
      <ul class="addInput">
        <li class="category">
          <label for="" class="a11yHidden">목표 선택</label>
          <select id="categorySelect" class="categorySelect">
            <option value="1">목표를 선택하세요</option>
          </select>
        </li>
        <li class="todoInput">
          <label for="" class="a11yHidden">할일 입력</label>
          <input type="text" placeholder="${todo.content}">
        </li>
        <li class="impSelect"><label for="test" class="a11yHidden btnImpLabel">text</label>
          <button class="btnImp ${todo.color}${todo.important ? ' impCheck' : ''}" id="test">중요</button>
        </li>
        <li class="startDate">
          <label for="">시작 날짜</label>
          <input type="date" name="" id="">
        </li>
        <li class="startTime">
          <label for="">공부 시작시간</label>
          <input type="number" name="" id="" placeholder="입력하세요"><span>시</span>
          <select name="country" id="countrySelectBox">
            <option value="">선택하세요</option>
            <option value="1">00</option>
            <option value="2">10</option>
            <option value="3">20</option>
            <option value="4">30</option>
            <option value="5">40</option>
            <option value="6">50</option>
          </select><span>분</span>
        </li>
        <li class="goalTime">
          <label for="">목표 공부시간</label>
          <select name="country" id="countrySelectBox">
            <option value="1">30분</option>
            <option value="2">1시간</option>
            <option value="3">1시간 30분</option>
            <option value="4">2시간</option>
            <option value="5">2시간 30분</option>
            <option value="6">3시간</option>
            <option value="7">3시간 30분</option>
            <option value="8">4시간</option>
            <option value="9">4시간 30분</option>
            <option value="10">5시간</option>
          </select>
        </li>
        <li class="contentInput">
          <label for="" class="a11yHidden">상세 내용 입력</label>
          <textarea name="" id="" cols="30" rows="10" placeholder="상세 내용을 입력하세요">${todo.detail}</textarea>
        </li>
      </ul>
      <button class="btnCancel">취소</button>
      <button class="btnRegister">등록</button>`;
    
    giveValue(todo);
    selectGoals(todo);
    minDate();
  });
};

const removeEdit = () => {
  $addTodosPopup.classList.remove('active');
};

const addZero = num => {
  return num.length > 1 || num > 9 ? num : '0' + num;
};

const getContent = () => {
  const $todoInput = document.querySelector('.editTodos .addInput > .todoInput input');
  return $todoInput.value;
};

const getGoal = () => {
  const $selectGoals = document.querySelector('.editTodos .addInput .category select');
  return +$selectGoals.value;
};

const getColor = () => {
  return goals.find(goal => goal.id === getGoal()).color;
};

const getDate = () => {
  const $startDate = document.querySelector('.editTodos li.startDate input');
  return $startDate.value;
};

const getDayNum = () => {
  const date = getDate();
  const day = new Date(+(date[0] + date[1] + date[2] + date[3]), +(date[5] + date[6]) - 1, +(date[8] + date[9]));
  return day.getDay();
};

const getStart = () => {
  const $startHour = document.querySelector('.editTodos .startTime input');
  const $startMin = document.querySelector('.editTodos .startTime select');
  return `${addZero($startHour.value)}:${addZero(($startMin.value - 1) * 10)}`;
};

const getImp = () => {
  const $btnImp = document.querySelector('.editTodos li.impSelect .btnImp');
  return $btnImp.classList.contains('impCheck');
};

const getDetail = () => {
  const $detail = document.querySelector('.editTodos li.contentInput > textarea');
  return $detail.value;
};

const getGoalTm = () => {
  const $goalTime = +document.querySelector('.editTodos .goalTime select').value;
  if ($goalTime === 1) return '0:30';
  if ($goalTime === 2) return '1:00';
  if ($goalTime === 3) return '1:30';
  if ($goalTime === 4) return '2:00';
  if ($goalTime === 5) return '2:30';
  if ($goalTime === 6) return '3:00';
  if ($goalTime === 7) return '3:30';
  if ($goalTime === 8) return '4:00';
  if ($goalTime === 9) return '4:30';
  if ($goalTime === 10) return '5:00';
};

const editTodo = target => {
  // 인풋이 비어있으면 리턴하기 추가
  const id = +target.parentNode.firstElementChild.id;
  fetch(`/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: getContent(),
      goal: getGoal(),
      color: getColor(),
      date: getDate(),
      day: getDayNum(),
      important: getImp(),
      startTime: getStart(),
      goalTime: getGoalTm(),
      detail: getDetail(),
    })
  }).then(res => res.json())
    .then(data => todayTodos = todayTodos.map(todo => (todo.id === id ? data : todo)))
    // .then(getToday) 
    .then(render)
    .then(removeEdit) 
    .catch(error => console.error('Error:', error));
};

// 투두 수정 팝업창
$addTodosPopup.onclick = e => {
  if (e.target.matches('.editTodos > .btnCancel')) removeEdit();
  // if (e.target.matches('.editTodos > .btnClosed')) removeEdit();
  if (e.target.matches('.editTodos > .btnRegister')) editTodo(e.target);
  if (e.target.matches('.editTodos .addInput > li.impSelect .btnImp')) e.target.classList.toggle('impCheck');
};



const deletePopup = target => {
  $deletePopup.classList.add('active');
  targetId = +target.parentNode.id;
};

// 투두리스트 클릭 > 1.스탑워치 시작 버튼
$todoList.onclick = e => {
  if (e.target.matches('.todoList > li > .btnStopWatch')) renderPopup(e.target);
  if (e.target.matches('.todoList > li > a > h4 > .icoImp')) toggleCheck(e.target);
  if (e.target.matches('.todoList > li > .todoTitSet')) addDetail(e.target);
  if (e.target.matches('.todoList > li > .todoTitSet > *')) addDetail(e.target.parentNode);
  if (e.target.matches('.todoList > li')) e.target.classList.toggle('ing');
  if (e.target.matches('.todoList > li > .btnDelete')) deletePopup(e.target);
  // if (e.target.matches('.todoList > li > .btnDelete')) $deletePopup.classList.add('active');
  // if (e.target.matches('.todoList > li > .btnDelete')) deleteTodo(e.target);
  if (e.target.matches('.todoList > li > .btnEdit')) renderEditTodo(e.target);
};
// getTodayGoalTIme();
// getTodayPersent();
const deleteTodo = () => {

  fetch(`/todos/${targetId}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(() => todayTodos = todayTodos.filter(todo => todo.id !== targetId))
    .then(render)
    // .then(getTodayGoalTIme)
    // .then(getTodayPersent)
    .catch(error => console.error('Error:', error));
  $deletePopup.classList.remove('active');
};

$deletePopup.onclick = e => {
  if (e.target.matches('.deleteTodo > button:not(.btnRemove)')) $deletePopup.classList.remove('active');
  if (e.target.matches('.deleteTodo > button.btnRemove')) deleteTodo();
};

const patchTimer = target => {
  const matchId = +target.parentNode.firstElementChild.id;
  fetch(`todos/${matchId}`, {
    method: 'PATCH',
    body: JSON.stringify({ done: `${popupControl.simulationTime().textContent}` }),
    headers: { 'Content-Type': 'application/json' },
  })
    .then(res => res.json())
    .then(data => todayTodos = todayTodos.map(todo => (todo.id === +matchId ? data : todo)))
    .then(render)
    // .then(getTodayGoalTIme)
    // .then(getTodayPersent)
    .catch(error => console.error('Error:', error));
};

// 타이머 팝업창 클릭 > 1. 종료 버튼 2. 일시정지 버튼
$timerPopup.onclick = e => {
  if (!e.target.matches('button')) return;
  play = !play;
  if (e.target.matches('.timer > .btnRegister')) {
    removeActive();
    patchTimer(e.target);
  }
  if (e.target.matches('.timer > .stopTimer > .btnStopWatch')) {
    e.target.classList.toggle('play');
    if (!popupControl.containPlay()) startStopWatch();
  }
};

// import
/* 치원님 할일 추가 code 시작 */
const $btnAddTodo = document.querySelector('.btnAddTodo');
// popup
// 할일 추가 popup
const $addTodos = document.querySelector('.createTodos');
const $addTodoGoal = $addTodos.querySelector('.category #categorySelect');
const $addTodoCont = $addTodos.querySelector('.todoInput #todoContent');
const $addTodoImp = $addTodos.querySelector('.impSelect input');
const $addTodoDate = $addTodos.querySelector('#dateStart');
const $addTodoStart = {
  hour: $addTodos.querySelector('.startTime #startTime'),
  minute: $addTodos.querySelector('.startTime #countrySelectBox')
};
const $addTodoGTime = $addTodos.querySelector('.goalTime #countrySelectBox');
const $addTodoDetail = $addTodos.querySelector('.contentInput #todoDetail');

// 함수
// 숫자 생성
const generateDateCW = time => `${
  time.getFullYear()
}-${
  time.getMonth() > 9 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1)
}-${
  time.getDate() > 9 ? time.getDate() : '0' + time.getDate()
}`;

const transSecond = (hh = 0, mm = 0, ss = 0) => {
  let count = 0;
  count += +hh * 3600;
  count += +mm * 60;
  count += +ss;
  return count;
};

// popup에 빈 input 있는지 확인하는 함수
const checkValue = popupTarget => {
  const inputAll = popupTarget.querySelectorAll('input:not(#dateEnd)');
  const selectAll = popupTarget.querySelectorAll('select');
  const inputCk = inputAll.length ? [...inputAll].every(input => input.value.trim()) : true;
  const selectCk = selectAll.length ? [...selectAll].every(select => select.value) : true;
  return inputCk && selectCk;
};
// 시간이 중복되는지 확인하는 함수
const checkTime = (date, time, goalTime) => {
  const filterDate = todos.filter(todo => todo.date === date);
  const todosTime = filterDate.map(todo => [transSecond(...todo.startTime.split(':')), transSecond(...todo.goalTime.split(':'))]);
  const targetTime = transSecond(...time.split(':'));
  const targetGoal = transSecond(...goalTime.split(':'));
  
  return (todosTime.every(timeArr => {
    const check = timeArr[0] - targetTime;
    return check > 0 ? check - targetGoal >= 0 : check + timeArr[1] <= 0;
  }));
};
const todoGoalOption = (hour, minute) => {
  let html = '';
  // if (hour < 19 || (hour === 19 && !minute)) {
    
  // }
  html = `
  <option value="0:30">30분</option>
  <option value="1:00">1시간</option>
  <option value="1:30">1시간 30분</option>
  <option value="2:00">2시간</option>
  <option value="2:30">2시간 30분</option>
  <option value="3:00">3시간</option>
  <option value="3:30">3시간 30분</option>
  <option value="4:00">4시간</option>
  <option value="4:30">4시간 30분</option>
  <option value="5:00">5시간</option>`;
  console.log('시간에 따라 옵션 수 줄이기', hour, minute);
  $addTodoGTime.innerHTML = html;
};
// addTodo popup 초기화 함수
const resetAddtodo = () => {
  $addTodoCont.value = '';
  $addTodoImp.checked = false;
  $addTodoDate.value = '';
  $addTodoDate.max = null;
  $addTodoStart.hour.value = '';
  $addTodoStart.minute.innerHTML = '<option value=""> 분 </option>';
  $addTodoGTime.innerHTML = '<option value=""> - </option>';
  $addTodoDetail.value = '';
};

// 통신
// 할일 추가 함수
const addTodos = async () => {
  // 입력란 확인
  if (!checkValue($addTodos)) {
    window.alert('필수 입력란이 전부 채워지지 않았습니다.');
    return;
  }

  // 할일 일정이 오늘 이후인지 확인
  if (new Date($addTodoDate.value) - new Date(generateDateCW(now)) < 0) {
    window.alert('시작 날짜를 오늘 이후로 선택하십시요.');
    return;
  }

  const hour = $addTodoStart.hour.value;
  const minute = $addTodoStart.minute.value;
  // 시작 시간이 6 - 23 인지 확인
  if (hour < 6 || hour > 23) {
    window.alert('시작 시간은 6시부터 23시까지 입니다.');
    return;
  }

  // 중복 예정 확인
  if (!checkTime($addTodoDate.value, `${hour}:${minute}`, $addTodoGTime.value)) {
    window.alert('할일 예정이 다른 예정과 겹칩니다.');
    return;
  }

  // 통신 - post -
  try {
    const _todo = await fetch('/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: generateId(todos),
        content: $addTodoCont.value,
        goal: +$addTodoGoal.value,
        color: goals.find(({ id }) => id === +$addTodoGoal.value).color,
        date: $addTodoDate.value,
        day: new Date($addTodoDate.value).getDay(),
        important: $addTodoImp.checked,
        startTime: `${hour < 10 ? '0' + hour : hour}:${$addTodoStart.minute.value}`,
        goalTime: $addTodoGTime.value,
        detail: $addTodoDetail.value,
        done: '00:00:00'
      })
    });
    const todo = await _todo.json();
    todos = [...todos, todo];
    window.alert('할일이 추가되었습니다.');
    closePopup($addTodos);
    console.log('조건에 따라서 뷰 랜더');
    // render();
    if ($addTodoDate.value === generateDateCW(now)) render();
    resetAddtodo();
  } catch (e) {
    console.error(e);
  }
};

// 이벤트 핸들러
// 버튼
// 할일 추가 버튼 클릭 이벤트
$btnAddTodo.onclick = () => {
  let html = '<option value="" selected>목표를 선택하세요</option>';
  goals.forEach(goal => {
    html += `<option value="${goal.id}">${goal.content}</option>`;
  });
  $addTodoGoal.innerHTML = html;
  openPopup($addTodos);
};

// popup
// 할일 추가 popup 클릭 이벤트
$addTodos.onclick = ({ target }) => {
  popup(target, $addTodos, addTodos, resetAddtodo);
};
// 할일 선택 이벤트
$addTodos.onchange = ({ target }) => {
  if (target.matches('#important')) return;
  // 목표 선택 시 날짜 데이터 Dday 이전만 선택 가능하게 만드는 식
  if (target === $addTodoGoal && $addTodoGoal.value !== '') {
    const targetGoal = goals.find(({ id }) => id === +$addTodoGoal.value);
    $addTodoDate.max = targetGoal.dDay;
  }
  if (target === $addTodoStart.hour) {
    $addTodoStart.minute.innerHTML = target.value === '23' ? `
    <option value="00">00</option>
    <option value="10">10</option>
    <option value="20">20</option>
    <option value="30">30</option>` : `
    <option value="00">00</option>
    <option value="10">10</option>
    <option value="20">20</option>
    <option value="30">30</option>
    <option value="40">40</option>
    <option value="50">50</option>`;
    todoGoalOption(+$addTodoStart.hour.value, 0);
  }
};

/* 치원님 할일 추가 code 종료 */
window.onload = () => {
  // 날짜 선택 최소 값 설정
  document.querySelectorAll('input[type="date"]').forEach(input => input.min = generateDateCW(now));
  // 시간 선택 최소 최대 값 설정
  $addTodoStart.hour.max = 23;
  $addTodoStart.hour.min = 6;
  getData();
};