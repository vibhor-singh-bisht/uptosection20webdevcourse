const fs=require('fs');

const path=require('path');
const express =require('express');
const uuid=require('uuid');


const app=express();

//Doing the below code to register view engine , a template engine

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

// app.use(express.json())

app.use(express.static('public'));

app.use(express.urlencoded({extended:false}))
app.get('/',function(req,res){
    // const htmlFilePath=path.join(__dirname,'views','index.html');
    // res.sendFile(htmlFilePath);
    //The above method is redundant as of now implementing below the new method :
    res.render('index');

})
app.get('/restaurants', function(req,res){
    // const htmlFilePath=path.join(__dirname,'views','restaurants.html');
    // res.sendFile(htmlFilePath);
    const filePath=path.join(__dirname,'data','restaurants.json')

    const fileData=fs.readFileSync(filePath);
    const storedRestaurants=JSON.parse(fileData);
    res.render('restaurants', { numberOfRestaurants:storedRestaurants.length,restaurants:storedRestaurants});

})

app.get('/restaurants/:id',function(req,res){
    
    
    const restaurantId=req.params.id;
    const filePath=path.join(__dirname,'data','restaurants.json')

    const fileData=fs.readFileSync(filePath);
    const storedRestaurants=JSON.parse(fileData);

    for(const restaurant of storedRestaurants){
        if(restaurant.id===restaurantId){
            res.render('restaurants-detail',{restaurant : restaurant });
        }
}
    res.render('404')
})

app.post('/recommend',function(req,res){

    const restaurant=req.body;
    restaurant.id =uuid.v4();
    const filePath=path.join(__dirname,'data','restaurants.json')

    const fileData=fs.readFileSync(filePath);
    const storedRestaurants=JSON.parse(fileData);

    storedRestaurants.push(restaurant);

    fs.writeFileSync(filePath, JSON.stringify(storedRestaurants));
    res.redirect('/confirm');

});
app.get('/about', function(req,res){
    // const htmlFilePath=path.join(__dirname,'views','about.html');
    // res.sendFile(htmlFilePath);
    res.render('about');
})
app.get('/confirm', function(req,res){
    // const htmlFilePath=path.join(__dirname,'views','confirm.html');
    // res.sendFile(htmlFilePath);
    res.render('confirm');
})
app.get('/recommend', function(req,res){
    // const htmlFilePath=path.join(__dirname,'views','recommend.html');
    // res.sendFile(htmlFilePath);
    res.render('recommend');
})
app.use(function(req,res){
    res.render('404');
})
app.use(function(error,req,res,next){
    res.render('500')
})
app.listen(3000);