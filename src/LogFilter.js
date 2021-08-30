import React from 'react';
import {Button, Checkbox, Grid} from "@material-ui/core";
import {Description} from "@material-ui/icons";

class LogFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logFilter: this.props.logFilter
    }

    this.handleRoleChange = this.handleRoleChange.bind(this);
    this.handleCommandChange = this.handleCommandChange.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
  }

  handleRoleChange(event) {
    let role = event.target.value;
    let tempLogFilter = this.state.logFilter;
    tempLogFilter.role[role] = !tempLogFilter.role[role];
    this.setState({logFilter: tempLogFilter});
  }

  handleCommandChange() {
    let tempLogFilter = this.state.logFilter;
    tempLogFilter.command = !tempLogFilter.command;
    this.setState({logFilter: tempLogFilter});
  }

  handleCommentChange() {
    let tempLogFilter = this.state.logFilter;
    tempLogFilter.comment = !tempLogFilter.comment;
    this.setState({logFilter: tempLogFilter});
  }

  render() {
    let filterElement = [];
    if (this.state.logFilter.role) {
      for (let role in this.state.logFilter.role) {
        if (this.props.roleTable.getType(role) === 'pc') {
          filterElement.push(
            <label id={'label-role-' + role} key={'checkbox-role-' + role}>
              <Checkbox id={'checkbox-role-' + role}
                        checked={this.state.logFilter.role[role]}
                        onChange={this.handleRoleChange}
                        value={role}/>
              {this.props.roleTable.getName(role)}
            </label>,
          );
        }
      }
      filterElement.push(<br key='br-role'/>);
      filterElement.push(
        <label id="command" key="command">
          <Checkbox id={'checkbox-command'}
                 checked={this.state.logFilter.command}
                 onChange={this.handleCommandChange} value={this.state.command}/>
          Command
        </label>);
      filterElement.push(
        <label id="comment" key="comment">
          <Checkbox id={'checkbox-comment'}
                 checked={this.state.logFilter.comment}
                 onChange={this.handleCommentChange} value={this.state.command}/>
          Comment
        </label>,
      );
    }
    if (filterElement.length !== 0) {
      return (
        <Grid container style={{marginBottom: '1em'}}>
          <Grid item sm>
            {filterElement}
          </Grid>
          <Grid item xs align='center'>
            <Button
              variant="contained"
              color="secondary"
              component="span"
              endIcon={<Description/>}
              onClick={this.props.onSubmit}>
              Render
            </Button>
          </Grid>
        </Grid>
      );
    } else {
      return <div/>;
    }
  }
}

export default LogFilter;