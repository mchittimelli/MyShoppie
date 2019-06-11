
var express=require('express');
var app=express();
var mongojs=require('mongojs');

var db=mongojs('users',['users']);
var db1=mongojs('products',['product']);
var db2=mongojs('products',['recommendedItems']);
var db3=mongojs('cartDb',['cartCollection']);

var bodyParser=require('body-parser');

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.get('/ecomController',function(req,res){
	console.log('its a GET request');
	db.users.find(function(err,docs){
		console.log(docs);
		res.json(docs);
	});
	
});

app.post('/ecomSignUpController',function(req,res){
	console.log('i got it signup...');
	console.log(req.body);
	db.users.insert(req.body,function(err,doc){
		res.json(doc);
	});
	
});
app.post('/product',function(req,res){
	console.log('i m from POST');
	console.log(req.body.subcategory);
	db1.product.find({subcategory:req.body.subcategory},function(err,docs){
		console.log(docs);
		res.json(docs);
	});
		
});
app.post('/productDetails',function(req,res){
	console.log('i m from productdetails');
	console.log(req.body.productName);
	db1.product.find({productName:req.body.productName},function(err,docs){
		console.log(docs);
		res.json(docs);
	});
		
});
app.post('/searchItem',function(req,res){
	console.log(req.body.itemName);
	var searchName=req.body.itemName;
	
	db1.product.find({$or:[{category:searchName},{subcategory:searchName},{productName: new RegExp(searchName,"i")}]},function(err,docs){
		console.log(docs);
       var data={
           "results":docs
       };
		res.json(data);

	
});
   });
app.post('/recitems',function(req,res){
	console.log('i m from recommendedPOST');
	console.log(req.body);
	db2.recommendedItems.find(function(err,docs){
		console.log(docs);
		res.json(docs);
	});
		
});


 
 

app.post('/searchproductDetails',function(req,res){
	console.log('i m from searchproductdetails');
	console.log(req.body.productName);
	db1.product.find({productName:req.body.productName},function(err,docs){
		console.log(docs);
		res.json(docs);
	});
		
});
app.post('/checkout',function(req,res){
    console.log('from checkout POST');
    console.log(req.body.prodName);
     console.log(req.body.prodQuantity);
    var userDetails;
    var itemDetails;
    db.users.findOne({name:req.body.user},function(err,doc){
       
        //console.log(doc);
        userDetails=doc;
        //console.log(userDetails);
        db1.product.update({productName:req.body.prodName},{$set:{count:req.body.prodQuantity}});
        db1.product.findOne({productName:req.body.prodName},function(err,doc){
            console.log(doc);
        itemDetails=doc;
        
       // console.log("Hello");
        
        //console.log(itemDetails);
            db3.cartCollection.insert({userDetail:userDetails,itemDetail:itemDetails,quantityOrdered:req.body.prodQuantity,uname:req.body.user},function(err,docs){
           console.log(docs);
                res.json(docs);
        });
       
        });
    });
       
    });

app.post('/account',function(req,res){
    
    console.log('i received account post'); 
    console.log(req.body);
    db3.cartCollection.find({uname:req.body.name},function(err,doc){
        console.log(doc);
        res.json(doc);
    });
});
app.listen(3000);
console.log("i m listening at port 3000");