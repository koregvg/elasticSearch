/**
 * Created by wangpai on 2016/11/30.
 */

var express = require('express');
var elasticsearch = require('elasticsearch');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: '首页'});
});

//GET es-index page.
router.get('/es-index', function (req, res, next) {
    res.render('es-index',{title:'日志查询'});
});

router.post('/search', function (req, res) {
    var Dealer = {
        client: new elasticsearch.Client({
            host: 'http://cp01-aijia-4.epc.baidu.com:8500',
            log: 'trace'
        }),
        status: '',
        hits: '',
        searchObj: req.body.unit.queryObj,
        testConnection: function () {

            this.client.ping({
                requestTimeout: 30000,//30秒超时

                // undocumented params are appended to the query string
                hello: "elasticsearch"
            }, function (error) {
                if (error) {
                    console.error('elasticsearch 集群已挂!');
                    return false;
                } else {
                    console.log('连接成功');
                }
            });
            return true;
        },
        searchAll: function (req, res, next) {
            if (this.testConnection()) {
                this.client.search({
                    body: {
                        query: {
                            match: this.searchObj
                        }
                    }
                    //q: '_search'
                }).then(function (body) {
                    Dealer.hits = '';
                    Dealer.hits = body.hits.hits;
                    if (body.hits.total === 0) {
                        res.send(JSON.stringify({status: 1, result: Dealer.hits}));
                    } else {
                        res.send(JSON.stringify({status: 0, result: Dealer.hits}));
                        console.log(Dealer.hits);
                    }
                }, function (error) {
                    console.trace(error.message);
                });
            }
        }
    };
    Dealer.searchAll(req, res);
});

module.exports = router;