/** Registry layout: mỗi mẫu thiệp có thể dùng Cover + Header riêng. */
import { traditional } from './traditional';
import { floral } from './floral';
import { hoamoc } from './hoamoc';
import { laudai } from './laudai';
import { vanson } from './vanson';
import type { LayoutDef } from './types';

export type { CoverProps, HeaderProps, LayoutDef } from './types';

export const LAYOUTS: Record<string, LayoutDef> = {
  traditional,
  floral,
  hoamoc,
  laudai,
  vanson,
};
