import Passage from '../Passage';

export default function getPassagesFromElement(dataEl: HTMLElement, offset: number = 0) {
  const rVal: { [name: string]: Passage } = {};

  for (let i = 0; i < dataEl.children.length; i += 1) {
    const child = dataEl.children.item(i);
    if (child && (child.nodeName === 'TW-PASSAGEDATA')) {
      const id = parseInt(child.getAttribute('pid')!, 10) + offset;
      const name = child.getAttribute('name')!;
      const tags = child.getAttribute('tags');

      let source = child.innerHTML.replace('\r', '').split('\n');

      if (source.length > 0) {
        let minIndent: number = Number.MAX_VALUE;

        const trimmedSource = source.map((line: string) => {
          const trimmedLine = line.trimStart();
          const indent = line.length - trimmedLine.length;

          if (indent < minIndent) {
            minIndent = indent;
          }

          return {
            line: trimmedLine,
            indent,
          };
        });

        source = trimmedSource.map(({ line, indent }) => {
          const newIndent = (indent - minIndent);
          if (newIndent) {
            return line.padStart(newIndent + line.length);
          }
          return line;
        });
      }

      rVal[name] = {
        id: id + offset,
        name,
        tags: tags ? tags.split(' ') : [],
        source: source.join('\n'),
      };
    }
  }

  return rVal;
}
