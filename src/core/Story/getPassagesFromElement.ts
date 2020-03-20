import Passage from "../Passage";

export default function getPassagesFromElement(dataEl: HTMLElement, offset: number = 0) {
  let rVal: { [id: number]: Passage } = {};

  for (let i = 0; i < dataEl.children.length; i++) {
    var child = dataEl.children.item(i);
    if (!child) {
      continue;
    }
    if (child.nodeName === 'TW-PASSAGEDATA') {
      const id = parseInt(child.getAttribute('pid')!) + offset;
      const name = child.getAttribute('name')!;
      const tags = child.getAttribute('tags');

      let source = child.innerHTML.replace('\r', '').split('\n');

      if (source.length > 0){
        let minIndent: number = Number.MAX_VALUE;

        let trimmedSource = source.map((line: string) => {
          const trimmedLine = line.trimStart();
          const indent = line.length - trimmedLine.length;

          if (indent < minIndent){
            minIndent = indent;
          }

          return {
            line: trimmedLine,
            indent: indent
          }
        });

        source = trimmedSource.map(({line, indent}) => {
          const newIndent = (indent - minIndent);
          if (newIndent){
            return line.padStart(newIndent + line.length);
          }else{
            return line;
          }
        });
      }

      rVal[id] = {
        id: id + offset,
        name,
        tags: tags ? tags.split(' ') : [],
        source: source.join('\n'),
      };
    };
  }

  return rVal;
}