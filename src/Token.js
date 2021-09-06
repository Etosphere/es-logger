export const BlockBegin = 'block-begin';
export const BlockEnd = 'block-end';
export const Action = 'action';
export const Command = 'command';
export const Comment = 'comment';
export const EOF = 'eof';

export default class Token {
  constructor(id, tokenType, roleID, content) {
    this.id = id;
    this.type = tokenType;
    this.roleID = roleID;
    this.content = content;
  }
}