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
