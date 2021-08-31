import React from 'react';
import {Button, Checkbox, Divider, Grid, List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
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

  handleRoleChange(roleID) {
    let tempLogFilter = this.state.logFilter;
    tempLogFilter.role[roleID] = !tempLogFilter.role[roleID];
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
            <ListItem key={role} button onClick={() => this.handleRoleChange(role)}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={this.state.logFilter.role[role]}
                />
              </ListItemIcon>
              <ListItemText id={'label-role-' + role} primary={this.props.roleTable.getName(role)} />
            </ListItem>
          );
        }
      }
      filterElement.push(<Divider/>);
      filterElement.push(
        <ListItem key='command' button onClick={this.handleCommandChange}>
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={this.state.logFilter.command}
            />
          </ListItemIcon>
          <ListItemText id={'label-command'} primary='Command'/>
        </ListItem>);
      filterElement.push(
        <ListItem key='comment' button onClick={this.handleCommentChange}>
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={this.state.logFilter.comment}
            />
          </ListItemIcon>
          <ListItemText id={'label-comment'} primary='Comment'/>
        </ListItem>);
    }
    if (filterElement.length !== 0) {
      return (
        <Grid container direction="column"
              justifyContent="center" alignItems="center"
              style={{marginBottom: '3em'}}>
          <Grid item sm align='center'>
            <List dense disablePadding>
              {filterElement}
            </List>
          </Grid>
          <Grid item sm align='center'>
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