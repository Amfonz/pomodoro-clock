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
  //store time in seconds internally but get it in minutes
  constructor(time_in_minutes){
    set_time(time_in_minutes);
  }
  start() {
    setInterval(this.decrement_time,1000);//every second
  }
  decrement_time(){
    this.time--;
  }

  set_time(time_in_minutes){
    this.time = time_in_minutes * 60;
  }

}



function pause(){
  let now = new Date;
  let difference = now - start;
  let restart_delay = 100 - Math.floor((difference/1000) % 1 * 100);
  //convert difference to seconds and get the decimal portion
  //subtract by 100 to get how many milliseconds were left before next second
}

