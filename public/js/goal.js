// goal.js
// 상태
let goals = [];

// 시간 변수
const now = new Date();
const oneHour = 3600000;
const oneDay = 86400000;
const generateDate = time => `${
  time.getFullYear()
}-${
  time.getMonth() > 9 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1)
}-${
  time.getDate()
}`;

// Dom
const $btnAddTodo = document.querySelector('.btnAddTodo');
const $addTodos = document.querySelector('.addTodos');
const $btnAddGoal = document.querySelector('.btnAddGoal');
const $addGoal = document.querySelector('.addGoal');
const $editGoal = document.querySelector('.editGoal');
const $editGoalContent = $editGoal.querySelector('.editInput .goalInput input');
const $editGoalDday = $editGoal.querySelector('.editInput .dDayInput input');
const $deleteGoal = document.querySelector('.deleteGoal');
const $goalList = document.querySelector('.goalList');

let targetId = null;

// 날짜 선택 최소 값
document.querySelectorAll('input[type="date"]').forEach(input => input.min = generateDate(now));

// 함수 /////////////////////////////////////////////////////////////////
// 숫자 생성
// 현재 날짜부터 남은 날짜 구하는 함수
const generateDday = date => Math.ceil((date - now) / oneDay);
// id 제너레이트
const generateId = target => Math.max(...target.map(ele => +ele.id)) + 1;

// 목표 페이지 랜더 함수
const goalRender = () => {
  let html = '';
  console.log(goals);
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

// popup
// popup 여는 함수
const openPopup = target => {
  target.classList.add('active');
};
// popup 닫는 함수
const closePopup = target => {
  target.classList.remove('active');
  if (targetId) targetId = null;
};
// popup 이벤트 함수
const popup = (target, $popup, callback) => {
  if (!target.matches('button')) return;
  if (target.matches('.btnCancel') || target.matches('.btnClosed')) {
    closePopup($popup);
  } else {
    callback();
    closePopup($popup);
  }
};

// 통신
// 목표 추가 함수
const addGoalFn = async () => {
  // input
  const $goalInput = $addGoal.querySelector('.addInput .goalInput');
  const $dDayInput = $addGoal.querySelector('.addInput .dDayInput');
  // const $indexInput = $addGoal.querySelector('.addInput .indexInput');
  // data
  const goalContent = $goalInput.querySelector('input').value.trim();
  const goalDday = $dDayInput.querySelector('input').value;
  // const goalColor = $indexInput.querySelector('input[check]');
  
  if (goalContent && goalDday && 'purple') {
    const _goals = await fetch('../../goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: generateId(goals),
        content: goalContent,
        dDay: goalDday,
        color: 'purple'
      })
    }).then(res => res.json());

    goals = [...goals, _goals];
    $goalInput.querySelector('input').value = '';
    $dDayInput.querySelector('input').value = '';

    goalRender();
  } else {
    console.log('input 확인 후 해당 input 아래에 경고문구 출력');
  }
};
// 목표 제거 함수
const deleteGoalFn = async id => {
  await fetch(`../../goals/${id}`, { method: 'delete' });
  goals = goals.filter(goal => goal.id !== id);
  goalRender();
};
// 목표 수정 함수
const editGoalFn = async id => {
  const { content, dDay, color } = goals.find(goal => goal.id === id);
  
  // 바뀐 goal data 객체 반환 함수
  const checkInputs = (() => {
    const check = { length: 0, datas: [] };
    if (!($editGoalContent.value === content)) {
      check.length += 1;
      check.datas.push({
        key: 'content',
        value: $editGoalContent.value
      });
    }
    if (!($editGoalDday.value === dDay)) {
      check.length += 1;
      check.datas.push({
        key: 'dDay',
        value: $editGoalDday.value
      });
    }
    console.log('color 체크 함수 해야함');
    return check;
  })();

  // 수정한 내용이 있는지 없는지 확인
  if (!checkInputs.length) return;

  // payload 생성
  const payload = {};
  checkInputs.datas.forEach(data => {
    payload[data.key] = data.value;
  });
  // 통신 -수정-
  const _goal = await fetch(`../../goals/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(res => res.json());
  goals = goals.map(goal => (goal.id === id ? _goal : goal));
  goalRender();
};

// 이벤트 핸들러 ////////////////////////////////////////////////////////
// 버튼
// 할일 추가 버튼 클릭 이벤트
$btnAddTodo.onclick = () => {
  openPopup($addTodos);
};
// 목표 추가 버튼 클릭 이벤트
$btnAddGoal.onclick = () => {
  if (goals.length >= 5) {
    console.log('목표는 최대 5개 입니다.');
    return;
  }
  openPopup($addGoal);
};
// 목표 요소 안 수정/삭제 버튼 클릭 이벤트
$goalList.onclick = ({ target }) => {
  if (!(target.matches('.btnEdit') || target.matches('.btnDelete'))) return;
  targetId = +target.parentNode.id;
  if (target.matches('.btnEdit')) {
    openPopup($editGoal);
    const targetGoal = goals.find(({ id }) => id === targetId);
    
    $editGoalContent.value = targetGoal.content;
    $editGoalDday.value = targetGoal.dDay;
    // $editGoal.querySelector('.editInput .indexInput input[checked]');
  } else {
    openPopup($deleteGoal);
  }
};

// popup
// 할일 추가 popup 클릭 이벤트
$addTodos.onclick = ({ target }) => {
  popup(target, $addTodos, () => {
    console.log('할일 추가 이벤트');
  });
};
// 목표 추가 popup 클릭 이벤트
$addGoal.onclick = ({ target }) => {
  popup(target, $addGoal, addGoalFn);
};
// 목표 수정 popup 클릭 이벤트
$editGoal.onclick = ({ target }) => {
  popup(target, $editGoal, () => {
    editGoalFn(targetId);
  });
};
// 삭제 확인 popup 클릭 이벤트
$deleteGoal.onclick = ({ target }) => {
  if (!target.matches('button')) return;
  popup(target, $deleteGoal, () => {
    deleteGoalFn(targetId);
    console.log('목표에 관련된 할일 삭제 이벤트');
  });
};
// 로드 이벤트
window.onload = async () => {
  const _goals = await fetch('../../goals').then(res => res.json());
  goals = _goals;
  goalRender();
};