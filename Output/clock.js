// 定义 Clock 类
class Clock {
    constructor() {
      this.startTime = null;
      this.running = false;
    }
  
    // 启动时钟
    start() {
      if (!this.running) {
        this.startTime = Date.now();
        this.running = true;
        console.log('Clock started.');
      } else {
        console.log('Clock is already running.');
      }
    }
  
    // 停止时钟并返回经过的时间（秒）
    stop() {
      if (this.running) {
        const elapsedTime = (Date.now() - this.startTime) / 1000; // 将毫秒转换为秒
        this.running = false;
        console.log('Clock stopped.');
        return elapsedTime;
      } else {
        console.log('Clock is not running.');
        return 0;
      }
    }
  }
  
  // 导出 Clock 类
  module.exports = Clock;
  