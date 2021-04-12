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

  module.exports.tool = tool;
  module.exports.location = location;