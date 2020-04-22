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
const goals = [
  {
    id: 1, content: 'project tomato', dDay: '2020-04-24', color: 'red'
  },
  {
    id: 2, content: 'react tomato', dDay: '2020-04-24', color: 'yellow'
  },
  {
    id: 3, content: 'test0 test0', dDay: '2020-04-24', color: 'green'
  },
  {
    id: 4, content: 'project test0', dDay: '2020-04-24', color: 'blue'
  },
  {
    id: 5, content: 'test0 tomato', dDay: '2020-04-24', color: 'purple'
  }
];
const todos = [
  {
    id: 0, content: 'test', goal: 0, color: 'red', date: '2020-04-19', day: '0', important: true, startTime: '07:00', goalTime: '2:00', detail: '프로젝트 tomato HTML 제작', done: '02:05:38'
  },
  {
    id: 1, content: 'HTML', goal: 2, color: 'green', date: '2020-04-18', day: 'SAT', important: true, startTime: '07:00', goalTime: '2:00', detail: '프로젝트 tomato HTML 제작', done: '02:05:38'
  },
  {
    id: 2, content: 'HTML', goal: 0, color: 'red', date: '2020-04-21', day: 'TUE', important: true, startTime: '07:00', goalTime: '3:30', detail: '프로젝트 tomato HTML 제작', done: '02:05:38'
  },
  {
    id: 3, content: 'HTML', goal: 1, color: 'yellow', date: '2020-04-22', day: 'WED', important: true, startTime: '07:00', goalTime: '4:30', detail: '프로젝트 tomato HTML 제작', done: '02:05:38'
  },
  {
    id: 4, content: 'HTML', goal: 0, color: 'blue', date: '2020-04-21', day: 'TUE', important: true, startTime: '07:00', goalTime: '1:30', detail: '프로젝트 tomato HTML 제작', done: '02:05:38'
  },
  {
    id: 5, content: 'HTML', goal: 2, color: 'purple', date: '2020-04-23', day: 'THU', important: true, startTime: '07:00', goalTime: '4:00', detail: '프로젝트 tomato HTML 제작', done: '02:05:38'
  },
  {
    id: 6, content: 'HTML', goal: 4, color: 'yellow', date: '2020-04-24', day: 'FRI', important: true, startTime: '07:00', goalTime: '1:30', detail: '프로젝트 tomato HTML 제작', done: '02:05:38'
  },
  {
    id: 7, content: 'HTML', goal: 0, color: 'blue', date: '2020-04-21', day: 'TUE', important: true, startTime: '07:00', goalTime: '3:30', detail: '프로젝트 tomato HTML 제작', done: '02:05:38'
  },
  {
    id: 8, content: 'HTML', goal: 3, color: 'green', date: '2020-04-20', day: 'MON', important: true, startTime: '07:00', goalTime: '2:00', detail: '프로젝트 tomato HTML 제작', done: '02:05:38'
  },
  {
    id: 9, content: 'HTML', goal: 0, color: 'purple', date: '2020-04-23', day: 'THU', important: true, startTime: '07:00', goalTime: '1:30', detail: '프로젝트 tomato HTML 제작', done: '02:05:38'
  },
  {
    id: 10, content: 'HTML', goal: 5, color: 'purple', date: '2020-04-20', day: 'MON', important: true, startTime: '07:00', goalTime: '2:30', detail: '프로젝트 tomato HTML 제작', done: '02:05:38'
  },
  {
    id: 11, content: 'HTML', goal: 5, color: 'green', date: '2020-04-19', day: 'SUN', important: true, startTime: '07:00', goalTime: '2:00', detail: '프로젝트 tomato HTML 제작', done: '02:05:38'
  }  
];

// DOMS
const $weeklyChallenge = document.querySelector('.weeklyChallenge');
const $statsContent = document.querySelector('.statsContent');
const $statsChildren = [...$statsContent.children];
const $statsDate = document.querySelector('.statsData');
const $weeklyTotal = document.querySelector('.weekly .total > p');
const $weeklySum = document.querySelector('.weekly .sum > p');
const $weeklyAchievementGoalTime = document.querySelector('.weekly .achievement span');
const $weeklyAchievement = document.querySelector('.weekly .achievement > p');
const $weeklyProgressBar = document.querySelector('.weekly .progressBar');
const $period = document.querySelector('.period');
const $weeklyGraph = document.querySelector('.weekly .graph');

const now = new Date();

const getToday = () => {
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  return year + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date);
};
const todayParse = Date.parse(getToday());
const today = getToday();

// 일주일 날짜 구하기
for (let i = 1; i <= 7; i++) {
  const first = now.getDate() - now.getDay() + i;
  const day = new Date(now.setDate(first)).toISOString().slice(0, 10);
  week[i - 1].date = day;
}


/*
강사님 새로운 위크 받는 새로운 코드
function getCurrentWeek() {
  const today = new Date();
  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today.setDate(today.getDate() - today.getDay() + i));
    const year = d.getFullYear();
    let month = d.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let date = d.getDate();
    date = date < 10 ? '0' + date : date;
    week.push(`${year}-${month}-${date}`);
  }
  return week;
}
*/



const dateChangeForm = targetDate => {
  const dateTemp = targetDate.split('-');
  return `${dateTemp[0]}년 ${dateTemp[1]}월 ${dateTemp[2]}일`;
};
const dateChangeForm2 = targetDate => {
  const dateTemp = targetDate.split('-');
  return `${dateTemp[0]}.${dateTemp[1]}.${dateTemp[2]}`;
};

// daily & weekly 공통 사용 함수
const rateCalc = (divisor, dividend) => {
  const temp = (divisor / dividend) * 100;
  return Math.round(temp);
};
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
// daily data & 함수
// 선택 날짜 찾기
const selectDateSearch = btnSelectId => {
  let selectDateTemp = '';
  week.forEach(day => {
    if (day.id !== +btnSelectId) return;
    selectDateTemp = day.date;
  });
  return selectDateTemp;
};
// 하루 목표 시간 구하기 (초)
const getDailyGoalSeconds = date => {
  let sumGoalTemp = 0;
  todos.forEach(todo => {
    if (todo.date !== date) return;    
    const splitTarget = todo.goalTime;
    let changeTarget = splitTarget.split(':');
    changeTarget = (changeTarget[0] * 60 * 60) + (changeTarget[1] * 60);
    sumGoalTemp += changeTarget;
  });
  return sumGoalTemp;
};

// 하루 실행 시간 구하기(초)
const getDailyDoneSeconds = date => {
  let sumDoneTemp = 0;
  todos.forEach(todo => {
    if (todo.date !== date) return;
    const splitTarget = todo.done;
    let changeTarget = splitTarget.split(':');
    changeTarget = (changeTarget[0] * 60 * 60) + (changeTarget[1] * 60) + +changeTarget[2];
    sumDoneTemp += changeTarget;
  });
  return sumDoneTemp;
};


// weekly data & 함수
// 주간 목표 시간 구하기 (초)
const getWeeklyGoalSeconds = () => {
  let sumGoalTemp = 0;
  week.forEach(day => {
    todos.forEach(todo => {
      if (day.date !== todo.date) return;
      const splitTarget = todo.goalTime;
      let changeTarget = splitTarget.split(':');
      changeTarget = (changeTarget[0] * 60 * 60) + (changeTarget[1] * 60);
      sumGoalTemp += changeTarget;
    });
  });
  return sumGoalTemp;
};

// 주간 실행 시간 구하기(초)
const getWeeklyDoneSeconds = () => {
  let sumDoneTemp = 0;
  week.forEach(day => {
    todos.forEach(todo => {
      if (day.date !== todo.date) return;
      const splitTarget = todo.done;
      let changeTarget = splitTarget.split(':');
      changeTarget = (changeTarget[0] * 60 * 60) + (changeTarget[1] * 60) + +changeTarget[2];
      sumDoneTemp += changeTarget;
    });
  });
  return sumDoneTemp;
};

// 하루 Category별 실행 시간 구하기(초)
const getDailyIndexDoneSeconds = (date, color) => {
  let _todos = [];
  let sumDoneTemp = 0;
  _todos = todos.filter(todo => todo.date === date);
  _todos.forEach(todo => {
    if (todo.color !== color) return;
    const splitTarget = todo.done;
    let changeTarget = splitTarget.split(':');
    changeTarget = (changeTarget[0] * 60 * 60) + (changeTarget[1] * 60) + +changeTarget[2];
    sumDoneTemp += changeTarget;
  });
  return sumDoneTemp;
};
// 하루 Category별 목표 시간 구하기(초)
const getDailyIndexGoalSeconds = (date, color) => {
  let _todos = [];
  let sumGoalTemp = 0;
  _todos = todos.filter(todo => todo.date === date);
  _todos.forEach(todo => {
    if (todo.color !== color) return;
    const splitTarget = todo.goalTime;
    let changeTarget = splitTarget.split(':');
    changeTarget = (changeTarget[0] * 60 * 60) + (changeTarget[1] * 60);
    sumGoalTemp += changeTarget;
  });
  return sumGoalTemp;
};

const getIndexRate = (checkDate, color) => {
  const indexGoalSeconds = getDailyIndexGoalSeconds(checkDate, color);
  const indexDoneSeconds = getDailyIndexDoneSeconds(checkDate, color);
  return rateCalc(indexDoneSeconds, indexGoalSeconds);
};

// 목표 이름 구하기
const getGoalTitle = color => {
  let tempTitle = '';
  goals.forEach(goal => {
    if (goal.color === color) tempTitle = goal.content;
  });
  return tempTitle;
};

// 주간 Category별 목표 시간 구하기(초)
const getWeeklyIndexGoalSeconds = color => {
  let _todos = [];
  let sumGoalTemp = 0;
  week.forEach(day => {
    _todos = todos.filter(todo => todo.date === day.date);
    _todos.forEach(todo => {
      if (todo.color !== color) return;
      const splitTarget = todo.goalTime;
      let changeTarget = splitTarget.split(':');
      changeTarget = (changeTarget[0] * 60 * 60) + (changeTarget[1] * 60);
      sumGoalTemp += changeTarget;
    });
  });
  return sumGoalTemp;
};
console.log(getWeeklyIndexGoalSeconds('red'));

// 주간 Category별 실행 시간 구하기(초)
const getWeeklyIndexDoneSeconds = color => {
  let _todos = [];
  let sumDoneTemp = 0;
  week.forEach(day => {
    _todos = todos.filter(todo => todo.date === day.date);
    _todos.forEach(todo => {
      if (todo.color !== color) return;
      const splitTarget = todo.done;
      let changeTarget = splitTarget.split(':');
      changeTarget = (changeTarget[0] * 60 * 60) + (changeTarget[1] * 60) + +changeTarget[2];
      sumDoneTemp += changeTarget;
    });
  });
  return sumDoneTemp;
};

console.log(getWeeklyIndexDoneSeconds('red'));
const getIndexWeeklyRate = (checkDate, color) => {
  const indexGoalSeconds = getWeeklyIndexGoalSeconds(checkDate, color);
  const indexDoneSeconds = getWeeklyIndexDoneSeconds(checkDate, color);
  return rateCalc(indexDoneSeconds, indexGoalSeconds);
};

// weeklyChallenge render
const allAchieve = 90;
const sucessCriteria = () => (allAchieve > 30 ? (allAchieve > 80 ? 'perfect' : 'seccess') : 'fail');
const getBtn = () => (allAchieve > 30 ? (allAchieve > 80 ? '<button class="stamp">성공</button>' : '<button class="stamp">통과</button>') : '<button class="stamp">실패</button>');

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
    <h4>달성률 <span>${secondsToHours(goalSeconds)}</span></h4>
    <p>${rateCalc(doneSeconds, goalSeconds)}%</p>
    <div class="progress">
      <div class="progressBar" style="width:${rateCalc(doneSeconds, goalSeconds)}%;"></div>
    </div>
  </li>
  <li class="category">
    <h4>목표별 공부시간 <span>(%)</span></h4>
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
  $statsDate.innerHTML = dataHtml;
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

  let weeklyHtml = '';
  week.forEach(day => {
    const getDate = day.date.split('-')[2];
    weeklyHtml += `<div id="${day.id}" class="${sucessCriteria(allAchieve)}">
    <dt>${day.dayName}</dt>
    <dd>${todayParse > Date.parse(day.date) ? getBtn(allAchieve) : ''}${getDate}
    </dd>
  </div>`;
  });
  $weeklyChallenge.innerHTML = weeklyHtml;

  dailyDataRender(today);
};
window.onload = render;
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
    const averageCalc = doneSeconds / 2;

    $weeklyTotal.textContent = `${secondsToHours(doneSeconds)}`;
    $weeklyAchievementGoalTime.textContent = `${secondsToHours(goalSeconds)}`;
    $weeklyAchievement.textContent = `${rateCalc(doneSeconds, goalSeconds)}%`;
    $weeklySum.textContent = `${secondsToHours(averageCalc)}`;
    $weeklyProgressBar.style.width = `${rateCalc(doneSeconds, goalSeconds)}%`;
    graphRender();


  }
};