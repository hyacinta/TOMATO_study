let goals = [];
let todos = [];

const $scheduleList = document.querySelectorAll('main#schedule ul.scheduleList div.halfMinute');

const addZero = num => {
  return num.length > 1 || num > 9 ? num : '0' + num;
};

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
  console.log(timeArr);
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

// roundTime('5:0');
// 359 1439
console.log(getTimeCal('23:59'));

// timeArr를 돌면서 todos와 매칭하는것만 필터 후 요소로 i를 주고 스케줄[i]에innerHtml 한다. 
const renderSche = () => {
  const timeArr = mkTimeArr();
  const scheArr = [...$scheduleList];

  todos.filter(todo => {
    const timeLimit = getTimeCal(todo.startTime);
    if (timeLimit < 360 || timeLimit > 1439) return;
    // console.log('i', timeArr.findIndex(time => time === todo.startTime));
    const i = timeArr.findIndex(time => time === roundTime(todo.startTime));

    // console.log('calc', todo.goalTime[2]);
    // console.log('calc', (todo.goalTime[2] % 3));
    // console.log('calc', (todo.goalTime[2] % 3) * 10);
    // <div class="todo ${todo.color}" style="height: ${getTimeCal(todo.goalTime) - 1}px; top: ${(todo.goalTime[2] % 3) * 10}px;">
    scheArr[i].innerHTML = `
      <div class="todo ${todo.color}" style="height: ${getTimeCal(todo.goalTime) + 1}px; top: ${((todo.startTime[3] % 3) * 10) - 1}px;">
        <h4>${getGoalContent(todo.goal)}</h4>
        <p>${todo.content}</p>
      </div>`;
  });
};

const getToday = _todos => {
  todos = _todos.filter(todo => {
    const today = new Date();
    const month = today.getMonth() + 1 > 9 ? today.getMonth() + 1 : `0${today.getMonth() + 1}`;
    return todo.date === `${today.getFullYear()}-${month}-${today.getDate()}`; // --
  });
};

const getData = async () => {
  try {
    goals = await fetch('/goals').then(res => res.json());

    todos = await fetch('/todos').then(res => res.json());
    getToday(todos);
    // console.log('getTodos', todos);
    renderSche();
  } catch (e) {
    console.error('Error:', e);
  }
};

window.onload = getData;