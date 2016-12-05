/**
 * Created by wangpai on 2016/11/30.
 */

var express = require('express');
var elasticsearch = require('elasticsearch');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

 //GET es-index page.
router.get('/es-index', function(req, res, next) {
  res.render('es-index',{data:''});
});

router.post('/search',function(req,res){
  var Dealer =  {
    client: new elasticsearch.Client({
      host: 'http://cp01-aijia-4.epc.baidu.com:8500',
      log: 'trace'
    }),
    hits:'',
    searchObj:{
      index:req.body.unit.productLine,
      type:req.body.unit.type,
      start_time:req.body.unit.start_time,
      start_time:req.body.unit.end_time
    },
    testConnection : function () {

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
    searchAll : function (req,res,next) {
      if(this.testConnection()){
        this.client.search({
          index:this.searchObj.index,
          type:this.searchObj.type,
          body:{query:{match_all:{}}}
          //q: '_search'
        }).then(function (body) {
          Dealer.hits='';
          Dealer.hits = body.hits.hits;
          res.send(JSON.stringify({status:0,result:Dealer.hits}));
          console.log(Dealer.hits);
        }, function (error) {
          console.trace(error.message);
        });
      }
    }
  };
  Dealer.searchAll(req,res);
});

module.exports = router;