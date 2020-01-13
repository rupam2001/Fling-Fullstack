import React from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import './styles/content.css';
import Cookies from 'js-cookie';

import Footer from './Footer.component';
class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            click: 0,
            needtoshow: false,
            whattoshow: this.props.comments,
            mycomment: '',
            // reacted: (this.props.reaction == 0) ? (false) : (true),
            reacted: false,
            whichLike: true,//true=liked, false=disliked
            glowlike: 'nothing',//set to like to glow
            glowdislike: 'nothing',
            likeNo: this.props.noOfLikes,
            dislikeNo: this.props.noOfDislikes,
            templikeNo: this.props.noOfLikes + 1,
            tempdislikeNo: this.props.noOfDislikes + 1,
            moreAbout: false,
            // liked: (this.props.reaction == 1) ? (true) : (false),
            // disliked: (this.props.reaction == -1) ? (true) : (false),
            liked: false,
            disliked: false,
            neutral: true,
            reaction: this.props.reaction,
            waiitt: true,
            btns: 'btn btn-default',
            iconLike: 'iconhappy',
            disabled: false,
            disabled2: false,
            posts_iliked: this.props.posts_iliked,
            posts_idisliked: this.props.posts_idisliked,

            post_id: this.props.postid

        }
        // const timer = setTimeout(() => {
        //     // setCount('Timeout called!');
        //     this.updateLikeDislike()
        // }, 3000);

        // this.liked_i();
        // this.disliked_i();
        // this.isreacted(0);
    }
    componentDidMount() {
        this.isreacted();
    }
    isreacted = () => {
        for (var i = 0; i < this.props.posts_iliked.length; i++) {
            if (this.state.post_id == this.state.posts_iliked[i]) {
                this.setState({
                    reacted: true,
                    templikeNo: this.props.noOfLikes,
                    glowlike: 'like'

                })
                return
            }
        }
        for (var i = 0; i < this.props.posts_idisliked.length; i++) {
            if (this.state.post_id == this.state.posts_idisliked[i]) {
                this.setState({
                    reacted: true,
                    tempdislikeNo: this.props.noOfDisLikes,
                    glowdislike: 'like'
                })
                return

            }
        }

    }



    onClickComment = () => {
        this.setState({ click: this.state.click + 1 });
        console.log(this.state.click);
        if (this.state.click % 2 == 1) {
            this.setState({ needtoshow: false })
        }
        if (this.state.click % 2 == 0) {
            this.setState({ needtoshow: true })
        }
    }
    collectComment = (e) => {
        this.setState({
            mycomment: e.target.value
        })
    }
    doComment = (e) => {
        e.preventDefault();

        const email = Cookies.get('email');
        const password = Cookies.get('password');

        if (this.state.mycomment.length > 1) {
            axios.post('http://localhost:5000/doComment', { email: email, password: password, postId: this.props.postid, content: this.state.mycomment })
                .then(res => {
                    if (res.data.done) {
                        this.setState({
                            whattoshow: res.data.newComments
                        })
                        document.getElementById("commentForm").reset();

                    } else {

                    }

                }).catch();
        }
        this.setState({ mycomment: '' });
    }

    updateLikeDislike = (e) => {
        const email = Cookies.get('email');
        const password = Cookies.get('password');
        axios.post('http://localhost:5000/updateLikeDislike', { email: email, password: password, postId: this.props.postid, likeNo: e.like, dislikeNo: e.dislike, liked: e.liked, disliked: e.disliked, neutral: this.state.neutral, text: this.props.texts, category: this.props.category, comments: this.props.comments })
            .then((res) => {
                this.setState({ disabled: false })
                console.log("unabled");
            })
            .catch()

    }

    liked = () => {
        this.setState({ disabled: true })
        if (true) {
            if (!this.state.reacted) {
                this.setState({ glowlike: 'like', reacted: true, likeNo: this.state.templikeNo, liked: true });
                this.updateLikeDislike({ like: this.state.templikeNo, dislike: this.state.dislikeNo, liked: true, disliked: false });
            }
            else {

                if (this.state.glowlike == 'like') {
                    this.setState({ glowlike: 'nothing', likeNo: this.state.templikeNo - 1, liked: false })
                    this.updateLikeDislike({ like: this.state.templikeNo - 1, dislike: this.state.dislikeNo, liked: false, disliked: false });

                }
                else {
                    this.setState({ glowlike: 'like', glowdislike: 'nothing', likeNo: this.state.templikeNo, dislikeNo: this.state.tempdislikeNo - 1, liked: true, disliked: false })
                    this.updateLikeDislike({ like: this.state.likeNo, dislike: this.state.tempdislikeNo - 1, liked: true, disliked: false });
                }
            }
            this.setState({ waiitt: true })
        }
    }
    disliked = () => {
        this.setState({ disabled: true })

        if (true) {
            if (!this.state.reacted) {
                this.setState({ glowdislike: 'like', reacted: true, dislikeNo: this.state.tempdislikeNo, disliked: true })
                this.updateLikeDislike({ like: this.state.likeNo, dislike: this.state.tempdislikeNo, disliked: true, liked: false });

            }
            else {

                if (this.state.glowdislike == 'like') {
                    this.setState({ glowdislike: 'nothing', dislikeNo: this.state.tempdislikeNo - 1, disliked: false })
                    this.updateLikeDislike({ like: this.state.likeNo, dislike: this.state.tempdislikeNo - 1, disliked: false, liked: false });


                }
                else {
                    this.setState({ glowdislike: 'like', glowlike: 'nothing', dislikeNo: this.state.tempdislikeNo, likeNo: this.state.templikeNo - 1, disliked: true, liked: false })
                    this.updateLikeDislike({ like: this.state.templikeNo - 1, dislike: this.state.tempdislikeNo, disliked: true, liked: false });

                }
            }
            this.setState({ waiitt: true });
        }
    }
    ///////////////dupllicatesssss





    ///for about
    showAbout = () => {
        this.setState({
            moreAbout: (this.state.moreAbout) ? (false) : (true)
        })
    }
    render() {

        return (
            <div className={(this.props.category[0] == 'normal' || this.props.category[0] == 'Conf') ? ('box') : ('boxNotice')} key={this.props.postid}>
                {(this.props.category[0] == 'normal' || this.props.category[0] == 'Conf') ? ((this.props.category[0] == 'Conf') ? (<div><span className="love"></span></div>) : (<div><span className="someone"></span></div>)) : (<div><span className="iconNotice"></span></div>)}
                <div className="panel panel-default">
                    <div className="panel-body"><h3 className="heading"> {(this.props.category[0] == 'normal' || this.props.category[0] == 'Conf') ? (<div></div>) : (<div>By: {this.props.category[1]}</div>)}
                        <br></br>  {(this.props.category[0] == 'normal' || this.props.category[0] == 'Conf') ? (<div></div>) : (<div className="more" onClick={this.showAbout}><span className="iconMore"></span></div>)}
                        {(this.state.moreAbout) ? (<div><p>{this.props.category[3]}</p><p>{this.props.category[2]}</p></div>) : (<div></div>)}
                    </h3><br></br><p className="upload">Uploaded on:</p></div>
                    <div ide="panel-footer"><h4 className="contents">{this.props.texts}</h4></div>
                    <div className="ldc">
                        <div >
                            {(this.state.disabled) ? (<div><button className={this.state.btns} id={this.state.glowlike} onClick={this.liked} disabled><span className={this.state.iconLike} key={this.props.postid}></span>{this.state.likeNo}</button>
                                <button className={this.state.btns} id={this.state.glowdislike} onClick={this.disliked} disabled><span className='iconsad' key={this.props.postid + 1}></span>{this.state.dislikeNo}</button>
                                <button className={this.state.btns} ><span className='iconcomment' key={this.props.postid + 2} onClick={this.onClickComment}></span>{this.state.whattoshow.length}</button>
                            </div>
                            )
                                : (
                                    <div>
                                        <button className={this.state.btns} id={this.state.glowlike} onClick={this.liked}><span className={this.state.iconLike} key={this.props.postid}></span>{this.state.likeNo}</button>
                                        <button className={this.state.btns} id={this.state.glowdislike} onClick={this.disliked}><span className='iconsad' key={this.props.postid + 1}></span>{this.state.dislikeNo}</button>
                                        <button className={this.state.btns} ><span className='iconcomment' key={this.props.postid + 2} onClick={this.onClickComment}></span>{this.state.whattoshow.length}</button>
                                    </div>
                                )}

                            {/* <button className={this.state.btns} ><span className='iconcomment' key={this.props.postid + 2} onClick={this.onClickComment}></span>{this.state.whattoshow.length}</button> */}
                        </div>
                    </div>
                    <br></br>
                    {(this.state.needtoshow) ? (
                        <div>
                            <form onSubmit={this.doComment} id="commentForm">
                                <div className="input-group mb-3 ">
                                    <input type="text" className="form-control" placeholder="Write a comment(Anyonomusly)" onChange={this.collectComment}></input>
                                    <div className="input-group-append">
                                        <button className="btn btn-outline-secondary" type="submit">post</button>
                                    </div>
                                </div>
                            </form>
                            <div className="commentHead">Comment Section :</div>
                        </div>
                    ) : (<div></div>)}
                    {(this.state.needtoshow) ? (
                        this.state.whattoshow.map(each => (
                            <div className="eachComment">
                                <p>{each}</p>
                            </div>
                        )
                        )
                    ) : (<div></div>)}
                </div>
            </div>
        )
    }
}

export default class Content extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            contents: [],
            wannaPost: false,
            mypost: '',
            sureLogout: false,
            logouttext: 'logout',
            category: 'normal',
            OffAnm_name: 'none',
            OffAnm_phone: 0,
            OffAnm_about: 'none',
            posts_iliked: [],
            posts_idisliked: []
        }
        this.nextPagePost = this.nextPagePost.bind(this);
    }
    ///loading all the posts
    componentDidMount() {
        const email = Cookies.get('email');
        const password = Cookies.get('password');
        axios.post("http://localhost:5000/allpost", { email: email, password: password, isnext: true, pageNo: 1 })
            .then(res => {
                console.log(res.data.allContents);
                this.setState({
                    contents: res.data.allContents,
                    posts_iliked: res.data.posts_iliked,
                    posts_idisliked: res.data.posts_idisliked
                })
            })
            .catch()
    }
    nextPagePost(newPosts) {
        this.setState({
            contents: newPosts
        })
    }
    postRender = () => {


        return (
            this.state.contents.map((each) => {
                // i += 1;
                return (<Post key={each._id} posts_iliked={this.state.posts_iliked} posts_idisliked={this.state.posts_idisliked} category={each.category} postid={each._id} texts={each.texts} noOfLikes={each.noOfLikes} noOfDislikes={each.noOfDislikes} noOfComments={each.noOfComments} comments={each.comments} />

                )
            })
        )
    }

    addPostButton = () => {
        this.setState({ wannaPost: (this.state.wannaPost) ? (false) : (true) })
    }
    collectPost = (e) => {
        this.setState({
            mypost: e.target.value
        });
        console.log(this.state.mypost);
    }
    postSuccess = (b) => {
        if (b) {
            this.setState({ wannaPost: false })
        }
    }
    onChangeCategory = (e) => {
        // console.log(e.target.value)
        // var type = 'normal'
        // if (e.target.value == 1)
        //     type = 'OffAnm' //stands for official announcement
        // if (e.target.value == 2)
        //     type = 'Conf'  //stands for conffesions
        this.setState({
            category: e.target.value
        })
        // console.log(this.state.category);
    }

    doPost = (e) => {
        e.preventDefault();
        const email = Cookies.get('email');
        const password = Cookies.get('password');
        if (this.state.mypost.length > 5) {
            axios.post('http://localhost:5000/dopost', { email: email, password: password, content: this.state.mypost, category: this.state.category })
                .then(res => {
                    if (res.data.done) {
                        this.postSuccess(true);
                        this.setState({
                            mypost: ''
                        })
                    }
                    else {
                        this.postSuccess(false)
                    }

                })
                .catch()
        }


    }
    areYouSureLogout = () => {
        this.setState({ sureLogout: (this.state.sureLogout) ? (false) : (true) })
    }
    Logout = () => {
        Cookies.remove('email');
        Cookies.remove('password');
        this.props.isloginfunc(false);

    }
    ///Official announcement details
    OffAnm_name = (e) => {
        this.setState({
            OffAnm_name: e.target.value
        })
    }
    OffAnm_phone = (e) => {
        this.setState({
            OffAnm_phone: e.target.value
        })
    }
    OffAnm_about = (e) => {
        this.setState({
            OffAnm_about: e.target.value
        })
    }


    render() {
        return (
            <div>
                <div className="addpostcont"> <button className="postplan" onClick={this.addPostButton}>Add post </button></div>
                {(this.state.wannaPost) ? (
                    <div>
                        <form onSubmit={this.doPost}>
                            <div className='postingForm'>
                                <div className="form-group">
                                    <textarea className="form-control" rows="3" id="comment" onChange={this.collectPost} placeholder={(this.state.category == 'normal' || this.state.category == 'Conf') ? ("Your name will be anonymous!") : ("Your Details will be visible")}></textarea>
                                    <button className='btn' id='postbtn' type='submit'><span className='iconPost'></span></button>
                                </div>
                                <select className="mdb-select md-form" onChange={this.onChangeCategory}>
                                    <option value="" disabled selected>Type</option>
                                    <option value="normal">Default(anonymous)</option>
                                    <option value="OffAnm">Official announcement(your details will be needed)</option>
                                    <option value="Conf">Confession(anonymous)</option>
                                </select>
                            </div>
                            <div>
                            </div>
                            {(this.state.category == 'OffAnm') ? (
                                <div className='OffAnmdiv'>
                                    <div className="form-group">
                                        <label >Your fullname</label>
                                        <input type="text" required className="form-control" placeholder="name" onChange={this.OffAnm_name}></input>
                                        <label >Your Contact number</label>
                                        <input type="number" required className="form-control" onChange={this.OffAnm_phone}></input>
                                        <label >About Yourself</label>
                                        <textarea rows='2' required className="form-control" onChange={this.OffAnm_about} ></textarea>
                                    </div>
                                </div>) : (<div></div>)}
                        </form>
                    </div>) : (<div></div>)}

                {this.postRender()}
                <div className='logoutdiv'>
                    <button type="button" className="btn btn-light " onClick={this.areYouSureLogout}>{(this.state.sureLogout) ? ('cancel') : ('logout')}</button>
                    {
                        (this.state.sureLogout) ? (<button type="button" className="btn btn-outline-danger " onClick={this.Logout}>Are you sure?</button>) : (<div></div>)
                    }
                </div>
                <Footer nextPagePost={this.nextPagePost.bind(this)} />
            </div>
        );
    }
}

