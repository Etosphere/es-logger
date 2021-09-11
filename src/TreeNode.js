export const addChildNode = (parentNode, childNode) => {
  return parentNode.children.push(childNode);
}

export class ParseTreeNode {
  constructor(type, content) {
    this.type = type;
    this.content = content;
    this.children = [];
  }
}

export class SyntaxTreeNode {
  constructor(id, type, role, content) {
    this.id = id;
    this.type = type;
    this.role = role;
    this.content = content;
    this.children = [];
  }
}