declare module '@theme-original/DocItem/Content' {
  import {type ComponentType} from 'react';
  import type {WrapperProps} from '@docusaurus/types';
  import type ContentType from '@theme/DocItem/Content';
  
  const Content: ComponentType<WrapperProps<typeof ContentType>>;
  export default Content;
}

declare module '@theme/DocItem/Content' {
  import {type ComponentType} from 'react';
  import type {WrapperProps} from '@docusaurus/types';
  
  const Content: ComponentType<WrapperProps<unknown>>;
  export default Content;
  export type ContentType = ComponentType<WrapperProps<unknown>>;
}
