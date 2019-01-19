import * as React from 'react';
import Helper from '../../helper/helper';
import contacts from '../../texts/contact';
import './contact.css';

interface IContact {    
    label: string;
    icon:string;
    value: string;
    link?: string;
    phoneLink?: string;
}

interface State {
    contacts: IContact[]
}

export default class Contact extends React.Component<{},State> {
    
    readonly state:State = {
        contacts: []
    };

    componentDidMount() {
        this.setState({
            contacts:contacts
        })
    }

    showContacts = () => {
        if(this.state.contacts) {
            return contacts.map((contact:any, index)=>{                
                const key = contact.label ? contact.label : 'key'+index;
                const onClick = contact.link ? () => { window.open(contact.link) } : () => {};
                const href = contact.phoneLink ? contact.phoneLink : "javascript:void(0);";
                const className = contact.link || contact.phoneLink  ? "bullet can-click" : "bullet";
                
                return (
                    <a key={key} className={className} onClick={onClick} href={href} title={contact.label+": "+contact.value}>
                        {Helper.processIconAndLabel(contact)}
                        <span className="value">{contact.value}</span>
                    </a>
                );
            });
        } else {
            return "Loading...";
        }
    }

    render() {
        return (
            <div className="contact">{
                this.showContacts()
            }</div>
        )
    }
}