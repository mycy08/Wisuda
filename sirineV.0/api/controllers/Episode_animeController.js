/**
 * Episode_animeController
 *
 * @description :: Server-side logic for managing episode_animes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var request = require('request')
var cheerio = require('cheerio')
var Promise = require('bluebird')

fs = require('fs'),
    urls = [],
    urls1 = [];
module.exports = {
    add: function (req, res) {
        res.view('admin/addEpisode', {
            layout: false
        })

    },
    updateEpisode: function (req, res) {
        var nativePromise = new Promise(function (resolve, reject) {
        Anime.native(function (err, collection) {
            if (err) return res.serverError(err);

            collection.find({ status: "OnGoing" }, {
                nama_anime: true,
                url_anime_english: true,
                nama_anime: true,
                anime_id: true,
            }).toArray(function (err, results) {
                
                if (err) return res.serverError(err);
                results.forEach(function (anime) {
                    
                    request(anime.url_anime_english, function (err, res, body) {
                        var metadata = []
                        if (!err && res.statusCode == 200) {
                            
                            var $ = cheerio.load(body);
                            $('.infovan').each(function (index) {

                                var url = $(this).attr('href')
                                var episode = $(this).find('.infoept2', '.centerv').text()
                                metadata.push({
                                    id_anime: anime._id,
                                    url: url,
                                    episode: episode
                                })

                            })

                        }
                        // console.log(metadata)
                        return resolve(metadata)
                         
                    })
                        
                    

                })

                return res.ok(results);
            })

        })
    })
    return nativePromise.then(function (itemList) {
        console.log(itemList)
      })
},


    findall: function (req, res) {
        console.log("Inside findall..............");

        return Episode_anime.find().then(function (episode_anime) {
            console.log("animeService.findAll -- anime = " + episode_anime);
            return res.view("admin/listEpisode", {
                status: 'OK',
                title: 'List of anime',
                episode_anime: episode_anime
            });
        }).catch(function (err) {
            console.error("Error on ContactService.findAll");
            console.error(err);
            return res.view('500', { message: "Sorry, an error occurd - " + err });
        });
    },
    delete: function (req, res) {
        Episode_anime.destroy({ id: req.params.id }).exec(function (err) {
            if (err) {
                res.send(500, { error: 'Database error' })
            }
            res.redirect('/episode_anime')
        })
    }
};

