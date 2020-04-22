// common.js
// Dom 
const $btnAddTodo = document.querySelector('.btnAddTodo');
// popup
// 할일 추가
const $addTodos = document.querySelector('.addTodos');
const $addTodoGoal = $addTodos.querySelector('.category #categorySelect');
const $addTodoCont = $addTodos.querySelector('.todoInput #todoContent');
const $addTodoImp = $addTodos.querySelector('.impSelect');
// const $addTodoDate = { start: }

// 함수 /////////////////////////////////////////////////////////////////
// popup
// popup 여는 함수
const openPopup = target => {
  target.classList.add('active');
};
// popup 닫는 함수
const closePopup = target => {
  target.classList.remove('active');
};
// popup 이벤트 함수
const popup = (target, $popup, doCallback, cancelCallback) => {
  if (!target.matches('button')) return;
  if (target.matches('.btnCancel') || target.matches('.btnClosed')) {
    if (cancelCallback) cancelCallback();
    closePopup($popup);
  } else {
    doCallback();
    closePopup($popup);
  }
};

// 통신
// 할일 추가 함수


// 이벤트 핸들러 ////////////////////////////////////////////////////////
// 버튼
// 할일 추가 버튼 클릭 이벤트
$btnAddTodo.onclick = () => {
  openPopup($addTodos);
};

// popup
// 할일 추가 popup 클릭 이벤트
$addTodos.onclick = ({ target }) => {
  if (target.matches('#test')) return;
  popup(target, $addTodos, () => {
    console.log('할일 추가 이벤트');
  });
};
export {
  openPopup,
  closePopup,
  popup
};