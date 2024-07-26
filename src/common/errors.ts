export const AuthError = {
  LoginInfoUnavailable: "Auth_DB: 로그인 정보를 불러올 수 없습니다.",
  UserNotFound: "Auth_DB: 사용자 정보를 찾을 수 없습니다.",
  StudentNotFound: "Auth_DB: 학생 정보를 찾울 수 없습니다.",

  ForbiddenUserType: "Auth_InValid: 허용되지 않은 유저 타입입니다.",
  PasswordMismatch: "Auth_InValid: 비밀번호가 일치하지 않습니다.",

  CannotGetGoogleIdToken:
    "Auth_Google: 구글 토큰에서 id_token을 가져올 수 없습니다.",
  CannotGetGooglePayload:
    "Auth_Google: 구글 토큰에서 payload를 가져올 수 없습니다.",
};

export const UserManageError = {
  UserNotFound: "UserManage_DB: 사용자 정보를 불러올 수 없습니다.",
};
