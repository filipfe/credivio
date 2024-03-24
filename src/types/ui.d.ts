type TableProps<T> = {
  title: string;
  rows: T[];
  count: number;
  simplified?: boolean;
  children?: React.ReactNode;
  viewOnly?: {
    setRows: React.Dispatch<React.SetStateAction<T[]>>;
    onRowSelect: (id: string) => void;
  };
};
