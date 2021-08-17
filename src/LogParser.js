import React from 'react';
import _ from 'lodash';
import LogScanner from './LogScanner';
import RoleFilter from './RoleFilter';
import * as Token from './Token';

export const Start = Symbol('Start');
export const StartPrime = Symbol('Start\'');
export const Block = Symbol('Block');
export const BlockBegin = Symbol('block-begin');
export const BlockEnd = Symbol('block-end');
export const ACC = Symbol('ACC');
export const Action = Symbol('action');
export const Command = Symbol('command');
export const Comment = Symbol('comment');

class ParseTreeNode {
  constructor(type, content) {
    this.type = type;
    this.content = content;
    this.children = [];
  }

  addChild = (node) => { this.children.push(node); };
}

class SyntaxTreeNode {
  constructor(id, type, role, content) {
    this.id = id;
    this.type = type;
    this.role = role;
    this.content = content;
    this.children = [];
  }

  addChild = (node) => { this.children.push(node); };
}

class LogParser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      parseTreeRoot: null,
      syntaxTreeRoot: null,
      roleFilter: {},   // e.g.: {"role1": {"action": true, "command", false, "comment": false}, ...}
      outputHTML: '',
    };
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleFileRead = this.handleFileRead.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  // syntax:
  //
  // Start -> Block Start' | ACC Start'
  // Start' -> Block Start' | ACC Start' | empty
  // Block -> block-begin Start' block-end
  // ACC -> action | command | comment
  parse(tokenSequence) {
    let tokenIndex = 0;
    const getToken = () => tokenSequence[tokenIndex];
    const nextToken = () => tokenIndex += 1;

    let parseProgram = (node) => {
      let token = getToken();
      if (token.type === Token.BlockBegin) {
        node.addChild(new ParseTreeNode(Block, null));
        if (parseBlock(node.children[0])) {
          node.addChild(new ParseTreeNode(StartPrime, null));
          return parseStartPrime(node.children[1]);
        }
      } else if (token.type === Token.Action || token.type === Token.Command ||
        token.type === Token.Comment) {
        node.addChild(new ParseTreeNode(ACC, null));
        if (parseACC(node.children[0])) {
          node.addChild(new ParseTreeNode(StartPrime, null));
          return parseStartPrime(node.children[1]);
        }
      } else {
        console.log(`Error parsing at ${token}.`);
        return false;
      }
    };

    let parseStartPrime = (node) => {
      let token = getToken();
      if (token.type === Token.BlockBegin) {
        node.addChild(new ParseTreeNode(Block, null));
        if (parseBlock(node.children[0])) {
          node.addChild(new ParseTreeNode(StartPrime, null));
          return parseStartPrime(node.children[1]);
        }
      } else if (token.type === Token.Action || token.type === Token.Command ||
        token.type === Token.Comment) {
        node.addChild(new ParseTreeNode(ACC, null));
        if (parseACC(node.children[0])) {
          node.addChild(new ParseTreeNode(StartPrime, null));
          return parseStartPrime(node.children[1]);
        }
      } else {
        return true;    // for Start' -> empty
      }
    };

    let parseBlock = (node) => {
      let token = getToken();
      if (token.type === Token.BlockBegin) {
        node.addChild(new ParseTreeNode(BlockBegin, token));
        nextToken();
        node.addChild(new ParseTreeNode(StartPrime, null));
        if (parseStartPrime(node.children[1])) {
          node.addChild(new ParseTreeNode(BlockEnd, getToken()));
          if (getToken().type === Token.BlockEnd) {
            nextToken();
            return true;
          } else {
            console.log(
              `Error parsing at ${getToken()}, should be <block-end>.`);
          }
        }
      } else {
        console.log(`Error parsing at ${getToken()}, should be <block-begin>.`);
      }
    };

    let parseACC = (node) => {
      let token = getToken();
      if (token.type === Token.Action) {
        node.addChild(new ParseTreeNode(Action, token));
        nextToken();
        return true;
      } else if (token.type === Token.Command) {
        node.addChild(new ParseTreeNode(Command, token));
        nextToken();
        return true;
      } else if (token.type === Token.Comment) {
        node.addChild(new ParseTreeNode(Comment, token));
        nextToken();
        return true;
      } else {
        console.log(
          `Error parsing at ${token}, should be <action> or <command> or <comment>.`);
        return false;
      }
    };

    let startNode = new ParseTreeNode(Start);
    if (parseProgram(startNode)) {
      return startNode;
    } else {
      console.log('Failed to parse the code.');
    }
  }

  buildSyntaxTree(rootNode) {
    let nodeID = 1;
    let buildSyntaxTreeNode = (originNode, buildRootNode) => {
      if (originNode.type === Block) {
        buildRootNode.addChild(new SyntaxTreeNode(nodeID, Block, [], null));
      } else if (originNode.type === Action || originNode.type === Command ||
        originNode.type === Comment) {
        buildRootNode.addChild(
          new SyntaxTreeNode(nodeID, originNode.type, originNode.content.role,
            originNode.content.content));
      } else {
        // do nothing
        return false;
      }
      nodeID += 1;
      return buildRootNode.children[buildRootNode.children.length - 1];
    };

    let buildSyntaxTree = (parseTreeNode, syntaxTreeNode) => {
      if (parseTreeNode) {
        let buildChildNode = buildSyntaxTreeNode(parseTreeNode, syntaxTreeNode);
        if (buildChildNode) {
          parseTreeNode.children.forEach(
            (child, _) => buildSyntaxTree(child, buildChildNode));
        } else {
          parseTreeNode.children.forEach(
            (child, _) => buildSyntaxTree(child, syntaxTreeNode));
        }
      }
    };

    let syntaxTreeRoot = new SyntaxTreeNode(0, Block, [], null);  // global block containing all roles
    buildSyntaxTree(rootNode, syntaxTreeRoot);
    if (syntaxTreeRoot.children !== []) {
      return syntaxTreeRoot.children[0];
    } else {
      return syntaxTreeRoot;
    }
  }

  // traverse syntax tree in post order to update "role" in Block nodes
  updateRole(rootNode) {
    if (rootNode) {
      if (rootNode.type === Block) {
        let roleArray = rootNode.role;
        rootNode.children.forEach(
          (child, _) => roleArray = roleArray.concat(this.updateRole(child)));
        rootNode.role = [...new Set(roleArray)].sort();
      }
      return rootNode.role;
    } else {
      return [];
    }
  };

  initializeRoleFilter() {
    let tempRoleFilter = {};
    this.state.syntaxTreeRoot.role.forEach((role) => {
      tempRoleFilter[role] = {
        'action': true,
        'command': true,
        'comment': true,
      };
    });
    this.setState({roleFilter: tempRoleFilter});
  }

  handleFileChange(event) {
    this.setState({
      selectedFile: event.target.files[0],
    });
  }

  handleFileRead(event) {
    let content = event.target.result;
    let logScanner = new LogScanner(content);
    let tokenSequence = logScanner.analyze();
    let parseTree = this.parse(tokenSequence);
    let syntaxTree = this.buildSyntaxTree(parseTree);
    this.setState({
      parseTreeRoot: parseTree,
      syntaxTreeRoot: syntaxTree,
      outputHTML: JSON.stringify(syntaxTree, null, 4),
    });
    this.updateRole(this.state.syntaxTreeRoot);
    this.initializeRoleFilter();
  }

  handleFileUpload(event) {
    event.preventDefault();
    const fileReader = new FileReader();
    fileReader.onload = this.handleFileRead;
    fileReader.readAsText(this.state.selectedFile);
  }

  handleCheckboxChange(newRoleFilter) {
    this.setState({roleFilter: newRoleFilter});
  }

  // post-order traversal to delete nodes according to role filter checkboxes
  filterNodeByRole() {
    let filteredTree = _.cloneDeep(this.state.syntaxTreeRoot);

    let traverseFilter = (node, parentNode) => {
      if (node) {
        // make a clone to prevent wrong index made by deletion in iteration
        node.children.slice(0).forEach((child, _) => traverseFilter(child, node));
        if (node.type === Block && node.children.length === 0 && parentNode) {
          let toDeleteIndex = parentNode.children.findIndex((child) => child.id === node.id);
          parentNode.children.splice(toDeleteIndex, 1);
          node = null;
        } else if (node.type !== Block) {
          // check for filtering action / command / comment
          let typeName = node.type.toString();
          typeName = typeName.substring(7, typeName.length - 1);
          if (!this.state.roleFilter[node.role][typeName]) {
            let toDeleteIndex = parentNode.children.findIndex((child) => child.id === node.id);
            parentNode.children.splice(toDeleteIndex, 1);
            node = null;
          }
        }
      }
    }
    traverseFilter(filteredTree, null);
    this.setState({outputHTML: JSON.stringify(filteredTree, null, 4)});
  }

  render() {
    return (
      <div>
        <div>
          <input type="file" onChange={this.handleFileChange}/>
          <input type="button" value="Upload" onClick={this.handleFileUpload}/>
        </div>
        <RoleFilter roleFilter={this.state.roleFilter}
                    onChange={this.handleCheckboxChange}
                    onSubmit={(e) => {
                      e.preventDefault();
                      this.filterNodeByRole();
                    }}/>
        <pre id="output"
             dangerouslySetInnerHTML={{__html: this.state.outputHTML}}/>
      </div>
    );
  }
}

export default LogParser;