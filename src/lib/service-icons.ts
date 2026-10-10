// Iconos Tabler de cada servicio (clave = `icon` en src/data/site.ts). Los usan la home y /services.
import FileSearch from '@tabler/icons/outline/file-search.svg';
import BuildingEstate from '@tabler/icons/outline/building-estate.svg';
import Bulb from '@tabler/icons/outline/bulb.svg';
import Calculator from '@tabler/icons/outline/calculator.svg';
import FileInvoice from '@tabler/icons/outline/file-invoice.svg';
import ReportAnalytics from '@tabler/icons/outline/report-analytics.svg';
import ReportMoney from '@tabler/icons/outline/report-money.svg';
import ClipboardCheck from '@tabler/icons/outline/clipboard-check.svg';
import Folders from '@tabler/icons/outline/folders.svg';

export const serviceIcons: Record<string, typeof FileSearch> = {
  'file-search': FileSearch,
  'building-estate': BuildingEstate,
  bulb: Bulb,
  calculator: Calculator,
  'file-invoice': FileInvoice,
  'report-analytics': ReportAnalytics,
  'report-money': ReportMoney,
  'clipboard-check': ClipboardCheck,
  folders: Folders,
};
