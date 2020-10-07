import React from 'react';
import { translate } from 'react-jhipster';

export interface IInviteEmployeesResultProps{
    data: any,
}

const InviteEmployeesResult = (props: IInviteEmployeesResultProps) => {
    const renderComponent = () => {
        return (
            <>
            <div className="block-feedback block-feedback-blue-button">
                {translate('employees.inviteEmployees.form.notify.sendedMail')}
                {props.data.some(el => el.sentEmailError === true) && <a href="https://www.e-sales-support.jp/app/home/p/2" title="" className="button-primary button-activity-registration">{translate('employees.inviteEmployees.form.button.notify')}</a>}
            </div>
            <div className="add-row-wrap">
                <p>{translate('employees.inviteEmployees.form.title.invitedMember')}</p>
            </div>
            <table className="table-default">
                <thead>
                    <tr>
                        <td className="align-middle w50">{translate('employees.inviteEmployees.form.header.memberName')}</td>
                        <td className="align-middle w50">{translate('employees.inviteEmployees.form.header.memberEmail')}</td>
                    </tr>
                </thead>
                {props.data.map((r, i) => (
                <tbody key = {i}>
                    <tr>
                        <td className="align-middle w50">
                            <span className = "word-wrap">
                                {r.memberName}
                            </span>
                        </td>
                        <td className="align-middle w50">
                            <span className = "word-wrap">
                                {r.emailAddress}
                            </span>
                        </td>
                    </tr>
                </tbody>
                ))}
            </table>
            </>
    )}
    return (
        <div>{renderComponent()}</div>
    );
}

export default InviteEmployeesResult;
