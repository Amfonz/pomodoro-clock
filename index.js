/*
  Logic: take date when user hits start
  every second decrement time
  if pause ...
    take another date and subtract the second from the first
    pause clock (clear interval)
  on Resume
    set timeout(difference).. decrement
    then set interval (for seconds)

*/
class Timer {
  /*
    vars
    start -- Date
    pause -- Date
    restart -- delay
    time -- int (seconds)
  
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

  }
  is_running(){
    return this.running;
  }
  display_formatted_time(difference) {
    let difference_in_seconds = difference/1000;
    let minutes = Math.floor(difference_in_seconds / 60);
    let seconds = Math.ceil(difference_in_seconds % 60);
    //values like 59.999 supposed to render as xx:00 need to be rounded up to 60
    if(seconds == 60){ seconds = "0"; minutes++;}
    
    document.querySelector('#time').textContent = `${minutes}:${seconds < 10  ? seconds = `0${seconds}` : seconds}`;

    return `${minutes}:${seconds}`;

  }
  
}
var timer = new Timer(.1);
document.querySelector('#time').textContent = timer.display_formatted_time(timer.duration);


document.querySelector('#start').addEventListener('click',(e)=>{
  if(!timer.is_running()) timer.start();
});
document.querySelector('#pause').addEventListener('click',()=>{
  if (timer.is_running()) timer.pause();

});


