import React from "react";
import {Block} from "./LogParser";

class LogRender extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let children = null;
    if (this.props.node && this.props.node.children !== 0) {
      children = (
        <ul style={{listStyleType: 'none', margin: 0}}>
          {this.props.node.children.map((i) => (
            <LogRender node={i} key={'log-node-' + i.id} roleTable={this.props.roleTable}/>
          ))}
        </ul>
      );
      if (this.props.node.type === Block) {
        let blockRoles = this.props.node.role.map((roleID) => this.props.roleTable.getName(roleID)).join(', ');
        if (this.props.node.id === 0) {
          // not render the root Block node
          return (<div>{children}</div>);
        } else {
          return (
            <li>
              <span>[{blockRoles}]</span>
              {children}
            </li>
          );
        }
      } else {
        return (
          <li>
            <span>&lt;{this.props.roleTable.getName(this.props.node.role)}&gt;</span> {this.props.node.content}
            {children}
          </li>
        );
      }
    } else {
      return null;
    }
  }
}

export default LogRender;