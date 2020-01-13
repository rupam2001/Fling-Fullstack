import React from 'react';
import { Link } from 'react-router-dom';
import Header from './header.component';
import Content from './mainContent.component';

export default class Homepage extends React.Component {
    constructor(props) {
        super(props);

    }
    mainContent = () => {

        if (this.props.islogin) {
            return (
                <div>
                    <Header />
                    <Content isloginfunc={this.props.isloginfunc} />
                </div>

            )
        }
        else {
            return (
                <div>
                    <h1>Don't try to be Smart coz we are Smarter than you ..</h1>
                    <Link to='/'><h3>Go back and login</h3></Link>
                </div>
            )
        }
    }


    render() {


        return (
            this.mainContent()
        )
    }



}