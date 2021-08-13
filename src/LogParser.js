import React from 'react';
import LogScanner from './LogScanner';

class LogParser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      id: 0,
      outputHTML: '',
    };
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleFileRead = this.handleFileRead.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
  }

  handleFileChange(event) {
    this.setState({
      selectedFile: event.target.files[0],
    });
  }

  handleFileRead(event) {
    let content = event.target.result;
    let logScanner = new LogScanner(content);
    let tokenSequence = logScanner.analyze();
    this.setState({outputHTML: JSON.stringify(tokenSequence, null, 2)});
  }

  handleFileUpload() {
    const fileReader = new FileReader();
    fileReader.onload = this.handleFileRead;
    fileReader.readAsText(this.state.selectedFile);
  }

  render() {
    return (
      <div>
        <div>
          <input type="file" onChange={this.handleFileChange}/>
          <input type="button" value="Upload" onClick={this.handleFileUpload}/>
        </div>
        <pre id="output"
             dangerouslySetInnerHTML={{__html: this.state.outputHTML}}/>
      </div>
    );
  }
}

export default LogParser;