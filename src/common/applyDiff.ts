interface HTMLElementWithProps {
  [key: string]: any;
  checked?: boolean;
  value?: string;
  selected?: boolean;
  disabled?: boolean;
}
type DiffableNode = HTMLElement | ChildNode;

const updateDOM = (parent: DiffableNode, realNode: DiffableNode, virtualNode: DiffableNode) => {
  // updateDom
  // 1. 기존 node는 없고 새로운 node만 있다면 새로운 node를 추가한다.
  if (!realNode && virtualNode) {
    parent.appendChild(virtualNode);
    return;
  }
  // 2. 기존 node는 있고 새로운 node는 없다면 기존 node를 제거한다.
  if (realNode && !virtualNode) {
    parent.removeChild(realNode);
    return;
  }
  // 3. 기존 node와 새로운 node 모두 Text node이고 기존 node와 새로운 node의 textContent가 다르면 새로운 textContent로 교체한다.
  if (realNode.nodeType === Node.TEXT_NODE && virtualNode.nodeType === Node.TEXT_NODE) {
    if (realNode.textContent !== virtualNode.textContent) {
      realNode.textContent = virtualNode.textContent;
    }
  }

  // 4. 기존 node 또는 새로운 node가 comment node면 무시한다.
  if (realNode.nodeType === Node.COMMENT_NODE || virtualNode.nodeType === Node.COMMENT_NODE) {
    return;
  }

  // 5. Element.nodeName이 다르면 기존 node를 제거하고 새로운 node로 교체한다. node가 자식을 가진 tree라면 자식 node를 모두 재구축된다.
  if (realNode.nodeName !== virtualNode.nodeName) {
    parent.insertBefore(virtualNode, realNode);
    parent.removeChild(realNode);
    return;
  }

  // 6. element.nodeName이 동일한 경우, attribute를 확인해 동일하면 유지하고 다르면 변경한다.
  // virtualNode에 존재하는 어트리뷰트가 realNode에는 존재하지 않거나 어트리뷰트 값이 같지 않으면 realNode에 해당 어트리뷰트를 추가/변경해 virtualNode와 일치시킨다.
  if (realNode instanceof HTMLElement && virtualNode instanceof HTMLElement) {
    for (const { name, value } of [...virtualNode.attributes]) {
      if (!realNode.hasAttribute(name) || realNode.getAttribute(name) !== value) {
        realNode.setAttribute(name, value);
      }
    }

    // 7. realNode에 존재하는 어트리뷰트가 virtualNode에는 존재하지 않으면 realNode에서 해당 어트리뷰트를 제거해 virtualNode와 일치시킨다.
    for (const { name } of [...realNode.attributes]) {
      if (!virtualNode.hasAttribute(name)) realNode.removeAttribute(name);
    }
    // 8. element attribute를 일치시켜도 element property는 일치하지 않는 경우가 있다.
    // HTML 어트리뷰트와 DOM 프로퍼티가 언제나 1:1로 대응하는 것은 아니며, HTML 어트리뷰트 이름과 DOM 프로퍼티 키가 반드시 일치하는 것도 아니다.
    ['checked', 'value', 'selected', 'disabled'].forEach(key => {
      // 요소 노드의 타입에 따라 소유하는 DOM 프로퍼티가 다르다. 따라서 해당 key의 프로퍼티가 존재하는지 확인한다.
      if (
        (realNode as HTMLElementWithProps)[key] !== undefined &&
        (virtualNode as HTMLElementWithProps)[key] !== undefined &&
        (realNode as HTMLElementWithProps)[key] !== (virtualNode as HTMLElementWithProps)[key]
      ) {
        (realNode as HTMLElementWithProps)[key] = (virtualNode as HTMLElementWithProps)[key];
      }
    });

    // 또 요소 노드의 타입에 따라 소유하는 DOM 프로퍼티도 다르다.
    // 모든 프로퍼티를 비교해야 하지만 checked/value/selected 프로퍼티만 비교한다.
    ///
  }
  // 9. element의 자식 node와 text를 재귀 비교해 DOM에 update한다.
  applyDiff(realNode, virtualNode);
};

const applyDiff = (realDOM: HTMLElement | ChildNode, virtualDOM: HTMLElement | ChildNode) => {
  const [realNodes, virtualNodes] = [[...realDOM.childNodes], [...virtualDOM.childNodes]];
  const max = Math.max(realNodes.length, virtualNodes.length);
  for (let i = 0; i < max; i++) {
    updateDOM(realDOM, realNodes[i], virtualNodes[i]);
  }
};

export default applyDiff;
