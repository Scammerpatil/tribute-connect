export interface Tribute {
  _id?: string;
  name: string;
  description: string;
  dob: Date;
  dod: Date;
  user: User;
  image: string;
  supportingDocument: string;
  isAdminApproved?: boolean;
  likes?: {
    user: User;
  }[];
  comments?: {
    comment: string;
    user: User;
    timestamp: Date;
  }[];
  funding?: {
    user: User;
    amount: number;
    date: Date;
  }[];
}
