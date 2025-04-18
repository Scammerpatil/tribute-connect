import { Tribute } from "./Tribute";

export interface User {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
  profileImage: string;
  isApproved?: boolean;
  isPremiumHolder?: boolean;
  followers: User[];
  following: User[];
  pinnedTribute: Tribute[];
}
