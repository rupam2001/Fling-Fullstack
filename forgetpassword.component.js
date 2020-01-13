import React, { Component } from 'react';
import axios from 'axios';
import "./styles/login.css";
import Cookies from 'js-cookie';
class ForgetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            disable: false,
            notFound: false,
            isOTP: false,
            OTP: '',
            otp_disable: false,
            wrongOTP: false,
            newSignup: false,
            newpass_disable: false,
            newPassword: ''
        }
    }
    emailCollector = (e) => {
        this.setState({ email: e.target.value });
    }
    submitEmail = (e) => {
        e.preventDefault();
        this.setState({
            disable: true,
            notFound: false,

        })
        Cookies.set('email_forgetpass', this.state.email, { expires: 0.000694444 * 4 });//0.000694444*(n) , n = minutes

        axios.post("http://localhost:5000/forgetpassword", { email: this.state.email })
            .then(res => {
                if (res.data.done) {
                    this.setState({
                        disable: false,
                        notFound: false,
                        isOTP: true
                    })
                }
                else {
                    this.setState({
                        notFound: true,
                        disable: false
                    })
                }

            })
            .catch()
    }
    OTPcollector = (e) => {
        this.setState({
            OTP: e.target.value
        })
    }
    submitOTP = (e) => {
        e.preventDefault();
        this.setState({
            otp_disable: true,
            wrongOTP: false
        })
        Cookies.set('otp_forgetpass', this.state.OTP, { expires: 0.000694444 * 2 });//0.000694444*(n) , n = minutes
        const email = Cookies.get('email_forgetpass');
        axios.post("http://localhost:5000/forgetpassword/checkOTP", { OTP: this.state.OTP, email: email })
            .then(res => {
                if (res.data.done) {
                    this.setState({
                        wrongOTP: false,
                        newSignup: true
                    })
                } else {
                    this.setState({ wrongOTP: true, otp_disable: false })
                }
            }).catch()

    }
    passCollector = (e) => {
        this.setState({
            newPassword: e.target.value
        })
    }
    submitNewPassword = (e) => {
        e.preventDefault();
        this.setState({
            newpass_disable: true
        })
        const email = Cookies.get('email_forgetpass');
        const OTP = Cookies.get('otp_forgetpass');
        axios.post("http://localhost:5000/forgetpassword/resetPassword", { email: email, password: this.state.newPassword, OTP: OTP })
            .then(res => {
                if (res.data.done) {
                    this.props.backAfterReset();
                    console.log("from forgetpass");
                }
                else {
                    console.log("getting false!!")
                }
            })
            .catch();
    }
    GOback = () => {
        this.props.goBack();
    }
    render() {
        return (
            <div className="container">
                {(this.state.newSignup) ? (
                    <div className="container">
                        <form className="was-validated" onSubmit={this.submitNewPassword}>
                            <div className="form-group">
                                <label htmlFor="password">New password:</label>
                                <input type="password" onChange={this.passCollector} className="form-control" id="uname" placeholder="Enter new password" name="uname" required></input>
                                <div className="valid-feedback">Valid.</div>
                                <div className="invalid-feedback">Please fill out this field.</div>
                            </div>
                            {(this.state.newpass_disable) ? (<button type="submit" className="btn btn-outline-success btn-block" disabled><span class="spinner-border spinner-border-sm"></span>Reseting...</button>
                            ) : (
                                    <button type="submit" className="btn btn-outline-success btn-block">Reset</button>
                                )}
                        </form>

                    </div>

                ) : (
                        <div>
                            {(this.state.isOTP) ? (
                                <div>
                                    {(this.state.wrongOTP) ? (<h6 className="verifyFail">Wrong OTP</h6>)
                                        : (
                                            <div></div>
                                        )}
                                    <form className="was-validated" onSubmit={this.submitOTP}>
                                        <div className="form-group">
                                            <label htmlFor="pwd">Enter the OTP</label>
                                            <input type="password" onChange={this.OTPcollector} className="form-control" value={this.state.OTP} placeholder="OTP" required></input>
                                            <div className="valid-feedback">Valid.</div>
                                            <div className="invalid-feedback">Please fill out this field.</div>
                                        </div>
                                        {(this.state.otp_disable) ? (<button type="submit" className="btn btn-outline-success btn-block" disabled><span class="spinner-border spinner-border-sm"></span>Checking..</button>)
                                            : (
                                                <button type="submit" className="btn btn-outline-success btn-block" >Submit OTP</button>
                                            )}

                                    </form>
                                </div>
                            )
                                : (<div>
                                    {
                                        (this.state.notFound) ? (
                                            <h6 className="verifyFail">No such email has been found in our database</h6>
                                        )
                                            : (
                                                <div></div>
                                            )}
                                    <form className="was-validated" onSubmit={this.submitEmail}>
                                        <div className="form-group">
                                            <label htmlFor="email">What is your email?</label>
                                            <input type="email" onChange={this.emailCollector} className="form-control" id="uname" placeholder="Enter email" name="uname" required></input>
                                            <div className="valid-feedback">Valid.</div>
                                            <div className="invalid-feedback">Please fill out this field.</div>
                                        </div>
                                        {(this.state.disable) ? (<button type="submit" className="btn btn-outline-success btn-block" disabled><span class="spinner-border spinner-border-sm"></span>Checking..</button>)
                                            : (
                                                <button type="submit" className="btn btn-outline-success btn-block" >send OTP</button>
                                            )}
                                        <br></br>
                                        <a href='#' onClick={this.GOback}>Go Back</a>
                                    </form>
                                </div>
                                )}
                        </div>
                    )}

            </div>

        );
    }
}

export default ForgetPassword;