import React, { Component } from 'react';
import Carousel from '../../../container/Carousel';
import AnchorButton from '../../../navigation/AnchorButton';
import Images from './../../../../models/Images';

class IState {

}

class IProps {
    image: Images = new Images();
    back: any = () => {}
}

export default class GalleryPictureDetail extends Component<IProps, IState> {

    constructor(props) {
        super(props);
    }

    render() {
        const image: Images = this.props.image;
        return (
            <div id="GalleryPicture" className="container-fluid">
                <h2>Gallery</h2>
                <AnchorButton onClick={this.props.back} iconClassName="fas fa-angle-left" children="Back" />
                <p/>
                <Carousel imageUrls={image.getFullUrls()} />
                <h4>{image.title}</h4>
                <div className="alert alert-success">
                    <h5>Description</h5>
                    {image.description}
                </div>

            </div>
        )
    }
}
