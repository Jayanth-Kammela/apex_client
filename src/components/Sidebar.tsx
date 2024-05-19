import React from 'react';
import { Link } from 'react-router-dom';
import { LeftArrow, RightArrow } from '../utils/svg';

const Sidebar = ({ isOpen, toggleSidebar }: any) => {
    return (
        <React.Fragment>
            <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
                <div style={{ position: 'absolute', left: 248 }} onClick={toggleSidebar}>
                    {!isOpen ? <RightArrow /> : <LeftArrow />}
                </div>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/add-scenario">Add Scenario</Link></li>
                    <li><Link to="/scenarios">All Scenarios</Link></li>
                    <li><Link to="/vehicles">Add Vehicle</Link></li>
                </ul>
            </div>
        </React.Fragment>
    );
};

export default Sidebar;
