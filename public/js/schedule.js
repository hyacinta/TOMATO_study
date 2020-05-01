import { 
  generateId,
  openPopup,
  closePopup,
  popup
} from './common.js';

let goals = [];
let todos = [];
let dayTodos = [];
let targetId = [];

const $scheduleList = document.querySelectorAll('#schedule ul.scheduleList div.halfMinute');
const $selectDate = document.querySelector('.selectDate > input[type="date"]');
const $schedule = document.querySelector('ul.scheduleList');
const $scheDimd = document.querySelector('div.shec + .dimd');
const $schePopup = document.querySelector('div.shec.popup');
const $delScheTodo = document.querySelector('div.delShecTodo');
const $editScheTodo = document.querySelector('div.editShecTodo');

console.dir($selectDate);

const addZero = num => {
  return num.length > 1 || num > 9 ? num : '0' + num;
};

const mkTimeArr = () => {
  const timeArr = [];
  let [hour, min] = ['06', '00'];
  for (let i = 0; i < $scheduleList.length; i++) {
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
  // console.log(goals);
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
    return todo.date === `${today.getFullYear()}-${addZero(today.getMonth() + 1)}-${addZero(today.getDate())}`;
  });
};


const filterTodos = _todos => _todos.filter(todo => todo.date === $selectDate.value);

const getDayTodos = () => {
  const _todos = todos.filter(todo => goals.find(goal => goal.id === todo.goal));
  dayTodos = $selectDate.value === '' ? getToday(_todos) : filterTodos(_todos);
};

// innerHtml이라서 시작시간이 겹치는 구간은 덮어쓴다. 고로 랜더링이 안된다.
const renderSche = () => {
  const timeArr = mkTimeArr();
  const scheArr = [...$scheduleList];

  getDayTodos();

  scheArr.forEach(sche => sche.innerHTML = '');

  dayTodos.forEach(todo => {
    const timeLimit = getTimeCal(todo.startTime);
    if (timeLimit < 360 || timeLimit > 1439) return;
    const i = timeArr.findIndex(time => time === roundTime(todo.startTime));
    scheArr[i].innerHTML = `
    <div id="${todo.id}" class="todo ${todo.color}" style="height: ${getTimeCal(todo.goalTime) + 1}px; top: ${((todo.startTime[3] % 3) * 10) - 1}px;">
    <h4>${getGoalContent(todo.goal)}</h4>
    <p>${todo.content}</p>
    </div>`;
  });
};

const getData = async () => {
  try {
    goals = await fetch('/goals').then(res => res.json());
    
    todos = await fetch('/todos').then(res => res.json());
    getDayTodos();
    renderSche();
  } catch (e) {
    console.error('Error:', e);
  }
};

$selectDate.onchange = e => {
  console.dir(e);
  // getData();
  // getDayTodos();
  renderSche();
};

// 20.04.29 수정삭제 기능 추가
const removePopup = () => {
  $schePopup.classList.remove('active');
};
const deletePopup = () => {
  $delScheTodo.classList.remove('active');
};

const deleteSche = () => {
  fetch(`/todos/${targetId}`, { method: 'DELETE' })
    .then(() => todos = todos.filter(todo => todo.id !== targetId))
    // .then(() => dayTodos = dayTodos.filter(todo => todo.id !== targetId))
    // .then(getDayTodos)
    .then(renderSche)
    .catch(error => console.error('Error:', error));
};

// 스케줄 클릭시 팝업창 띄움
$schedule.onclick = e => {
  if (!e.target.matches('ul.scheduleList div.halfMinute > div.todo')) return;
  $schePopup.classList.add('active');
  targetId = +e.target.id; 
};

$scheDimd.onclick = () => {
  removePopup();
};

// 삭제 팝업창
$delScheTodo.onclick = e => {
  if (e.target.matches('.delShecTodo > button')) deletePopup();
  if (e.target.matches('.delShecTodo > button.btnRemove')) deleteSche();
};

// 수정 기능 시작
const setGoals = todo => {
  const $selectGoals = document.querySelector('.editShecTodo .addInput .category select');
  let html = `<option value="${todo.goal}">${goals.find(goal => goal.id === +todo.goal).content}</option>`;
  goals.forEach(goal => {
    if (goal.id === todo.goal) return;
    html += `<option value="${goal.id}">${goal.content}</option>`;
  });
  $selectGoals.innerHTML = html;
};

const setStartMin = todo => {
  const $startMin = $editScheTodo.querySelector('li.startTime > select');
  let html = '';
  for (let i = 0; i < 6; i++) {
    html += `<option value="${i + 1}">${i}0</option>`;
  }
  $startMin.innerHTML = html;
  $startMin.value = +todo.startTime[3] + 1;
};

// 목표시간 랜더링 해주면서 value값 지정해주는 함수
const setGoalTime = todo => {
  const $goalTime = $editScheTodo.querySelector('li.goalTime > select');
  let html = '<option value="1">30분</option>';
  let value = 1;
  for (let i = 2; i <= 10; i++) {
    const _i = Math.floor(i / 2);
    html += `<option value="${i}">${!(i % 2) ? _i + '시간' : _i + '시간 30분'}</option>`;
    if (todo.goalTime === (!(i % 2) ? `${_i}:00` : `${_i}:30`)) value = i;
  }
  $goalTime.innerHTML = html;
  $goalTime.value = value;
};

const insertValue = todo => {
  const $todoInput = $editScheTodo.querySelector('li.todoInput > input');
  const $startDate = $editScheTodo.querySelector('li.startDate > input[type="date"]');
  const $startHour = $editScheTodo.querySelector('li.startTime > input');

  $todoInput.value = todo.content;
  $startDate.value = todo.date;
  [$startHour.value] = todo.startTime.split(':', 2);
  setGoals(todo);
  setStartMin(todo);
  setGoalTime(todo);
};

// 수정 팝업창 랜더
const renderEditSche = () => {
  removePopup();
  $editScheTodo.classList.add('active');
  
  dayTodos.forEach(todo => {
    if (todo.id !== targetId) return;
    $editScheTodo.innerHTML = `
    <h3 id="${todo.id}">할일 수정</h3>
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
      <li class="impSelect"><label for="test" class="a11yHidden btnImpLabel">중요</label>
        <button class="btnImp${todo.important ? ' impCheck' : ''}" id="test">중요</button>
      </li>
      <li class="startDate">
        <label for="">시작 날짜</label>
        <input type="date" name="" id="">
      </li>
      <li class="startTime">
        <label for="">공부 시작시간</label>
        <input type="number" name="" id="" placeholder="입력하세요"><span>시</span>
        <select name="country" id="countrySelectBox">
        </select><span>분</span>
      </li>
      <li class="goalTime">
        <label for="">목표 공부시간</label>
        <select name="country" id="countrySelectBox">
        </select>
      </li>
      <li class="contentInput">
        <label for="" class="a11yHidden">상세 내용 입력</label>
        <textarea name="" id="" cols="30" rows="10" placeholder="상세 내용을 입력하세요">${todo.detail}</textarea>
      </li>
    </ul>
    <button class="btnCancel">취소</button>
    <button class="btnRegister">등록</button>`;

    insertValue(todo);
  });
};

const _getContent = () => $editScheTodo.querySelector('.addInput > .todoInput input').value;

const _getGoal = () => +$editScheTodo.querySelector('.addInput .category select').value;

const _getColor = () => goals.find(goal => goal.id === _getGoal()).color;

const _getDate = () => $editScheTodo.querySelector('li.startDate input').value;

const _getDayNum = () => new Date(_getDate()).getDay();

const _getImp = () => $editScheTodo.querySelector('li.impSelect .btnImp').classList.contains('impCheck');

const _getStart = () => {
  const $startHour = $editScheTodo.querySelector('.startTime input');
  const $startMin = $editScheTodo.querySelector('.startTime select');
  return `${addZero($startHour.value)}:${addZero(($startMin.value - 1) * 10)}`;
};

const _getGoalTime = () => {
  const $goalTime = $editScheTodo.querySelector('li.goalTime > select');
  const text = [...$goalTime.children].find(option => $goalTime.value === option.value).textContent;
  if (text === '30분') return '0:30';
  return text.includes('분') ? `${text[0]}:30` : `${text[0]}:00`;
};

const _getDetail = () => $editScheTodo.querySelector('li.contentInput > textarea').value;

const generateDateCW = time => `${
  time.getFullYear()
}-${
  time.getMonth() > 9 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1)
}-${
  time.getDate() > 9 ? time.getDate() : '0' + time.getDate()
}`;

const removeEditSche = () => $editScheTodo.classList.remove('active');

const editSche = async () => {
  let data = {};
  // 인풋이 비어있으면 리턴하기 추가
  try {
    data = await fetch(`/todos/${targetId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: _getContent(),
        goal: _getGoal(),
        color: _getColor(),
        date: _getDate(),
        day: _getDayNum(),
        important: _getImp(),
        startTime: _getStart(),
        goalTime: _getGoalTime(),
        detail: _getDetail(),
      })
    }).then(res => res.json());
    // if (data.date !== ($selectDate.value || generateDateCW(new Date()))) {
    //   todos = todos.map(todo => (todo.id === targetId ? data : todo));
    //   dayTodos = dayTodos.filter(todo => (todo.id !== data.id));
    // }
    // dayTodos = dayTodos.map(todo => (todo.id === targetId ? data : todo));
    // if문 부터 5줄을 주석 2줄로 간단히 바꿀 수 있지만 데이터가 큰 todos는 최대한 적게 돌도록 노력해봤다.
    todos = todos.map(todo => (todo.id === targetId ? data : todo));
    // getDayTodos(); 
    renderSche();
    removeEditSche();
  } catch (e) {
    console.error('Error:', e);
  }
};
// const editSche = () => {
//   // 인풋이 비어있으면 리턴하기 추가
//   fetch(`/todos/${targetId}`, {
//     method: 'PATCH',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       content: _getContent(),
//       goal: _getGoal(),
//       color: _getColor(),
//       date: _getDate(),
//       day: _getDayNum(),
//       // important: _getImp(),
//       // startTime: _getStart(),
//       goalTime: _getGoalTime(),
//       // detail: _getDetail(),
//     })
//   }).then(res => res.json())
//     // .then(data => {
//     //   let _dayTodos = [];
//     //   dayTodos.forEach(todo => {
//     //     if (data.date !== ($selectDate.value || generateDateCW(new Date()))) return;
//     //     // console.log('222' + $selectDate.value, generateDateCW(new Date()), data.date);
//     //     _dayTodos = [..._dayTodos, (todo.id === targetId ? data : todo)];
//     //     console.log(1);
//     //   });
//     //   dayTodos = _dayTodos;
//     //   console.log(dayTodos);
//     // })
//     .then(data => dayTodos = dayTodos.map(todo => (todo.id === targetId ? data : todo)))
//     // .then(_dayTodos => dayTodos = _dayTodos.filter(todo => (todo.id === targetId ? data : todo)))
//     .then(renderSche)
//     .then(removeEditSche) 
//     .catch(error => console.error('Error:', error));
// };

// 수정 팝업창
$editScheTodo.onclick = e => {
  if (e.target.matches('.editShecTodo > .btnCancel')) removeEditSche();
  if (e.target.matches('.editShecTodo > .btnRegister')) editSche();
  if (e.target.matches('.editShecTodo li.impSelect .btnImp')) e.target.classList.toggle('impCheck');
};


// 수정 삭제 선택 팝업창
$schePopup.onclick = e => {
  if (e.target.matches('div.shec > span.editShec')) renderEditSche();
  if (e.target.matches('div.shec > span.delShec')) {
    removePopup();
    $delScheTodo.classList.add('active');
  }
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
    if ($addTodoDate.value === generateDateCW(now)) {
      // getDayTodos();
      renderSche();
    }
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
