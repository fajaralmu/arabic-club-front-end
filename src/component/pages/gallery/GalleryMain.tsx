

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'; 
import BaseMainMenus from './../../layout/BaseMainMenus';
import { mapCommonUserStateToProps } from './../../../constant/stores';


class GalleryMain extends BaseMainMenus {
    constructor(props: any) {
        super(props, "Gallery");
    }

    render() {
        return (
            <div className="section-body container-fluid">
                {this.titleTag()}
                <div className="alert alert-info">
                    Welcome to gallery page
                </div>
            </div>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(GalleryMain))