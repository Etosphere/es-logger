import React from "react";
import {Block} from "./LogParser";
import {Typography, withStyles} from "@material-ui/core";
import {TreeItem, TreeView} from "@material-ui/lab";
import {ChevronRight, ExpandMore} from "@material-ui/icons";

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
  render() {
    const classes = this.props.classes;

    const renderTree = (node) => {
      if (node.type !== Block) {
        return <Typography key={node.id}
                           style={{color: this.props.roleTable.getColor(node.role)}}>{`<${this.props.roleTable.getName(node.role)}> ${node.content}`}</Typography>;
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
              style={{color: '#a2a2a2'}}>{`---Click to Expand--- [${roleList.join(', ')}]`}</Typography>;
            return (
              <TreeItem key={node.id} nodeId={node.id.toString()} label={labelContent}>
                {node.children.map((node) => renderTree(node))}
              </TreeItem>
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
      return (
        <TreeView
          className={classes.root}
          defaultCollapseIcon={<ExpandMore/>}
          defaultExpanded={['root']}
          defaultExpandIcon={<ChevronRight/>}
        >
          {renderTree(this.props.node)}
        </TreeView>
      );
    } else {
      return null;
    }
    // let children = null;
    // if (this.props.node && this.props.node.children !== 0) {
    //   children = (
    //     <ul style={{listStyleType: 'none', margin: 0}}>
    //       {this.props.node.children.map((i) => (
    //         <LogRender node={i} key={'log-node-' + i.id} roleTable={this.props.roleTable}/>
    //       ))}
    //     </ul>
    //   );
    //   if (this.props.node.type === Block) {
    //     let blockRoles = this.props.node.role.map((roleID) => this.props.roleTable.getName(roleID)).join(', ');
    //     if (this.props.node.id === 0) {
    //       // not render the root Block node
    //       return (<div>{children}</div>);
    //     } else {
    //       return (
    //         <li>
    //           <span>[{blockRoles}]</span>
    //           {children}
    //         </li>
    //       );
    //     }
    //   } else {
    //     return (
    //       <li>
    //         <span>&lt;{this.props.roleTable.getName(this.props.node.role)}&gt;</span> {this.props.node.content}
    //         {children}
    //       </li>
    //     );
    //   }
    // } else {
    //   return null;
    // }
  }
}

export default withStyles(styles, {withTheme: true})(LogRender);