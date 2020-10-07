import React, { Component, useEffect } from 'react';
import { } from 'googlemaps';
import { GMap } from 'primereact/gmap';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Growl } from 'primereact/growl';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';

interface IMaps extends StateProps, DispatchProps {

}

interface IDynamicListStateProps {
    // recordCheckList: any,
    authorities,
    customerListResult
}

type ICustomerMapProps = IMaps & IDynamicListStateProps;

const CustomerMap = (props: ICustomerMapProps) => {
    const customerListResult = props.customerListResult;
    const onMapClick = (event) => {
        console.log(event);
    }

    // click customer
    const onCustomerClick = (event) => {
        const isCustomer = event.overlay !== undefined;
        if (!isCustomer) {
            return;
        }
        const latitude = event.overlay.position.lat();
        const longitude = event.overlay.position.lng();
        event.map.zoom = 2;
        event.map.center = { lat: latitude, lng: longitude };      
    }

    const handleDragEnd = (event) => {
        console.log(event);
    }

    // const onMapDragEnd = (event) => {
    //     console.log(event);
    // }

    const onZoomChanged = () => {
        // console.log("AA");
    }

    const onMapReady = (map) => {
        // console.dir(map);
        // this.setState({
        //     overlays: this.state.overlays
        // })
    }

    const options = {
        center: { lat: 21.0418627, lng: 105.7708316 },
        zoom: 14
    };

    const style = { width: '100%', height: '88vh' };
    // const footer = <div>
    //     {/* <Button label="Yes" icon="pi pi-check" onClick={this.addMarker} />
    //     <Button label="No" icon="pi pi-times" onClick={this.onHide} /> */}
    // </div>;

    return (
        <div className="esr-content-body">
            <GMap overlays={customerListResult} options={options} style={style} onZoomChanged={onZoomChanged} onMapReady={map => onMapReady(map)}
                onMapClick={e => onMapClick(e)} onOverlayClick={e => onCustomerClick(e)} onOverlayDragEnd={e => handleDragEnd(e)} />
        </div>
    );
}

const mapStateToProps = ({ dynamicList, authentication, employeeControlSidebar, employeeList }: IRootState) => ({
    authorities: authentication.account.authorities,
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomerMap)