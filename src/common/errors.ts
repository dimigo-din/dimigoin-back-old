import { HttpException, HttpStatus } from "@nestjs/common";

export const AuthError = {
  LoginInfoUnavailable: "Auth_DB: 로그인 정보를 불러올 수 없습니다.",
  UserNotFound: "Auth_DB: 사용자 정보를 찾을 수 없습니다.",
  StudentNotFound: "Auth_DB: 학생 정보를 찾울 수 없습니다.",

  ForbiddenAuthType: "Auth_InValid: 허용되지 않은 인증 방식입니다.",
  ForbiddenUserType: "Auth_InValid: 허용되지 않은 유저 타입입니다.",
  PasswordMismatch: "Auth_InValid: 비밀번호가 일치하지 않습니다.",
  NoRefreshToken: "Auth_InValid: 리프레시 토큰이 아닙니다.",

  PermissionDenied: "Auth_Permission: 권한이 부족합니다.",

  CannotGetGoogleIdToken:
    "Auth_Google: 구글 토큰에서 id_token을 가져올 수 없습니다.",
  CannotGetGooglePayload:
    "Auth_Google: 구글 토큰에서 payload를 가져올 수 없습니다.",
};

export const UserManageError = {
  LoginInfoUnavailable: "UserManage_L-DB: 로그인 정보를 불러올 수 없습니다.",
  UserNotFound: "UserManage_U-DB: 사용자 정보를 불러올 수 없습니다.",
};

export const MusicError = {
  InvalidVideoId:
    "Music_VideoIdInvalid: 잘못된 형식의 유튜브 비디오 아이디를 제출하였습니다.",

  AlreadyApplied: "Music_AlreadyApplied: 이미 해당 기상송이 신청되었습니다.",

  AlreadyVoted:
    "Music_AlreadyVoted: 사용자가 이미 해당 기상송을 투표하였습니다.",
  DailyVoteLimitExceeded:
    "Music_DailyApplyLimitExceeded: 하루 최대 가능한 기상송 등록 건수에 도달하였습니다.",
};

export const MusicManageError = {
  InvalidVideoId:
    "MusicManage_VideoIdInvalid: 잘못된 형식의 유튜브 비디오 아이디를 제출하였습니다.",

  AlreadyApplied:
    "MusicManage_AlreadyApplied: 이미 해당 기상송이 신청되었습니다.",

  NotApplied: "MusicManage_NotApplied: 신청되지 않은 기상송입니다.",
};

export const RateLimitError = {
  RateLimitExceeded:
    "RateLimit_TooManyRequest: 짧은 시간에 너무 많은 요청이 수신되었습니다.",
};

export const LaundryError = {
  UserNotFound: "Laundry: 해당 유저를 찾을 수 없습니다.",
  MachineNotFound: "Laundry: 해당 세탁 기기를 찾을 수 없습니다.",
  TimeNotFound: "Laundry: 해당 세탁 시간을 찾을 수 없습니다.",
  ApplyNotFound: "Laundry: 해당 세탁 신청을 찾을 수 없습니다.",
};

export const LaundryManageError = {
  InvalidGender: "LaundryManage: 올바르지 않은 성별입니다.",
  InvalidFloor: "LaundryManage: 허용되지 않은 기숙사 층계입니다.",
  InvalidPos: "LaundryManage: 허용되지 않은 기기 위치입니다.",
  InvalidMachine: "LaundryManage: 허용되지 않은 기기 종류입니다.",
  InvalidGrade: "LaundryManage: 올바르지 않은 학년 값입니다.",

  MachineNotFound: "LaundryManage: 존재하지 않는 기기입니다.",

  InvalidTimeFormat: "LaundryManage: 올바르지 않은 시간 형식입니다.",
  InvalidWeekdayFormat: "LaundryManage: 올바르지 않은 요일 형식입니다.",

  TimeNotFound: "LaundryManage: 존재하지 않는 시간표입니다.",
};

/**
 *  @param { Object } base - Error bases
 *  @param { Error } error - Error message
 *  @param { HttpStatus } type - Http response code
 */
export const ErrorHandler = (base: object, error: Error, type: HttpStatus) => {
  if (Object.values(base).includes(error.message)) {
    throw new HttpException(error.message, type);
  }
};
