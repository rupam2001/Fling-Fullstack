const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
mongoose.connect(".........");
require('dotenv').config();
var app = express();
app.use(cors());
app.use(express.json());
var nodemailer = require('nodemailer');


//database stuffs
var userSchema = mongoose.Schema({ //////////////////////////////////////////User Schema
    userName: String,
    email: String,
    password: String,
    posts: [{ type: mongoose.Types.ObjectId }],
    posts_iliked: [{ type: mongoose.Types.ObjectId }],
    posts_idisliked: [{ type: mongoose.Types.ObjectId }]

});

var postSchema = mongoose.Schema({   /////////////////////////////////////////Post Schema
    texts: String,
    category: [{ type: String }],
    noOfLikes: Number,
    noOfDislikes: Number,
    comments: [{ type: String }]
});
var User = mongoose.model('user9_3', userSchema);////////////////////////////////////////model User
var Post = mongoose.model('post9_3', postSchema);///////////////////////////////////////model Post

var OtpShema = new mongoose.Schema(  ///////OTP Schema
    {
        email: String,
        password: String,
        otp: String

    }
);
var OtpSchema_forgetpass = new mongoose.Schema({
    email: String,
    otp: String
})
var OTP_DB_FORGETPASS = mongoose.model('Otpbase_test_forgetpass_4', OtpSchema_forgetpass)
var OTP_DB = mongoose.model('Otpbase_test9_2', OtpShema);  ////////////////////OTP model
//otp mailer
var transport = nodemailer.createTransport(  ////////////////////////mailing engine
    {
        service: 'gmail',
        auth: {
            user: 'yor mail',
            pass: 'password'
        }
    }
);
app.post('/signup', function (req, res) {//send otp
    //we also have to check if the user had already signed up before
    var otp_code = Math.floor(Math.random() * 100000);//creating the otp code
    var usermail = req.body.email;
    var userPassword = req.body.password;
    if (true)//for debugging purpose
    {
        //creating the mail
        var mailOptions = {
            from: '.....................',
            to: usermail, ///also have to check if the mail is valid
            subject: 'OTP varification for JEC-Fling',
            text: `Hi!!,Your OTP for JEC-Fling is : ${otp_code}`
        }
        //sending the mail
        transport.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
                //we need to inform the user
                res.json({ success: false });
            }
            else {
                console.log('Email has been sent!');
                var temp_details = { email: usermail, password: userPassword, otp: otp_code }
                OTP_DB.create(temp_details, function (err, details) {
                    if (err) {
                        console.log(err);
                        //we need to inform the user
                        res.json({ success: false });
                    }
                    else {
                        res.json({ success: true });
                    }
                })
            }
        })
    }

})
//otp verification
app.post('/otp', function (req, res) {
    var candidate_otp = req.body.OTP;
    var useremail = req.body.email;
    var userPassword = req.body.password;
    // console.log("hiiiii")
    if (useremail && userPassword)
        OTP_DB.findOne({ email: useremail, password: userPassword }, function (err, found_user) {
            if (err) {
                console.log(err);
                //we have to infrom user that Wrong OTP
            }
            else {
                if (candidate_otp == found_user.otp) {
                    ///otp has been varified
                    var final_user = {
                        email: found_user.email,
                        password: found_user.password
                    }
                    //creating the user
                    User.create(final_user, function (err, created_user) {
                        if (err) {
                            console.log(err);
                            //we have to inform user that his otp is crrect but something went wrong in the database
                            res.json({ success: false });
                            OTP_DB.deleteOne({ email: useremail, password: userPassword }, function (err, obj) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("deleted from otp database successfully")
                                }
                            })
                        }
                        else {
                            console.log(created_user);
                            res.json({ success: true });
                            OTP_DB.deleteOne({ email: useremail, password: userPassword }, function (err, obj) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("deleted from otp database successfully")
                                }
                            })
                        }
                    })
                }
                else {
                    res.json({ success: false });

                }
            }
        })
})
////////////////////////////////////////entry point
app.post('/islogin', function (req, res) {
    if (req.body.password && req.body.email) {
        if (req.body.fromcookie) {
            // if (req.body.email == 'test@gmail.com') {
            //     res.json({ isLogin: true, postIliked: ['1', '2'], postIdisliked: ['3', '4'] });
            //     console.log('from cookie matched');
            // }
            console.log('from cookie')
            User.findOne({ email: req.body.email }, function (err, found_user) {
                if (err) {
                    console.log(err);
                    res.json({ isLogin: false });
                }
                else {
                    if (found_user.password == req.body.password) {
                        //successfully loged in using cookie
                        res.json({
                            isLogin: true,//have to add post i liked/disliked
                            posts_iliked: found_user.posts_iliked,
                            posts_idisliked: found_user.posts_idisliked
                        })
                    }
                    else {
                        res.json({ isLogin: false });
                    }
                }
            })
            console.log('from cookie');
        }
        if (!req.body.fromcookie) {
            User.findOne({ email: req.body.email }, function (err, found_user) {
                if (err) {
                    console.log(err);
                    res.json({ isLogin: false });
                }
                else {
                    if (found_user)
                        if (found_user.password == req.body.password) {
                            //successfully loged in
                            res.json({
                                isLogin: true,//have to add post i liked/disliked
                                posts_iliked: found_user.posts_iliked
                            })
                        }
                        else {
                            console.log("pass missmatched")
                            res.json({ isLogin: false });
                        }
                }
            })
            console.log('not from cookie');
        }
    }
    console.log("hitt")

})

app.get('/notice', function (req, res) {
    var notictypes = "good";  //good/warning/danger/info
    var content = "Hi! i am a notice from server.Please add this site in homescreen .Swipe down to refresh!";
    var isnotice = true;///////////////////////////////////////////set to false to remove notice
    res.json({ notictypes: notictypes, isnotice: isnotice, content: content })
    console.log("notice")
});
app.get('/s', function (req, res) {
    console.log('work')
    res.send('hi')
    User.findOne({ userName: 'Rupam jyoti Das' }, function (err, user) {
        if (err)
            console.log(err);
        else {
            console.log(user);
            Post.findById(user.post[0], function (err, post) {
                if (err)
                    console.log(err)
                else
                    console.log(post);
            })
        }
    })
})

/////////////////////////////////////////////////Forget passs
app.post('/forgetpassword', function (req, res) {
    var email = req.body.email;
    if (email) {
        User.findOne({ email: email }, function (err, found_user) {
            if (err) {
                console.log(err);
            }
            else {

                ////////////////////////email hasbeen found
                //creating the mail
                var otp_code = Math.floor(Math.random() * 100000);//creating the otp code

                var mailOptions = {
                    from: '',
                    to: email, ///also have to check if the mail is valid
                    subject: 'OTP for JEC-Fling (for reset password)',
                    text: `Hi!!,Your OTP for JEC-Fling is (reset password) : ${otp_code}`
                }
                //sending the mail
                transport.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('email hasbeen sent for reset password')
                        var newUser_otp = { email: email, otp: otp_code };
                        OTP_DB_FORGETPASS.create(newUser_otp, function (error, callbackuser) {
                            if (error) {
                                console.log(error);
                            }
                            else {
                                ///////////////////////successs
                                console.log('forget pass saved');
                                res.json({ done: true });
                                console.log(callbackuser);
                            }
                        })
                    }
                })

            }
        })
    }
    else {
        res.json({ done: false })
    }
})

app.post('/forgetpassword/checkOTP', function (req, res) {
    var email = req.body.email;
    var OTP = req.body.OTP;
    if (email && OTP) {
        OTP_DB_FORGETPASS.findOne({ email: email }, function (error, found_otp) {
            if (error) {
                console.log(error);
            }
            else {
                if (found_otp.otp == OTP) {
                    res.json({ done: true });
                }
                else {
                    res.json({ done: false });
                }
            }
        })
    }
})

app.post('/forgetpassword/resetPassword', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var OTP = req.body.OTP //for extra security
    console.log('rest hit')
    if (email && password && OTP) {
        OTP_DB_FORGETPASS.findOne({ email: email }, function (error, found_otp) {
            if (error) {
                console.log(error);
            }
            else {
                if (found_otp.otp == OTP) {
                    User.findOne({ email: email }, function (error, found_user) {
                        found_user.password = password;
                        console.log("//////////////////")
                        found_user.save(function (error, updatedUser) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log("reset done!");
                                OTP_DB_FORGETPASS.deleteOne(found_otp);////////////////clearing
                                res.json({ done: true });
                            }
                        })

                    })
                }
            }
        })
    }
})
//////////////////////////////////////////////////////////
app.post('/allpost', function (req, res) {
    var password = req.body.password;
    var email = req.body.email;
    var pageNo = req.body.pageNo;
    var isnext = req.body.isnext;
    var sliceit;
    var amountToSend = 2;
    User.findOne({ email: email }, function (err, found_user) {
        if (err) {
            console.log(err);
        }
        else {
            if (found_user.password == password) {
                Post.find(function (err, found_post) {
                    if (err) {
                        console.log(err);
                        res.json([{
                            postid: '1',
                            texts: 'Something went wrong in the database please contact/report to 8638047859(whatsapp)',
                            category: ['OfAnm', 'Rupam Jyoti Das', '8638047859', 'Co-founder of JEC-Fling'],
                            noOfLikes: 0,
                            noOfDislikes: 0,
                            comments: ['hi']
                        }]);

                    }
                    else {
                        found_post = found_post.reverse();
                        if (found_post.length == 0) {
                            res.json({
                                allContents: [{
                                    postid: '1',
                                    texts: 'Hii, be the first one to post!!!',
                                    category: ['OfAnm', 'Rupam Jyoti Das', '8638047859', 'from JEC-Fling'],
                                    noOfLikes: 0,
                                    noOfDislikes: 0,
                                    comments: []
                                }],
                                posts_iliked: found_user.posts_iliked,
                                posts_idisliked: found_user.posts_idisliked
                            });

                        }
                        else {
                            ///////////////////////////////mil gaya
                            var finalData = [];
                            if (isnext) {
                                for (var i = (pageNo - 1) * amountToSend; i < found_post.length; i++) {
                                    if (i == pageNo * amountToSend) { break; }
                                    finalData.push(found_post[i]);
                                }
                            }
                            else {
                                for (var i = (pageNo) * amountToSend; i > 0; i--) {
                                    if (i == (pageNo - 1) * amountToSend) { break; }
                                    finalData.push(found_post[i]);
                                    console.log(i, pageNo)
                                }
                            }
                            if (finalData.length == 0) {
                                finalData.push({
                                    _id: 1,
                                    text: 'lastpage',
                                    noOfLikes: 0,
                                    noOfDislikes: 0,
                                    noOfComments: 0,
                                    category: ['OfAnm', "Rupam jyoti Das"]
                                })
                            }
                            console.log("send hbo lge")
                            res.json({
                                allContents: finalData, posts_iliked: found_user.posts_iliked,
                                posts_idisliked: found_user.posts_idisliked
                            });
                        }
                    }
                })
            }
            else {
                res.json([{
                    postid: '1',
                    texts: 'Hii, be the first one to post!!!',
                    category: ['OfAnm', 'Rupam Jyoti Das', '8638047859', ' from JEC-Fling'],
                    noOfLikes: 0,
                    noOfDislikes: 0,
                    comments: ['hi']
                }]);
            }
        }
    })


})
app.post('/dopost', function (req, res) {
    if (req.body.email && req.body.password) {
        User.findOne({ email: req.body.email, password: req.body.password }, function (err, found_user) {
            if (err) {
                console.log(err);
                res.json({ done: false });
            }
            else {
                Post.create({
                    texts: req.body.content,
                    category: req.body.category,
                    noOfLikes: 0,
                    noOfDislikes: 0
                }, function (err, created_post) {
                    if (err) {
                        console.log(err);
                        res.json({ done: false });
                    }
                    else {
                        found_user.posts.push(created_post); //we are sending the whole object but it will take only id as we initialized before
                        res.json({ done: true });
                        console.log('posted successfully!!');
                    }
                })
            }
        })
    }
})


app.post('/doComment', function (req, res) {
    if (req.body.email && req.body.password) {
        var email = req.body.email;
        var password = req.body.password;
        var postId = req.body.postId;
        var content = req.body.content;
        console.log(email, password, postId, content);
        User.findOne({ email: email, password: password }, function (err, found_user) {
            if (err) {
                console.log(err);
            }
            else {
                Post.findById(postId, function (err, found_post) {
                    if (err) {
                        console.log(err);
                        res.json({ done: false })

                    }
                    else {
                        console.log('commented')
                        found_post.comments.push(content);//pushing
                        found_post.save(function (err, savedComment) {//saving
                            if (err) {
                                console.log(err);
                                res.json({ done: false })

                            } else {
                                console.log('saved');
                                res.json({ done: true, newComments: found_post.comments })
                            }
                        })
                        console.log(found_post);
                    }
                })
            }
        })
    }
})
app.post('/updateLikeDislike', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var liked_no = req.body.likeNo;
    var disliked_no = req.body.dislikeNo;
    var text = req.body.texts;
    var category = req.body.category;
    var comment = req.body.comments;
    var postId = req.body.postId;
    var newPost = {
        texts: text,
        category: category,
        noOfLikes: liked_no,
        noOfDislikes: disliked_no,
        comments: comment
    }
    // console.log(email, password)
    var isliked = req.body.liked, isdisliked = req.body.disliked;
    if (email && password)
        User.findOne({ email: email, password: password }, function (err, found_user) {
            if (err) {
                console.log(err);
            }
            else {

                Post.findById(postId, function (err, found_post) {
                    if (err) {
                        console.log(err);
                        res.json({ done: false })

                    }
                    else {
                        // found_post.noOfLikes = liked_no;
                        // found_post.noOfDislikes = disliked_no;


                        if (!isliked && !isdisliked) {
                            //finding in post_i_liked
                            // var duplicate_in_liked=false
                            var to = found_user.posts_iliked.length;

                            //remove the postid from the post_i_liked array
                            for (var i = 0; i < to; i++) {
                                if (found_user.posts_iliked[i] == postId) {
                                    found_user.posts_iliked.splice(i, 1); ///////////////////////////
                                    found_post.noOfLikes = found_post.noOfLikes - 1;
                                }
                            }
                            var to2 = found_user.posts_idisliked.length;
                            for (var i = 0; i < to2; i++) {
                                if (found_user.posts_idisliked[i] == postId) {
                                    found_user.posts_iliked.splice(i, 1); ///////////////////////////
                                    found_post.noOfDislikes = found_post.noOfDislikes - 1;
                                }
                            }
                            found_user.save()
                            found_post.save();////////////////////////////////////
                            console.log(found_user)
                            res.json({ done: true })
                        }
                        else if (isliked && !isdisliked) {
                            //removal from post_i_disliked (if any)
                            var to = found_user.posts_idisliked.length;
                            for (var i = 0; i < to; i++) {
                                if (found_user.posts_idisliked[i] == postId) {
                                    found_user.posts_iliked.splice(i, 1); ///////////////////////////
                                    found_post.noOfDislikes = found_post.noOfDislikes - 1;
                                }
                            }
                            //
                            var already = false;
                            var to2 = found_user.posts_iliked.length;

                            for (var i = 0; i < to2; i++) {
                                if (found_user.posts_iliked[i] == postId) {
                                    ///////////////////////////
                                    already = true;
                                }
                            }
                            if (!already) {
                                //add to post_i_liked
                                found_user.posts_iliked.push(postId);
                                found_post.noOfLikes = found_post.noOfLikes + 1;

                                found_post.save();////////////////////////////////////
                                console.log(found_user);
                                found_user.save()
                                res.json({ done: true })
                            }
                            else {
                                //exit
                            }
                        }
                        else {
                            var to = found_user.posts_iliked.length;

                            //remove the postid from the post_i_liked array
                            for (var i = 0; i < to; i++) {
                                if (found_user.posts_iliked[i] == postId) {
                                    found_user.posts_iliked.splice(i, 1); ///////////////////////////
                                    found_post.noOfLikes = found_post.noOfLikes - 1;
                                }
                            }
                            //
                            var to2 = found_user.posts_idisliked.length;

                            var already = false;
                            for (var i = 0; i < to2; i++) {
                                if (found_user.posts_idisliked[i] == postId) {
                                    ///////////////////////////
                                    already = true;

                                }
                            }
                            if (!already) {
                                //add to post_i_liked
                                found_user.posts_idisliked.push(postId);
                                found_post.noOfDislikes = found_post.noOfDislikes + 1;

                                found_post.save();////////////////////////////////////
                                console.log(found_user)
                                found_user.save()
                                res.json({ done: true })
                            }
                            else {
                                //exit
                                res.json({ done: true })
                            }
                        }
                    }
                }
                )
                console.log(req.body.likeNo, ' ', req.body.dislikeNo);
            }
        })
})
//////////////////////////////////////////////Listening
app.listen(5000, function () {
    console.log("Server is running....");
})
