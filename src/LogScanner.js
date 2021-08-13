class LogScanner {
  constructor(rawLogData) {
    this.rawLogData = rawLogData;
    this.tokenSequence = [];
  }

  analyze() {
    const makeToken = (id, tokenType, role, content) => {
      return {
        'id': id,
        'type': tokenType,
        'role': role,
        'content': content,
      };
    };
    let logArray = this.rawLogData.split('<')
      .slice(1)
      .map((str) => '<' + str.trim());
    let tokenID = 1;      // id 0 is for configuration header
    logArray.forEach((line, _) => {
      let trimLine = line.trim();
      let bracketContent = trimLine.match(/<.+>/)[0];  // <xxx>
      if (bracketContent) {
        let skipBracketContent = bracketContent.slice(1,
          bracketContent.length - 1);  // <xxx> without <>
        if (skipBracketContent === '{') {
          this.tokenSequence.push(
            makeToken(tokenID, 'block-begin', null, null));
        } else if (skipBracketContent === '}') {
          this.tokenSequence.push(makeToken(tokenID, 'block-end', null, null));
        } else {
          this.tokenSequence.push(
            makeToken(tokenID, 'action', skipBracketContent,
              trimLine.split('>')[1].trim()));
        }
        tokenID += 1;
      } else {
        console.log(`Ignore analyzing context: ${line}`);
      }
    });
    return this.tokenSequence;
  }
}

export default LogScanner;