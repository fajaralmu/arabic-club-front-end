

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
import GalleryPictureDetail from './GalleryPictureDetail';
class IState {
    imageList: Images[] = new Array();
    loading: boolean = false;
    filter: Filter = new Filter();
    totalData: number = 0;
    selectedImage?: Images
}
class GalleryPicture extends BaseComponent {
    state: IState = new IState();;
    galleryService: GalleryService;
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
    onImageClick = (image: Images) => {
        this.setState({ selectedImage: image });
    }
    removeSelectedImage = () => {
        this.setState({ selectedImage: undefined });
    }
    render() {
        const filter: Filter = this.state.filter;
        const selectedImage: Images | undefined = this.state.selectedImage;
        if (selectedImage) {
            return (
                <GalleryPictureDetail image={selectedImage} back={this.removeSelectedImage} />)
        }
        return (
            <div id="GalleryPicture" className="container-fluid">
                <h2>Pictures</h2>
                <div className="alert alert-info">
                    Welcome to gallery picture
                </div>
                <NavigationButtons
                    activePage={filter.page ?? 0}
                    limit={filter.limit ?? 5} totalData={this.state.totalData}
                    onClick={this.loadPicturesAtPage}
                />
                {this.state.loading ? <Spinner /> : <ImageList onClick={this.onImageClick} images={this.state.imageList} />}
            </div>
        )
    }
}

const ImageList = (props: { images: Images[], onClick(image: Images): void }) => {
    const images: Images[] = props.images;
    return (
        <div className="row">
            {images.map((image, i) => {
                return <ImageItem key={"img-item-" + i} onClick={props.onClick} image={image} />
            })}
        </div>
    )
}

const ImageItem = (props: { image: Images, onClick(image: Images): void }) => {
    const image: Images = Object.assign(new Images(), props.image);
    const firstImage: string = image.getFirstImage();
    return (
        <div style={{ marginBottom: '5px' }} className="col-md-3">
            <div className="card">
                <img onClick={(e) => props.onClick(image)} src={baseImageUrl() + firstImage} className="card-img-top" />
                <div style={{ position: 'absolute', right: 5, bottom: 5 }} >
                    <a className="btn btn-outline-dark btn-sm" onClick={(e) => props.onClick(image)} >
                        <i className="fas fa-angle-double-right" />
                    </a>
                </div>
                <div className="card-body">
                    <h5 className="card-title">{image.title}</h5>
                </div>
            </div>
        </div>
    )
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(GalleryPicture))