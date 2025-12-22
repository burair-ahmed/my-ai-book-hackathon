import React, {type ReactNode} from 'react';
import Content from '@theme-original/DocItem/Content';
import type ContentType from '@theme/DocItem/Content';
import type {WrapperProps} from '@docusaurus/types';
import ChapterPersonalizer from '@site/src/components/Personalization/ChapterPersonalizer';
// @ts-ignore
import {useDoc} from '@docusaurus/plugin-content-docs/client';

type Props = WrapperProps<typeof ContentType>;

export default function ContentWrapper(props: Props): ReactNode {
  const {metadata} = useDoc();
  return (
    <>
      <ChapterPersonalizer chapterId={metadata.id} />
      <Content {...props} />
    </>
  );
}
