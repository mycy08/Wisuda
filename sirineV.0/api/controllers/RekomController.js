/**
 * RekomController
 *
 * @description :: Server-side logic for managing rekoms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var kMeans = require('kmeans-js');
module.exports = {
    re:function(req,res){
        

    var data = [[1, 2, 3], [2, 7, 1], [69, 10, 25],[0, 1, 3]];

    var km = new kMeans({
        K: 3
    });

    km.cluster(data);
    while (km.step()) {
        km.findClosestCentroids();
        km.moveCentroids();

        console.log(km.centroids);

    if(km.hasConverged()) break;
}

        console.log('Finished in:', km.currentIteration, ' iterations');
        console.log(km.centroids, km.clusters);
    },
    rekomendasi:function(req,res){
        
        var jumlahCluster =3
        var jumlahIterasi =100
        Rekomendasi.native(function(err, collection) {
            if (err) return res.serverError(err);
      
            collection.find({}, {
                id_anime:true,
                nama_anime: true,
                action : true,
                adventure :true,
                comedy :true,
                scifi :true,
                drama :true,
                space :true,
                supernatural : true,
                thriller : true,
                mystery : true,
                seinen : true,
                school : true,
                historical : true,
                echi	 : true,
                sliceoflife	 : true,
                harem	: true,
                pyschological	: true,
                superpower	: true,
                fantasy	: true,
                mecha	: true,
                sports	: true,
                romance	: true,
                shounen	: true,
                horor	: true,
                martialarts	: true,
                magic: true
            }).toArray(function (err, rekomendasi) {
              if (err) return res.serverError(err);
              var jumlahAtribut = rekomendasi.length-2
            })
         function daftarCluser(rekomendasi,jumlahCluster,jumlahAtribut,jumlahIterasi){
            for(var i=0;i<jumlahCluster;i++){
                daftarCluser(i) 
            }
         }
        
        })
    }

    
	
};

