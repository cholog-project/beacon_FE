export interface Task {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  teamMemberId: number;
}

export interface Tasks{
  tasks:Task[];
}
