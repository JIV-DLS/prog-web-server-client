import React from 'react';
import PropTypes from 'prop-types';
import Toggle from 'react-toggle';
import {faMoon, faSun} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import 'react-toggle/style.css';
import './theme.scss';

export const ToggleModeNight = ({mode, onChange}) => (
    <div className="ToggleMode">
        <Toggle
            id="mode"
            icons={{
                checked: (
                    <FontAwesomeIcon icon={faMoon} className="fa faMoon"/>
                ),
                unchecked: (
                    <FontAwesomeIcon icon={faSun} className="fa faSun"/>
                ),
            }}
            defaultChecked={mode}
            onChange={onChange}
        />
    </div>
);

ToggleModeNight.propTypes = {
    mode: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
};

ToggleModeNight.defaultProps = {
    mode: false,
};
