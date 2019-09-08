const Product = require('../models/product');


exports.getAddProduct = (req, res, next) => {
        res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing:false
    });
}

exports.postAddProduct = (req, res, next) => {
    console.log(req.body);
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price; 
    const description = req.body.description;
    const product = new Product(
        title,
        price,
        description,
        imageUrl,
        null,
        req.user._id
        );
    product.save()
    .then( result => {
        console.log('Created Product');
        res.redirect('/admin/products');
    })
    .catch( err => {
        console.log(err);
    })
}

exports.getEditProduct = (req, res, next) => {
    // Get edit value from url using key
    const editMode = req.query.edit === "true" ? true : false; 
    if(!editMode) {
        return res.redirect('/');
    }
    const prodId=req.params.productId;
    
    // for getting products related to user only:

    Product.findById(prodId)
    // Product.findByPk(prodId)
    .then(product => {
        console.log(product);
        if(!product){
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing:editMode,
            product
        });
    })
    .catch(err => {
        console.log(err);
    })
      
}

exports.postEditProduct = (req, res, next) => {
    
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = parseFloat(req.body.price);
    const updatedDescription = req.body.description;
    
    const updatedProduct = new Product(updatedTitle,updatedPrice,updatedDescription,updatedImageUrl, prodId);

    console.log("New Product",updatedProduct);
    updatedProduct.save()
    .then(result => {
        console.log("UPDATED");
        res.redirect('/admin/products');
    })
    .catch(err => {
        // will catch error for both promises
        console.log(err);
    })
    
}

exports.getProducts = (req,res,next) => {
    // Get all products
    Product.fetchAll() 
    .then( products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    })
    .catch( err => {
        console.log(err);
    });
}


exports.deleteProduct =(req,res,next)=>{
    const prodId = req.body.productId;

    Product.deleteById(prodId)
    .then(result => {
        console.log("Product Deleted");
        res.redirect('/admin/products');
    })
    .catch(err => {
        console.log(err);
    });
}