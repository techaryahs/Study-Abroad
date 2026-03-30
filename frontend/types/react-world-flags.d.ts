declare module 'react-world-flags' {
  import * as React from 'react';

  export interface FlagProps {
    code?: string;
    fallback?: React.ReactNode;
    [key: string]: any;
  }

  const Flag: React.FC<FlagProps>;
  export default Flag;
}
