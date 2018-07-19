/**
 * RatingController
 *
 * @description :: Server-side logic for managing ratings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	add:function(req,res){
        res.view('admin/addRating')
    },
    tambahRating:function(req,res){
       
        Rating.findOne({id_anime:req.param('id_anime')}).where({id_user:req.param('id_user')}).exec(function(err,rating){
            if (err) {
                return res.serverError(err);
            }
            else{
                if(!rating){
                    var ratingObj={
                        owner_anime:req.param('id_anime'),
                        owner_user:req.param('id_user'),
                        id_anime : req.param('id_anime'),
                        id_user : req.param('id_user'),
                        score:req.param('score'),
                        review:req.param('review')
                    }
                  Rating.create(ratingObj,function(err,ratings){
                    if(err){
                      var failedRating = [
                        'Ada Kesalahan pada Server'
                      ]
                      req.session.flash = {
                        err: failedRating
                      }
                    } 
                    else{
                      var successRating = [
                        'Review telah berhasil diberikan'
                      ]
                      req.session.flash = {
                        err: successRating
                      }
                      
                      res.redirect('/detail-anime/'+req.param('id_anime'));
                      return
                    }
                  })
                }
                else{
                  Rating.update({
                    id_anime :req.param('id_anime'),
                    id_user :req.param('id_user')
                  },{
                    score:req.param('score'),
                    review:req.param('review')
                  }).exec(function(err,ratings){
                    var updateRating = [
                      'Review Anime sudah berhasil diubah'
                    ]
                    req.session.flash = {
                      err: updateRating
                    }
                    res.redirect('/detail-anime/'+req.param('id_anime'));
                    return
                  })
                  
                }
            }
        })
    },
    findall: function (req, res) {
        console.log("Inside findall..............");

        return Rating.find().then(function (rating) {
            console.log("animeService.findAll -- anime = " + rating);
            return res.view("admin/listEpisode", {
                status: 'OK',
                title: 'List of anime',
                rating: rating
            });
        }).catch(function (err) {
            console.error("Error on ContactService.findAll");
            console.error(err);
            return res.view('500', {message: "Sorry, an error occurd - " + err});
        });
    },
};

