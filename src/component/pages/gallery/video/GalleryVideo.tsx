

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import BaseComponent from '../../../BaseComponent';
import GalleryService from '../../../../services/GalleryService';
import Filter from '../../../../models/Filter';
import Videos from '../../../../models/Videos';
import WebResponse from '../../../../models/WebResponse';
import NavigationButtons from '../../../navigation/NavigationButtons';
import Spinner from '../../../loader/Spinner';
import { baseImageUrl  } from '../../../../constant/Url'; 
import Snippet from './../../../../models/Snippet';
import Card from './../../../container/Card';
import AnchorWithIcon from '../../../navigation/AnchorWithIcon';
import SimpleWarning from '../../../alert/SimpleWarning';

class IState {
    videoList: Videos[] = new Array();
    loading: boolean = false;
    filter: Filter = new Filter();
    totalData: number = 0; 
}
class GalleryVideo extends BaseComponent {
    state: IState = new IState();;
    galleryService: GalleryService;
    constructor(props: any) {
        super(props, false);
        this.galleryService = this.getServices().galleryService;
    }
    startLoading = (realtime:boolean) => { this.setState({ loading: true }); super.startLoading(realtime) }
    endLoading = () => { this.setState({ loading: false }); super.endLoading() }
    componentDidMount() {
        document.title = "Video Gallery";
        this.loadRecords();
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
            <div id="GalleryVideo" className="container-fluid">
                <h2>Videos</h2>
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
    const link= <a className="btn btn-outline-dark btn-sm" target="_blank" href={video.url} >
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
                <img src={snippet.thumbnails?.medium?.url} className="card-img-top" />
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