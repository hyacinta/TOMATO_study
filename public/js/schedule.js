let goals = [];
let todos = [];

const $scheduleList = document.querySelectorAll('main#schedule ul.scheduleList div.halfMinute');
const $selectDate = document.querySelector('.selectDate > input[type="date"]');

const addZero = num => {
  return num.length > 1 || num > 9 ? num : '0' + num;
};
// const generateDate = time => `${time.getFullYear()}-${time.getMonth() > 9 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1)}-${time.getDate()}`;
// document.querySelector('input[type="date"]').min = generateDate(new Date());

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
  return goals.find(goal => goal.id === id).content;
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

const filterTodos = () => {
  return todos.filter(todo => {
    return todo.date === $selectDate.value;
  });
};

// timeArr를 돌면서 todos와 매칭하는것만 필터 후 요소로 i를 주고 스케줄[i]에innerHtml 한다. 
// innerHtml이라서 시작시간이 겹치는 구간은 덮어쓴다. 고로 랜더링이 안된다.
const renderSche = () => {
  const timeArr = mkTimeArr();
  const scheArr = [...$scheduleList];

  const _todos = $selectDate.value === '' ? getToday(todos) : filterTodos();

  scheArr.forEach(sche => sche.innerHTML = '');

  _todos.filter(todo => {
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

window.onload = getData;