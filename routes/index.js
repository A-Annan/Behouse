const express = require('express');
const router = express.Router();
const product = require('../Model/Product');
const images = require('../Model/Images');
const user = require('../Model/User');
const order = require('../Model/order');
const productQte = require('../Model/ProductQte');
const sequelize = require('sequelize');
const multer = require('multer');
const fs = require('fs');
var check_auth = require('../check_auth');


const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        if (!fs.existsSync('uploads/'+req.body.name)){
            fs.mkdirSync('uploads/'+req.body.name);
        } else {
            console.log('product already exist')
        }
        cb(null, 'uploads/'+req.body.name)
    },
    filename: function (req, file, cb) {

        cb(null, req.body.name +'_'+file.originalname)
    }
})

const upload = multer({ storage: storage});

/* GET home page. */
router.post('/product', async (req, res, next) => {
    const prod = req.body;
    const rep_prod = await product.create(prod);


    try {
        await prod.images.map(
            async x => {
                await images.create({url: x, ProductId: rep_prod.getDataValue('id')});
            }
        )
    } catch (err) {
        res.json({
            success: false,
            msg: err
        })
    }
    res.json({
        success: true
    })
});


router.post('/order', async (req, res, next) => {
    const body = req.body;
   try{
       let u = await user.create(body.user);
       let uId = await u.getDataValue('id');
       let c = await order.create({userId: uId});
       let cId =(await c).getDataValue('id');
       c = await order.findByPk(cId);
       u = await  user.findByPk(uId);
       await c.setUser(uId);
       await body.products.map(async x => {
           let p = await product.findByPk(x.product.id)
           let n = await p.addOrders(cId)
           let nId = await n[0].getDataValue('id')
           await productQte.update({
               qte: x.qte
           },{
               where: {
                   id: nId
               }
           })
       })
   }catch (err){
       res.json({success:false})
   }

    res.json({success:true})

});


router.get('/product/:index/:limit', (req, res, next) => {
    console.log(req.params.index)
    product.findAndCountAll({
        include: {model: images, required: false},
        limit: 6,
        offset: req.body.index,
        distinct: true
    }).then(
        (products) => {
            res.json({
                success: true,
                data: products
            })
        }
    ).catch((err) => {
        res.json({success: false, msg: err})
    })
})

router.get('/product_home', (req, res, next) => {
    product.findAndCountAll({include: images, limit: 9}).then(
        (products) => {
            res.json({
                success: true,
                data: products
            })
        }
    ).catch((err) => {
        res.json({success: false, msg: err})
    })
})
//TODO redd check_auth
router.get('/order/:index/:page_size',async (req,res,next)=>{
   try{
       let index = req.params.index;
       let page_size = req.params.page_size;
        index =Number(page_size)*Number(index)

       let orders = await order.findAndCountAll({
           include:[{
               model: user,
               where: {UserId: sequelize.col('User.id')}
           },
               /*  {
                     model: product,
                     as: 'Products'

                 }*/
           ],
           limit: Number(page_size),
           offset: index
       });

       let count_noneConfirmed = await order.findAndCountAll({where: {state: 'none confirmed'}});
       let count_confirmed = await order.findAndCountAll({where: {state: 'confirmed'}});
       let count_enRoute = await order.findAndCountAll({where: {state: 'enRoute'}});
       let count_arrived = await order.findAndCountAll({where: {state: 'arrived'}});
       let count_shipped = await order.findAndCountAll({where: {state: 'shipped'}});

       let count = {
           noneConfirmed: count_noneConfirmed.count,
           confirmed: count_confirmed.count,
           enRoute: count_enRoute.count,
           arrived: count_arrived.count,
           shipped: count_shipped.count
       }
    res.json({success:true,data: orders.rows,numOrder:orders.count, count: count})

   }catch (err){
       console.log(err)
   }





});

router.get('/order/:order_id', async (req,res,next) => {
    let order_id = req.params.order_id;
    order.findByPk(
            order_id
    ,{
        include:[{
            model: user,
            where: {UserId: sequelize.col('User.id')}
        }, {
                  model: product,
                  as: 'Products'
            }
        ]
    }).then( x => {
        res.json({success:true,data: x});
    }).catch(err => {
        res.json({success:false,data: err});
    });
});


router.put('/state/:orderId', async (req,res,next)=>{
    let orderId = req.params.orderId;
    let state = req.body.state;


   await order.update({state: state},{
        where: {id:orderId}
    }).then(x => {
        res.json({success: true, data: x});
    }).catch(err => {
        console.log(err);
        res.json({success: false, msg: err});
    })
})

router.post('/add_product_data',async (req,res ,next) => {
    product.create(req.body.product).then(x =>{
        res.json({success: true, data: x});
    }).catch(err =>{
        res.json({success: false, msg: err});
    })
});


router.put('/add_image/:image_name/:productId', async (req,res,next)=>{

    if (req.params.image_name === 'image'){
        product.update({
                image: req.body.image
        }, {where:{id: req.params.productId}}).then(x =>{
            res.json({success: true, data: x});
        }).catch(err =>{
            console.log(err)
            res.json({success: false, msg: err});
        })
    }
    if (req.params.image_name === 'hover'){
        product.update({
            hover_image: req.body.image
        }, {where:{id: req.params.productId}}).then(x =>{
            res.json({success: true, data: x});
        }).catch(err =>{
            console.log(err)
            res.json({success: false, msg: err});
        })
    }
    if (req.params.image_name === 'cart'){
        product.update({
            cart_image: req.body.image
        }, {where:{id: req.params.productId}}).then(x =>{
            res.json({success: true, data: x});
        }).catch(err =>{
            console.log(err)
            res.json({success: false, msg: err});
        })
    }

});


router.put('/add_images/:productId',async (req,res,next)=>{

    console.log(req.body.image);
});



router.post('/files',check_auth,upload.array('files',7),async (req,res,next) => {

    try{
        const files = req.files;
        // console.log(file.mimetype);


        let prod = {
            designation: req.body.designation,
            description: req.body.description,
            name: req.body.name,
            price: req.body.price,
            image: req.files[0].path,
            home_image: req.files[0].path,
            hover_image: req.files[1].path,
            cart_image: req.files[2].path,
            ratings: 4,
            category: "cat-1",
        }



        let newProd = await product.create(prod);
        await newProd.addImages((await images.create({url: req.files[3].path})).getDataValue('id'));
        await newProd.addImages((await images.create({url: req.files[4].path})).getDataValue('id'));
        await newProd.addImages((await images.create({url: req.files[5].path})).getDataValue('id'));
        await newProd.addImages((await images.create({url: req.files[6].path})).getDataValue('id'));
    } catch (err){
        res.json({success: false,msg:err})
    }

    res.json({success:true})

})

router.delete('/product/:prodId',(req,res,next)=>{
    product.destroy({where:{id: req.params.prodId}}).then(()=>{
        res.json({success: true,msg: 'product deleted'})
    })
})





module.exports = router;
