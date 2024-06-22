type TableProps<T> = {
  title: string;
  rows: T[];
  count: number;
  simplified?: boolean;
  children?: React.ReactNode;
  viewOnly?: {
    setRows: React.Dispatch<React.SetStateAction<T[]>>;
  };
  type?: OperationType;
  topContent?: React.ReactNode;
};
