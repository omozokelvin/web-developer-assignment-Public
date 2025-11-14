import { AxiosRequestConfig } from 'axios';

export interface HttpErrorResponse {
  readonly message: string;
}

export interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  noErrorMessage?: boolean;
}

export interface ExtendedColumnDef<TData> {
  header: string;
  key: keyof TData;
  cell: (row: TData) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}
