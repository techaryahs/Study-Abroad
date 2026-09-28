declare module 'react-world-flags' {
  import * as React from 'react';

  export interface FlagProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    code?: string;
    fallback?: React.ReactNode | null;
    width?: string | number;
    height?: string | number;
    [key: string]: unknown;
  }

  const Flag: React.FC<FlagProps>;
  export default Flag;
}
