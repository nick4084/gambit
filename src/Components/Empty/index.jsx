import React from 'react';
import './index.css';

export const Empty = (props) => {
    return (
        <div className="empty-container">
            <i className="icon-social-dropbox"></i>
            {/* <img src={require('../../../src/assets/img/brand/logo.svg')}></img> */}
            <span>{props.title}</span>
        </div>
    );
} 
