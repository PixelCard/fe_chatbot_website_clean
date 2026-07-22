import { APP_ROUTES } from '@/app/config/routes';

export const CLIENT_THEME = {
  primaryOrange: '#FF7A00',
  background: '#FFFFFF',
  inputBackground: '#FFFFFF',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  mutedGrey: '#9CA3AF',
  errorRed: '#EF4444',
  idleBorder: '#D1D5DB',
};

export const CLIENT_NAV_ITEMS = [
  {
    label: 'Trang chủ',
    href: '/',
  },
  {
    label: 'Dịch vụ',
    href: '/#process',
  },
  {
    label: 'Lịch sử đơn',
    href: APP_ROUTES.CLIENT.ORDER_HISTORY,
  },
  {
    label: 'Trợ giúp',
    href: '/#assistant',
  },
];

export type ClientNavItem = (typeof CLIENT_NAV_ITEMS)[number];

export const HEADER_NAV_ITEMS = CLIENT_NAV_ITEMS;
