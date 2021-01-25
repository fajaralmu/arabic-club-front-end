

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';  
import { mapCommonUserStateToProps } from './../../../../constant/stores';
import BaseComponent from './../../../BaseComponent';


class GalleryPicture extends BaseComponent {
    constructor(props: any) {
        super(props, false);
    }

    componentDidMount() {
        document.title = "Picture Gallery";
    }

    render() {
        return (
            <div id="GalleryPicture" className="container-fluid">
                <h2>Gallery</h2>
                <div className="alert alert-info">
                    Welcome to gallery picture
                </div>
            </div>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(GalleryPicture))