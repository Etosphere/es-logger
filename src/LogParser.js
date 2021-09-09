import React from 'react';
import _ from 'lodash';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import PublishIcon from '@material-ui/icons/Publish';
import SendIcon from '@material-ui/icons/Send';
import LogScanner from './LogScanner';
import * as Token from './Token';
import RoleConfigurator from "./RoleConfigurator";
import LogRender from "./LogRender";
import BackToTopButton from "./BackToTopButton";

export const Start = 'Start';
export const StartPrime = "Start'";
export const Block = 'Block';
export const BlockBegin = 'block-begin';
export const BlockEnd = 'block-end';
export const ACC = 'ACC';
export const Action = 'action';
export const Command = 'command';
export const Comment = 'comment';

class ParseTreeNode {
  constructor(type, content) {
    this.type = type;
    this.content = content;
    this.children = [];
  }

  addChild = (node) => {
    this.children.push(node);
  };
}

class SyntaxTreeNode {
  constructor(id, type, role, content) {
    this.id = id;
    this.type = type;
    this.role = role;
    this.content = content;
    this.children = [];
  }

  addChild = (node) => {
    this.children.push(node);
  };
}

class LogParser extends React.Component {
  constructor(props) {
    super(props);
    this.header = {
      show_command: false,
      show_comment: false
    };
    this.state = {
      selectedFile: null,
      parseTreeRoot: null,
      syntaxTreeRoot: null,
      filteredTreeRoot: null,
      roleTable: null,
      logFilter: {},   // e.g.: {"role": {0: true, 1: false, ...}], "command": true, "comment": true}
      showRoleConfigurator: false,
      // showLogFilter: false,
      showLogRender: false,
    };

    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleFileRead = this.handleFileRead.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleRoleTableChange = this.handleRoleTableChange.bind(this);
    this.handleLogFilterChange = this.handleLogFilterChange.bind(this);
    this.filterNodeByRole = this.filterNodeByRole.bind(this);
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
          new SyntaxTreeNode(nodeID, originNode.type, originNode.content.roleID,
            originNode.content.content));
      } else {
        // do nothing
        return false;
      }
      nodeID += 1;
      return buildRootNode.children[buildRootNode.children.length - 1];
    };

    let buildFullSyntaxTree = (parseTreeNode, syntaxTreeNode) => {
      if (parseTreeNode) {
        let buildChildNode = buildSyntaxTreeNode(parseTreeNode, syntaxTreeNode);
        if (buildChildNode) {
          parseTreeNode.children.forEach(
            (child, _) => buildFullSyntaxTree(child, buildChildNode));
        } else {
          parseTreeNode.children.forEach(
            (child, _) => buildFullSyntaxTree(child, syntaxTreeNode));
        }
      }
    };

    let syntaxTreeRoot = new SyntaxTreeNode(0, Block, [], null);  // global block containing all roles
    buildFullSyntaxTree(rootNode, syntaxTreeRoot);
    return syntaxTreeRoot;
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

  initializeLogFilter() {
    let roleDict = {};
    this.state.syntaxTreeRoot.role.forEach((role) => roleDict[role] = true);
    return {
      'role': roleDict,
      'command': this.header.show_command, // according to show_command in YAML header, default value is false
      'comment': this.header.show_comment, // according to show_comment in YAML header, default value is false
    };
  }

  handleFileChange(event) {
    this.setState({
      selectedFile: event.target.files[0],
      parseTreeRoot: null,
      syntaxTreeRoot: null,
      filteredTreeRoot: null,
      roleTable: null,
      logFilter: {},
      showRoleConfigurator: false,
      showLogRender: false,
    });
  }

  handleFileRead(event) {
    let content = event.target.result;
    let logScanner = new LogScanner(content);
    let tokenSequence = logScanner.analyze();
    this.header = logScanner.header;
    let parseTree = this.parse(tokenSequence);
    let syntaxTree = this.buildSyntaxTree(parseTree);
    this.setState({
      parseTreeRoot: parseTree,
      syntaxTreeRoot: syntaxTree,
      roleTable: logScanner.roleTable,
    }, () => {
      this.updateRole(this.state.syntaxTreeRoot);
      let logFilter = this.initializeLogFilter();
      this.setState({logFilter: logFilter, showRoleConfigurator: true});
    });
  }

  handleFileUpload() {
    const fileReader = new FileReader();
    fileReader.onload = this.handleFileRead;
    fileReader.readAsText(this.state.selectedFile);
  }

  handleRoleTableChange(newRoleTable) {
    this.setState({roleTable: newRoleTable});
  }

  handleLogFilterChange(newLogFilter) {
    this.setState({logFilter: newLogFilter});
  }

  // post-order traversal to delete nodes add update collapse states according to role filter checkboxes
  // deletion rule:
  //   1. If none of the reserved roles appear in the Block (except kp and dicer), delete the Block (and its children) node.
  //   2. If is a action / command / comment node and is filtered out according to the checkboxes, delete it.
  // collapsing rule:
  //   If there exists a reserved role that does not appear in the Block node, collapse the node.
  filterNodeByRole() {
    // get all reserved roles from rileFilter
    let reservedRoleArray = [];
    Object.keys(this.state.logFilter.role).forEach((roleID) => {
      if (this.state.roleTable.getType(roleID) === 'pc' && this.state.logFilter.role[roleID]) {
        reservedRoleArray.push(roleID);
      }
    });
    reservedRoleArray = reservedRoleArray.map((roleID) => parseInt(roleID));

    let isIntersectionEmpty = (array1, array2) => {
      return !array1.map((item) => array2.includes(item)).includes(true);
    };

    let isSubsetOf = (array1, array2) => {
      return array1.every((value) => array2.includes(value));
    }

    let filteredTree = _.cloneDeep(this.state.syntaxTreeRoot);

    let traverseFilter = (node, parentNode) => {
      if (node) {
        // make a clone to prevent wrong index made by deletion in iteration
        node.children.slice(0)
          .forEach((child, _) => traverseFilter(child, node));
        if (node.type === Block) {
          node.collapsed = !isSubsetOf(reservedRoleArray, node.role);
          if ((node.children.length === 0 && parentNode) ||
            isIntersectionEmpty(node.role, reservedRoleArray)) {
            // Block is empty or no reserved roles appear
            let toDeleteIndex = parentNode.children.findIndex(
              (child) => child.id === node.id);
            parentNode.children.splice(toDeleteIndex, 1);
            node = null;
          }
        } else {
          node.collapsed = false;
          // check for filtering command / comment
          if ((node.type === Command && (!this.state.logFilter.command)) ||
            (node.type === Comment && (!this.state.logFilter.comment))) {
            let toDeleteIndex = parentNode.children.findIndex(
              (child) => child.id === node.id);
            parentNode.children.splice(toDeleteIndex, 1);
            node = null;
          }
        }
      }
    };
    traverseFilter(filteredTree, null);
    this.updateRole(filteredTree);
    this.setState({filteredTreeRoot: filteredTree, showLogRender: true});
  }

  render() {
    return ([
      <div id="back-to-top-anchor" key="back-to-top-anchor"/>,
      <BackToTopButton key="back-to-top-button"/>,
      <Grid key="handle-file-grid" container spacing={1} direction="column" style={{marginBottom: 24}}>
        <Grid item xs align="center">
          <input
            hidden
            id="contained-button-file"
            accept="text/plain,.log"
            type="file"
            onChange={this.handleFileChange}
          />
          <label htmlFor="contained-button-file">
            <Button
              variant="outlined"
              color="primary"
              component="span"
              endIcon={<PublishIcon/>}
            >
              Browse
            </Button>
          </label>
        </Grid>
        {this.state.selectedFile &&
        <Fade in timeout={1500}>
          <Grid item xs align="center">
            <Button
              variant="contained"
              color="primary"
              component="span"
              endIcon={<SendIcon/>}
              onClick={this.handleFileUpload}>
              Submit
            </Button>
          </Grid>
        </Fade>}
      </Grid>,
      <Grid container key="role-configurator-grid">
        {this.state.showRoleConfigurator &&
        <RoleConfigurator key="role-configurator"
                          roleTable={_.cloneDeep(this.state.roleTable)}
                          logFilter={this.state.logFilter}
                          header={this.header}
                          onRoleTableChange={this.handleRoleTableChange}
                          onFilterChange={this.handleLogFilterChange}
                          onSubmit={this.filterNodeByRole}/>
        }
      </Grid>,
      <Divider hidden={!this.state.showLogRender} key="divider"/>,
      // <Grid container key="role-filter-grid">
      //   {this.state.showLogFilter &&
      //   <LogFilter key="filter"
      //              logFilter={this.state.logFilter}
      //              roleTable={this.state.roleTable}
      //              onSubmit={this.filterNodeByRole}/>
      //   }
      // </Grid>,
      <Container key="log-render-container" maxWidth="md">
        {this.state.showLogRender &&
        <LogRender key="render"
                   node={this.state.filteredTreeRoot}
                   roleTable={this.state.roleTable}
                   header={this.header}/>}
      </Container>
    ]);
  }
}

export default LogParser;