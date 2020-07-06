import React, { Component } from 'react';

import './FileSystem.css';

class FileSystem extends Component {
  // Initialize the state
  constructor(props){
    super(props);
    this.state = {
        visible: true,
    }
  }

  render() {
    switch (this.props.type) {
        case "ref":
            return <button onClick={() => {this.props.callBack(this.props.action)}}>{this.props.value}</button>
        case "img":
            return <img src={this.props.value}></img>
        case "fs":
            return <div className="file-system">
                <div className="file-system-header" onClick={this.toggle}>{`${this.props.value}${this.state.visible ? "" : " [...]"}`}</div>
                <div className={`file-system-body${this.state.visible ? "" : " file-system-hidden"}`}>
                    <ul>
                        {this.props.sub.map(i => {
                            return <li><FileSystem {...i} callBack={this.props.callBack} /></li>
                        })}
                    </ul>
                </div>
            </div>
    }
  }

  toggle = () => {
      this.setState(state => {
          return {visible: !state.visible}
      })
  }
}

export default FileSystem;