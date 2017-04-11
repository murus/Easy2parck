    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var ObjectId = Schema.ObjectId;


    var PostSchema = new mongoose.Schema({



        title: {
            type:String,
            required:true
        },

        user_id: {
          type:Schema.Types.ObjectId,
          ref:'user',
          required: true
        },

        address: {
          type:String,
          required:true
        },

        location: {
          type: [Number],
          required: true
        }, // [Long, Lat]

        images: {
          type:String,
          required:false
        },

        description: {
          type:String,
          required:false
        },

        price: {
          type:String,
          required:true
        },

        userRatting: {
          type:String,
          required:false
        },

        latitude: {
            type:String,
            required:false
        },

        longitude: {
            type:String,
            required:false
        },

        /*trk :  {
           "lat": 50.3293714,
           "lng": 6.9389939
        } //inserted data is the object to be inserted
        */

        timeavAilability: {
          type : Array ,
          "default": []
        },

        facility: {
          type : Array ,
          "default" : []
        },

    }, {
        timestamps: true
    });


    // Indexes this schema in geoJSON format (critical for running proximity searches)
    PostSchema.index({location: '2dsphere'});

    PostSchema.statics = {

      //create a post
      createPost: function(data, callback){
                      var post = new this(data);
                      console.log(data);
                      post.save(callback);
                  },

     // get the post by id
      getPostById: function(query, callback){
                      console.log(query);
                      this.find(query, callback);
                  },

      //get all the post
      getAllPost: function(query, callback){
                      this.find(query, callback);
                  },

      // update the post using post ID
      // this.update(id, {$set: updateData}, callback);
      updatePostById: function(id, updateData, callback) {
                        this.findByIdAndUpdate(id, { $set: updateData}, callback);
                      },


      // delete post by id
      removePostById: function(removeData, callback) {
                        this.remove(removeData, callback);
                      },

      // get all the post details with help of user id
      getAllPostWithUserDetail: function(query, callback) {
                                  this.find().populate('user_id').exec(function(err, usersDocuments) {
                                      // handle err
                                      // usersDocuments formatted as desired
                                      callback(usersDocuments);
                                      });
                                },

      // filter options
      getPostByFilter: function(data, callback) {

                          // Grab all of the query parameters from the body.
                          console.log("muruganfilter"+data.latitude+"long"+ data.longitude+"distance"+data.distance);

                          var lat = data.latitude;
                          var long = data.longitude;
                          var distance = data.distance;
                          var price = data.price;

                          // Opens a generic Mongoose Query. Depending on the post body we will...
                          var query = this.find({});

                          // ...include filter by Max Distance (converting miles to meters)
                          if(distance){
                                // Using MongoDB's geospatial querying features. (Note how coordinates are set [long, lat]
                                query = query.where('location').near({ center: {type: 'Point', coordinates: [long, lat]},

                               // Converting meters to miles. Specifying spherical geometry (for globe)
                                maxDistance: distance * 1609.34, spherical: true});
                          }


                          if(price){
                              query = query.where('price').gte(price);
                          }


    // Execute Query and Return the Query Results
                          query.exec(function(err, users){
                                if(err)
                                //res.send(err);
                                callback(err);
                                else
                                // If no errors, respond with a JSON of all users that meet the criteria
                                //res.json(users);
                                    console.log("I m here!");
                                callback(users);
                          });
                      }

    }


    module.exports = mongoose.model('Post', PostSchema);



    // ...include filter by Gender (all options)
    /* if(male || female || other){
     query.or([{ 'gender': male }, { 'gender': female }, {'gender': other}]);
     }*/

    // ...include filter by Min Age
    /*if(price){
     query = query.where('price').gte(price);
     }*/

    // ...include filter by Max Age
    /* if(maxAge){
     query = query.where('age').lte(maxAge);
     }*/

    // ...include filter by Favorite Language
    /* if(favLang){
     query = query.where('favlang').equals(favLang);
     }*/

    // ...include filter for HTML5 Verified Locations
    /*if(reqVerified){
     query = query.where('htmlverified').equals("Yep (Thanks for giving us real data!)");
     }*/
