const {Telegraf, Composer, Markup} = require('telegraf');
const firebase = require("firebase/app");
const environment = require("./environment");
require("firebase/firestore");
require('firebase/auth');
require('firebase/database');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN)

const keyboard = Markup.inlineKeyboard([
    // Markup.button.url('❤️', 'http://telegraf.js.org'),
    Markup.button.callback('User', 'user'),
    Markup.button.callback('Location', 'location'),
    Markup.button.callback('Tool', 'tool')
])

firebase.initializeApp(environment.firebaseConfig);

bot.start((ctx) => ctx.reply(`Привет ${ctx.message.from.first_name}!`));

bot.help((ctx) => ctx.reply('Send me a sticker'));


const randomPhoto = 'https://picsum.photos/200/300/?random'
bot.command('cat', (ctx) => ctx.replyWithPhoto(randomPhoto));

bot.command('new', (ctx) => ctx.telegram.sendMessage(ctx.message.chat.id, `${ctx.message.from.first_name}, what exactly do you want to create?`, keyboard));

bot.command('answer', (ctx) => {
    console.log(ctx.message)
    return ctx.replyWithMarkdownV2('*42*')
})

bot.on('text', async (ctx) => {
    const text = ctx.message.text.toLowerCase();
    console.log(text);
    if(text.includes('users') && text.includes(' ')) {
        console.log('Works!');
        ctx.reply('Works!');
    }
    // try{
    //     data = await api.getReportsByCountries(ctx.message.text);
    //     ctx.reply(data);
    // }catch{
    //     console.log('Error - reply');
    //     ctx.reply('There is no such country!');
    // }
});


// bot.hears('user', async (ctx) => {
//     const userRef = await firebase.database().ref('/users/' + 'iOADbMaCMbfZfxqUkkFmK9WHpnk2');
//     userRef.on('value', (snapshot) => {
//         console.log(snapshot.val());
//         ctx.reply(snapshot.val());
//       });
// });
// bot.hears('users', async (ctx) => {
//     const userRef = await firebase.database().ref('/users/');
//     userRef.on('value', (snapshot) => {
//         console.log(snapshot.val());
//         ctx.reply(snapshot.val());
//       });
// });

bot.on('callback_query', (ctx) => {
  console.log('Cb - ' + ctx.callbackQuery.id);
  console.log('Cb - ' + ctx.callbackQuery.message.text);
  console.log('Cb - ' + ctx.callbackQuery.data);
  ctx.telegram.answerCbQuery(ctx.callbackQuery.id)

})

bot.on('inline_query', (ctx) => {
  console.log('Inline query - - ' + ctx.inlineQuery.id);
  const result = []
  // Explicit usage
  ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result)

})

bot.launch();
console.log('Bot is started!');

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))