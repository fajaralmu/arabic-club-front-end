

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';  
import { mapCommonUserStateToProps } from './../../../../constant/stores';
import BaseComponent from './../../../BaseComponent';
import GalleryService from './../../../../services/GalleryService';
import Filter from './../../../../models/Filter';
import Images from './../../../../models/Images';
import WebResponse from './../../../../models/WebResponse';
import NavigationButtons from './../../../navigation/NavigationButtons';
import Spinner from './../../../loader/Spinner';
import { baseImageUrl } from './../../../../constant/Url';
class IState {
    imageList: Images[] = new Array();
    loading: boolean = false;
    filter: Filter = new Filter();
    totalData: number = 0;
}
class GalleryPicture extends BaseComponent {
    state:IState = new IState();;
    galleryService:GalleryService;
    constructor(props: any) {
        super(props, false);
        this.galleryService = this.getServices().galleryService;
    }
    startLoading = () => { this.setState({ loading: true }); }
    endLoading = () => { this.setState({ loading: false }); }
    componentDidMount() {
        document.title = "Picture Gallery";
        this.loadPictures();
    }
    dataLoaded = (response: WebResponse) => {
        this.setState({ imageList: response.entities ?? [], totalData: response.totalData });
    }

    loadPictures = () => {
        if (this.state.loading) return;
        this.commonAjax(
            this.galleryService.getPictures,
            this.dataLoaded,
            this.showCommonErrorAlert,
            this.state.filter
        )
    }
    loadPicturesAtPage = (page: number) => {
        const filter = this.state.filter;
        filter.page = page;
        this.setState({ filter: filter });
        this.loadPictures();
    }
    render() {
        const filter:Filter = this.state.filter;
        return (
            <div id="GalleryPicture" className="container-fluid">
                <h2>Gallery</h2>
                <div className="alert alert-info">
                    Welcome to gallery picture
                </div>
                <NavigationButtons
                    activePage={filter.page ?? 0}
                    limit={filter.limit ?? 5} totalData={this.state.totalData}
                    onClick={this.loadPicturesAtPage}
                />
                {this.state.loading ? <Spinner />:<ImageList images={this.state.imageList}/>}
            </div>
        )
    }
}

const ImageList= (props:{images:Images[]}) => {
    const images:Images[] = props.images;
    return (
        <div className="row">
            {images.map((image,i)=> {
                return <ImageItem image={image} key={"ii-"+i} />
            })}
        </div>
    )
}

const ImageItem = (props:{image:Images}) => {
    const image:Images = props.image;
    const firstImage:string = Images.getFirstImage(image);
    return (
        <div className="col-4">
            <a  className="thumbnail">
            <img src={baseImageUrl+firstImage} width="200" />
            </a>
            <p>{image.title}</p>
        </div>
    )
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(GalleryPicture))