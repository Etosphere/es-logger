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
  CircularProgress,
  Button,
  withStyles
} from "@material-ui/core";

const styles = (theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  chip: {
    margin: 2
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
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

class RoleConfigurator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      kpList: [],
      dicerList: [],
    }

    this.handleKpChange = this.handleKpChange.bind(this);
    this.handleDicerChange = this.handleDicerChange.bind(this);
    // this.handleChange = this.handleChange.bind(this);
  }

  handleKpChange(event) {
    this.setState({
      kpList: event.target.value
    })
  }

  handleDicerChange(event) {
    this.setState({
      dicerList: event.target.value
    })
  }

  // handleChange(event) {
  //   let role = event.target.attributes.getNamedItem('data-role').value;
  //   let nodeType = event.target.attributes.getNamedItem('data-node-type').value;
  //   let tempLogFilter = this.props.logFilter;
  //   if (nodeType === 'role') {
  //     tempLogFilter.role[role] = !tempLogFilter.role[role];
  //   } else if (nodeType === 'command') {
  //     tempLogFilter.command = !tempLogFilter.command;
  //   } else if (nodeType === 'comment') {
  //     tempLogFilter.comment = !tempLogFilter.comment;
  //   }
  //   this.props.onChange(tempLogFilter);
  // }

  render() {
    const classes = this.props.classes;
    console.log(this.props);

    // const handleChange = (event) => {
    //   setPersonName(event.target.value);
    // };
    if (this.props.roleTable) {
      return (
        <div>
          <FormControl className={classes.formControl}>
            <InputLabel id="kp-selection-checkbox-label">Select KP</InputLabel>
            <Select
              labelId="kp-selection-checkbox-label"
              id="kp-selection-checkbox"
              multiple
              value={this.state.kpList}
              onChange={this.handleKpChange}
              input={<Input/>}
              renderValue={(selected) => (
                <div className={classes.chips}>
                  {selected.map((value) => (
                    <Chip key={value} label={this.props.roleTable.getName(value)} className={classes.chip}/>
                  ))}
                </div>
              )}
              MenuProps={MenuProps}
            >
              {Object.keys(this.props.roleTable.table).map((roleID) => (
                <MenuItem key={roleID} value={roleID}>
                  <Checkbox checked={this.state.kpList.indexOf(roleID) > -1}/>
                  <ListItemText primary={this.props.roleTable.getName(roleID)}/>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <br/>
          <FormControl className={classes.formControl}>
            <InputLabel id="dicer-selection-checkbox-label">Select dicer</InputLabel>
            <Select
              labelId="dicer-selection-checkbox-label"
              id="dicer-selection-checkbox"
              multiple
              value={this.state.dicerList}
              onChange={this.handleDicerChange}
              input={<Input/>}
              renderValue={(selected) => (
                <div className={classes.chips}>
                  {selected.map((value) => (
                    <Chip key={value} label={this.props.roleTable.getName(value)} className={classes.chip}/>
                  ))}
                </div>
              )}
              MenuProps={MenuProps}
            >
              {Object.keys(this.props.roleTable.table).map((roleID) => (
                <MenuItem key={roleID} value={roleID}>
                  <Checkbox checked={this.state.dicerList.indexOf(roleID) > -1}/>
                  <ListItemText primary={this.props.roleTable.getName(roleID)}/>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <br />
          {/*{personName.map((person) => (*/}
          {/*  <div>*/}
          {/*    <TextField*/}
          {/*      id="outlined-secondary"*/}
          {/*      variant="outlined"*/}
          {/*      color="secondary"*/}
          {/*      size="small"*/}
          {/*      value={person}*/}
          {/*      style={{marginRight: '12px'}}*/}
          {/*    />*/}
          {/*    <CircularProgress />*/}
          {/*  </div>*/}
          {/*))}*/}
          <Button variant="contained" color="primary">
            Submit
          </Button>
        </div>
      );
    } else {
      return (
        <></>
      );
    }
  }
}

export default withStyles(styles, {withTheme: true})(RoleConfigurator);