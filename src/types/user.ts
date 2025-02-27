export interface User {
  username: string;
  email: string;
  groups: string[];
  url: string; // it is the url to the user record, so the last part is the id;
}
