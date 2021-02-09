import React from 'react'
import AnchorWithIcon from './../../navigation/AnchorWithIcon';
import EntityProperty from '../../../models/settings/EntityProperty';

const     ExternalEditForm = (props:{record:any, entityProperty:EntityProperty, show?:boolean}) => {
    
    if (props.show == false) return null;
    let link = "";
    if (props.entityProperty.entityName == 'quiz') {
        link = "/quizmanagement/detail/"+props.record.id;
    } else {
        return null;
    }

    
    return <AnchorWithIcon className="btn btn-dark btn-sm" iconClassName="fas fa-edit" to={link} attributes={{target:"_blank"}} />
}

export default ExternalEditForm;