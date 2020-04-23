// goal.js
import { 
  generateId,
  openPopup,
  closePopup,
  popup
} from './common.js';
// 함수]
// generateId(배열) : 배열에 생성될 요소의 아이디를 생성
// openPopup(popup요소) : 팝업 열기
// closePopup(popup요소) : 팝업 닫기
// popup(event.target, popup요소, popup 기능 버튼 실행할 함수, popup 닫을 떄 실행할 함수) : 해당 팝업의 기능 수행

// 상태
let targetId = null;
let goals = [];
let todos = [];

// 시간 변수
const now = new Date();
const oneHour = 3600000;
const oneDay = 86400000;
const generateDate = time => `${
  time.getFullYear()
}-${
  time.getMonth() > 9 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1)
}-${
  time.getDate() > 9 ? time.getDate() : '0' + time.getDate()
}`;

// Dom //////////
// 버튼
const $btnAddGoal = document.querySelector('.btnAddGoal');
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
// 목표 추가 popup
const $addGoal = document.querySelector('.addGoal');
const $addGoalCont = $addGoal.querySelector('.goalInput');
const $addGoalDday = $addGoal.querySelector('.dDayInput');
const $addGoalColor = $addGoal.querySelector('.indexInput');
// 목표 수정 popup
const $editGoal = document.querySelector('.editGoal');
const $editGoalContent = $editGoal.querySelector('.goalInput input');
const $editGoalDday = $editGoal.querySelector('.dDayInput input');
const $editGoalColor = $editGoal.querySelector('.indexInput');
// 목표 삭제 popup
const $deleteGoal = document.querySelector('.deleteGoal');

// 목표 페이지 ul
const $goalList = document.querySelector('.goalList');

// 함수 /////////////////////////////////////////////////////////////////
// 숫자 생성
// 현재 날짜부터 남은 날짜 구하는 함수
const generateDday = date => Math.ceil((date - now) / oneDay);
// 시간을 초단위 숫자로 변환하는 함수
const transSecond = (hh = 0, mm = 0, ss = 0) => {
  let count = 0;
  count += +hh * 3600;
  count += +mm * 60;
  count += +ss;
  return count;
};

// 목표 페이지 랜더 함수
const goalRender = () => {
  let html = '';
  goals.forEach(goal => {
    const goalDday = goal.dDay.split('-');
    html += `<li id="${goal.id}" class="${goal.color}">
    <div class="goalTit">
      <h4>${goal.content}</h3>
      <span class="closingDate">${goalDday[0]}.${goalDday[1]}.${goalDday[2]} / D-${generateDday(new Date(goal.dDay) - (9 * oneHour))}</span>
    </div>
    <button class="btnEdit">수정</button>
    <button class="btnDelete">삭제</button>
  </li>`;
  });
  $goalList.innerHTML = html;
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

// 목표 시간 옵션 만드는 함수
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
// addGoal popup 초기화 함수
const resetAddGoal = () => {
  $addGoalCont.querySelector('input').value = '';
  $addGoalDday.querySelector('input').value = '';
  if ($addGoalColor.querySelector('input:checked')) $addGoalColor.querySelector('input:checked').checked = false;
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
  if (new Date($addTodoDate.value) - new Date(generateDate(now)) < 0) {
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
    resetAddtodo();
    closePopup($addTodos);
  } catch (e) {
    console.error(e);
  }
};

// 목표 추가 함수
const addGoalFn = async () => {
  // data
  const goalContent = $addGoalCont.querySelector('input').value.trim();
  const goalDday = $addGoalDday.querySelector('input').value;
  const $goalColor = $addGoalColor.querySelector('input:checked');
  
  // 입력란 확인
  if (!goalContent || !goalDday || !$goalColor) {
    window.alert('입력란이 전부 채워지지 않았습니다.');
    return;
  }
  // 목표 Dday가 오늘 이후인지 확인
  if (new Date(goalDday) - new Date(generateDate(now)) < 0) {
    window.alert('목표 D-day를 오늘 이후로 선택하십시요.');
    return;
  }
  // 목표 색상이 중복되는지 확인
  const goalColor = $goalColor.value;
  if (goals.some(goal => goal.color === goalColor)) {
    window.alert('추가하는 목표 색상이 중복됩니다.');
    return;
  }

  // 통신 - post -
  try {
    let _goals = await fetch('/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: generateId(goals),
        content: goalContent,
        dDay: goalDday,
        color: goalColor
      })
    });
    _goals = await _goals.json();
    goals = [...goals, _goals];
  } catch (e) {
    console.error(e);
  }
  goalRender();
  resetAddGoal();
  closePopup($addGoal);
};

// 목표 제거 함수
const deleteGoalFn = async id => {
  // 통신 - delete - 
  try {
    await fetch(`/goals/${id}`, { method: 'delete' });
    goals = goals.filter(goal => goal.id !== id);
  } catch (e) {
    console.error(e);
  }
  
  const deleteTodos = todos.filter(todo => todo.goal === id);
  console.log('목표에 관련된 할일 삭제 이벤트', deleteTodos);
  // try {
  //   await fetch('/todos/12,13', { method: 'delete' });
  // } catch (e) {
  //   console.error(e);
  // }
  goalRender();
  closePopup($deleteGoal);
};
// 목표 수정 함수
const editGoalFn = async id => {
  const { content, dDay, color } = goals.find(goal => goal.id === id);
  
  // 바뀐 goal data 객체 반환 함수
  const checkInputs = (() => {
    const check = { length: 0, datas: [] };
    if ($editGoalContent.value !== content) {
      check.length += 1;
      check.datas.push({
        key: 'content',
        value: $editGoalContent.value
      });
    }
    if ($editGoalDday.value !== dDay) {
      check.length += 1;
      check.datas.push({
        key: 'dDay',
        value: $editGoalDday.value
      });
    }
    if ($editGoalColor.querySelector('input:checked').value !== color) {
      check.length += 1;
      check.datas.push({
        key: 'color',
        value: $editGoalColor.querySelector('input:checked').value
      });
    }
    return check;
  })();
  // 수정한 내용이 있는지 없는지 확인
  if (!checkInputs.length) {
    closePopup($editGoal);
    return;
  }

  // 목표의 D-day가 오늘 이후인지 확인
  const checkDday = checkInputs.datas.some(data => data.key === 'dDay');
  if (checkDday && new Date($editGoalDday.value) - new Date(generateDate(now)) < 0) {
    window.alert('목표 D-day를 오늘 이후로 선택하십시요.');
    return;
  }
  
  // 색상이 중복되는지 확인
  const checkColor = checkInputs.datas.some(data => data.key === 'color');
  if (checkColor && goals.some(goal => goal.color === $editGoalColor.querySelector('input:checked').value)) {
    window.alert('수정하는 목표 색상이 중복됩니다.');
    return;
  }

  // payload 생성
  const payload = {};
  checkInputs.datas.forEach(data => {
    payload[data.key] = data.value;
  });
  // 통신 -patch-
  try {
    const _goal = await fetch(`/goals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const goalRes = await _goal.json();
    goals = goals.map(goal => (goal.id === id ? goalRes : goal));
  } catch (e) {
    console.error(e);
  }
  console.log('todos 색상 데이터 변환');
  goalRender();
  closePopup($editGoal);
  targetId = null;
};

// 이벤트 핸들러 ////////////////////////////////////////////////////////
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
// 목표 추가 버튼 클릭 이벤트
$btnAddGoal.onclick = () => {
  if (goals.length >= 5) {
    window.alert('목표는 최대 5개까지 입니다.');
    return;
  }
  openPopup($addGoal);
};
// 목표 요소 안 수정/삭제 버튼 클릭 이벤트
$goalList.onclick = ({ target }) => {
  if (!(target.matches('.btnEdit') || target.matches('.btnDelete'))) return;
  targetId = +target.parentNode.id;
  if (target.matches('.btnEdit')) {
    const targetGoal = goals.find(({ id }) => id === targetId);
    
    $editGoalContent.value = targetGoal.content;
    $editGoalDday.value = targetGoal.dDay;
    $editGoalColor.querySelector(`.${targetGoal.color} input`).checked = true;
    openPopup($editGoal);
  } else {
    openPopup($deleteGoal);
  }
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
    <option value="00">00분</option>
    <option value="10">10분</option>
    <option value="20">20분</option>
    <option value="30">30분</option>` : `
    <option value="00">00분</option>
    <option value="10">10분</option>
    <option value="20">20분</option>
    <option value="30">30분</option>
    <option value="40">40분</option>
    <option value="50">50분</option>`;
    todoGoalOption(+$addTodoStart.hour.value, 0);
  }
};
// 목표 추가 popup 클릭 이벤트
$addGoal.onclick = ({ target }) => {
  popup(target, $addGoal, addGoalFn, resetAddGoal);
};
// 목표 수정 popup 클릭 이벤트
$editGoal.onclick = ({ target }) => {
  popup(
    target, 
    $editGoal, 
    () => {
      editGoalFn(targetId);
    },
    () => {
      targetId = null;
    }
  );
};
// 삭제 확인 popup 클릭 이벤트
$deleteGoal.onclick = ({ target }) => {
  if (!target.matches('button')) return;
  popup(
    target, 
    $deleteGoal, 
    () => {
      deleteGoalFn(targetId);
    },
    () => {
      targetId = null;
    }
  );
};
// 로드 이벤트
window.onload = async () => {
  // 날짜 선택 최소 값 설정
  document.querySelectorAll('input[type="date"]').forEach(input => input.min = generateDate(now));
  // 시간 선택 최소 최대 값 설정
  $addTodoStart.hour.max = 23;
  $addTodoStart.hour.min = 6;

  try {
    const _goals = await fetch('/goals');
    goals = await _goals.json();
  } catch (e) {
    console.error(e);
  }
  try {
    const _todos = await fetch('/todos');
    todos = await _todos.json();
  } catch (e) {
    console.error(e);
  }
  goalRender();
};
