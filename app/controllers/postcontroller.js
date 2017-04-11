    var Post = require('../models/parking');

    exports.createPost = function (req, res){

          Post.createPost(req.body, function(err, result){
              if (!err) {
                  //return res.status(200).json(result);
                  return res.status(200).send({status: "true", resultPosting: result});
              } else {
                  //return res.status(401).send(err); // 500 error
                  return res.status(201).send({status: "false"});
              }
          });

    }

    exports.getPostById = function (req, res) {
          //user_id we can replace based one requirement if we want get a single post id then go for _id.
          Post.getPostById({user_id: req.params.id}, function(err, result){

              if (!err) {
                  return res.status(200).json( result);


              } else {
                  return res.status(401).send(err); // 500 error
              }
          });
    }

    /*!** getallpost details . *!*/
    exports.getAllPost = function (req, res) {

          Post.getAllPost({}, function (err, result) {

              if (!err) {

                  return res.status(200).send({status: "true", resultPosting: result});

              } else {
                  console.log(err);

                  return res.status(201).send({status: "false"});
              }
          });
    }

    /*!** updatepost function to get post by id. *!*/
    exports.updatePostById = function (req, res) {

        Post.updatePostById(req.params.id, req.body, function(err, result) {

                if (!err) {
                    return res.status(200).json(result);
                } else {
                    return res.status(201).send(err); // 500 error
                }
            });
    }


    /*!** removeCompany function to get Company by id. *!*/
    exports.removePostById = function (req, res) {

      Post.removePostById({_id: req.params.id}, function(err, result) {

          if (!err) {
              return res.status(200).json(result);
          } else {
              console.log(err);
              return res.status(401).send(err); // 500 error
          }
      });
    }

    /*!** getallCompany details . *!*/
    exports.getAllPostWithUserDetail = function (req, res){
      // Post.find().populate('user_id').exec(function(err, usersDocuments) {
      //     // handle err
      //     // usersDocuments formatted as desired
      //
      //     console.log(res)
      //     // return  usersDocuments;
      //     return  res.status(201).send({
      //         status:200,
      //         result_company: usersDocuments
      //     });
      //
      //
      // });

      Post.getAllPostWithUserDetail({}, function(err, result) {

          if (!err) {
              console.log(result);
              return  res.status(200).send({
                      status:200,
                      result_company: result
              });
              //  return res.json(result);
              } else {
                  console.log(err);
                  return res.send(err); // 500 error
              }
          });
      }


      exports.getPostByFilter = function (req, res) {

            Post.getPostByFilter(req.body, function(result,err ) {

                console.log("fiterssss-->"+req.body.latitude);
                  if (err) {
                      console.log("here is the err:", +err);
                      return res.status(201).send({status: "false"});
                  } else {
                      console.log(result);
                      return res.status(200).send({status: "true", resultPosting: result});
                  }

            });

      }
