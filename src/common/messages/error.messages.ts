export const ERROR = {
  EXCEPTION: {
    FORBIDDEN: 'Unauthorized',
    INSUFFICIENT_PERMISSIONS: 'Insufficient permissions to perform this action',
  },
  AUTH: {
    INVALID_TOKEN: 'Invalid token',
  },
  USER: {
    NAME_CRITERIA: 'Name does not meet criteria',
    EMAIL_CRITERIA: 'Email must be valid email address',
    PASSWORD_CRITERIA: 'Password does not meet criteria',
    ROLE_CRITERIA: 'Allowed roles are user and admin',
    USER_NOT_FOUND: 'User does not exists',
    INCORRECT_PASSWORD: 'Email or password is incorrect',
    NAME_TAKEN: 'User with this name already exists',
    EMAIL_TAKEN: 'User with this email already exists',
  },
  CATS: {
    IMAGE_REQUIRED: 'Image is required for upload',
    NOT_FOUND: 'Cat image does not exists',
    FILENAME_EXISTS: 'Filename already exists',
  },
};
