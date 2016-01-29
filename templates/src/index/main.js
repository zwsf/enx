/**
 * @file index main.js
 * @author luwenlong
 */

import React, {Component} from 'react'
import {render} from 'react-dom'
import './index.styl'

class App extends Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="hello">
                <h1>React Native for iOS</h1>
            </div>
        );
    }
};

export default function init() {
    render(
        <App name="reapp" />,
        document.getElementById('app')
    );
}
