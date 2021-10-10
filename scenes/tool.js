const {Scenes, Markup, session} = require('telegraf');
const firebase = require("firebase/app");
const environment = require("../environment");
let Tool = require('../model/Tool')
require("firebase/firestore");
require('firebase/auth');
require('firebase/database');
const {Storage} = require('@google-cloud/storage')
require('dotenv').config();

firebase.initializeApp(environment.firebaseConfig);

const storage = new Storage();
const bucket = storage.bucket('litwinhouse.appspot.com');

const create = new Scenes.WizardScene(
    'create-tool',
    async (ctx) => {
      await ctx.reply('Как называется инструмент?');
      return ctx.wizard.next()
    },
    async (ctx) => {
      ctx.session.toolName = ctx.message.text;
      await ctx.reply('Цена инструмента?')
      return ctx.wizard.next()
    },
    async (ctx) => {
      ctx.session.toolprice = ctx.message.text;
      await ctx.reply('Где находится инструмент?')
      return ctx.wizard.next()
    },
    async (ctx) => {
      ctx.session.toolLocation = ctx.message.text;
      console.log(ctx);
      const toolListRef = await firebase.database().ref('/tools');
      var newToolRef = toolListRef.push();
      let newTool = new Tool('t'+Date.now().toString(), ctx.session.toolName, ctx.session.toolprice, ctx.session.toolLocation);
      newToolRef.set(newTool.json());
      const path = newToolRef.toString();
      await ctx.reply(`Tool is created: ${path}`)
      return await ctx.scene.leave()
    }
)

const find = new Scenes.WizardScene(
  'find-tool',
  async (ctx) => {
    const userRef = await firebase.database().ref('/tools/');
    userRef.on('value', (snapshot) => {
      let ra = [];
      snapshot.forEach(child => {
        let rt = child.val();
        let rk = child.key;
        ra.push(`${rt.id} ${rt.name} ${rt.location}`);
        // ra.push(`ID:*${rk}* ${rt.name} ${rt.location}`);
        // ctx.replyWithMarkdownV2(rm);
        // console.log(child.key);
        // console.log(child.val());
      });
      // ctx.reply(snapshot.key);
      ctx.replyWithMarkdownV2(ra.join('\r\n'));
    });
    return await ctx.scene.leave()
  }
)

const findById = new Scenes.WizardScene(
  'find-tool-id',
  async (ctx) => {
    await ctx.reply('Какой ID у инструмента?')
    return ctx.wizard.next()
  },
  async (ctx) => {
    let rId = ctx.session.id = ctx.message.text;
    const userRef = await firebase.database().ref('/tools/');
    userRef.on('value', (snapshot) => {
      let isSend = false;
      snapshot.forEach(child => {
        let rt = child.val();
        // let rk = child.key;
        if(rt.id === rId) {
          const file = bucket.file('images/hammer-1295018_1280.png');
          console.log(`URL:${file.publicUrl()}`);
          ctx.replyWithPhoto(file.publicUrl());
          ctx.replyWithMarkdownV2(`${rt.id} ${rt.name} ${rt.location} ${rt.price}`); 
          isSend = true;
        }
      });
      if(!isSend) ctx.reply(`Инструмент с ${rId} не найден`);
    });
    return await ctx.scene.leave()
  }
)

module.exports.create = create;
module.exports.find = find;
module.exports.findById = findById;