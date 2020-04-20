// 주간 챌린지
// 하루 성공 기준
// 30% 이하 실패
// 30%  ~ 80% 통과
// 80% 이상 성공

// 일간
// 총 공부시간 및 달성률
// 목표별 공부시간 및 달성률
// 주간챌린지에서 날짜 선택시 해당 날짜 데이터 볼 수 있음 (다른날짜는 흐리게 처리)

// 주간
// 총 공부시간 및 달성률
// 일간 평균 공부시간 및 달성률
// 목표별 공부시간 및 달성률



// 가상 데이터
const week = [
  { date: '2020-04-19', day: 0, todos: [] },
  { date: '2020-04-20', day: 1, todos: [] },
  { date: '2020-04-21', day: 2, todos: [] },
  { date: '2020-04-22', day: 3, todos: [] },
  { date: '2020-04-23', day: 4, todos: [] },
  { date: '2020-04-24', day: 5, todos: [] },
  { date: '2020-04-25', day: 6, todos: [] }
];

let todos = [
  { id : 0, content : 'test', goal: 0, date : '2020-04-19', day : '0', important : true, startTime : '07:00', goalTime: '2:00', detail: '프로젝트 tomato HTML 제작', done: '02:05:38' },
  { id : 1, content : 'HTML', goal: 2, date : '2020-04-18', day : 'SAT', important : true, startTime : '07:00', goalTime: '2:00', detail: '프로젝트 tomato HTML 제작', done: '02:05:38' },
  { id : 2, content : 'HTML', goal: 0, date : '2020-04-21', day : 'TUE', important : true, startTime : '07:00', goalTime: '2:00', detail: '프로젝트 tomato HTML 제작', done: '02:05:38' },
  { id : 3, content : 'HTML', goal: 1, date : '2020-04-22', day : 'WED', important : true, startTime : '07:00', goalTime: '2:00', detail: '프로젝트 tomato HTML 제작', done: '02:05:38' },
  { id : 4, content : 'HTML', goal: 0, date : '2020-04-21', day : 'TUE', important : true, startTime : '07:00', goalTime: '2:00', detail: '프로젝트 tomato HTML 제작', done: '02:05:38' },
  { id : 5, content : 'HTML', goal: 2, date : '2020-04-23', day : 'THU', important : true, startTime : '07:00', goalTime: '2:00', detail: '프로젝트 tomato HTML 제작', done: '02:05:38' },
  { id : 6, content : 'HTML', goal: 4, date : '2020-04-24', day : 'FRI', important : true, startTime : '07:00', goalTime: '2:00', detail: '프로젝트 tomato HTML 제작', done: '02:05:38' },
  { id : 7, content : 'HTML', goal: 0, date : '2020-04-21', day : 'TUE', important : true, startTime : '07:00', goalTime: '2:00', detail: '프로젝트 tomato HTML 제작', done: '02:05:38' },
  { id : 8, content : 'HTML', goal: 3, date : '2020-04-20', day : 'MON', important : true, startTime : '07:00', goalTime: '2:00', detail: '프로젝트 tomato HTML 제작', done: '02:05:38' },
  { id : 9, content : 'HTML', goal: 0, date : '2020-04-23', day : 'THU', important : true, startTime : '07:00', goalTime: '2:00', detail: '프로젝트 tomato HTML 제작', done: '02:05:38' },
  { id : 10, content : 'HTML', goal: 5, date : '2020-04-20', day : 'MON', important : true, startTime : '07:00', goalTime: '2:00', detail: '프로젝트 tomato HTML 제작', done: '02:05:38' },
  { id : 11, content : 'HTML', goal: 5, date : '2020-04-19', day : 'SUN', important : true, startTime : '07:00', goalTime: '2:00', detail: '프로젝트 tomato HTML 제작', done: '02:05:38' }  
];


// DOMS
const $weeklyChallenge = document.querySelector('.weeklyChallenge');
const $statsContent = document.querySelector('.statsContent');

// data 
// 주간 총 공부시간
// todos를 돌면서 일주일 단위를 구하는 방법?
// new date를 사용해서 오늘 날짜랑 요일을 구하고
// 오늘 날짜랑 요일에서 
const now = new Date();
const getToday = now.getDate();

const getDay = day => {
  let newDay = '';
  switch (day) {
    case 0:
      newDay = '월';
      break;
    case 1:
      newDay = '화';
      break;
    case 2:
      newDay = '수';
      break;
    case 3:
      newDay = '목';
      break;
    case 4:
      newDay = '금';
      break;
    case 5:
      newDay = '토';
      break;
    case 6:
      newDay = '일';
      break;
    default:
      break;
  }
  return newDay;
};
const getDate = date => date.split('-')[2];
const allAchieve = 20;
const sucessCriteria = () => (allAchieve > 30 ? (allAchieve > 80 ? 'perfect' : 'seccess') : 'fail');
const getBtn = () => (allAchieve > 30 ? (allAchieve > 80 ? '<button class="stamp">성공</button>' : '<button class="stamp">통과</button>') : '<button class="stamp">실패</button>');

const _week = week.map(day => ({ ...day, date: `${getDate(day.date)}`, day: `${getDay(day.day)}` }));

const weeklyRender = () => {
  let html = '';
  _week.forEach(day => {
    html += `<div class="${sucessCriteria(allAchieve)}">
    <dt>${day.day}</dt>
    <dd>${getToday > +day.date ? getBtn(allAchieve) : ''}${day.date}
    </dd>
  </div>`;
  });
  $weeklyChallenge.innerHTML = html;
};

window.onload = weeklyRender;

// event
$weeklyChallenge.onclick = e => {
  if (!e.target.matches('.stamp')) return;
  console.log('test');
};

$statsContent.onclick = e => {
  if (!e.target.matches('.btnTab')) return;
  console.log('test2');
};