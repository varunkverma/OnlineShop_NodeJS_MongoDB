const mongodb = require('mongodb');
const getDb = require('../util/database').getDB;
class User{
    constructor(username,email,cart,id){
        this.name=username;
        this.email=email;
        this.cart=cart; // {items: []}
        this._id=id;
    }

    save(){
        const db =getDb();
        return db.collection('users').insertOne(this); 
    }

    addToCart(product) {
        const cardProductIndex = this.cart.items.findIndex(cp =>{
            return cp.productId.toString() === product._id.toString();
        });

        let newQuantity = 1;

        const updatedCartItems = [...this.cart.items];

        if(cardProductIndex >=0){
            newQuantity = this.cart.items[cardProductIndex].quantity + 1;
            updatedCartItems[cardProductIndex].quantity = newQuantity;
        }
        else{
            updatedCartItems.push({productId: new mongodb.ObjectId(product._id),quantity:newQuantity});
        }

        const updatedCart = { items: updatedCartItems};
        const db = getDb();
        return db.collection('users').updateOne(
            {_id : new mongodb.ObjectId(this._id)},
            { $set : {cart:updatedCart}}
        );

    }

    getCart(){
        const db = getDb();

        const productIds = this.cart.items.map( item => item.productId);

        return db.collection('products').find({ _id:{ $in : productIds }})
        .toArray()
        .then( products => {
            
            return products.map( prod => {
                return {
                    ...prod,
                    quantity: this.cart.items.find( p => {
                        return p.productId.toString() === prod._id.toString()
                    }).quantity
                }
            })
        })
        .catch(err => console.log(err));
    }

    deleteItemFromCart(productId){
        const updatedCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString()
        });
        const db=getDb();
        return db.collection('users').
        updateOne({ _id: new mongodb.ObjectId(this._id)},{ $set : {cart:{items:updatedCartItems}}});
    }

    addOrder(){
        const db=getDb();
        return this.getCart()
        .then((products) =>{
            const order = {
                items: products,
                user:{
                    _id : mongodb.ObjectId(this._id),
                    name:this.name
                }
            };
            return db.collection('orders')
            .insertOne(order);
        })        
        .then(result => {
            this.cart = { items:[] };
            return db.collection('users')
            .updateOne(
                { _id: new mongodb.ObjectId(this._id) },
                { $set: { cart : { items: [] } } }
            );
        })
        .catch(err => console.log(err));
    }

    getOrders(){
        const db = getDb();

        return db.collection('orders').find({'user._id':mongodb.ObjectId(this._id)}).toArray();
    }

    static findById(userId){
        const db = getDb();
        return db.collection('users').findOne({_id: new mongodb.ObjectId(userId)});
    }
}

module.exports = User;