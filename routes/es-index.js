/**
 * Created by baidu on 2016/11/30.
 */
var express = require('express');
var elasticsearch = require('elasticsearch');
var router = express.Router();

var pageObj =  {
    client: new elasticsearch.Client({
        host: 'http://cp01-aijia-4.epc.baidu.com:8500',
        log: 'trace'
    }),
    hits:'',
    testConnection : function () {
        this.client.ping({
            requestTimeout: 30000,

            // undocumented params are appended to the query string
            hello: "elasticsearch"
        }, function (error) {
            if (error) {
                console.error('elasticsearch cluster is down!');
                return false;
            } else {
                console.log('All is well');
            }
        });
        return true;
    },
    searchAll : function () {
        if(this.testConnection()){
            this.client.search({
                index:'zfd',
                type:'rd',
                body:{query:{match_all:{}}}
                //q: '_search'
            }).then(function (body) {
                pageObj.hits='';
                pageObj.hits = body.hits.hits;
                console.log(pageObj.hits);
            }, function (error) {
                console.trace(error.message);
            });
        }
    }
};

/* GET es-index page. */
router.get('/', function(req, res, next) {
    pageObj.searchAll();
    res.render('es-index', { data: JSON.stringify(pageObj.hits) });
});

module.exports = router;