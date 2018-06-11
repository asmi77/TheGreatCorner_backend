import { Signale } from "signale";
import figures from "figures";

const auth = {
  scope: "AUTH"
};

const messages = {
  scope: "MESSAGES"
};

const products = {
  scope: "PRODUCTS"
};

const profile = {
  scope: "PROFILE"
};

const users = {
  scope: "USERS"
};

const authTerminal = new Signale(auth);
const messagesTerminal = new Signale(messages);
const productsTerminal = new Signale(products);
const profileTerminal = new Signale(profile);
const usersTerminal = new Signale(users);

const terminal = (module.exports = {
  authTerminal,
  messagesTerminal,
  productsTerminal,
  profileTerminal,
  usersTerminal
});
