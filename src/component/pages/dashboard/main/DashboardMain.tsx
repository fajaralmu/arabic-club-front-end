

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import BaseMainMenus from '../../../layout/BaseMainMenus';
import User from './../../../../models/User';
import { baseImageUrl } from './../../../../constant/Url';


class DashboardMain extends BaseMainMenus {
    constructor(props: any) {
        super(props, "Dashboard", true);
    }

    render() {
        const user: User | undefined = this.getLoggedUser();
        if (!user) return null;
        return (
            <div  className=" section-body container-fluid">
                {this.titleTag()}
                <div className="alert alert-info">
                    Welcome, <strong>{user.displayName}  </strong>
                    <p />
                    <p className="badge badge-dark">{user.role?.toLowerCase().split("_")[1]}</p>
                </div>
            </div>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(DashboardMain))