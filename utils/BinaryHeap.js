console.log("BinaryHeap.js loaded");

class BinaryHeap {
  constructor() {
    this.heap = [];
  }

  push(node, distance) {
    this.heap.push({ node, distance });
    this.bubbleUp(this.heap.length - 1);
    return Math.ceil(Math.log2(this.heap.length));
  }

  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return { item: this.heap.pop(), ops: 0 };

    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    const ops = this.bubbleDown(0);
    return { item: min, ops };
  }

  bubbleUp(index) {
    const element = this.heap[index];
    let ops = 0;
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      ops++;
      if (element.distance >= parent.distance) break;

      this.heap[index] = parent;
      this.heap[parentIndex] = element;
      index = parentIndex;
    }
    return ops;
  }

  bubbleDown(index) {
    const length = this.heap.length;
    const element = this.heap[index];
    let ops = 0;

    while (true) {
      let leftChildIndex = 2 * index + 1;
      let rightChildIndex = 2 * index + 2;
      let leftChild, rightChild;
      let swap = null;

      if (leftChildIndex < length) {
        leftChild = this.heap[leftChildIndex];
        ops++;
        if (leftChild.distance < element.distance) {
          swap = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        rightChild = this.heap[rightChildIndex];
        ops++;
        if (
          (swap === null && rightChild.distance < element.distance) ||
          (swap !== null && rightChild.distance < this.heap[swap].distance)
        ) {
          swap = rightChildIndex;
        }
      }

      if (swap === null) break;

      this.heap[index] = this.heap[swap];
      this.heap[swap] = element;
      index = swap;
    }
    return ops;
  }

  size() {
    return this.heap.length;
  }
}

export default BinaryHeap;