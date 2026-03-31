export interface Message {
  id: string;
  title: string;
  preview: string;
  date: string; // ISO date string
  iconColor: string; // hex colour for the icon background
  iconKey: "alert" | "bank" | "paypal" | "person" | "withdraw";
}

export interface ThreadMessage {
  id: string;
  text: string;
  type: "received" | "sent";
  date: string; // ISO date string
}

export interface MessageThread {
  id: string;
  title: string;
  messages: ThreadMessage[];
}
