import React from 'react';
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import FormatColorTextIcon from "@material-ui/icons/FormatColorText";
import PopupState, {bindTrigger, bindPopover} from 'material-ui-popup-state';
import SketchPicker from "react-color/lib/Sketch";

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
              style={{color: this.state.color, padding: 9}}
              edge="end"
              aria-label="change color"
              component="span"
              {...bindTrigger(popupState)}>
              <FormatColorTextIcon/>
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
              }}>
              <SketchPicker color={this.state.color}
                            onChange={this.handleChange}
                            onChangeComplete={this.props.onChangeComplete}
                            disableAlpha/>
            </Popover>
          </div>
        )}
      </PopupState>
    )
  }
}

export default ColorPicker;