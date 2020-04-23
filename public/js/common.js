// common.js
// 함수 /////////////////////////////////////////////////////////////////
// id 제너레이트
const generateId = target => Math.max(...target.map(ele => +ele.id)) + 1;

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
  if (target.matches('.btnCancel')) {
    if (cancelCallback) cancelCallback();
    closePopup($popup);
  } else {
    doCallback();
    // closePopup($popup);
  }
};

// export //////////////////////////////////////////////////////////////
export {
  generateId,
  openPopup,
  closePopup,
  popup
};