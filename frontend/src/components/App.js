import React, {Component} from 'react';
import {render} from 'react-dom';
import HomePage from './HomePage';


class App extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div>
                <div class="bg"></div>
                <div class="bg bg2"></div>
                <div class="bg bg3"></div>
                <div className="center content">
                    <HomePage />
                </div>
            </div>
        );
    }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
export default App;