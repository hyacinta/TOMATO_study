// 가상 데이터
const week = [
  { id: 1, dayName: '월', date: '' },
  { id: 2, dayName: '화', date: '' },
  { id: 3, dayName: '수', date: '' },
  { id: 4, dayName: '목', date: '' },
  { id: 5, dayName: '금', date: '' },
  { id: 6, dayName: '토', date: '' },
  { id: 7, dayName: '일', date: '' }
];
const todos = [
  {
    id: 0, content: 'test', goal: 0, date: '2020-04-19', day: '0', important: true, startTime: '07:00', goalTime: '2:00', detail: '프로젝트 tomato HTML 제작', done: '02:05:38'
  },
  {
    id: 1, content: 'HTML', goal: 2, date: '2020-04-18', day: 'SAT', important: true, startTime: '07:00', goalTime: '2:00', detail: '프로젝트 tomato HTML 제작', done: '02:05:38'
  },
  {
    id: 2, content: 'HTML', goal: 0, date: '2020-04-21', day: 'TUE', important: true, startTime: '07:00', goalTime: '3:30', detail: '프로젝트 tomato HTML 제작', done: '02:05:38'
  },
  {
    id: 3, content: 'HTML', goal: 1, date: '2020-04-22', day: 'WED', important: true, startTime: '07:00', goalTime: '0:30', detail: '프로젝트 tomato HTML 제작', done: '02:05:38'
  },
  {
    id: 4, content: 'HTML', goal: 0, date: '2020-04-21', day: 'TUE', important: true, startTime: '07:00', goalTime: '1:30', detail: '프로젝트 tomato HTML 제작', done: '02:05:38'
  },
  {
    id: 5, content: 'HTML', goal: 2, date: '2020-04-23', day: 'THU', important: true, startTime: '07:00', goalTime: '4:00', detail: '프로젝트 tomato HTML 제작', done: '02:05:38'
  },
  {
    id: 6, content: 'HTML', goal: 4, date: '2020-04-24', day: 'FRI', important: true, startTime: '07:00', goalTime: '1:30', detail: '프로젝트 tomato HTML 제작', done: '02:05:38'
  },
  {
    id: 7, content: 'HTML', goal: 0, date: '2020-04-21', day: 'TUE', important: true, startTime: '07:00', goalTime: '3:30', detail: '프로젝트 tomato HTML 제작', done: '02:05:38'
  },
  {
    id: 8, content: 'HTML', goal: 3, date: '2020-04-20', day: 'MON', important: true, startTime: '07:00', goalTime: '2:00', detail: '프로젝트 tomato HTML 제작', done: '02:05:38'
  },
  {
    id: 9, content: 'HTML', goal: 0, date: '2020-04-23', day: 'THU', important: true, startTime: '07:00', goalTime: '1:30', detail: '프로젝트 tomato HTML 제작', done: '02:05:38'
  },
  {
    id: 10, content: 'HTML', goal: 5, date: '2020-04-20', day: 'MON', important: true, startTime: '07:00', goalTime: '2:30', detail: '프로젝트 tomato HTML 제작', done: '02:05:38'
  },
  {
    id: 11, content: 'HTML', goal: 5, date: '2020-04-19', day: 'SUN', important: true, startTime: '07:00', goalTime: '2:00', detail: '프로젝트 tomato HTML 제작', done: '02:05:38'
  }  
];

// DOMS
const $weeklyChallenge = document.querySelector('.weeklyChallenge');
const $statsContent = document.querySelector('.statsContent');
const $statsChildren = [...$statsContent.children];
const now = new Date();
const getToday = now.getDate();

// 일주일 날짜 구하기
for (let i = 1; i <= 7; i++) {
  const first = now.getDate() - now.getDay() + i;
  const day = new Date(now.setDate(first)).toISOString().slice(0, 10);
  week[i - 1].date = day;
}

// weekly render
const allAchieve = 90;
const sucessCriteria = () => (allAchieve > 30 ? (allAchieve > 80 ? 'perfect' : 'seccess') : 'fail');
const getBtn = () => (allAchieve > 30 ? (allAchieve > 80 ? '<button class="stamp">성공</button>' : '<button class="stamp">통과</button>') : '<button class="stamp">실패</button>');

const weeklyRender = () => {
  let html = '';
  week.forEach(day => {
    const getDate = day.date.split('-')[2];
    html += `<div id="${day.id}" class="${sucessCriteria(allAchieve)}">
    <dt>${day.dayName}</dt>
    <dd>${getToday > +getDate ? getBtn(allAchieve) : ''}${getDate}
    </dd>
  </div>`;
  });
  $weeklyChallenge.innerHTML = html;
};

window.onload = weeklyRender;


// daily data
// 1. todos를 돌면서 같은 날짜의 목표시간을 합한다
// 2. todos를 돌면서 같은 날짜의 실제 공부시간을 합한다.
// 1/2를 해서 퍼센트를 구한다.
// 타겟의 부모요소의 id값을 week의 day의 id값과 비교하여 같을 경우 day의 date값과 todos의 date값을 비교해서 오늘 데이터를 구한다.

// 1. todos를 돌면서 같은 날짜의 goal이 같은 데이터의 목표시간을 합한다.
// 2. todos를 돌면서 같은 날짜의 goal이 같은 데이터의 실제 공부시간을 합한다.
// 1/2를 해서 퍼센트를 구한다.

// 선택 날짜 찾기

// 하루 목표 시간 구하기(초)

// 하루 성공 시간 구하기(초)

// 달성률 계산

// 목표별 하루 목표 시간 구하기(초)

// 목표별 하루 성공 시간 구하기(초)

// 목표별 일간 달성률 계산


// 주간
// 1. todos를 돌면서 주간 데이터의 목표시간을 합한다
// 2. todos를 돌면서 주간 데이터의 실제 공부시간을 합한다.
// 1/2를 해서 퍼센트를 구한다.

// 1. todos를 돌면서 주간 데이터의 goal이 같은 데이터의 목표시간을 합한다.
// 2. todos를 돌면서 주간 데이터의 goal이 같은 데이터의 실제 공부시간을 합한다.
// 1/2를 해서 퍼센트를 구한다.


// event
$weeklyChallenge.onclick = ({ target }) => {
  if (!target.matches('.stamp')) return;
  $statsChildren.forEach(content => {
    content.classList.toggle('active', content.classList.contains('daily'));
  });
};

$statsContent.onclick = ({ target }) => {
  if (!target.matches('.btnTab')) return;
  $statsChildren.forEach(content => {
    content.classList.toggle('active', content === target.parentNode);
  });
};

// 주간챌린지에서 날짜 선택시 해당 날짜 데이터 볼 수 있음 (다른날짜는 흐리게 처리)