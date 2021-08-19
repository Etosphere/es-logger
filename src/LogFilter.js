import React from 'react';

class LogFilter extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    let role = event.target.attributes.getNamedItem('data-role').value;
    let nodeType = event.target.attributes.getNamedItem('data-node-type').value;
    let tempLogFilter = this.props.logFilter;
    if (nodeType === 'role') {
      tempLogFilter.role[role] = !tempLogFilter.role[role];
    } else if (nodeType === 'command') {
      tempLogFilter.command = !tempLogFilter.command;
    } else if (nodeType === 'comment') {
      tempLogFilter.comment = !tempLogFilter.comment;
    }
    this.props.onChange(tempLogFilter);
  }

  render() {
    let filterElement = [];
    if (this.props.logFilter.role) {
      Object.keys(this.props.logFilter.role).forEach((role) => {
        filterElement.push(
          <label id={'label-role-' + role} key={'checkbox-role-' + role}>
            <input type="checkbox" id={'checkbox-role-' + role}
                   data-role={role} data-node-type="role"
                   checked={this.props.logFilter.role[role]}
                   onChange={this.handleChange}
                   value={this.props.logFilter.role[role]}/>
            {this.props.roleTable.getName(role)}
          </label>,
        );
      });
      filterElement.push(<br key='br-role'/>);
      filterElement.push(
        <label id="command" key="command">
          <input type="checkbox" id={'checkbox-command'}
                 data-role="all" data-node-type="command"
                 checked={this.props.logFilter.command}
                 onChange={this.handleChange} value={this.props.command}/>
          Command
        </label>);
      filterElement.push(
        <label id="comment" key="comment">
          <input type="checkbox" id={'checkbox-comment'}
                 data-role="all" data-node-type="comment"
                 checked={this.props.logFilter.comment}
                 onChange={this.handleChange} value={this.props.command}/>
          Comment
        </label>,
      );
    }
    if (filterElement.length !== 0) {
      return (
        <form onSubmit={this.props.onSubmit}>
          {filterElement}
          <br/>
          <input type="submit" value="Submit"/>
        </form>
      );
    } else {
      return <div/>;
    }
  }
}

export default LogFilter;