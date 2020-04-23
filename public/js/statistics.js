import { 
  generateId,
  openPopup,
  closePopup,
  popup
} from './common.js';

let week = [];
let goals = [];
let todos = []; 

// DOMS
const $period = document.querySelector('.period');
const $weeklyChallenge = document.querySelector('.weeklyChallenge');
const $statsContent = document.querySelector('.statsContent');
const $statsChildren = [...$statsContent.children];
const $statsData = document.querySelector('.statsData');
const $weeklyTotal = document.querySelector('.weekly .total > p');
const $weeklySum = document.querySelector('.weekly .sum > p');
const $weeklyAchievementGoalTime = document.querySelector('.weekly .achievement span');
const $weeklyAchievement = document.querySelector('.weekly .achievement > p');
const $weeklyProgressBar = document.querySelector('.weekly .progressBar');
const $weeklyGraph = document.querySelector('.weekly .graph');

// 일주일 날짜 구하기
const getCurrentWeek = () => {
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now.setDate(now.getDate() - now.getDay() + i));
    const year = d.getFullYear();
    let month = d.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let date = d.getDate();
    date = date < 10 ? '0' + date : date;
    const getFullDate = `${year}-${month}-${date}`;
    week[i].date = getFullDate;
  }
  return week;
};
// 오늘 날짜 구하기
const getToday = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  return `${year}-${month < 10 ? '0' + month : month}-${date < 10 ? '0' + date : date}`;
};
const today = getToday();

// 공통 사용 함수
// 날짜 형식 변경하기 ex) 2020년 04월 05일
const dateChangeForm = targetDate => {
  const dateTemp = targetDate.split('-');
  return `${dateTemp[0]}년 ${dateTemp[1]}월 ${dateTemp[2]}일`;
};
// 날짜 형식 변경하기 ex) 2020.04.05
const dateChangeForm2 = targetDate => {
  const dateTemp = targetDate.split('-');
  return `${dateTemp[0]}.${dateTemp[1]}.${dateTemp[2]}`;
};
// 초를 시간, 분, 초로 변경하기 
const secondsToHours = sec => {
  let time = '';
  let hour = 0;
  let minute = 0;
  let seconds = 0;
  hour = parseInt((sec / 60) / 60, 10);
  minute = parseInt((sec % 3600) / 60, 10);
  seconds = parseInt(sec % 60, 10);
  time = `${hour}시간 ${minute < 10 ? '0' : ''}${minute}분 ${seconds < 10 ? '0' : ''}${seconds}초`;
  return time;
};
// 달성률 구하기
const rateCalc = (divisor, dividend) => {
  const temp = (divisor / dividend) * 100;
  return Math.round(temp);
};
// 목표 이름 구하기
const getGoalTitle = color => {
  let tempTitle = '';
  goals.forEach(goal => {
    if (goal.color === color) tempTitle = goal.content;
  });
  return tempTitle;
};

// 선택 날짜 찾기
const selectDateSearch = btnSelectId => {
  let selectDateTemp = '';
  week.forEach(day => {
    if (day.id !== +btnSelectId) return;
    selectDateTemp = day.date;
  });
  return selectDateTemp;
};

// 일간 평균 공부시간 구하기
const averageDate = target => {
  let temp = 0;
  week.forEach(day => {
    if (day.date !== target) return;
    temp = day.id;
  });
  return temp;
};
// 시간의 합 구하기
// 하루 목표 시간 구하기 (초)
const getDailyGoalSeconds = date => {
  let sumTemp = 0;
  todos.forEach(todo => {
    if (todo.date !== date) return;
    const splitTarget = todo.goalTime;
    let changeTarget = splitTarget.split(':');
    changeTarget = (changeTarget[0] * 60 * 60) + (changeTarget[1] * 60);
    sumTemp += changeTarget;
  });
  return sumTemp;
};
// 하루 실행 시간 구하기(초)
const getDailyDoneSeconds = date => {
  let sumTemp = 0;
  todos.forEach(todo => {
    if (todo.date !== date) return;
    const splitTarget = todo.done;
    let changeTarget = splitTarget.split(':');
    changeTarget = (changeTarget[0] * 60 * 60) + (changeTarget[1] * 60) + +changeTarget[2];
    sumTemp += changeTarget;
  });
  return sumTemp;
};
// 주간 목표 시간 구하기 (초)
const getWeeklyGoalSeconds = () => {
  let sumTemp = 0;
  week.forEach(day => {
    todos.forEach(todo => {
      if (day.date !== todo.date) return;
      const splitTarget = todo.goalTime;
      let changeTarget = splitTarget.split(':');
      changeTarget = (changeTarget[0] * 60 * 60) + (changeTarget[1] * 60);
      sumTemp += changeTarget;
    });
  });
  return sumTemp;
};
// 주간 실행 시간 구하기(초)
const getWeeklyDoneSeconds = () => {
  let sumTemp = 0;
  week.forEach(day => {
    todos.forEach(todo => {
      if (day.date !== todo.date) return;
      const splitTarget = todo.done;
      let changeTarget = splitTarget.split(':');
      changeTarget = (changeTarget[0] * 60 * 60) + (changeTarget[1] * 60) + +changeTarget[2];
      sumTemp += changeTarget;
    });
  });
  return sumTemp;
};
// 하루 Category별 목표 시간 구하기(초)
const getDailyIndexGoalSeconds = (date, color) => {
  let _todos = [];
  let sumTemp = 0;
  _todos = todos.filter(todo => todo.date === date);
  _todos.forEach(todo => {
    if (todo.color !== color) return;
    const splitTarget = todo.goalTime;
    let changeTarget = splitTarget.split(':');
    changeTarget = (changeTarget[0] * 60 * 60) + (changeTarget[1] * 60);
    sumTemp += changeTarget;
  });
  return sumTemp;
};
// 하루 Category별 실행 시간 구하기(초)
const getDailyIndexDoneSeconds = (date, color) => {
  let _todos = [];
  let sumTemp = 0;
  _todos = todos.filter(todo => todo.date === date);
  _todos.forEach(todo => {
    if (todo.color !== color) return;
    const splitTarget = todo.done;
    let changeTarget = splitTarget.split(':');
    changeTarget = (changeTarget[0] * 60 * 60) + (changeTarget[1] * 60) + +changeTarget[2];
    sumTemp += changeTarget;
  });
  return sumTemp;
};
// 주간 Category별 목표 시간 구하기(초)
const getWeeklyIndexGoalSeconds = color => {
  let _todos = [];
  let sumTemp = 0;
  week.forEach(day => {
    _todos = todos.filter(todo => todo.date === day.date);
    _todos.forEach(todo => {
      if (todo.color !== color) return;
      const splitTarget = todo.goalTime;
      let changeTarget = splitTarget.split(':');
      changeTarget = (changeTarget[0] * 60 * 60) + (changeTarget[1] * 60);
      sumTemp += changeTarget;
    });
  });
  return sumTemp;
};
// 주간 Category별 실행 시간 구하기(초)
const getWeeklyIndexDoneSeconds = color => {
  let _todos = [];
  let sumTemp = 0;
  week.forEach(day => {
    _todos = todos.filter(todo => todo.date === day.date);
    _todos.forEach(todo => {
      if (todo.color !== color) return;
      const splitTarget = todo.done;
      let changeTarget = splitTarget.split(':');
      changeTarget = (changeTarget[0] * 60 * 60) + (changeTarget[1] * 60) + +changeTarget[2];
      sumTemp += changeTarget;
    });
  });
  return sumTemp;
};

const getIndexRate = (checkDate, color) => {
  const indexGoalSeconds = getDailyIndexGoalSeconds(checkDate, color);
  const indexDoneSeconds = getDailyIndexDoneSeconds(checkDate, color);
  return rateCalc(indexDoneSeconds, indexGoalSeconds);
};
const getIndexWeeklyRate = (checkDate, color) => {
  const indexGoalSeconds = getWeeklyIndexGoalSeconds(checkDate, color);
  const indexDoneSeconds = getWeeklyIndexDoneSeconds(checkDate, color);
  return rateCalc(indexDoneSeconds, indexGoalSeconds);
};

// render
const weeklyChallengeRender = () => {
  let weeklyChallengeHtml = '';
  week.forEach(day => {
    const goalSeconds = getDailyGoalSeconds(day.date);
    const doneSeconds = getDailyDoneSeconds(day.date);
    const sucessCriteria = () => (`${rateCalc(doneSeconds, goalSeconds)}` > 30 ? (`${rateCalc(doneSeconds, goalSeconds)}` > 80 ? 'perfect' : 'seccess') : 'fail');
    const getBtn = () => (`${rateCalc(doneSeconds, goalSeconds)}` > 30 ? (`${rateCalc(doneSeconds, goalSeconds)}` > 80 ? '<button class="stamp">성공</button>' : '<button class="stamp">통과</button>') : '<button class="stamp">실패</button>');
    const parseToday = Date.parse(getToday());
    const parseDayDate = Date.parse(day.date);
    const getDate = day.date.split('-')[2];

    weeklyChallengeHtml += `<div id="${day.id}" class="${sucessCriteria(`${rateCalc(doneSeconds, goalSeconds)}`)}">
    <dt>${day.dayName}</dt>
    <dd>${parseToday > parseDayDate ? getBtn(`${rateCalc(doneSeconds, goalSeconds)}`) : ''}${getDate}</dd>
  </div>`;
  });
  $weeklyChallenge.innerHTML = weeklyChallengeHtml;
};

const dailyDataRender = date => {
  const goalSeconds = getDailyGoalSeconds(date);
  const doneSeconds = getDailyDoneSeconds(date);
  let dataHtml = '';
  dataHtml = `
  <li class="dailyDate">
    ${dateChangeForm(date)}
  </li>
  <li class="total">
    <h4>총 공부 시간</h4>
    <p>${secondsToHours(doneSeconds)}</p>
  </li>
  <li class="achievement">
    <h4>달성률 <span>목표 : ${secondsToHours(goalSeconds)}</span></h4>
    <p>${rateCalc(doneSeconds, goalSeconds) ? rateCalc(doneSeconds, goalSeconds) : '0'}%</p>
    <div class="progress">
      <div class="progressBar" style="width:${rateCalc(doneSeconds, goalSeconds)}%;"></div>
    </div>
  </li>
  <li class="category">
    <h4>목표별 공부시간</h4>
    <ul class="graph">
      <li class="red">
        <label>${getGoalTitle('red')}</label>
        <div class="bar" style="height: ${getIndexRate(date, 'red') ? getIndexRate(date, 'red') : '0'}%">
          <span class="percent">${getIndexRate(date, 'red') ? getIndexRate(date, 'red') : '0'}%</span>
        </div>
      </li>
      <li class="yellow">
        <label>${getGoalTitle('yellow')}</label>
        <div class="bar" style="height: ${getIndexRate(date, 'yellow') ? getIndexRate(date, 'yellow') : '0'}%">
          <span class="percent">${getIndexRate(date, 'yellow') ? getIndexRate(date, 'yellow') : '0'}%</span>
        </div>
      </li>
      <li class="green">
        <label>${getGoalTitle('green')}</label>
        <div class="bar" style="height: ${getIndexRate(date, 'green') ? getIndexRate(date, 'green') : '0'}%">
          <span class="percent">${getIndexRate(date, 'green') ? getIndexRate(date, 'green') : '0'}%</span>
        </div>
      </li>
      <li class="blue">
        <label>${getGoalTitle('blue')}</label>
        <div class="bar" style="height: ${getIndexRate(date, 'blue') ? getIndexRate(date, 'blue') : '0'}%">
          <span class="percent">${getIndexRate(date, 'blue') ? getIndexRate(date, 'blue') : '0'}%</span>
        </div>
      </li>
      <li class="purple">
        <label>${getGoalTitle('purple')}</label>
        <div class="bar" style="height: ${getIndexRate(date, 'purple') ? getIndexRate(date, 'purple') : '0'}%">
          <span class="percent">${getIndexRate(date, 'purple') ? getIndexRate(date, 'purple') : '0'}%</span>
        </div>
      </li>
    </ul>
  </li>
  `;
  $statsData.innerHTML = dataHtml;
};

const graphRender = () => {
  let graphHtml = '';
  graphHtml = `
  <li class="red">
    <label>${getGoalTitle('red')}</label>
    <div class="bar" style="height: ${getIndexWeeklyRate('red') ? getIndexWeeklyRate('red') : '0'}%">
      <span class="percent">${getIndexWeeklyRate('red') ? getIndexWeeklyRate('red') : '0'}%</span>
    </div>
  </li>
  <li class="yellow">
    <label>${getGoalTitle('yellow')}</label>
    <div class="bar" style="height: ${getIndexWeeklyRate('yellow') ? getIndexWeeklyRate('yellow') : '0'}%">
      <span class="percent">${getIndexWeeklyRate('yellow') ? getIndexWeeklyRate('yellow') : '0'}%</span>
    </div>
  </li>
  <li class="blue">
    <label>${getGoalTitle('blue')}</label>
    <div class="bar" style="height: ${getIndexWeeklyRate('blue') ? getIndexWeeklyRate('blue') : '0'}%">
      <span class="percent">${getIndexWeeklyRate('blue') ? getIndexWeeklyRate('blue') : '0'}%</span>
    </div>
  </li>
  <li class="green">
    <label>${getGoalTitle('green')}</label>
    <div class="bar" style="height: ${getIndexWeeklyRate('green') ? getIndexWeeklyRate('green') : '0'}%">
      <span class="percent">${getIndexWeeklyRate('green') ? getIndexWeeklyRate('green') : '0'}%</span>
    </div>
  </li>
  <li class="purple">
    <label>${getGoalTitle('purple')}</label>
    <div class="bar" style="height: ${getIndexWeeklyRate('purple') ? getIndexWeeklyRate('purple') : '0'}%">
      <span class="percent">${getIndexWeeklyRate('purple') ? getIndexWeeklyRate('purple') : '0'}%</span>
    </div>
  </li>
  `;
  $weeklyGraph.innerHTML = graphHtml;
};

const render = () => {
  $period.textContent = `${dateChangeForm2(week[0].date)} ~ ${dateChangeForm2(week[6].date)}`;
  weeklyChallengeRender();
  dailyDataRender(today);
};

// event
$weeklyChallenge.onclick = ({ target }) => {
  if (!target.matches('.stamp')) return;
  $statsChildren.forEach(content => {
    content.classList.toggle('active', content.classList.contains('daily'));
  });
  const btnSelectId = target.parentNode.parentNode.id;
  const selectDate = selectDateSearch(btnSelectId);
  dailyDataRender(selectDate);
};

$statsContent.onclick = ({ target }) => {
  if (!target.matches('.btnTab')) return;
  $statsChildren.forEach(content => {
    content.classList.toggle('active', content === target.parentNode);
  });
  if (target.parentNode.classList.contains('daily')) {
    dailyDataRender(today);
  }
  if (target.parentNode.classList.contains('weekly')) {
    const goalSeconds = getWeeklyGoalSeconds();
    const doneSeconds = getWeeklyDoneSeconds();
    const averageCalc = doneSeconds / averageDate(today);

    $weeklyTotal.textContent = `${secondsToHours(doneSeconds)}`;
    $weeklyAchievementGoalTime.textContent = `목표 : ${secondsToHours(goalSeconds)}`;
    $weeklyAchievement.textContent = `${rateCalc(doneSeconds, goalSeconds)}%`;
    $weeklySum.textContent = `${secondsToHours(averageCalc)}`;
    $weeklyProgressBar.style.width = `${rateCalc(doneSeconds, goalSeconds)}%`;
    graphRender();
  }
};

const onLoad = async () => {
  const getTodos = await fetch('/todos');
  todos = await getTodos.json();
  const getWeek = await fetch('/week');
  week = await getWeek.json();
  getCurrentWeek();
  const getGoals = await fetch('/goals');
  goals = await getGoals.json();
  render();
};

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
const generateDate = time => `${
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
  $addTodoStart.minute.innerHTML = '<option value="">선택하세요</option>';
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
  const hour = $addTodoStart.hour.value;
  const minute = $addTodoStart.minute.value;
  // 중복 예정 확인
  if (!checkTime($addTodoDate.value, `${hour}:${minute}`, $addTodoGTime.value)) {
    window.alert('할일 예정이 다른 예정과 겹칩니다.');
    return;
  }
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
    resetAddtodo();
    console.log('조건에 따라서 뷰 랜더');
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
  const now = new Date();
  // 날짜 선택 최소 값 설정
  document.querySelectorAll('input[type="date"]').forEach(input => input.min = generateDate(now));
  // 시간 선택 최소 최대 값 설정
  $addTodoStart.hour.max = 23;
  $addTodoStart.hour.min = 6;
  onLoad();
};