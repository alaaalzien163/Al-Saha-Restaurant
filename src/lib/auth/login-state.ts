export type LoginFieldErrors = {
  email?: string;
  password?: string;
};

export type LoginState = {
  status: "idle" | "error";
  /** Form-level error (e.g. invalid credentials). */
  message: string | null;
  /** Per-field validation errors. */
  fieldErrors: LoginFieldErrors;
};

export const INITIAL_LOGIN_STATE: LoginState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};
