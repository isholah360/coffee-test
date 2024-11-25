const Wishlist = require('../models/wishlistModel');

async function addToWishlist(req, res) {
  const { userId, productId } = req.body;

  try {
  
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      
      wishlist = new Wishlist({ userId, products: [productId] });
    } else {
    
      if (wishlist.products.includes(productId)) {
        return res.status(400).json({ message: 'Product already in wishlist' });
      }
      wishlist.products.push(productId);
    }


    await wishlist.save();
    return res.status(200).json({ message: 'Product added to wishlist', wishlist });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return res.status(500).json({ message: 'Failed to add product to wishlist' });
  }
}

module.exports = { addToWishlist };
