// goal.js
// 상태
let goals = [];

// Dom
const $goalList = document.querySelector('.goalList');

const now = new Date();
console.log(now);

// 함수
const goalRender = () => {
  let html = '';
  goals.forEach(goal => {
    const goalDday = goal.dDay.split('-');
    html += `<li class="${goal.color}">
    <div class="goalTit">
      <h4>${goal.content}</h3>
      <span class="closingDate">${goalDday[0]}.${goalDday[1]}.${goalDday[2]} / D-${0}</span>
    </div>
    <button class="btnEdit">수정</button>
    <button class="btnDelete">삭제</button>
  </li>`;
  });
  $goalList.innerHTML = html;
};

fetch('../../goals')
  .then(res => res.json())
  .then(res => goals = res)
  .then(goalRender);
