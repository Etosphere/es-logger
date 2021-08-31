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
              <ListItemIcon key={'icon-' + role}>
                <Checkbox
                  key={role}
                  edge="start"
                  checked={this.state.logFilter.role[role]}
                />
              </ListItemIcon>
              <ListItemText key={'label-role-' + role} primary={this.props.roleTable.getName(role)} />
            </ListItem>
          );
        }
      }
      filterElement.push(<Divider key='divider'/>);
      filterElement.push(
        <ListItem key='command' button onClick={this.handleCommandChange}>
          <ListItemIcon key='command-icon'>
            <Checkbox
              key='command-checkbox'
              edge="start"
              checked={this.state.logFilter.command}
            />
          </ListItemIcon>
          <ListItemText id='label-command' key='label-command' primary='Command'/>
        </ListItem>);
      filterElement.push(
        <ListItem key='comment' button onClick={this.handleCommentChange}>
          <ListItemIcon key='comment-icon'>
            <Checkbox
              key='comment-checkbox'
              edge="start"
              checked={this.state.logFilter.comment}
            />
          </ListItemIcon>
          <ListItemText id='label-comment' key='label-comment' primary='Comment'/>
        </ListItem>);
    }
    if (filterElement.length !== 0) {
      return (
        <Grid container direction="column"
              justifyContent="center" alignItems="center"
              style={{marginBottom: '3em'}} key='filter-grid'>
          <Grid item sm align='center' key='filter-list-grid'>
            <List dense disablePadding key='filter-list'>
              {filterElement}
            </List>
          </Grid>
          <Grid item sm align='center' key='render-button-grid'>
            <Button
              key='render-button'
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