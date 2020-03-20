
const ONCLICK_PREFIX = "onclick:";
const ONCLICK_LEN = ONCLICK_PREFIX.length;

export default function handleLink(href: string){
  if (href.startsWith("onclick:")){
    // eslint-disable-next-line no-eval
    eval(href.substr(ONCLICK_LEN));
  } else {
    window.engine.show(href);
  }
}