import React, { Component, Fragment } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import ApplicationProfile from '../../../models/ApplicationProfile';
import { baseImageUrl } from '../../../constant/Url';
import BasePage from './../../BasePage';

class HomeMain extends BasePage {
    constructor(props: any) {
        super(props, "Home", false);
    }
    render() {
        const applicationProfile: ApplicationProfile = this.getApplicationProfile();
        const imageUrl: string = baseImageUrl() + applicationProfile.backgroundUrl;
        return (
            <div className="section-body container-fluid" style={{padding:0}}>
                <div className="jumbotron"
                    style={{
                        margin:'0px',
                        marginTop: '20px',
                        backgroundImage: 'url("' + imageUrl + '")',
                        backgroundSize: 'cover',
                        color: applicationProfile.fontColor??"rgb(0,0,0)"
                    }}
                >
                    <h1 className="display-4">{applicationProfile.name}</h1>
                    <p className="lead">{applicationProfile.shortDescription}</p>
                    <hr className="my-4" />
                    <p>{applicationProfile.welcomingMessage}</p>
                    <Link className="btn btn-primary btn-lg" to="/about" role="button">About Us</Link>
                </div>
            </div>

        )
    }

} 

export default withRouter(connect(
    mapCommonUserStateToProps, 
)(HomeMain))