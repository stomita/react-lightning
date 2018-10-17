/* @flow */
import React from 'react';
import { compose } from 'recompose';
import { Map } from '../../../../src';

const enhancer = compose(

);

const MapExample = enhancer(props => {
    const markers = [
        {
            location: {
                // Location Information
                City: 'San Francisco',
                Country: 'USA',
                PostalCode: '94105',
                State: 'CA',
                Street: '50 Fremont St',
            },

            // Extra info for tile in sidebar %26 infoWindow
            icon: 'standard:account',
            title: 'Julies Kitchen', // e.g. Account.Name
            description: 'This is a long description'
        },
        {
            location: {
                // Location Information
                City: 'San Francisco',
                Country: 'USA',
                PostalCode: '94105',
                State: 'CA',
                Street: '30 Fremont St.',
            },

            // Extra info for tile in sidebar
            icon: 'standard:account',
            title: 'Tender Greens', // e.g. Account.Name
        }
    ];

    return (
       <div>
           <Map mapMarkers={ markers }/>
       </div>
    );
});

export default MapExample;