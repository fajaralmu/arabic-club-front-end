import React, { Component } from 'react'
import AnchorWithIcon from './../../navigation/AnchorWithIcon';
import EntityProperty from '../../../models/settings/EntityProperty';
import AnchorButton from './../../navigation/AnchorButton';

class ExternalEditForm extends Component<{delete(e):any, record: any, entityProperty: EntityProperty, show?: boolean }, any>{

    constructor(props) {
        super(props);
    }

    render() {
        const props = this.props;
        if (props.show == false) return null;
        let link = "";
        let btnClassName = "btn btn-dark btn-sm";
        let iconClassName = "fas fa-edit";
        const entityName = props.entityProperty.entityName;
        if (entityName == 'quiz') {
            link = "/quizmanagement/detail/" + props.record.id;
        } else if (entityName == "quizhistory") {
            link = "/quiz/history/" + props.record.id;
            return (
                <div style={{width:'150px'}}>
                <AnchorWithIcon className={btnClassName} iconClassName={iconClassName} to={link} attributes={{ target: "_blank" }} />
                <AnchorButton onClick={props.delete} className="btn btn-danger btn-sm" iconClassName="fas fa-times"></AnchorButton>
                </div>
            )
        } else {
            return null;
        }


        return <AnchorWithIcon className={btnClassName} iconClassName={iconClassName} to={link} attributes={{ target: "_blank" }} />
    }
}
export default ExternalEditForm;