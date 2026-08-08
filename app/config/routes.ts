export const APP_ROUTES = {
  HOME: "/",
  SERVICES: "/services",
  ORDER_HISTORY: "/orders/history",
  HELP: "/help",

  Auth: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    UPDATE_PROFILE: '/auth/update-profile',
  },

  CLIENT: {
    CHAT_BOT: "/chatbot",
    ORDER_HISTORY: "/orderhistory",
    CHATS: "/chats",
  },

  TECHNICIAN: {
    DASHBOARD: '/technician',
    Home: '/technician',
  },


  // Các trang của Admin
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    TECHNICIANS: '/admin/technicians',
    TECHNICAL_DOCUMENTS: '/admin/technical-documents',
  }

  //Các trang 
} as const;
