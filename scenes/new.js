const {Scenes, Markup, session} = require('telegraf');

const tool = new Scenes.WizardScene(
    'new-tool',
    async (ctx) => {
      await ctx.reply('Enter name')
      return ctx.wizard.next()
    },
    async (ctx) => {
      await ctx.reply('Enter location')
      return ctx.wizard.next()
    },
    async (ctx) => {
      await ctx.reply('Done')
      return await ctx.scene.leave()
    }
  )

  const location = new Scenes.WizardScene(
    'new-location',
    async (ctx) => {
      await ctx.reply('Enter name')
      return ctx.wizard.next()
    },
    async (ctx) => {
      await ctx.reply('Enter manager')
      return ctx.wizard.next()
    },
    async (ctx) => {
      await ctx.reply('Done')
      return await ctx.scene.leave()
    }
  )


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

  module.exports.tool = tool;
  module.exports.location = location;