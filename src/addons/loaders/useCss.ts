
export const CSS_TAGS = /^(css|style)$/i;

export default function useCss() {
  window.events.storyLoaded.on((story) => {
    story.sortedPassages.forEach((psg) => {
      if (psg.tags && psg.tags.some((t) => t.match(CSS_TAGS))) {
        story.userStyles.push(psg.source);
      }
    });
  });
}
