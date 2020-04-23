const date = new Date();

const time1 = 36000;
const time2 = 72000;
const time3 = 36000;

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
console.log(secondsToHours(time1), secondsToHours(time2), secondsToHours(time3));
console.log(secondsToHours(time1 + time2 + time3));
const avg = parseInt((time1 + time2 + time3) / 3, 10);
console.log(avg);
console.log(secondsToHours(avg));