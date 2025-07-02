export interface Order {
  _id: string;
  courseId: string;
  userId: string;
  payment_info: Payment;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  status: string;
}
