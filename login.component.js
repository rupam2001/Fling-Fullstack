import React, { Component } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import './styles/login.css';
import ForgetPassword from './forgetpassword.component';
// import { Redirect } from 'react-router-dom';
// // import myContext from './context/Mycontext';
// import myContext from '../context/Mycontext'

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            isLogin: false,
            wannaSignup: false,
            signupEmail: '',
            signupPass: '',
            showOTP: false,
            OTP: '',
            verified: false,
            wrongOTP: false,
            disableSignup: false,
            disabled_otp: false,
            wrongPass: false,
            forgetpass: false,
            reset: false
        }
    }
    createCookie = (e) => {
        e.preventDefault();
        document.getElementById("loginButton").disabled = true
        const email = this.state.email;
        const password = this.state.password;
        Cookies.set('email', email, { expires: 0.000694444 * 60 });//0.000694444*(n) , n = minutes
        Cookies.set('password', password, { expires: 0.000694444 * 60 });
        console.log("cookies has been set");
        this.onSubmit();
    }
    onSubmit = () => {
        const email = this.state.email;
        const password = this.state.password;
        const fromcookie = false;
        axios.post('http://localhost:5000/islogin', { email: email, password: password, fromcookie: fromcookie })
            .then(res => {
                if (res.data.isLogin) {
                    this.setState({
                        isLogin: res.data.isLogin
                    }
                    )
                    console.log(this.state.isLogin);
                    this.props.isloginfunc(this.state.isLogin);
                }
                else {
                    document.getElementById("loginButton").disabled = false;
                    this.setState({
                        wrongPass: true
                    })
                }
            })
            .catch(err => console.log("not found"));
    }
    componentDidMount() {
        //login useing cookie
        const email = Cookies.get('email');
        const password = Cookies.get('password');
        const fromcookie = true;
        axios.post('http://localhost:5000/islogin', { email: email, password: password, fromcookie: fromcookie })
            .then(res => {
                this.props.isloginfunc(res.data.isLogin);
                this.setState({
                    isLogin: res.data.isLogin
                })
                // this.props.isloginfunc(this.state.isLogin);
                // window.location.reload();
            })
            .catch();
    }
    //for login
    onChangeEmail = (e) => {
        this.setState({
            email: e.target.value
        })
    }
    onChangePassword = (e) => {
        this.setState({
            password: e.target.value
        })
    }
    //
    IwannaSignup = () => {
        this.setState({ wannaSignup: true })
    }
    goBack = () => {
        this.setState({ wannaSignup: false, forgetpass: false });
        console.log("go back", this.state.forgetpass)
    }
    //for signup
    emailCollector = (e) => {
        this.setState({
            signupEmail: e.target.value
        })
    }
    passCollector = (e) => {
        this.setState({
            signupPass: e.target.value
        })
    }
    IamSigningup = (e) => {
        e.preventDefault();
        this.setState({
            disableSignup: true
        })
        axios.post('http://localhost:5000/signup', { email: this.state.signupEmail, password: this.state.signupPass })
            .then(res => {
                if (res.data.success) {
                    //otp hasbeen successfully sent
                    this.setState({ showOTP: true, disableSignup: false })
                } else {
                }
            })
            .catch()
    }
    OTPcollector = (e) => {
        this.setState({
            OTP: e.target.value
        })
    }
    OTPsubmit = (e) => {
        e.preventDefault();
        this.setState({
            disabled_otp: true
        })
        axios.post('http://localhost:5000/otp', { email: this.state.signupEmail, password: this.state.signupPass, OTP: this.state.OTP })
            .then(res => {
                if (res.data.success) {
                    //email hasbeen varified 
                    //rediret to login page with message success
                    this.setState({
                        verified: true,
                        showOTP: false,
                        wannaSignup: false,
                        wrongOTP: false
                    })
                }
                else {
                    //wrong otp try again
                    this.setState({
                        wrongOTP: true,
                        disabled_otp: false
                    })
                }
            })
            .catch()
    }

    forgetPass = () => {
        this.setState({
            forgetpass: true
        })
    }
    backAfterReset = () => {
        this.setState({
            forgetpass: false,
            wannaSignup: false,
            reset: true,
            verified: false
        })
        console.log("in login", this.state.forgetpass)
    }
    render() {
        return (
            <div>
                {(this.state.forgetpass) ? (<ForgetPassword backAfterReset={this.backAfterReset.bind(this)} goBack={this.goBack.bind(this)} />)
                    : (
                        <div>{(this.state.showOTP) ? (
                            <div>
                                <div className="container">
                                    <h5 className="verifyFail">{(this.state.wrongOTP) ? ("Wrong OTP") : ("")}</h5>
                                    <form onSubmit={this.OTPsubmit}>
                                        <div className="form-group">
                                            <label >OTP hasbeen sent to your email address</label>
                                            <input type="password" required className="form-control" placeholder="OTP" onChange={this.OTPcollector}></input>
                                        </div>
                                        <div className='btndiv'>
                                            {(this.state.disabled_otp) ? (
                                                <button type="submit" className="btn btn-outline-secondary btn-block" disabled>
                                                    <span class="spinner-border spinner-border-sm"></span>
                                                    Verifying</button>
                                            ) : (
                                                    <button type="submit" className="btn btn-outline-secondary btn-block" >Verify</button>
                                                )}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        ) : (
                                (this.state.wannaSignup) ? (
                                    <div className="container">
                                        <form className="was-validated" onSubmit={this.IamSigningup}>
                                            <div className="form-group">
                                                <label htmlFor="email">Email:</label>
                                                <input type="email" onChange={this.emailCollector} className="form-control" id="uname" placeholder="Enter email" name="uname" required></input>
                                                <div className="valid-feedback">Valid.</div>
                                                <div className="invalid-feedback">Please fill out this field.</div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="pwd" >Password:</label>
                                                <input type="password" onChange={this.passCollector} className="form-control" id="pwd" placeholder="Enter password" name="pswd" required></input>
                                                <div className="valid-feedback">Valid.</div>
                                                <div className="invalid-feedback">Please fill out this field.</div>
                                            </div>
                                            {(this.state.disableSignup) ? (<button type="submit" className="btn btn-outline-success btn-block" disabled><span className="spinner-border spinner-border-sm"></span>Signing up</button>
                                            ) : (
                                                    <button type="submit" className="btn btn-outline-success btn-block">Signup</button>
                                                )}
                                        </form>
                                        <br></br>
                                        <a href="#" onClick={this.goBack}>Go back</a>
                                    </div>
                                ) : (<div className="container">
                                    <h5 className="verifySuccess">{(this.state.reset) ? ("succefully done reset please log in now..") : ("")}</h5>
                                    <h5 className="verifySuccess">{(this.state.verified) ? ("succefully verified! please log in now..") : ("")}</h5>
                                    {(this.state.wrongPass) ? (<h5 className="verifyFail">Wrong password or email.</h5>) : (<h5></h5>)}
                                    <form onSubmit={this.createCookie}> <div className="form-group">
                                        <label >Email address</label>
                                        <input type="email" className="form-control" required value={this.state.email} placeholder="Enter email" onChange={this.onChangeEmail}></input>
                                    </div>
                                        <div className="form-group">
                                            <label >Password</label>
                                            <input type="password" required value={this.state.password} className="form-control" placeholder="Password" onChange={this.onChangePassword}></input>
                                        </div>
                                        <div className='btndiv'>
                                            <button type="submit" className="btn btn-outline-secondary btn-block" id="loginButton" >Login</button>
                                        </div>
                                    </form>
                                    <br></br>
                                    <button type="submit" className="btn btn-outline-secondary btn-block" onClick={this.IwannaSignup}>SignUp</button>
                                    <br></br>
                                    <a href="#" onClick={this.forgetPass}>Forget your password?</a>
                                </div>)
                            )}</div>

                    )}

            </div>
        );
    }
}

