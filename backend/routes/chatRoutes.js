const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require("../controllers/chatControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);

module.exports = router;//accessing creating chat
//if user is not logged in it cannot access the chat

//router.route('/').post(protect,fetchChats);
//access the chats for that logged in user from mongodb

//router.route('/group').post(protect,createGroupChat);
//router.route('/rename').put(protect,renameGroup); //renaming group, update a particular frequency
//router.route('/removefromgroup').put(protect,removeFromGroup);
//router.route('/addgroup').put(protect,addToGroup);
