const {Scenes, Markup, session} = require('telegraf');
const firebase = require("firebase/app");
const environment = require("../environment");
require("firebase/firestore");
require('firebase/auth');
require('firebase/database');
require('dotenv').config();

const create = new Scenes.WizardScene(
    'create-location',
    async (ctx) => {
      await ctx.reply('Enter location name')
      return ctx.wizard.next()
    },
    async (ctx) => {
      await ctx.reply('Enter manager')
      return ctx.wizard.next()
    },
    async (ctx) => {
      await ctx.reply('Location is created')
      return await ctx.scene.leave()
    }
)

const find = new Scenes.WizardScene(
  'find-location',
  async (ctx) => {
    const userRef = await firebase.database().ref('/tools/');
    userRef.on('value', (snapshot) => {
        console.log(snapshot.val());
        ctx.reply(snapshot.val());
      });
    return await ctx.scene.leave()
  }
)

module.exports.create = create;
module.exports.find = find;