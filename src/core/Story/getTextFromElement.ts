
export default function getTextFromElement(dataEl: HTMLElement, tagName: string): string[] {
  const rVal: string[] = [];

  const styles = dataEl.getElementsByTagName(tagName);
  for (let j = 0; j < styles.length; j += 1) {
    rVal.push(styles.item(j)!.innerHTML);
  }

  return rVal;
}
