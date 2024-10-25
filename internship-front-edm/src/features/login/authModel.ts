export interface LoginPayload {
    email: string;
    password: string;
}

export interface User {
    email: string;
    role: string;
}

export interface SetPasswordForm {
    email: string;
    token: string;
    password: string;
  }
