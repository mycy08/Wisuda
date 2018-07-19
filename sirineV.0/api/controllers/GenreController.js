/**
 * GenreController
 *
 * @description :: Server-side logic for managing genres
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	add:function(req,res){
        res.view('admin/addGenre')
    },
    tampilGenre:function(req,res){
        Genre.findOne({id:req.param('id')})
            
            .populateAll().exec(function(err,gen){
            if(err){
                return res.serverError(err);
            }
            else{
                gen.animeStrings =[]
                async.each(gen.genres, function (genres, callback) {
                    Anime.findOne({ id: genres.id_anime }).exec(function (err, anime) {
                        if (err) {
                            callback(err)
                        } else {
                            gen.animeStrings.push({
                                id: anime.id,
                                nama_anime: anime.nama_anime,
                                photo_url: anime.photo_url, 
                                deskripsi : anime.deskripsi
                            })
                            callback()
                        }
                    })
                }, function (err) { 
                    
                    if (err)
                        return res.serverError(err);
                    else {
                        if (err)
                                return res.serverError(err);
                            else {
                                
                                Genre.find().exec(function(err,genre){
                                    res.view("user/genre/", {

                                        status: 'OK',
                                        title: 'Genre',
                                        gen:gen,
                                        genre:genre,
                                        
                                    })
                                })
                                
                            }
                    }
                })
            }
        })
    }
};

