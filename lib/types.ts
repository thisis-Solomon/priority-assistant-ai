export type ActionableStep = {
  id: string;
  text: string;
  isCompleted: boolean;
};

export type Priority = {
  id: string;
  text: string;
  isCompleted: boolean;
  actionableSteps?: ActionableStep[];
};

export type RetrospectiveData = {
  achieved: string[]; // ids of priorities
  blockages: string;
  improvements: string;
  carryOver: string[]; // text of priorities to carry over
};

export type UserData = {
  role: string | null;
  priorities: Priority[];
  lastPrioritySetDate: string | null; // ISO string
  lastRetrospectiveDate: string | null; // ISO string
};
