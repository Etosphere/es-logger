import Token, {BlockBegin, BlockEnd, Action, Command, Comment, EOF} from './Token';
import {RoleTable} from './Role';

const getRandomHSLAColor = (minH, maxH, minS, maxS, minL, maxL, minA, maxA) => {
  const getRandomNumber = (low, high) => {
    return Math.round(Math.random() * (high - low)) + low;
  }

  let hue = getRandomNumber(minH, maxH);
  let saturation = getRandomNumber(minS, maxS);
  let lightness = getRandomNumber(minL, maxL);
  let alpha = getRandomNumber(minA * 100, maxA * 100) / 100;

  return `hsl(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
}

class LogScanner {
  constructor(rawLogData) {
    this.rawLogData = rawLogData;
    this.tokenSequence = [];
    this.roleTable = new RoleTable();
  }

  analyze() {
    let logArray = this.rawLogData.split('\n').map((str) => str.trim());
    let tokenID = 0;
    let lastRoleName = '';
    let bufferActionContent = '';
    logArray.forEach((line, _) => {
      let bracketContent = line.match(/<.+>/);  // <xxx>
      if (bracketContent) {
        if (lastRoleName !== '') {
          let roleID = this.roleTable.addRole(lastRoleName, 'pc', getRandomHSLAColor(0, 360, 20, 80, 0, 75, 1, 1));
          this.tokenSequence.push(new Token(tokenID, Action, roleID, bufferActionContent));
          bufferActionContent = '';
          lastRoleName = '';
          tokenID += 1;
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
          let roleID = this.roleTable.addRole(skipBracketContent, 'pc', getRandomHSLAColor(0, 360, 20, 80, 0, 75, 1, 1));
          if (tokenContent[0] === '(' || tokenContent[0] === '（') {
            this.tokenSequence.push(
              new Token(tokenID, Comment, roleID, tokenContent));
            lastRoleName = '';
          } else if (tokenContent[0] === '.') {
            this.tokenSequence.push(
              new Token(tokenID, Command, roleID, tokenContent));
            lastRoleName = '';
          } else {
            bufferActionContent += tokenContent;
            lastRoleName = skipBracketContent;
            tokenID -= 1;
          }
        }
      } else {
        let roleID = this.roleTable.addRole(lastRoleName, 'pc', getRandomHSLAColor(0, 360, 20, 80, 0, 75, 1, 1));
        if (line[0] === '(' || line[0] === '（') {
          if (bufferActionContent !== '') {
            this.tokenSequence.push(new Token(tokenID, Action, roleID, bufferActionContent));
            bufferActionContent = '';
            tokenID += 1;
          }
          this.tokenSequence.push(
            new Token(tokenID, Comment, roleID, line));
        } else if (line[0] === '.') {
          if (bufferActionContent !== '') {
            this.tokenSequence.push(new Token(tokenID, Action, roleID, bufferActionContent));
            bufferActionContent = '';
          }
          this.tokenSequence.push(
            new Token(tokenID, Command, roleID, line));
        } else {
          bufferActionContent += '\n' + line;
          tokenID -= 1;
        }
      }
      tokenID += 1;
    });
    if (bufferActionContent !== '') {
      let roleID = this.roleTable.addRole(lastRoleName, 'pc', getRandomHSLAColor(0, 360, 20, 80, 0, 75, 1, 1));
      // push action token at last line
      this.tokenSequence.push(new Token(tokenID, Action, roleID, bufferActionContent));
      bufferActionContent = '';
    }
    this.tokenSequence.push(new Token(tokenID + 1, EOF, null, null));
    return this.tokenSequence;
  }
}

export default LogScanner;