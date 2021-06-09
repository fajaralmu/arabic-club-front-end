

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import BaseComponent from '../../../BaseComponent';
import GalleryService from '../../../../services/GalleryService';
import Filter from '../../../../models/commons/Filter';
import WebResponse from '../../../../models/commons/WebResponse';
import NavigationButtons from '../../../navigation/NavigationButtons';
import Spinner from '../../../loader/Spinner';
import { baseDocumentUrl } from '../../../../constant/Url';
import Card from '../../../container/Card';
import SimpleWarning from '../../../alert/SimpleWarning';
import Documents from './../../../../models/Documents';
import DocumentItem from './DocumentItem';
import BasePage from './../../../BasePage';

class IState {
    documentList: Documents[] = new Array();
    loading: boolean = false;
    filter: Filter = new Filter();
    totalData: number = 0;
}
class GalleryDocument extends BasePage {
    state: IState = new IState();;
    galleryService: GalleryService;
    constructor(props: any) {
        super(props, "Document Gallery", false);
        this.galleryService = this.getServices().galleryService;
    }
    startLoading = () => { this.setState({ loading: true }) }
    endLoading = () => { this.setState({ loading: false }) }
    componentDidMount() {
        this.validateLoginStatus(()=>{
            this.loadRecords();
            this.scrollTop();
        });
    }
    dataLoaded = (response: WebResponse) => {
        this.setState({ documentList: response.entities ?? [], totalData: response.totalData });
    }

    loadRecords = () => {
        if (this.state.loading) return;
        this.commonAjax(
            this.galleryService.getDocuments,
            this.dataLoaded,
            this.showCommonErrorAlert,
            this.state.filter
        )
    }
    loadRecordsAtPage = (page: number) => {
        const filter = this.state.filter;
        filter.page = page;
        this.setState({ filter: filter });
        this.loadRecords();
    }

    removeSelectedImage = () => {
        this.setState({ selectedImage: undefined });
    }
    render() {
        const filter: Filter = this.state.filter;

        return (
            <div className="section-body container-fluid">
                {this.titleTag()}
                <div className="alert alert-info"> Welcome to gallery documents</div>
                <NavigationButtons
                    activePage={filter.page ?? 0}
                    limit={filter.limit ?? 5} totalData={this.state.totalData}
                    onClick={this.loadRecordsAtPage}
                />
                {this.state.loading ? <Spinner /> : <DocumentList documents={this.state.documentList} />}
            </div>
        )
    }
}

const DocumentList = (props: { documents: Documents[], }) => {
    const docs: Documents[] = props.documents;
    return (
        <div className="row">
            {docs.map((doc, i) => {
                return <DocumentItem document={doc} key={"ii-" + i} />
            })}
        </div>
    )
}


export default withRouter(connect(
    mapCommonUserStateToProps
)(GalleryDocument))