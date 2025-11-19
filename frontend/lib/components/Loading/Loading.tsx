import { CSSProperties } from 'react';
import styles from './Loading.module.css';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '@/tailwind.config.js';

const fullConfig = resolveConfig(tailwindConfig);

export default function Loading({ style }: { style?: CSSProperties }) {
  return (
    <div
      className={styles['lds-ellipsis']}
      style={{
        color: (fullConfig as any)?.theme?.colors?.loading ?? undefined,
        ...style,
      }}
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

// bdb1c5
