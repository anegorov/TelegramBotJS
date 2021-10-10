const {Telegraf, Composer, Scenes, Markup, session} = require('telegraf');
const toolScenes = require('./scenes/tool');
const locationScenes = require('./scenes/location');

const token = process.env.BOT_TOKEN
if (token === undefined) {
  throw new Error('BOT_TOKEN must be provided!')
}

const bot = new Telegraf(token)

const stage = new Scenes.Stage([toolScenes.create, toolScenes.find, toolScenes.findById, locationScenes.create, locationScenes.find], {
  ttl: 10,
})

bot.use(session())
bot.use(stage.middleware())
bot.use((ctx, next) => {
  ctx.myContextProp = ''
  ctx.scene.session.mySceneSessionProp = 0
  return next()
})

bot.command('create', (ctx) =>
  ctx.reply('Что хочешь создать?', Markup
    .keyboard([
      ['☸ Location', '☸ Tool'] 
    ])
    .oneTime()
    .resize()
  )
)

bot.command('find', (ctx) =>
  ctx.reply('Что хочешь найти?', Markup
    .keyboard([
      ['🔍 Location', '🔍 Tool'],
      ['🔍 Location by ID', '🔍 Tool by ID'] 
    ])
    .oneTime()
    .resize()
  )
)

bot.command('caption', (ctx) => ctx.replyWithPhoto(
  'https://picsum.photos/200/300/?random',
  { caption: 'Caption *text*', parse_mode: 'Markdown' }
))

bot.hears('☸ Location', ctx => ctx.scene.enter('create-location'))
bot.hears('☸ Tool', ctx => ctx.scene.enter('create-tool'))
bot.hears('🔍 Location', ctx => ctx.scene.enter('find-location'))
bot.hears('🔍 Tool', ctx => ctx.scene.enter('find-tool'))
bot.hears('🔍 Tool by ID', ctx => ctx.scene.enter('find-tool-id'))

bot.on('message', (ctx) => {
  ctx.reply('Try /find or /create')
});

bot.launch()

console.log('Bot is started!')