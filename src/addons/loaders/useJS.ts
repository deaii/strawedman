
export const JS_TAGS = /^(js|javascript)$/i;

export default function useJS() {
  window.events.storyLoaded.on((story) => {
    story.sortedPassages.forEach((psg) => {
      if (psg.tags && psg.tags.some((t) => t.match(JS_TAGS))) {
        story.userScripts.push(psg.source);
      }
    });
  });
}
