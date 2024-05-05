export type CurrentUser = { id: string; email: string } | null;

export type CurrentUserResponse = {
  currentUser: CurrentUser;
};
