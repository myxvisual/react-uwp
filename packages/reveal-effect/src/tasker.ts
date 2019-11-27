class Task {
    id: string  = "";
    startTime?: number;
    isFinished: boolean = false;
    allCountTime: number = 0;
    yieldCbArr: Function[] = [];

    addYieldCb(yieldCb: Function) {
        this.yieldCbArr.push(yieldCb);
    }

    clearYieldCb() {
        this.yieldCbArr = [];
        this.isFinished = true;
    }

    next() {
        const yieldsLength = this.yieldCbArr.length;
        if (yieldsLength < 1 || this.isFinished) {
            return 0;
        } else {
            const currYield = this.yieldCbArr[0];
            this.yieldCbArr.splice(0, 1);
            this.isFinished = yieldsLength === 1;

            this.startTime = Date.now();
            currYield();
            const countTime = Date.now() - this.startTime;
            this.allCountTime += countTime;

            return countTime;
        }
    }
}

const tasks: Task[] = [];
let TASK_MAX_RUN_TIME = 16.67;
const MAX_COUNT_TIME = 500;

const fs = require("fs");
function addTasks() {
    const taskSize = 8;
    for (let i = 0; i < taskSize; i++) {
        const task = new Task();

        task.id = `task${i}`;
        for (let i = 0; i < 20; i++) {
            task.addYieldCb((z: number = i) => {
                // console.log(`${task.id} - ${z}`);
                for (let i = 0; i < (500 + Math.random() * 500); i++) {
                    fs.readFileSync("./package.json")
                }
            });
        }

        tasks.push(task);
    }
}
addTasks();

let isRunning = false;
let loopTimer: any = null;

function loopCheck() {
    clearTimeout(loopTimer);
    if (tasks.length > 0 || !isRunning) {
        runTasks();
        loopTimer = setTimeout(loopCheck, 16.7);
    } else {
        loopTimer = setTimeout(loopCheck, 16.7);
    }
}

function runTasks() {
    isRunning = true;
    const now = Date.now();
    for (const task of tasks) {
        while (!task.isFinished) {
            if (task.allCountTime >= MAX_COUNT_TIME) {
                task.yieldCbArr = [];
                task.isFinished = true;
            } else {
                const time = task.next();
                console.log(time, task.allCountTime);
            }
            
            // const time = task.next();
            // console.log(time, task.allCountTime);
        }
        continue;
    }
    isRunning = false;
    console.log(Date.now() - now);
}

loopCheck();

setTimeout(addTasks, 6000);