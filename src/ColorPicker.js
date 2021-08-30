import React from 'react';
import {IconButton, Popover} from "@material-ui/core";
import {FormatColorText} from "@material-ui/icons";
import {SketchPicker} from "react-color";
import PopupState, {bindTrigger, bindPopover} from 'material-ui-popup-state';

class ColorPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: this.props.color
    }
  }

  handleChange = (color) => {
    this.setState({color: color.hex})
  };

  render() {
    return (
      <PopupState variant="popover" popupId="color-picker-popup-popover">
        {(popupState) => (
          <div>
            <IconButton
              style={{color: this.state.color}}
              aria-label="change color"
              component="span"
              {...bindTrigger(popupState)}>
              <FormatColorText/>
            </IconButton>
            <Popover
              {...bindPopover(popupState)}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
            >
              <SketchPicker color={this.state.color}
                            onChange={this.handleChange}
                            onChangeComplete={this.props.onChangeComplete}/>
            </Popover>
          </div>
        )}
      </PopupState>
    )
  }
}

export default ColorPicker;