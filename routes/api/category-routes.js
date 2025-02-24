const router = require('express').Router();
const { Category, Product } = require('../../models/Index');


// Get all categories
router.get('/', async (req, res) => {
  try {
    const categoryData = await Category.findAll({
      include: [{ model: Product}],
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve categories', error: err.message});
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!categoryData) {
      return res.status(404).json({ message: 'No category found with this ID'});
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve category', error: err.message});
  }
});

// Post a new category
router.post('/', async (req, res) => {
  try {
    const categoryName = req.body.category_name?.trim();

    // Check if category name exists and isn't an empty string
    if (!categoryName) {
      return res.status(400).json({ message: 'Category name is required and cannot be empty' });
    }

    // Create the new category
    const newCategory = await Category.create({
      category_name: categoryName
    });

    console.log('New Category Created:', newCategory); // Debug log

    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: 'Invalid category data', error: err.message });
  }
});


// Put update a category
router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const updatedCategory = await Category.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updatedCategory[0]){ 
      return res.status(404).json({ message: 'No category found with this ID'});
    }

    res.status(200).json({ message: 'Category updated successfully'});
  } catch (err) {
    res.status(400).json({ message: 'Failed to update category', error: err.message });
  }
});
// Delete a category
router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {

    // Delete all products linked to this category
    await Product.destroy({
      where: {category_id: req.params.id},
    });

    // Now delete the category
    const deletedCategory = await Category.destroy({
      where: {id: req.params.id},
    });
    if (!deletedCategory) {
      return res.status(404).json({ message: 'No category found with this ID'});
    }
    
    res.status(200).json({ message: 'Category deleted successfully'});
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete category', error: err.message});
  }
});

module.exports = router;