import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNo: 1,
            isLastPage: false,
            shouldICallnextPage_function: true,
            times: 0,
            numberOfPost: 2

        }
    }
    loadNewPost = (e, pagno) => {
        const email = Cookies.get('email');
        const password = Cookies.get('password');

        axios.post('http://localhost:5000/allpost', { email: email, password: password, pageNo: pagno, isnext: e })
            .then(res => {
                if (res.data.allContents.length < this.state.numberOfPost) {
                    this.setState({
                        isLastPage: true
                    })
                    if (res.data.allContents.length != 0) {
                        this.setState({
                            shouldICallnextPage_function: false
                        });

                    }
                    else {

                        this.props.nextPagePost(res.data.allContents);
                        if (e)
                            this.setState({
                                times: this.state.times + 1,
                                pageNo: this.state.pageNo + 1


                            })
                        else
                            this.setState({
                                times: this.state.times - 1,
                                pageNo: this.state.pageNo - 1


                            })
                    }
                }
                else {
                    this.props.nextPagePost(res.data.allContents);
                    if (e)
                        this.setState({
                            isLastPage: false,
                            shouldICallnextPage_function: true,
                            times: this.state.times + 1,
                            pageNo: this.state.pageNo + 1
                        })
                    else {
                        this.setState({
                            isLastPage: false,
                            shouldICallnextPage_function: true,
                            times: this.state.times - 1,
                            pageNo: this.state.pageNo - 1
                        })
                    }

                }
            })
            .catch()


    }

    loadnext = () => {
        if (!this.isLastPage) {
            this.loadNewPost(true, this.state.pageNo + 1);
        }

    }
    loadPre = () => {
        // this.setState({
        //     isLastPage: false,
        //     shouldICallnextPage_function: true,
        //     times: this.state.times - 1,
        //     pageNo: this.state.pageNo - 1
        // })
        this.loadNewPost(false, this.state.pageNo - 1);
    }


    render() {
        return (
            <div>
                {(this.state.isLastPage) ? (<div><button className='btn btn-outline-secondary btn-block' onClick={this.loadPre} >previous page</button></div>)
                    : (<div>{(this.state.times >= 1) ? (<div><button className='btn btn-outline-secondary btn-block' onClick={this.loadPre}>previous page</button></div>) : (<div></div>)}
                        <div><button className='btn btn-outline-secondary btn-block' onClick={this.loadnext}>next page</button></div></div>
                    )}

            </div>
        );
    }
}

export default Footer;