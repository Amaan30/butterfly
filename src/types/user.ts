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

export interface PostSchema {
  _id: string;
  title: string;
  video?: string;
  content: string;
  image?: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  likes: string[];
  //comments: Comment[];
}