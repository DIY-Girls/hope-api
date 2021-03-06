const router = require('express').Router();
const userController = require('./controllers/user.controller');
const authController = require('./controllers/auth.controller');

router.get('/', function(req, res, next) {
    res.json({
        status: 'API is working',
        message: 'Welcome to the API'
    });
});

// User routes
router.route('/users')
      .get(userController.index)
      .post(userController.create);
      
router.route('/users/add_contact')
      .post(userController.addContact);
      
router.route('/users/delete_contact')
      .post(userController.deleteContact);

router.route('/users/:user_id')
      .get(userController.view)
      .post(userController.update)
      .patch(userController.update)
      .put(userController.update)
      .delete(userController.deleteUser);


router.route('/auth/login')
      .post(authController.login);

module.exports = router;