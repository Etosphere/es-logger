import React from 'react';
import {Block} from './LogParser';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import TreeItem from '@material-ui/lab/TreeItem';
import TreeView from '@material-ui/lab/TreeView';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SaveToDocxButton from './SaveToDocxButton';

const styles = (theme) => ({
  "@global": {
    ".MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label": {
      backgroundColor: "white"
    },
    ".MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label:hover, .MuiTreeItem-root.Mui-selected:focus > .MuiTreeItem-content .MuiTreeItem-label": {
      backgroundColor: "gray"
    }
  }
});

class LogRender extends React.Component {
  constructor(props) {
    super(props);
    this.collapsibleNodeArray = [];
    this.state = {
      expanded: [],
    }

    this.handleToggle = this.handleToggle.bind(this);
    this.collapseAll = this.collapseAll.bind(this);
    this.expandAll = this.expandAll.bind(this);

    this.initializeCollapsibleNodeArray();
  }

  initializeCollapsibleNodeArray() {
    const iterateTree = (node) => {
      if (node.type === Block && Array.isArray(node.children)) {
        if (node.collapsed) {
          this.collapsibleNodeArray.push(node.id.toString());
        }
        node.children.forEach((node) => iterateTree(node));
      }
    }
    iterateTree(this.props.node);
  }

  handleToggle(event, nodeId) {
    this.setState({expanded: nodeId});
  }

  collapseAll() {
    this.setState({expanded: []});
  }

  expandAll() {
    this.setState({expanded: this.collapsibleNodeArray});
  }

  render() {
    const classes = this.props.classes;

    const CustomTreeItem = withStyles({
      root: {
        // "&.MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label:hover": {
        //   background: "transparent"
        // },
        // "&.MuiTreeItem-root.Mui-selected:focus > .MuiTreeItem-content .MuiTreeItem-label": {
        //   background: "transparent"
        // },
        "&.MuiTreeItem-root:focus > .MuiTreeItem-content .MuiTreeItem-label": {
          background: "transparent"
        },
        "&.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label": {
          background: "transparent"
        },
        "&.MuiTreeItem-root > .MuiTreeItem-content:hover": {
          background: "transparent"
        },
        "&.MuiTreeItem-root > .MuiTreeItem-content:hover > .MuiTreeItem-label": {
          background: "transparent"
        }
      },
      group: {
        marginLeft: 7,
        paddingLeft: 18,
        borderLeft: "1px dashed #33333333",
      },
    })(TreeItem);

    const renderTree = (node) => {
      if (node.type !== Block) {
        if (node.content) {
          return <Typography key={node.id}
                             style={{color: this.props.roleTable.getColor(node.role), whiteSpace: "pre-line"}}>
            {`<${this.props.roleTable.getName(node.role)}> ${node.content}`}
          </Typography>;
        }
      } else {
        if (Array.isArray(node.children)) {
          if (node.collapsed) {
            let roleList = node.role.map((roleID) => {
              if (this.props.roleTable.getType(roleID) === 'pc') {
                return this.props.roleTable.getName(roleID)
              } else {
                return null;
              }
            }).filter((roleName) => roleName);
            let labelContent = <Typography
              style={{color: "#a2a2a2"}}>{`{${roleList.join(', ')}}`}</Typography>;
            return (
              <CustomTreeItem key={node.id} nodeId={node.id.toString()} label={labelContent}>
                {node.children.map((node) => renderTree(node))}
                <CustomTreeItem key={node.id.toString() + '-collapse'}
                                nodeId={node.id.toString() + '-collapse'}
                                label={<Typography style={{color: "#a2a2a2"}}>{'Click to Collapse'}</Typography>}
                                endIcon={<ExpandLessIcon/>}
                                onLabelClick={(event) => {
                                  let newExpanded = this.state.expanded;
                                  newExpanded.splice(newExpanded.indexOf(node.id.toString()), 1);
                                  this.handleToggle(event, newExpanded);
                                }}/>
              </CustomTreeItem>
            );
          } else {
            return node.children.map((node) => renderTree(node));
          }
        } else {
          return null;
        }
      }
    }

    if (this.props.node) {
      return ([
        this.props.header.title &&
        <Typography key="title" variant="h4" style={{marginTop: "16px", marginBottom: "16px"}}>
          {this.props.header.title}
        </Typography>,
        this.props.header.description &&
        <Typography key="description" variant="subtitle1" style={{
          whiteSpace: "pre-line",
          marginBottom: "16px",
          paddingLeft: "2em",
          paddingRight: "2em",
          color: "#888888"
        }}>{this.props.header.description}</Typography>,
        <Grid key="buttons-grid" container spacing={2} style={{marginBottom: '12px'}}>
          <Grid key="expand-and-collapse-button-group" item xs={12} sm={8}>
            <ButtonGroup key="button-group" variant="outlined" size="small" color="primary">
              <Button onClick={this.expandAll}>Expand all</Button>
              <Button onClick={this.collapseAll}>Collapse all</Button>
            </ButtonGroup>
          </Grid>
          <Grid key="save-to-docx-button" item xs={12} sm={4} align="right">
            <SaveToDocxButton key="save-to-docx-button" data={this.props.node} roleTable={this.props.roleTable}
                            header={this.props.header}/>
          </Grid>
        </Grid>,
        <TreeView
          className={classes.root}
          key="render-tree"
          defaultCollapseIcon={<ExpandMoreIcon/>}
          defaultExpanded={['root']}
          defaultExpandIcon={<ChevronRightIcon/>}
          disableSelection
          expanded={this.state.expanded}
          onNodeToggle={this.handleToggle}
          style={{marginBottom: "48px"}}
        >
          {renderTree(this.props.node)}
        </TreeView>
      ]);
    } else {
      return null;
    }
  }
}

export default withStyles(styles, {withTheme: true})(LogRender);