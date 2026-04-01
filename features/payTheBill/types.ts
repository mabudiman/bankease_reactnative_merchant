export type BillCategory = "electric" | "water" | "mobile" | "internet";

export type Provider = {
  id: string;
  name: string;
};

export type InternetBillDetail = {
  customerId: string;
  name: string;
  address: string;
  phoneNumber: string;
  code: string;
  from: string;
  to: string;
  internetFee: string;
  tax: string;
  total: string;
};
