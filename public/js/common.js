// common.js
// 알람창
const $alert = document.querySelector('.alert');
const $okAlert = $alert.querySelector('.btnOk');

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
// alert 여는 함수
const openAlert = text => {
  $alert.classList.add('active');
  $alert.style.paddingTop = `${64 - (13 * (parseInt(text.length / 14, 10)) + 2 * (parseInt(text.length / 14, 10) + 1))}px`;
  console.log(text.length);
  $alert.querySelector('p').textContent = text;
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


// 이벤트 핸들러 ////////////////////////////////////////////////////////
$okAlert.onclick = () => {
  $alert.querySelector('p').textContent = '';
  closePopup($alert);
};


// export //////////////////////////////////////////////////////////////
export {
  generateId,
  openPopup,
  closePopup,
  openAlert,
  popup
};