
export default function getTextFromElement(dataEl: HTMLElement, tagName: string): string[] {
  let rVal: string[] = [];

  let styles = dataEl.getElementsByTagName(tagName);
  for (let j = 0; j < styles.length; j++){
    rVal.push(styles.item(j)!.innerHTML);
  }

  return rVal;
}