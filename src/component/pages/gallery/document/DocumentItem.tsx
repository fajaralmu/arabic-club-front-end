import React, { Component, Fragment } from 'react'
import { baseDocumentUrl } from '../../../../constant/Url';
import Documents from './../../../../models/Documents';
import Card from './../../../container/Card';
import AnchorButton from './../../../navigation/AnchorButton';
interface Props { document: Documents }
class State {
    showLink: boolean = false;
}
export default class DocumentItem extends Component<Props, State>{

    state: State = new State();
    constructor(props) {
        super(props);
        this.state.showLink = this.props.document.accessCode == undefined || this.props.document.accessCode == "";
    }
    showAccessCodeInput = (e) => {
        const code = prompt("Enter access code for " + this.props.document.title);
        if (code == this.props.document.accessCode) {
            this.setState({ showLink: true });
        } else {
            alert("Invalid")
        }
    }
    render = () => {
        const doc: Documents = Object.assign(new Documents(), this.props.document);
        return (
            <div className="col-md-3 text-center">
                <Card>
                    <h5>{doc.title}</h5>
                    <p>{doc.description}</p>
                    <hr />
                    {this.state.showLink ?
                        <Fragment>
                            <ExtraViewer doc={doc} />
                            <a className="btn btn-outline-dark btn-sm" target="_blank" href={baseDocumentUrl() + doc.fileName} >
                                <i className="fa fa-link" />&nbsp;Link ({doc.getExtension()})
                            </a>
                        </Fragment>
                        : <AnchorButton onClick={this.showAccessCodeInput}
                            className="btn btn-dark btn-sm" children="Unlock" iconClassName="fas fa-key" />}
                </Card>
                <p />
            </div>
        )

    }
}

const ExtraViewer = (props: { doc: Documents }) => {
    const doc = props.doc;
    return (
        doc.getExtension().toLowerCase() == 'mp3' ?
            <video controls height={30} style={{width:"100%"}} src={baseDocumentUrl() + doc.fileName} />
            : null
    )
}