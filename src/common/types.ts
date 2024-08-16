export const UserTypeValues = ["student", "teacher", "admin"] as const;
export type UserType = (typeof UserTypeValues)[number];
export const GenderValues = ["M", "F"] as const;
export type Gender = (typeof GenderValues)[number];

export const GradeValues = [1, 2, 3] as const;
export type Grade = (typeof GradeValues)[number];
export const ClassValues = [1, 2, 3, 4, 5, 6] as const;
export type Class = (typeof ClassValues)[number];

export const LoginTypeValues = ["dimigo", "password"] as const;
export type LoginType = (typeof LoginTypeValues)[number];

export const RateLimitTypeValues = ["YoutubeSearch"] as const;
export type RateLimitType = (typeof RateLimitTypeValues)[number];

export const MachineTypeValues = ["washer", "dryer"] as const;
export type MachineType = (typeof MachineTypeValues)[number];

export const DormitoryFloorValues = [1, 2, 3, 4, 5] as const;
export type DormitoryFloor = (typeof DormitoryFloorValues)[number];

export const DormitoryMachinePosValues = ["L", "M", "R", "D"] as const;
export type DormitoryMachinePos = (typeof DormitoryMachinePosValues)[number];

export const StayScheduleDayUnitValues = ["weekday", "date"] as const;
export type StayScheduleDayUnit = (typeof StayScheduleDayUnitValues)[number];

export const WeekdayValues = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
] as const;
export type Weekday = (typeof WeekdayValues)[number];

export const StayAtTypeValues = ["studyroom", "class", "others"] as const;
export type StayAtType = (typeof StayAtTypeValues)[number];

export const MealScheduleValues = ["breakfast", "launch", "dinner"] as const;
export type MealSchedule = (typeof MealScheduleValues)[number];

export type StaySchedule = {
  name: string;
  from: string;
  to: string;
  stayPos: StayAtType;
  preset: string;
};
