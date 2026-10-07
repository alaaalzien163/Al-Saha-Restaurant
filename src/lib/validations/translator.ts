export type Translator = (
  key: string,
  values?: Record<string, string | number>,
) => string;

const EN_MESSAGES: Record<string, string> = {
  "field.nameRequired": "Name is required.",
  "field.nameTooLong": "Name must be {max} characters or fewer.",
  "field.descriptionTooLong": "Description must be {max} characters or fewer.",
  "field.displayOrderNotWhole": "Display order must be a whole number.",
  "field.displayOrderNegative": "Display order cannot be negative.",
  "item.categoryRequired": "Please choose a category.",
  "item.priceRequired": "Price is required.",
  "item.priceNotNumber": "Price must be a number.",
  "item.priceNegative": "Price cannot be negative.",
  "auth.emailRequired": "Email is required.",
  "auth.emailInvalid": "Enter a valid email address.",
  "auth.passwordRequired": "Password is required.",
  "profile.fullNameRequired": "Full name is required.",
  "profile.fullNameTooLong": "Full name must be {max} characters or fewer.",
  "profile.phoneTooLong": "Phone number is too long.",
  "profile.phoneInvalid": "Enter a valid phone number.",
  "password.currentRequired": "Enter your current password.",
  "password.newRequired": "Enter a new password.",
  "password.tooShort": "Password must be at least {min} characters.",
  "password.sameAsCurrent": "Choose a password different from your current one.",
  "password.confirmRequired": "Confirm your new password.",
  "password.mismatch": "Passwords do not match.",
  "image.typeInvalid": "Choose a JPEG, PNG, WebP, AVIF or GIF image.",
  "image.empty": "The selected image is empty.",
  "image.tooLarge": "Image must be 5 MB or smaller.",
  "actions.correctFields": "Please correct the highlighted fields.",
  "actions.categoryCreateFailed": "Could not create the category.",
  "actions.categoryUpdateFailed": "Could not update the category.",
  "actions.categoryStatusFailed": "Could not update the category status.",
  "actions.categoryDeleteFailed": "Could not delete the category.",
  "actions.categoryIdMissing": "Missing category id.",
  "actions.itemCreateFailed": "Could not create the item.",
  "actions.itemUpdateFailed": "Could not update the item.",
  "actions.itemLoadFailed": "Could not load the item.",
  "actions.itemNotFound": "This item no longer exists.",
  "actions.itemAvailabilityFailed": "Could not update the item availability.",
  "actions.itemDeleteFailed": "Could not delete the item.",
  "actions.itemIdMissing": "Missing item id.",
  "actions.imageUploadFailed": "Image upload failed. Please try again.",
  "actions.profileUpdateFailed": "Could not update your profile.",
  "actions.accountNoEmail": "Your account has no email on file.",
  "actions.currentPasswordIncorrect": "Your current password is incorrect.",
  "actions.incorrectPassword": "Incorrect password.",
  "actions.passwordUpdateFailed":
    "Could not update your password. It may not meet the security requirements.",
  "actions.passwordChangeUnavailable":
    "Password change is temporarily unavailable.",
  "actions.invalidCredentials": "Invalid email or password.",
  "actions.signInUnavailable":
    "Sign-in is temporarily unavailable. Please try again in a moment.",
};

const PLACEHOLDER_PATTERN = /\{(\w+)\}/g;

function interpolate(
  template: string,
  values?: Record<string, string | number>,
): string {
  if (!values) return template;
  return template.replace(PLACEHOLDER_PATTERN, (match, name: string) => {
    const value = values[name];
    return value === undefined ? match : String(value);
  });
}

export const defaultTranslator: Translator = (key, values) => {
  const template = EN_MESSAGES[key];
  if (template === undefined) return key;
  return interpolate(template, values);
};

export function resolveTranslator(t?: Translator): Translator {
  return t ?? defaultTranslator;
}
