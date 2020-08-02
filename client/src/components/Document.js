import React, { Component } from 'react';

import './Document.css';

class Document extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="document-holder">
                <div className="document-header">
                    <div className="logo">LOGO GOES HERE</div>
                </div>
                {this.props.children}
            </div>
        )
    }
}

export default Document;