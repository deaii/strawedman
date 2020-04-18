import React from 'react';
import EngineComponent from '../../core/EngineComponent';
import StoryData from '../../core/StoryData';

export default function useSegment(
  id: string,
  tagMatch: RegExp,
  className: string,
): EngineComponent {
  let markdown: string | null = null;

  window.events.storyLoaded.on((story) => {
    story.sortedPassages.forEach((passage) => {
      if (passage.tags && passage.tags.some((tag) => !!tag.match(tagMatch))) {
        markdown = passage.source;
        return false;
      }
      return true;
    });
  });

  const fc = ({
    state,
  }: StoryData) => {
    if (markdown) {
      const html = window.engine.process(markdown, state);

      return (
        <div
          id={id}
          className={className}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }

    return <></>;
  };

  return {
    FC: fc,
    name: id,
  };
}
