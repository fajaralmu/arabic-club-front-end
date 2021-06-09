

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import GalleryService from '../../../../services/GalleryService';
import Filter from '../../../../models/commons/Filter';
import Videos from '../../../../models/Videos';
import WebResponse from '../../../../models/commons/WebResponse';
import NavigationButtons from '../../../navigation/NavigationButtons';
import Spinner from '../../../loader/Spinner';
import Snippet from './../../../../models/Snippet';
import Card from './../../../container/Card';
import SimpleWarning from '../../../alert/SimpleWarning';
import BasePage from './../../../BasePage';

class IState {
    videoList: Videos[] = new Array();
    loading: boolean = false;
    filter: Filter = new Filter();
    totalData: number = 0; 
}
class GalleryVideo extends BasePage {
    state: IState = new IState();;
    galleryService: GalleryService;
    constructor(props: any) {
        super(props, "Video Gallery", false);
        this.galleryService = this.getServices().galleryService;
    }
    startLoading = (realtime:boolean) => { this.setState({ loading: true }); super.startLoading(realtime) }
    endLoading = () => { this.setState({ loading: false }); super.endLoading() }
    componentDidMount() {
        this.validateLoginStatus(()=>{
            this.loadRecords();
            this.scrollTop();
        })
    }
    dataLoaded = (response: WebResponse) => {
        this.setState({ videoList: response.entities ?? [], totalData: response.totalData });
    }

    loadRecords = () => {
        if (this.state.loading) return;
        this.commonAjaxWithProgress(
            this.galleryService.getVideos,
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
    onImageClick = (video: Videos) => {
        this.setState({ selectedImage: video });
    }
    removeSelectedImage = () => {
        this.setState({ selectedImage: undefined });
    }
    render() {
        const filter: Filter = this.state.filter; 
        
        return (
            <div className="section-body container-fluid">
                {this.titleTag()}
                <div className="alert alert-info">
                    Welcome to gallery videos
                </div>
                <NavigationButtons
                    activePage={filter.page ?? 0}
                    limit={filter.limit ?? 5} totalData={this.state.totalData}
                    onClick={this.loadRecordsAtPage}
                />
                {this.state.loading ? <Spinner /> : <VideoList onClick={this.onImageClick} video={this.state.videoList} />}
            </div>
        )
    }
}

const VideoList = (props: { video: Videos[], onClick(video: Videos): void }) => {
    const video: Videos[] = props.video;
    return (
        <div className="row">
            {video.map((video, i) => {
                return <VideoItem  video={video} key={"ii-" + i} />
            })}
        </div>
    )
}

const VideoItem = (props: { video: Videos, }) => {
    const video: Videos = Object.assign(new Videos(), props.video);
    const snippet:Snippet|undefined = video.videoSnippet;
    const link= <a className="btn btn-outline-dark btn-sm" target="_blank" href={video.url??"#"} >
        <i className="fa fa-play"/>&nbsp;
        Link
        </a>
    if (!snippet) {
        return (
            <div className="col-md-4">
            <Card>
                <SimpleWarning>No Preview</SimpleWarning>
                {link}
            </Card>
            
            </div>
        )
    }
    return (
        <div className="col-md-4" style={{marginBottom:'10px'}}>
            <div className="card">
                <img src={snippet.thumbnails?.medium?.url??""} className="card-img-top" />
                <div className="card-body">
                    <p className="card-title">{snippet.title}</p>
                    {/* <p className="card-text">{snippet.description}</p> */}
                </div>
                <div className="card-footer">
                    {link}
                </div>
            </div>
        </div>
    )
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(GalleryVideo))