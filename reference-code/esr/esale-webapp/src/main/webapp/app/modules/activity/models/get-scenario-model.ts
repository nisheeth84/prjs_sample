/**
 * Define data structure for API get-scenario
 **/

type EmployeesType = {
  employeeId?: any;
  employeeName?: any;
  photoEmployeeImg?: any;
};
type TasksType = {
  taskId?: any;
  taskName?: any;
  memo?: string;
  employees?: EmployeesType[];
  operators?: any;
  startDate?: any;
  finishDate?: any;
  statusTaskId: number;
};
export type MilestonesType = {
  milestoneId: number;
  statusMilestoneId: number;
  milestoneName: string;
  finishDate: any;
  memo: string;
  tasks: TasksType[];
  isDone: number;
};

export type GetScenario = {
  milestones?: MilestonesType[];
};
