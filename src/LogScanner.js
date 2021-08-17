import Token, {BlockBegin, BlockEnd, Action, Command, Comment, EOF} from './Token';

class LogScanner {
  constructor(rawLogData) {
    this.rawLogData = rawLogData;
    this.tokenSequence = [];
  }

  analyze() {
    let logArray = this.rawLogData.split('\n').map((str) => str.trim());
    let tokenID = 0;
    let lastSkipBracketContent = '';
    let bufferActionContent = '';
    logArray.forEach((line, _) => {
      let bracketContent = line.match(/<.+>/);  // <xxx>
      if (bracketContent) {
        if (bufferActionContent !== '') {
          this.tokenSequence.push(new Token(tokenID, Action, lastSkipBracketContent, bufferActionContent));
          bufferActionContent = '';
        }
        bracketContent = bracketContent[0];
        let skipBracketContent = bracketContent.slice(1,
          bracketContent.length - 1);  // <xxx> without <>
        if (skipBracketContent === '{') {
          this.tokenSequence.push(
            new Token(tokenID, BlockBegin, null, null));
        } else if (skipBracketContent === '}') {
          this.tokenSequence.push(new Token(tokenID, BlockEnd, null, null));
        } else {
          let tokenContent = line.split('>')[1].trim();
          if (tokenContent[0] === '(' || tokenContent[0] === '（') {
            this.tokenSequence.push(
              new Token(tokenID, Comment, skipBracketContent, tokenContent));
            lastSkipBracketContent = '';
          } else if (tokenContent[0] === '.') {
            this.tokenSequence.push(
              new Token(tokenID, Command, skipBracketContent, tokenContent));
            lastSkipBracketContent = '';
          } else {
            bufferActionContent += tokenContent;
            lastSkipBracketContent = skipBracketContent;
          }
        }
      } else {
        if (line[0] === '(' || line[0] === '（') {
          if (bufferActionContent !== '') {
            this.tokenSequence.push(new Token(tokenID, Action, lastSkipBracketContent, bufferActionContent));
            bufferActionContent = '';
          }
          this.tokenSequence.push(
            new Token(tokenID, Comment, lastSkipBracketContent, line));
        } else if (line[0] === '.') {
          if (bufferActionContent !== '') {
            this.tokenSequence.push(new Token(tokenID, Action, lastSkipBracketContent, bufferActionContent));
            bufferActionContent = '';
          }
          this.tokenSequence.push(
            new Token(tokenID, Command, lastSkipBracketContent, line));
        } else {
          bufferActionContent += '\n' + line;
        }
      }
      tokenID += 1;
    });
    this.tokenSequence.push(new Token(tokenID, EOF, null, null));
    return this.tokenSequence;
  }
}

export default LogScanner;