import React from 'react';

class RoleFilter extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    let role = event.target.attributes.getNamedItem('data-role').value;
    let nodeType = event.target.attributes.getNamedItem('data-node-type').value;
    let tempRoleFilter = this.props.roleFilter;
    tempRoleFilter[role][nodeType] = !tempRoleFilter[role][nodeType];
    this.props.onChange(tempRoleFilter);
  }

  render() {
    let filterElement = [];
    Object.keys(this.props.roleFilter).forEach((role) => {
      let value = this.props.roleFilter[role];
      let tempFilterElement = [];
      Object.keys(value).forEach((nodeType) => {
        let checked = value[nodeType];
        tempFilterElement.push(
          <label id={'label-' + role + '-' + nodeType} key={nodeType}>
            {nodeType}
            <input type="checkbox" id={'checkbox-' + role + '-' + nodeType}
                   data-role={role} data-node-type={nodeType}
                   checked={this.props.roleFilter[role][nodeType]}
                   onChange={this.handleChange} value={checked}/>
          </label>
        );
      });
      filterElement.push(
        <div id={'div-' + role} key={role}>
          {role}: {tempFilterElement}
        </div>
      );
    });
    if (filterElement.length !== 0) {
      return (
        <form onSubmit={this.props.onSubmit}>
          {filterElement}
          <input type="submit" value="Submit"/>
        </form>
      );
    } else {
      return <div/>;
    }
  }
}

export default RoleFilter;