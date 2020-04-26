import { 
  generateId,
  openPopup,
  closePopup,
  popup
} from './common.js';

let goals = [];
let todos = [];

const $scheduleList = document.querySelectorAll('main#schedule ul.scheduleList div.halfMinute');
const $selectDate = document.querySelector('.selectDate > input[type="date"]');

const addZero = num => {
  return num.length > 1 || num > 9 ? num : '0' + num;
};

const mkTimeArr = () => {
  const timeArr = [];
  let [hour, min] = ['06', '00'];
  for (let i = 0; i < 36; i++) {
    timeArr.push(`${addZero(hour)}:${addZero(min)}`);
    min = +min + 30;
    if (min === 60) {
      hour++;
      min = 0;
    } 
  }
  return timeArr;
};

const getGoalContent = id => {
  console.log(goals);
  return goals.find(goal => +goal.id === +id).content;
};

const getTimeCal = time => {
  const [hour, min] = time.split(':', 2);
  return hour * 60 + +min;
};

const roundTime = time => {
  const hour = time.split(':', 2)[0];
  let min = time.split(':', 2)[1];
  if (+min > 0 && +min < 30) min = 0;
  if (+min > 30 && +min < 60) min = 30;
  return `${addZero(hour)}:${addZero(min)}`;
};

const getToday = _todos => {
  return _todos.filter(todo => {
    const today = new Date();
    const month = today.getMonth() + 1 > 9 ? today.getMonth() + 1 : `0${today.getMonth() + 1}`;
    return todo.date === `${today.getFullYear()}-${month}-${today.getDate()}`;
  });
};

const filterTodos = _todos => _todos.filter(todo => todo.date === $selectDate.value);

// timeArr를 돌면서 todos와 매칭하는것만 필터 후 요소로 i를 주고 스케줄[i]에innerHtml 한다. 
// innerHtml이라서 시작시간이 겹치는 구간은 덮어쓴다. 고로 랜더링이 안된다.
const renderSche = () => {
  const timeArr = mkTimeArr();
  const scheArr = [...$scheduleList];

  let _todos = todos.filter(todo => goals.find(goal => goal.id === todo.goal));
  _todos = $selectDate.value === '' ? getToday(_todos) : filterTodos(_todos);

  scheArr.forEach(sche => sche.innerHTML = '');

  _todos.forEach(todo => {
    console.log(todo.goal);
    const timeLimit = getTimeCal(todo.startTime);
    if (timeLimit < 360 || timeLimit > 1439) return;
    const i = timeArr.findIndex(time => time === roundTime(todo.startTime));
    scheArr[i].innerHTML = `
    <div class="todo ${todo.color}" style="height: ${getTimeCal(todo.goalTime) + 1}px; top: ${((todo.startTime[3] % 3) * 10) - 1}px;">
    <h4>${getGoalContent(todo.goal)}</h4>
    <p>${todo.content}</p>
    </div>`;
  });
};

const getData = async () => {
  try {
    goals = await fetch('/goals').then(res => res.json());
    
    todos = await fetch('/todos').then(res => res.json());
    renderSche();
  } catch (e) {
    console.error('Error:', e);
  }
};

$selectDate.onchange = e => {
  console.dir(e);
  renderSche();
};

// import
/* 치원님 할일 추가 code 시작 */
const now = new Date();
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
    if ($addTodoDate.value === generateDateCW(now)) renderSche();
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

window.onload = () => {
  // 날짜 선택 최소 값 설정
  $addTodos.querySelectorAll('input[type="date"]').forEach(input => input.min = generateDateCW(now));
  getData();
};
