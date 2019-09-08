const mongodb = require('mongodb');
const getDb = require('../util/database').getDB;

class Product{
    constructor(title, price,description,imageUrl,id,userId){
        this.title=title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id= id ? (new mongodb.ObjectId(id)) : null;
        this.userId = userId;
    }

    save() {
        const db = getDb();
        let dbOp;
        // check if id is not undefined ->  update the product else insert the product
        if(this._id){
            dbOp = db.collection('products')
            .updateOne( { _id:this._id }, { $set : this } );
        }
        else{
            dbOp=db.collection('products').insertOne(this)
        }
        return dbOp
        .then( result => {
            //console.log(result);
        })
        .catch( err => {
            console.log(err);
        });
    }
    static fetchAll(){

        const db = getDb();
        // find returns a cursor
        // toArray should only be used if documents are less
        return db.collection('products').find().toArray()
        .then( products => {
            return products;
        })
        .catch( err =>{
            console.log(err);
        });
    }

    // fetch a singel item
    static findById(prodId){
        const db = getDb();
        return db.collection('products').find({_id: new mongodb.ObjectId(prodId)})
        .next()
        .then( product => {
            return product;
        })
        .catch(err => {
            console.log(err);
        });
    }

    // Delete a single product
    static deleteById(prodId){
        const db = getDb();
        return db.collection('products').deleteOne({_id: new mongodb.ObjectId(prodId)})
        .then( result => {
            console.log("Product Deleted!");
            return;
        })
        .catch(err => {
            console.log(err);
        })
    }
}

module.exports = Product;