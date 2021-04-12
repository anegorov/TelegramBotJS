const {Telegraf, Composer, Scenes, Markup, session} = require('telegraf');
require('dotenv').config();
const newScenes = require('./scenes/new');

const token = process.env.BOT_TOKEN
if (token === undefined) {
  throw new Error('BOT_TOKEN must be provided!')
}

// Handler factories
const { enter, leave } = Scenes.Stage

const stepHandler = new Composer()
stepHandler.action('tool', async (ctx) => {

  await ctx.reply('Enter tool name')
  return ctx.wizard.next()
});
stepHandler.action('user', async (ctx) => {
    await ctx.reply('Enter user name')
    return ctx.wizard.next()
});

const wizardNew = new Scenes.WizardScene(
    'new',
    async (ctx) => {
      await ctx.reply(
        'What to create?',
        Markup.inlineKeyboard([
        //   Markup.button.url('❤️', 'http://telegraf.js.org'),
        //   Markup.button.callback('➡️ Next', 'next'),
          Markup.button.callback('Tool','tool'),
          Markup.button.callback('User','user')
        ])
      )
      return ctx.wizard.next()
    },
    stepHandler,
    async (ctx) => {
      await ctx.reply('Step 3')
      return ctx.wizard.next()
    },
    async (ctx) => {
      await ctx.reply('Step 4')
      return ctx.wizard.next()
    },
    async (ctx) => {
      await ctx.reply('Done')
      return await ctx.scene.leave()
    }
  )

// Greeter scene
const greeterScene = new Scenes.BaseScene('greeter');
greeterScene.enter((ctx) => {
    ctx.reply('Enter name').catch((v) => console.log(v));
    superWizard;
});
greeterScene.leave((ctx) => ctx.reply('Bye'));
greeterScene.hears('hi', (ctx) => ctx.reply('Hi'));
greeterScene.command('back', leave());
greeterScene.on('message', (ctx) => ctx.replyWithMarkdown('Send `hi`'));

// Echo scene
const echoScene = new Scenes.BaseScene('echo');
echoScene.enter((ctx) => ctx.reply('echo scene'))
echoScene.leave((ctx) => ctx.reply('exiting echo scene'))
echoScene.command('back', leave())
echoScene.on('text', (ctx) => ctx.reply(ctx.message.text))
echoScene.on('message', (ctx) => ctx.reply('Only text messages please'))

const bot = new Telegraf(token)

const stage = new Scenes.Stage([greeterScene, echoScene, newScenes.tool, newScenes.location], {
  ttl: 10,
})
bot.use(session())
bot.use(stage.middleware())
bot.use((ctx, next) => {
  // we now have access to the the fields defined above
  ctx.myContextProp = ''
  ctx.scene.session.mySceneSessionProp = 0
  return next()
})
bot.command('greeter', (ctx) => ctx.scene.enter('greeter'))
bot.command('echo', (ctx) => ctx.scene.enter('echo'))
bot.command('new', (ctx) => {
  ctx.reply(
    'What to create?',
    Markup.inlineKeyboard([
      Markup.button.callback('Tool','new-tool'),
      Markup.button.callback('Location','new-location')
    ])
  )
});
bot.on('callback_query', (ctx) => {
  console.log('Cb - ' + ctx.callbackQuery.id);
  console.log('Cb - ' + ctx.callbackQuery.message.text);
  console.log('Cb - ' + ctx.callbackQuery.data);
  if(ctx.callbackQuery.data === 'new-tool') ctx.scene.enter('new-tool');
  if(ctx.callbackQuery.data === 'new-location') ctx.scene.enter('new-location');
  ctx.telegram.answerCbQuery(ctx.callbackQuery.id)
});
bot.on('message', (ctx) => ctx.reply('Try /echo or /greeter or /new'))
bot.launch()

console.log('Bot is started!')