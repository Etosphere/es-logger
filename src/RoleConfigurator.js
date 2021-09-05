import React from "react";
import {
  Input,
  InputLabel,
  MenuItem,
  FormControl,
  ListItemText,
  Select,
  Checkbox,
  Chip,
  TextField,
  Button,
  withStyles,
  List,
  ListItem,
  ListItemIcon,
  Grid,
  ListSubheader,
  FormHelperText,
  Grow,
  Fade,
  Divider
} from "@material-ui/core";
import {Description} from "@material-ui/icons";
import ColorPicker from "./ColorPicker";

const styles = (theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 240
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  chip: {
    marginTop: 2,
    marginRight: 2,
    marginBottom: 2,
    maxWidth: 100,
    overflow: "hidden",
    label: {
      overflow: "hidden",
    }
  },
  noLabel: {
    marginTop: theme.spacing(3)
  }
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 5.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

class RoleConfigurator extends React.Component {
  constructor(props) {
    super(props);

    // initialize kpList and dicerList according to YAML header
    let tempKpList = [];
    let tempDicerList = [];
    Object.values(this.props.roleTable.table).forEach((role) => {
      if (role.type === 'kp') {
        tempKpList.push(role.id.toString());
      } else if (role.type === 'dicer') {
        tempDicerList.push(role.id.toString());
      }
    });
    this.state = {
      kpList: tempKpList,
      dicerList: tempDicerList,
    }

    this.handleKpChange = this.handleKpChange.bind(this);
    this.handleDicerChange = this.handleDicerChange.bind(this);
    this.handleRoleNameChange = this.handleRoleNameChange.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.handleRoleFilterChange = this.handleRoleFilterChange.bind(this);
    this.handleCommandFilterChange = this.handleCommandFilterChange.bind(this);
    this.handleCommentFilterChange = this.handleCommentFilterChange.bind(this);
  }

  handleKpChange(event) {
    let tempRoleTable = this.props.roleTable;
    let newKpList = event.target.value;
    Object.keys(tempRoleTable.table).forEach((roleID) => {
      tempRoleTable.setType(roleID, 'pc');
    })
    newKpList.forEach((role) => {
      tempRoleTable.setType(role, 'kp');
    });
    this.state.dicerList.forEach((role) => {
      tempRoleTable.setType(role, 'dicer');
    });
    this.setState({
      kpList: newKpList
    }, () => {
      this.props.onRoleTableChange(tempRoleTable);
    });
  }

  handleDicerChange(event) {
    let tempRoleTable = this.props.roleTable;
    let newDicerList = event.target.value;
    Object.keys(tempRoleTable.table).forEach((roleID) => {
      tempRoleTable.setType(roleID, 'pc');
    })
    this.state.kpList.forEach((role) => {
      tempRoleTable.setType(role, 'kp');
    });
    newDicerList.forEach((role) => {
      tempRoleTable.setType(role, 'dicer');
    });
    this.setState({
      dicerList: newDicerList
    }, () => {
      this.props.onRoleTableChange(tempRoleTable);
    });
  }

  handleRoleNameChange(roleID, newRoleName) {
    let tempRoleTable = this.props.roleTable;
    tempRoleTable.setName(roleID, newRoleName);
    this.props.onRoleTableChange(tempRoleTable);
  }

  handleColorChange(roleID, newRoleColor) {
    let tempRoleTable = this.props.roleTable;
    tempRoleTable.setColor(roleID, newRoleColor);
    this.props.onRoleTableChange(tempRoleTable);
  }

  handleRoleFilterChange(roleID) {
    let tempLogFilter = this.props.logFilter;
    tempLogFilter.role[roleID] = !tempLogFilter.role[roleID];
    this.props.onFilterChange(tempLogFilter);
  }

  handleCommandFilterChange() {
    let tempLogFilter = this.props.logFilter;
    tempLogFilter.command = !tempLogFilter.command;
    this.props.onFilterChange(tempLogFilter);
    this.setState({logFilter: tempLogFilter});
  }

  handleCommentFilterChange() {
    let tempLogFilter = this.props.logFilter;
    tempLogFilter.comment = !tempLogFilter.comment;
    this.props.onFilterChange(tempLogFilter);
  }

  render() {
    const classes = this.props.classes;

    const kpTable = Object.keys(this.props.roleTable.table)
      .filter((roleID) => this.props.roleTable.getType(roleID) === 'kp');
    const dicerTable = Object.keys(this.props.roleTable.table)
      .filter((roleID) => this.props.roleTable.getType(roleID) === 'dicer');
    const pcTable = Object.keys(this.props.roleTable.table)
      .filter((roleID) => this.props.roleTable.getType(roleID) === 'pc');

    const generateListItem = (roleID, disabledCheckbox) => (
      <Grow key={roleID} in timeout={1500} mountOnEnter unmountOnExit>
        <ListItem key={roleID} style={{justifyContent: "center"}}>
          <ListItemIcon style={{minWidth: 0, paddingLeft: 9, paddingRight: 9}}>
            <Checkbox
              edge="start"
              onClick={() => this.handleRoleFilterChange(roleID)}
              checked={this.props.logFilter.role[roleID]}
              disabled={disabledCheckbox}
            />
          </ListItemIcon>
          <TextField
            id={"text-field-role" + roleID}
            color="secondary"
            key={'text-' + roleID}
            InputProps={{
              style: {color: this.props.roleTable.getColor(roleID)}
            }}
            fullWidth
            error={!this.props.roleTable.getName(roleID)}
            value={this.props.roleTable.getName(roleID)}
            onChange={(event) => {
              this.handleRoleNameChange(roleID, event.target.value);
            }}
          />
          <ListItemIcon key={'icon-' + roleID} style={{minWidth: 0, paddingLeft: 9, paddingRight: 9}}>
            <ColorPicker id={roleID}
                         color={this.props.roleTable.getColor(roleID)}
                         onChangeComplete={(color) => {
                           this.handleColorChange(roleID, color.hex)
                         }}/>
          </ListItemIcon>
        </ListItem>
      </Grow>);

    console.log(kpTable, this.props.roleTable);

    return ([
      <Grid container key="kp-and-dicer-configurator-grid">
        <Grid item xs align="right">
          <Fade in timeout={1500}>
            <FormControl className={classes.formControl}>
              <InputLabel id="kp-selection-checkbox-label">Select KP</InputLabel>
              <Select
                labelId="kp-selection-checkbox-label"
                id="kp-selection-checkbox"
                multiple
                error={this.state.kpList.length === 0}
                value={this.state.kpList}
                onChange={this.handleKpChange}
                input={<Input/>}
                renderValue={(selected) => (
                  <div className={classes.chips}>
                    {selected.map((value) => (
                      <Chip key={value}
                            label={this.props.roleTable.getName(value)}
                            className={classes.chip}
                            size="small"/>
                    ))}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {Object.keys(this.props.roleTable.table).map((roleID) => {
                  if (!this.state.dicerList.includes(roleID)) {
                    console.log(roleID, this.state.kpList, this.state.kpList.includes(roleID));
                    return (
                      <MenuItem key={roleID} value={roleID}>
                        <Checkbox checked={this.state.kpList.includes(roleID)}/>
                        <ListItemText primary={this.props.roleTable.getName(roleID)}/>
                      </MenuItem>
                    )
                  } else {
                    return null;
                  }
                })}
              </Select>
              <FormHelperText error hidden={this.state.kpList.length !== 0}>Must set at least one kp.</FormHelperText>
            </FormControl>
          </Fade>
        </Grid>
        <Grid item xs align="left">
          <Fade in timeout={1500}>
            <FormControl className={classes.formControl}>
              <InputLabel id="dicer-selection-checkbox-label">Select dicer</InputLabel>
              <Select
                labelId="dicer-selection-checkbox-label"
                id="dicer-selection-checkbox"
                multiple
                error={this.state.dicerList.length === 0}
                value={this.state.dicerList}
                onChange={this.handleDicerChange}
                input={<Input/>}
                renderValue={(selected) => (
                  <div className={classes.chips}>
                    {selected.map((value) => (
                      <Chip key={value}
                            label={this.props.roleTable.getName(value)}
                            className={classes.chip}
                            size="small"/>
                    ))}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {Object.keys(this.props.roleTable.table).map((roleID) => {
                  if (!this.state.kpList.includes(roleID)) {
                    return (
                      <MenuItem key={roleID} value={roleID}>
                        <Checkbox checked={this.state.dicerList.includes(roleID)}/>
                        <ListItemText primary={this.props.roleTable.getName(roleID)}/>
                      </MenuItem>
                    );
                  } else {
                    return null;
                  }
                })}
              </Select>
              <FormHelperText error hidden={this.state.dicerList.length !== 0}>Must set at least one
                dicer.</FormHelperText>
            </FormControl>
          </Fade>
        </Grid>
      </Grid>,
      <Grid container key="name-and-color-configurator-grid">
        <Grid item xs align="center">
          <Fade in timeout={1500}>
            <List dense style={{maxWidth: '360px'}}>
              {kpTable.length !== 0 &&
              <Fade key="kp" in timeout={1500} mountOnEnter unmountOnExit>
                <ListSubheader key="kp" disableSticky style={{lineHeight: '28px'}}>
                  KP
                </ListSubheader>
              </Fade>}
              {kpTable.map((roleID) => generateListItem(roleID, true))}
              {dicerTable.length !== 0 &&
              <Fade key="dicer" in timeout={1500} mountOnEnter unmountOnExit>
                <ListSubheader key="dicer" disableSticky style={{lineHeight: '28px'}}>
                  Dicer
                </ListSubheader>
              </Fade>}
              {dicerTable.map((roleID) => generateListItem(roleID, true))}
              {pcTable.length !== 0 &&
              <Fade key="pc" in timeout={1500} mountOnEnter unmountOnExit>
                <ListSubheader key="pc" disableSticky style={{lineHeight: '28px'}}>
                  PC
                </ListSubheader>
              </Fade>}
              {pcTable.map((roleID) => generateListItem(roleID, false))}
              <Divider key="divider" variant="middle"/>
              <Grow key="command-checkbox" in timeout={1500} mountOnEnter unmountOnExit>
                <ListItem key='command' button onClick={this.handleCommandFilterChange}>
                  <ListItemIcon key='command-icon'>
                    <Checkbox
                      key='command-checkbox'
                      edge="start"
                      checked={this.props.logFilter.command}
                    />
                  </ListItemIcon>
                  <ListItemText id='label-command' key='label-command' primary='Show Command'/>
                </ListItem>
              </Grow>
              <Grow key="comment-checkbox" in timeout={1500} mountOnEnter unmountOnExit>
                <ListItem key='comment' button onClick={this.handleCommentFilterChange}>
                  <ListItemIcon key='comment-icon'>
                    <Checkbox
                      key='comment-checkbox'
                      edge="start"
                      checked={this.props.logFilter.comment}
                    />
                  </ListItemIcon>
                  <ListItemText id='label-comment' key='label-comment' primary='Show Comment'/>
                </ListItem>
              </Grow>
            </List>
          </Fade>
        </Grid>
      </Grid>,
      <Grid container key="apply-button-grid" style={{marginBottom: "1em"}}>
        <Grid item xs align="center">
          <Button
            key="render-button"
            variant={this.state.kpList.length === 0 && this.state.dicerList.length === 0 ? "outlined" : "contained"}
            color="secondary"
            disabled={this.state.kpList.length === 0 || this.state.dicerList.length === 0}
            endIcon={<Description/>}
            onClick={this.props.onSubmit}>
            Render
          </Button>
        </Grid>
      </Grid>
    ]);
  }
}

export default withStyles(styles, {withTheme: true})(RoleConfigurator);