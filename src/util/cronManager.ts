import cron, { ScheduledTask, ScheduleOptions } from "node-cron";
import { UserToken } from "../model";
import { Op } from "sequelize";
interface Task {
  name: string;
  task: ScheduledTask;
}

interface HashedTask {
  [k: string]: ScheduledTask;
}

const tasks: Task[] = [];

const hashedTasks = () => {
  return tasks.reduce((map, obj) => {
    map[obj.name] = obj.task;
    return map;
  }, {}) as HashedTask;
};

const add = (
  taskName: string,
  cronExpression: string,
  func: () => void,
  options?: ScheduleOptions,
) => {
  options = options || {};
  options.timezone = "Asia/Seoul";
  tasks.push({
    name: taskName,
    task: cron.schedule(cronExpression, func, options),
  });
};

const stop = (taskName?: string) => {
  if (taskName) {
    hashedTasks()[taskName].stop();
  } else {
    tasks.map((t) => t.task.stop());
  }
};

const start = (taskName?: string) => {
  if (taskName) {
    hashedTasks()[taskName].start();
  } else {
    tasks.map((t) => t.task.start());
  }
};

// second minute hour day-of-month month day-of-week
add("clear expired token", "00 00 */4 * *", async () => {
  await UserToken.destroy({
    where: {
      refreshExpiredIn: {
        [Op.lte]: new Date(),
      },
    },
    benchmark: process.env.NODE_ENV !== "production",
  });
});

export const cronManager = {
  add,
  start,
  stop,
};

export default cronManager;
