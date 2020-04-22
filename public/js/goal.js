// goal.js
// 상태
let goals = [];

// 시간 변수
const now = new Date();
const oneHour = 3600000;
const oneDay = 86400000;

// Dom
const $goalList = document.querySelector('.goalList');

// 함수
const dDay = date => Math.ceil((date - now) / oneDay);

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
$goalList.onclick = target => {
  // if (target)
};

window.onload = () => {
  fetch('../../goals')
    .then(res => res.json())
    .then(res => goals = res)
    .then(goalRender);
};