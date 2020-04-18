import renderAttrs from '../../renderers/renderAttrs';
import { HREF_ATTR } from '../../renderers/renderEjs';

export default function printLink(display: string, target: string, attributes?: string) {
  const attr = attributes ? renderAttrs(attributes) : '';
  return `<a href="javascript:void(0)" ${HREF_ATTR}="${encodeURI(target)}" ${attr}>${display}</a>`;
}
