

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'; 
import BaseMainMenus from '../../layout/BaseMainMenus';
import { mapCommonUserStateToProps } from './../../../constant/stores';


class QuizManagementMain extends BaseMainMenus {
    constructor(props: any) {
        super(props, "Quiz Management", true);
    }

    render() {
        return (
            <div id="QuizManagement" className="container-fluid">
                <h2>Quiz Management</h2>
                <div className="alert alert-info">
                    Welcome, <strong>{this.getLoggedUser()?.displayName}</strong>
                </div>
            </div>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(QuizManagementMain))