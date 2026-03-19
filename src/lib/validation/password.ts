export const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

export const passwordRequirementsMessage =
  "Password must contain at least 1 uppercase letter, 1 number, 1 special character, and be at least 8 characters long.";

export const isPasswordComplex = (password: string): boolean =>
  passwordRegex.test(password);



