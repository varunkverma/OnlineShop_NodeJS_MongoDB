const Product = require('../models/product');
//const Cart = require('../models/Cart');

exports.getProducts = (req, res, next) => {
    Product.fetchAll().then(products => {
        res.render('shop/product-list',{
            prods:products,
            pageTitle:'All Products',
            path:'/products'
        });
    }).catch(err => {
        console.log(err);
    });
}

exports.getProduct = (req,res,next) => {
    const prodId = req.params.productId;
    // Product.findByPk(prodId)
    // .then(product => {
    //     res.render('shop/product-details',{
    //         product,
    //         pageTitle:product.title,
    //         path:'/products'
    //     });
    // })        
    // .catch( err => { 
    //     console.log(err);
    // })
    Product.findById(prodId)
    .then(product => {
        res.render('shop/product-details',{
            product,
            pageTitle:product.title,
            path:'/products'
        });
    })        
    .catch( err => { 
        console.log(err);
    })

//     // or

//     // Product.findAll( { where: { id:prodId } } )
//     // .then(products => {
//     //     res.render('shop/product-details',{
//     //         product:products[0],
//     //         pageTitle:products[0].title,
//     //         path:'/products'
//     //     });
//     // })
//     // .catch(err => {
//     //     console.log(err);
//     // })

    
 }

exports.getIndex = (req,res,next) => {
    Product.fetchAll().then(products => {
        res.render('shop/index',{
            prods:products,
            pageTitle:'Shop',
            path:'/'
        });
    }).catch(err => {
        console.log(err);
    });
}

exports.getCart = (req,res,next) => {
    req.user.getCart()
    .then( products => {    
        res.render('shop/cart',{
            pageTitle: 'Your Cart',
            path: '/cart',
            products: products
        });
    })
    .catch( err => {
        console.log(err);
    });
    
    
    // Cart.fetchCart((cart) => {
    //     Product.fetchAll(products => {
    //         const cartProducts=[];
    //         for(product of products){

    //             const cartProductData = cart.products.find(prod => prod.id ===product.id);
    //             if(cartProductData){
    //                 cartProducts.push({productData:product, qty:cartProductData.qty});
    //             }
    //         }
            
            // res.render('shop/cart',{
            //     pageTitle: 'Your Cart',
            //     path: '/cart',
            //     products: cartProducts
            // });
    //     })
        
    // })
    
}

exports.postCart = (req,res,next) => {
    
    const prodId = req.body.productId;
    Product.findById(prodId)
    .then( product =>{
        return req.user.addToCart(product);
    })
    .then( result => {
        res.redirect('/cart')
    })
    .catch(err => console.log(err))
    
}    
// }
exports.postCartDelete = (req,res,next) => {
    const prodId = req.body.productId;
    req.user.deleteItemFromCart(prodId)
    .then( () => {
        res.redirect('/cart');
    })
    .catch( err => console.log(err));  
}

exports.getOrders = (req,res,next) => {
    req.user.getOrders()
    .then( orders => {
        res.render('shop/orders',{
            pageTitle: 'Your Orders',
            path: '/orders',
            orders
        });
    })
    .catch(err => console.log(err))
    
}

exports.postOrder = (req,res,next) => {
    let fetchedCart;
    req.user.addOrder()
    .then( result => {
        res.redirect('/orders');
    })
    .catch( err => {
        console.log(err);
    })
}

// exports.getCheckout = (req,res,next) => {
//     res.render('shop/checkout',{
//         pageTitle: 'Checkout',
//         path: '/checkout'
//     });
// }
