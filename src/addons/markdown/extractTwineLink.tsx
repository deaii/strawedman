interface TwineLink {
  display: string;
  target: string;
}

export default function extractTwineLink(text: string): TwineLink {
  let target = text;
  let display = text;
  const barIndex = text.indexOf('|');
  const rightArrIndex = barIndex < 0 ? target.indexOf('->') : -1;
  const leftArrIndex = rightArrIndex < 0 ? target.indexOf('<-') : -1;
  if (barIndex !== -1) {
    // [[display|target]] format
    display = text.substr(0, barIndex);
    target = text.substr(barIndex + 1);
  } else if (rightArrIndex !== -1) {
    // [[text->target]] format
    display = target.substr(0, rightArrIndex);
    target = target.substr(rightArrIndex + 2);
  } else if (leftArrIndex !== -1) {
    // [[target<-display]] format
    display = target.substr(leftArrIndex + 2);
    target = target.substr(0, leftArrIndex);
  }
  return { display, target };
}
