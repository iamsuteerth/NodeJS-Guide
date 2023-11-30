const Sequalize = require('sequelize');
const sequalize = require('../util/database');

const CartItem = sequalize.define('cartItems',{
  id: {
    type: Sequalize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity : Sequalize.INTEGER
});

module.exports = CartItem;