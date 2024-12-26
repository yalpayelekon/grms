import React from 'react';
import { list_view_pixel_width } from '../CommonComponents/componentStyles.js';

function HouseKeepingRoomCard({ oda }) {
    // console.log(oda)

    const cardHeaderClass = oda.oda_dolu_bos ? 'bg-danger' : 'bg-success';
    const cardOdaColor = 'text-white';
    
    return (
        <div key={oda.oda_no} className="col-md-2 mb-3" style={{ paddingLeft: '30px', paddingTop: '10px', paddingRight: '30px'}}>  
            <div className="card">
                <div className="text-center"> 
                    <div className={`card-header ${cardHeaderClass}`}> <span className={cardOdaColor}><strong>ODA {oda.oda_no}</strong></span> </div>
                    <ul className="list-group list-group-flush ">
                        <li className={`list-group-item ${list_view_pixel_width}`}><strong>DND: </strong> {oda.DND ? 'Aktif' : 'Pasif'}</li>
                        <li className={`list-group-item ${list_view_pixel_width}`}><strong>Laundry: </strong> {oda.Laundry ? 'Aktif' : 'Pasif'}</li>
                        <li className={`list-group-item ${list_view_pixel_width}`}><strong>MUR: </strong> {oda.MUR ? 'Aktif' : 'Pasif'}</li>
                    </ul>
                </div>
                      
            </div>
        </div>
    );
}

export default HouseKeepingRoomCard;