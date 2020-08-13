import React, { Component } from 'react';

import './Document.css';

class Document extends Component {
    render() {
        return (
            <div className="document-holder">
                <div className="document-header">
                    <div className="logo">
                        <img src="/government/gov-wordmark-bw.svg" alt="Government logo" />
                    </div>
                </div>
                {this.props.children}
            </div>
        )
    }
}

export default Document;