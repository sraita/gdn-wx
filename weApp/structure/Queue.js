export default class Queue {
  constructor() {
    this.dataStore = [];
  }

  isEmpty() {
    if (this.dataStore.length == 0) return true;
    else return false;
  }

  // 向队列末尾添加一个元素，直接调用 push 方法即可
  enqueue(element) {
    this.dataStore.push(element);
  }
  // 删除队列首的元素
  dequeue() {
    if (this.isEmpty()) {
      return 'This queue is empty';
    }
    else {
      this.dataStore.shift();
    }
  }

  // 查看队首元素
  front() {
    if (this.empty()) return 'This queue is empty';
    else return this.dataStore[0];
  }
  // 读取队列尾的元素
  back() {
    if (this.empty()) return 'This queue is empty';
    else return this.dataStore[this.dataStore.length - 1];
  }

}