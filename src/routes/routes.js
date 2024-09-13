const express = require("express");
const router = express.Router();

//controllers
const orderCtrl = require("../controllers/orderCtrl");
const menuCtrl = require("../controllers/menuCtrl");
const categryCtrl = require("../controllers/categoryCtrl");
const userCtrl = require("../controllers/userCtrl");
const cartCtrl = require("../controllers/cartCtrl");
const checkoutCtrl = require("../controllers/checkoutCtrl");

//User routes
router.post("/user-register", userCtrl.createUser);
router.put("/loyalty-points/:uuid/:points", userCtrl.updateUserLoyaltyPoints);
router.get("/loyalty-points/:uuid", userCtrl.getUserLoyaltyPoints);
router.get("/points/:uuid", userCtrl.getUserPoints);
router.get("/user-id/:email", userCtrl.getUserUuid);
router.get("/user-name/:email", userCtrl.getUserName);

//Order routes
router.post("/order-create", orderCtrl.createOrder);
router.post(
  "/order-success/:email/:name/:OrderId/:orderDate/:orderPrice",
  orderCtrl.sendOrderSuccessMail
);
router.post(
  "/order-confirmed/:email/:OrderId/:orderPrice",
  orderCtrl.sendOrderConfirmedMail
);
router.post(
  "/order-deliver/:email/:OrderId/:orderPrice",
  orderCtrl.sendOrderDeliverMail
);
router.get("/orders/:State", orderCtrl.getAllOrders);
router.get("/fast-moving-items/:date", orderCtrl.getFastMovingItems);
router.get("/alltime-popular", orderCtrl.getAllTimePopularItems);
router.get("/orders-by-user/:State/:uid", orderCtrl.getAllOrdersByUser);
router.get("/orderstatus-by-user/:uid", orderCtrl.getAllOrderStatusByUser);
router.put("/order/state-change/:state/:id", orderCtrl.orderStateChange);
router.delete("/order/remove/:id", orderCtrl.orderRemoved);

//Menu routes
router.post("/menuitem/create", menuCtrl.createMenuItem);
router.put("/menuitem/update/:id", menuCtrl.updateMenuItemData);
router.put(
  "/menuitem/availability/update/:id/:availbility",
  menuCtrl.updateMenuItemAvailability
);
router.get("/menu", menuCtrl.getAllMenuItems);
router.get("/fast-move-items/:code", menuCtrl.getFastMovingItems);
router.get(
  "/menu-by-category/:category1/:category2/:category3",
  menuCtrl.getMenuItemsByCategory
);
router.get("/product-by-category/:category", menuCtrl.getProductsByCategory);
router.get("/product-by-search/:name", menuCtrl.getProductsBySearch);
router.delete("/menuitem-remove/:id", menuCtrl.menuItemRemove);

//Category routes
router.post("/category/create", categryCtrl.createCategoryItem);
router.get("/category", categryCtrl.getAllCategoryItems);

//Cart routes
router.get(
  "/cart-item-availability/:userId/:itemId",
  cartCtrl.getCartItemAvailability
);
router.get("/cart-prices/:userId", cartCtrl.getCartPrices);
router.get("/cart-items/:userId", cartCtrl.getCartItems);
router.post("/cart/create", cartCtrl.createCartItem);
router.put("/cart/update/:id/:qnt", cartCtrl.updateCartItem);
router.delete("/cart/delete/:id", cartCtrl.deleteCartItem);
router.delete("/cart/remove/:uuid", cartCtrl.cartClean);

//Checkout routes
router.post("/checkout/create", checkoutCtrl.addCheckoutInfo);

module.exports = router;
