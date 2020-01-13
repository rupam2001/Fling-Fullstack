import React from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import './styles/header.css';

export default class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            headingText: 'Fling',
            noticeText: '',
            isnotice: true,
            notictypes: {
                info: "alert alert-info alert-dismissible fade show",
                good: "alert alert-success alert-dismissible fade show",
                warning: "alert alert-warning alert-dismissible fade show",
                danger: 'alert alert-danger alert-dismissible fade show'
            },
            color: "alert alert-info"
        }
    }
    componentDidMount() {
        axios.get('http://localhost:5000/notice')
            .then(res => {
                var type = this.state.notictypes.info;
                switch (res.data.notictypes) {
                    case 'good':
                        type = this.state.notictypes.good;
                        break;
                    case 'warning':
                        type = this.state.notictypes.warning;
                        break;
                    case 'danger':
                        type = this.state.notictypes.danger;
                        break;
                    default:
                        type = this.state.notictypes.info;
                }
                console.log(res.data.content, res.data.notictypes, res.data.isnotice)
                this.setState({ noticeText: res.data.content, color: type, isnotice: res.data.isnotice })
            })
            .catch();
    }
    closeNotice = () => {
        this.setState({ isnotice: false })
    }

    render() {
        return (
            <div>
                <div className="container">
                    <div className="jumbotron">
                        <h1 className='headingText'>{this.state.headingText}</h1>
                        {/* <div className="iconBox"><span className="iconPerson"></span></div> */}
                    </div>
                    {(this.state.isnotice) ? (
                        <div >
                            <div className={this.state.color}>
                                <button type="button" className="close" data-dismiss="alert" onClick={this.closeNotice}>&times;</button>
                                <strong>Notice:</strong> {this.state.noticeText}
                            </div>
                        </div>
                    ) : (
                            <div></div>
                        )
                    }


                </div>
            </div>
        )
    }
}
{/* <div className="toast">
  <div class="toast-header">
    Toast Header
  </div>
  <div class="toast-body">
  <div className={this.state.color}>
    <strong>Notice:</strong> {this.state.noticeText}
     </div>
  </div>
</div> */}


{/* 
<div className={this.state.color}>
                            <strong>Notice:</strong> {this.state.noticeText}
                        </div> */}