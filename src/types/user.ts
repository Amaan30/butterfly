export interface User {
  _id: string;
  username: string;
  email: string;
  name: string,
  profilePicture?: string;
  bio?: string;
  followers?: string[];
  following?: string[];
}
export interface PublicUserInfo {
  _id: string;
  username: string;
  profilePicture?: string;
}
export interface FollowInfoResponse {
  _id: string;
  followers: PublicUserInfo[];
  following: PublicUserInfo[];
}