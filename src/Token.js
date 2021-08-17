export const BlockBegin = Symbol('block-begin');
export const BlockEnd = Symbol('block-end');
export const Action = Symbol('action');
export const Command = Symbol('command');
export const Comment = Symbol('comment');
export const EOF = Symbol('eof');

export default class Token {
  constructor(id, tokenType, role, content) {
    this.id = id;
    this.type = tokenType;
    this.role = role;
    this.content = content;
  }
}