/*
 
*/
class Timer {
  /*
    vars
    start -- Date
    pause -- Date
    restart -- delay
    duration: time -- never will be set 0
  
  */
  constructor(duration_in_mins){
    //duration stored in millis 
    this.duration = duration_in_mins * 60000;
    this.start_time = 0;
    this.running = false;
  }
 
  start(){
    this.running = true;
    if(!this.start_time){
      this.start_time = Date.now();
      this.end_time = this.start_time + this.duration;
      this.display_formatted_time(this.end_time - this.start_time);
    }
    this.interval = setTimeout(this.increment_time.bind(this),100);
  }
  increment_time(){
    this.start_time += 100;
    let difference = this.end_time-this.start_time;
    this.display_formatted_time(this.end_time-this.start_time);
    if(!difference){ this.end(); return; }
    this.interval = setTimeout(this.increment_time.bind(this),100);
  }
  
  pause() {
    clearInterval(this.interval);
    this.running = false;
  }
  end(){
    this.pause();
    this.start_time = 0;
    if(mode == 'work'){
      change_mode('short',short_break_duration);
      timer.start();
    }else{
      change_mode('work',work_duration);
      timer.start();
    }

  }
  is_running(){
    return this.running;
  }
  display_formatted_time(difference=this.duration) {
    let difference_in_seconds = difference/1000;
    let minutes = Math.floor(difference_in_seconds / 60);
    let seconds = Math.ceil(difference_in_seconds % 60);
    //values like 24.59.999 supposed to render as 25:00  (not 24:60 ) need to be rounded up to 60 (hence ceiling and if )
    if(seconds == 60){ seconds = "0"; minutes++;}
    
    document.querySelector('#time').textContent = `${minutes}:${seconds < 10  ? seconds = `0${seconds}` : seconds}`;

    return `${minutes}:${seconds}`;

  }
  
}
let work_duration = document.querySelector('#work-duration');
let short_break_duration = document.querySelector('#break-duration');
let long_break_duration = document.querySelector('#long-break-duration');


var timer = new Timer(parseInt(work_duration.value));
var mode = "work";



document.querySelector('#work').addEventListener('click',(e)=>{
  change_mode('work',work_duration);
});
document.querySelector('#short-break').addEventListener('click',(e)=>{
  change_mode('short',short_break_duration);
});
document.querySelector('#long-break').addEventListener('click',(e)=>{
  change_mode('long',long_break_duration);
});

function change_mode(new_mode,new_time){
  timer.pause();
  mode = new_mode;
  if(!new_time.value || new_time.value == 0) new_time.value = 1;
  timer = new Timer(parseInt(new_time.value));
  timer.display_formatted_time();
}

document.querySelector('#start').addEventListener('click',(e)=>{
  if(!timer.is_running()) timer.start();
});
document.querySelector('#pause').addEventListener('click',()=>{
  if (timer.is_running()) timer.pause();

});
document.querySelector('#reset').addEventListener('click',()=>{
  timer.pause();
  change_mode(mode,get_time_field_matches_mode());
  timer.display_formatted_time();
});



function get_time_field_matches_mode(){
  switch(mode){
    case 'work':
      return work_duration;
    case 'short':
      return short_break_duration;
    case 'long':
      return long_break_duration;
  }
}


/***  time input field control button handlers */
/*
replace these with two loops one collect all increments the other decrements
use datafield to call appropriate funcitons




*/
document.querySelectorAll('.increment').forEach(button => {
  button.addEventListener('click',(e)=>{
    let field;
    switch(button.dataset.change){
      case 'work':
        field = document.querySelector('#work-duration');
        field.value = parseInt(field.value)+1;
        break;
      case 'break':
        field = document.querySelector('#break-duration');
        field.value = parseInt(field.value)+1;
        break;
      case 'long-break':
        field = document.querySelector('#long-break-duration');
        field.value = parseInt(field.value)+1;
        break;
    }
  });
});
document.querySelectorAll('.decrement').forEach(button => {
  button.addEventListener('click',(e)=>{
    let field;
    switch(button.dataset.change){
      case 'work':
        field = document.querySelector('#work-duration');
        field.value = decrement_input_field(parseInt(field.value));
        break;
      case 'break':
        field = document.querySelector('#break-duration');
        field.value = decrement_input_field(parseInt(field.value));
        break;
      case 'long-break':
        field = document.querySelector('#long-break-duration');
        field.value = decrement_input_field(parseInt(field.value));
        break;
    }
  });
});
function decrement_input_field(value){
  return value == 1 ? 1 : value - 1;
}



/*         time input field handlers                   */
document.querySelectorAll('.time-field').forEach(field=>{
  onkeypress = (e)=>{
    let key = e.key.toUpperCase();
    if(isNaN(key) || (key == 0 && e.target.value == '')){
         return false;
    }
  }});





function init(){
  timer.display_formatted_time();
}
init();