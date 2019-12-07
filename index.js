/*
 chime
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
      //first time around start_time is 0
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
    //pause with extra duties
    this.pause();
    this.start_time = 0;
    //poor separation here but this sets up the next clock to tick
    //break if we just worked or work if we just break and starts it ...
    play_chime_x_seconds(5);  

    if(mode == 'work'){
      change_mode('short',short_break_duration);
      color_mode_buttons(document.querySelector('#short-break'));;
      timer.start();
    }else{
      color_mode_buttons(document.querySelector('#work'));;
      change_mode('work',work_duration);
      timer.start();
    }

  }
  is_running(){
    return this.running;
  }
  display_formatted_time(difference=this.duration) {
    //if no parameter we are just asking for the display of the timer before running at all
    let difference_in_seconds = difference/1000;
    let minutes = Math.floor(difference_in_seconds / 60);
    let seconds = Math.ceil(difference_in_seconds % 60);
    //values like 24.59.999 supposed to render as 25:00  (not 24:60 ) need to be rounded up to 60 (hence ceiling and if )
    if(seconds == 60){ seconds = "0"; minutes++;}
    
    document.querySelector('#time').textContent = `${minutes}:${seconds < 10  ? seconds = `0${seconds}` : seconds}`;
  }
  
}
/* end timer class */

/* globals */
let work_duration = document.querySelector('#work-duration');
let short_break_duration = document.querySelector('#break-duration');
let long_break_duration = document.querySelector('#long-break-duration');


var timer = new Timer(parseInt(work_duration.value));
var mode = "work";

/* audio */

function play_chime_x_seconds(sec){
  let chime = document.querySelector('audio');
  chime.loop = true;
  chime.play();
  setTimeout(()=>{
    chime.loop = false;
  },sec*1000);
}



/*
  Mode change handlers and functions
*/
document.querySelector('#work').addEventListener('click',(e)=>{
  color_mode_buttons(e.target);
  change_mode('work',work_duration);
});
document.querySelector('#short-break').addEventListener('click',(e)=>{
  color_mode_buttons(e.target);
  change_mode('short',short_break_duration);
});
document.querySelector('#long-break').addEventListener('click',(e)=>{
  color_mode_buttons(e.target);
  change_mode('long',long_break_duration);
});
function color_mode_buttons(button){
  //color the mode buttons appropriately with button turned on
  let modes = document.querySelectorAll('.modes');
  modes.forEach(mode => {
    mode == button ? mode.classList.add('clicked') : mode.classList.remove('clicked');
  });
}

function change_mode(new_mode,new_time){
  //new time is technically the field that holds the time
  //pause current timer to (not end because we dont want all the extra stuff)
  timer.pause();
  mode = new_mode;
  if(!new_time.value || new_time.value == 0) new_time.value = 1;
  //can't have 0 or undefined time
  timer = new Timer(parseInt(new_time.value));
  timer.display_formatted_time();
  console.log(new_mode);
  new_mode == 'work' ? document.querySelector('#message').textContent = 'Work' : document.querySelector('#message').textContent = `${new_mode.slice(0,1).toUpperCase()}${new_mode.slice(1)} Break`;
}

/* timer stop start ... handlers */

document.querySelector('#start').addEventListener('click',(e)=>{
  if(!timer.is_running()) timer.start();
  // no double hits on start
});
document.querySelector('#pause').addEventListener('click',()=>{
  if (timer.is_running()) timer.pause();
  //prevents clearing an interval that doesn't exist

});
document.querySelector('#reset').addEventListener('click',()=>{
  //similar to manual change buttons but we change mode to the same mode
  //(b/c its a reset)
  timer.pause();
  change_mode(mode,get_time_field_matches_mode());
});



function get_time_field_matches_mode(){
  //for reset just returns the field containing the time value that 
  //corresponds to current mode
  switch(mode){
    case 'work':
      return work_duration;
    case 'short':
      return short_break_duration;
    case 'long':
      return long_break_duration;
  }
}


/*
Button Styling for buttons that blink on click

*/

document.querySelectorAll('.blink').forEach(button => {
  button.addEventListener('mousedown',()=>{
    button.classList.toggle('darker');
    button.classList.toggle('notClicked');
  });
  button.addEventListener('mouseup',()=>{
    button.classList.toggle('darker');
    button.classList.toggle('notClicked');
  });
});

/* time input increment and decrement */
document.querySelectorAll('.increment').forEach(button => {
  button.addEventListener('click',(e)=>{
    let field;
    switch(button.dataset.change){
      case 'work-duration':
        field = document.querySelector('#work-duration');
        field.value = parseInt(field.value)+1;
        break;
      case 'break-duration':
        field = document.querySelector('#break-duration');
        field.value = parseInt(field.value)+1;
        break;
      case 'long-break-duration':
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
      case 'work-duration':
        field = document.querySelector('#work-duration');
        field.value = decrement_input_field(parseInt(field.value));
        break;
      case 'break-duration':
        field = document.querySelector('#break-duration');
        field.value = decrement_input_field(parseInt(field.value));
        break;
      case 'long-break-duration':
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