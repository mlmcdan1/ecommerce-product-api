const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models/Index');

// get all products
router.get('/', async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [{model: Category,}, {model: Tag }],
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve products', error: err.message});
  }
});

// get product by ID
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, {model: Tag}],
    });

    if (!productData){
      return res.status(404).json({ message: 'No product found with this ID'});
    }

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve product', error: err.message});
  }
});

// Post a new product
router.post('/', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: 'Invalid product data', error: err.message });
  }
});

// PUT update a product
router.put('/:id', async (req, res) => {
  // update product data
  try {
    const updatedProduct = await Product.update(req.body, {
      where: { id: req.params.id},
    });

    if (!updatedProduct[0]) {
      return res.status(404).json({ message: 'No product found with this ID', error: err.message});
    }
    
    res.status(200).json({message: 'Product updated successfully'});
  } catch (err) {
    res.status(400).json({message: 'Failed to update product', error: err.message});
  }
});

// Delete a product
router.delete('/:id',async (req, res) => {
  // delete one product by its `id` value
  try {
    const deletedProduct = await Product.destroy({
      where: {id: req.params.id},
    });

    if (!deletedProduct){
      return res.status(404).json({ message: 'No product found with this ID'});
    }

    res.status(200).json({ message: 'Product deleted successfully'});
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product', error: err.message});
  }
});

module.exports = router;