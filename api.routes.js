const router = require('express').Router();
const userController = require('./user.controller');
const authController = require('./auth.controller');

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

router.route('/users/:user_id')
      .get(userController.view)
      .post(userController.update)
      .patch(userController.update)
      .put(userController.update)
      .delete(userController.deleteUser);

router.route('/auth/login')
      .post(authController.login);

module.exports = router;