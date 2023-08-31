// @ts-nocheck
/**
 * WorkerPool, T is is post message type, U is return type.
 */
export class WorkerPool<T = any, U = any> {
  private _taskQueue: TaskItem<T, U>[] = [];
  private _workerStatus = 0;
  private _workerItems: WorkerItem<U>[];

  /**
   * Constructor of WorkerPool.
   * @param limitedCount - worker limit count
   * @param _workerCreator - creator of worker
   */
  constructor(public readonly limitedCount = 4, private readonly _workerCreator: () => Worker | Promise<Worker>) {
    this._workerItems = new Array<WorkerItem<U>>(limitedCount);
  }

  prepareWorker() {
    const count = this.limitedCount;
    const promises = new Array<Promise<Worker>>(count);
    for (let i = 0; i < count; i++) {
      promises.push(this._initWorker(i));
    }
    return Promise.all(promises);
  }

  /**
   * Post message to worker.
   * @param message - message which posted to worker
   * @returns return a promise of message
   */
  postMessage(message: T): Promise<U> {
    return new Promise((resolve, reject) => {
      const workerId = this._getIdleWorkerId();
      this._workerStatus |= 1 << workerId;
      if (workerId !== -1) {
        const workerItems = this._workerItems;
        Promise.resolve(workerItems[workerId] ?? this._initWorker(workerId)).then(() => {
          const workerItem = workerItems[workerId];
          workerItem.resolve = resolve;
          workerItem.reject = reject;
          workerItem.worker.postMessage(message);
        });
      } else {
        this._taskQueue.push({ resolve, reject, message });
      }
    });
  }

  /**
   * Destroy the worker pool.
   */
  destroy(): void {
    const workerItems = this._workerItems;
    for (let i = 0, n = workerItems.length; i < n; i++) {
      const workerItem = workerItems[i];
      workerItem.worker.terminate();
      workerItem.reject = null;
      workerItem.resolve = null;
    }
    workerItems.length = 0;
    this._taskQueue.length = 0;
    this._workerStatus = 0;
  }

  private _initWorker(workerId: number): Promise<Worker> {
    return Promise.resolve(this._workerCreator()).then((worker) => {
      worker.addEventListener("message", this._onMessage.bind(this, workerId));
      this._workerItems[workerId] = { worker, resolve: null, reject: null };
      return worker;
    });
  }

  private _getIdleWorkerId() {
    for (let i = 0, count = this.limitedCount; i < count; i++) {
      if (!(this._workerStatus & (1 << i))) return i;
    }
    return -1;
  }

  private _onMessage(workerId: number, msg: U) {
    if (msg.data.error) {
      this._workerItems[workerId].reject(msg.data.error);
    } else {
      this._workerItems[workerId].resolve(msg);
    }
    this._nextTask(workerId);
  }

  private _nextTask(workerId: number) {
    if (this._taskQueue.length) {
      const taskItem = this._taskQueue.shift() as TaskItem<T, U>;
      const workerItem = this._workerItems[workerId];
      workerItem.resolve = taskItem.resolve;
      workerItem.reject = taskItem.reject;
      workerItem.worker.postMessage(taskItem.message);
    } else {
      this._workerStatus ^= 1 << workerId;
    }
  }
}

interface WorkerItem<U> {
  worker: Worker;
  resolve: (item: U | PromiseLike<U>) => void;
  reject: (reason?: any) => void;
}

interface TaskItem<T, U> {
  message: T;
  transfer?: Array<Transferable>;
  resolve: (item: U | PromiseLike<U>) => void;
  reject: (reason?: any) => void;
}
