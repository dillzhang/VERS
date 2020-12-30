import React, { Component } from "react";

import "./FileSystem.css";

class FileSystem extends Component {
  // Initialize the state
  constructor(props) {
    super(props);
    this.state = {
      folder: "",
      level: this.props.level,
    };

    this.props.socket.on("roomStateUpdate", ({ state }) => {
      this.setState({ level: state });
    });
  }

  render() {
    return (
      <div className="file-system">
        <div className="central">
          <div className="folders">
            {Object.keys(this.props.folders).map((folder, index) => {
              return (
                <div
                  key={`folder${index}`}
                  className={`folder ${
                    this.props.folders[folder].requirement <= this.state.level
                      ? "available"
                      : "encrypted"
                  } ${this.state.folder === folder ? "selected" : ""}`}
                  onClick={() => {
                    if (
                      this.props.folders[folder].requirement <= this.state.level
                    ) {
                      this.setState({ folder });
                    }
                  }}
                >
                  {this.props.folders[folder].display}
                </div>
              );
            })}
          </div>
          {this.props.folders.hasOwnProperty(this.state.folder) && (
            <div className="files">
              {Object.keys(this.props.folders[this.state.folder].files).map(
                (file, index) => {
                  const fileObject = this.props.folders[this.state.folder]
                    .files[file];
                  return (
                    <div
                      key={`file${index}`}
                      className={`file ${
                        fileObject.requirement <= this.state.level
                          ? "available"
                          : "encrypted"
                      }`}
                      onClick={() => {
                        if (fileObject.requirement <= this.state.level) {
                          this.props.openCallBack(file);
                        }
                      }}
                    >
                      {fileObject.display}
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
        <div className="stats">
          16 items, 545.98 GB available - Currently Decrypting
        </div>
      </div>
    );
  }
}

export default FileSystem;
