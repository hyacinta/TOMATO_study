// goal.js
// 상태
let goals = [];

// 시간 변수
const now = new Date();
const oneHour = 3600000;
const oneDay = 86400000;

// Dom
const $btnAddGoal = document.querySelector('.btnAddGoal');
const $addGoal = document.querySelector('.addGoal');
const $deleteGoal = document.querySelector('.deleteGoal');
const $goalList = document.querySelector('.goalList');

let targetId = null;

// 함수
// 현재 날짜부터 남은 날짜 구하는 함수
const dDay = date => Math.ceil((date - now) / oneDay);
// popup 여는 함수
const openPopup = target => {
  target.classList.add('active');
};
// popup 닫는 함수
const closePopup = target => {
  // target.
  target.classList.remove('active');
};
// popup 이벤트 함수
const popup = (target, $popup, callback) => {
  if (target.matches('.btnRegister') || target.matches('.btnDelete')) {
    callback();
  } else {
    closePopup($popup);
  }
};
// 목표 페이지 랜더 함수
const goalRender = () => {
  let html = '';
  goals.forEach(goal => {
    const goalDday = goal.dDay.split('-');
    html += `<li id="${goal.id}" class="${goal.color}">
    <div class="goalTit">
      <h4>${goal.content}</h3>
      <span class="closingDate">${goalDday[0]}.${goalDday[1]}.${goalDday[2]} / D-${dDay(new Date(goal.dDay) - (9 * oneHour))}</span>
    </div>
    <button class="btnEdit">수정</button>
    <button class="btnDelete">삭제</button>
  </li>`;
  });
  $goalList.innerHTML = html;
};

// 이벤트 핸들러
// 목표 추가 버튼 이벤트
$btnAddGoal.onclick = () => {
  if (goals.length >= 5) {
    window.alert('목표는 최대 5개 입니다.');
    return;
  }
  openPopup($addGoal);
};
// 목표 추가 popup 이벤트
$addGoal.onclick = ({ target }) => {
  if (!target.matches('button')) return;
  popup(target, $addGoal, () => {
    console.log('목표 추가 이벤트');
  });
};
// 목표 요소 안 수정/삭제 버튼
$goalList.onclick = ({ target }) => {
  if (!(target.matches('.btnEdit') || target.matches('.btnDelete'))) return;
  targetId = target.parentNode.id;
  if (target.matches('.btnEdit')) {
    openPopup($addGoal);
  } else {
    openPopup($deleteGoal);
  }
};
// 삭제 확인 popup 이벤트
$deleteGoal.onclick = ({ target }) => {
  if (!target.matches('button')) return;
  popup(target, $deleteGoal, () => {
    console.log('삭제 이벤트');
  });
  targetId = null; 
};
// 로드 이벤트
window.onload = async () => {
  const _goals = await fetch('../../goals').then(res => res.json());
  goals = _goals;
  goalRender();
};