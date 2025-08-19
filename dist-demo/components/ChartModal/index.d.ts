import { DataTableColumn } from '../../types';

interface ChartModalProps<T = any> {
    isOpen: boolean;
    onClose: () => void;
    data: T[];
    columns: DataTableColumn<T>[];
    title?: string;
}
declare const ChartModal: <T extends Record<string, any>>({ isOpen, onClose, data, columns, title }: ChartModalProps<T>) => import("react/jsx-runtime").JSX.Element | null;
export default ChartModal;
//# sourceMappingURL=index.d.ts.map