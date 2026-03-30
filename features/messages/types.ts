export interface Message {
  id: string;
  title: string;
  preview: string;
  date: string; // ISO date string
  iconColor: string; // hex colour for the icon background
  iconName: string; // Ionicons icon name
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
