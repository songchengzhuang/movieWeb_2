/**
 * Created by Administrator on 2017/3/5.
 * 伪造模板数据跑通前后端交互流程
 */

 var express=require('express');
 var path=require('path');  //设置路径
 var mongoose=require('mongoose');

 var _=require('underscore');
 var Movie=require('./models/movie');
 var bodyParser = require('body-parser');
 var port = process.env.PORT||3000  //设置端口3000（默认），和外围所传递的参数
 var app=express();  //启动一个服务器

 mongoose.connect('mongodb://localhost/imooc');


 app.set('views','./views/pages')  //设置视图的默认目录
 app.set('view engine','jade')  //设置默认的模板引擎
 // app.use(express.bodyParser())
 app.use(bodyParser.urlencoded({extended: true}))//将表单数据 编码解析
 app.use(bodyParser.json());
 app.use(express.static(path.join(__dirname+'/public')))//设置静态资源的默认位置
 app.locals.moment=require('moment');
 app.listen(port)    //监听端口

 console.log('imooc已经成功启动port端口：'+port)  //在浏览器控制台可以看到

//路由的编写

//首页index
app.get('/',function (req,res) {        //路由以“/”分割
    Movie.fetch(function (err,movies) {
        if(err){
            console.log(err)
        }
        res.render('index',{    //返回首页
            title:'imooc 首页',    //传递参数，替代占位符
            movies:movies
        })
    })
})

//详情页detail
app.get('/movie/:id',function (req,res) {
    var id=req.params.id;

    Movie.findById(id,function (err,movie) {
        res.render('detail',{    //返回首页
            title:'imooc 详情页'+movie.title, //传递参数，替代占位符
            movie:movie
        })
    })

    })
//后台录入页admin
app.get('/admin/movie',function (req,res) {
    res.render('admin',{    //返回首页,reader 第一个参数传入模板字符串，第二个参数传入变量
        title:'imooc 后台录入页', //传递参数，替代占位符
        movie:{
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster:'',
            flash: '',
            summary: '',
            language: ''
        }
    })
})

//更新页
app.get('/admin/update/:id',function (req,res) {
    var id =req.params.id;
    if(id){
        Movie.findById(id,function (err,movie) {
            res.render('admin',{
                title:'imooc 列表更新页',
                movie:movie
            })
        })
    }
})

//删除页
app.delete('/admin/list',function (req,res) {
    var id =req.query.id;

    if(id){
        Movie.remove({_id:id},function (err,movie) {
            if(err){
                console.log(err);
            }
            else{
                res.json({success:1})
            }
        })
    }
})

//电影数据的存储(数据库)，加入一个路由.以及更新信息
app.post('/admin/movie/new',function (req,res) {
    var id = req.body.movie._id;
    var movieObj=req.body.movie;
    var _movie;

    console.log("********后台录入数据库********" + id);

    if(id!=='undefined'){
        Movie.findById(id,function (err,movie) {
            if(err){
                console.log(err)
            }
            _movie= _.extend(movie,movieObj)
            _movie.save(function (err,movie){
                if(err){
                    console.log(err)
                }

                res.redirect('/movie/'+movie._id)
            })
        })
    }
    else{
        _movie=new Movie({
            doctor:movieObj.doctor,
            title:movieObj.title,
            language:movieObj.language,
            country:movieObj.country,
            summary:movieObj.summary,
            flash:movieObj.flash,
            year:movieObj.year,
            poster:movieObj.poster
        })
        _movie.save(function (err,movie) {
            if(err){
                console.log(err)
            }

            res.redirect('/movie/'+movie._id)
        })
    }
})



//列表页list
app.get('/admin/list',function (req,res) {
    Movie.fetch(function (err,movies) {
        if(err){
            console.log(err)
        }
        res.render('list',{    //返回首页
            title:'imooc 列表页',    //传递参数，替代占位符
            movies:movies
        })
    })
})