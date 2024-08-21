const { Telegraf, Scenes, session } = require('telegraf');
const axios = require('axios');

const bot = new Telegraf('7500931643:AAGdf8UD1HdIJDZEh9A5cTBNPQNNrbAVyRc');

// صحنه‌ها برای مدیریت مراحل مختلف جمع‌آوری اطلاعات
const moleculeWizard = new Scenes.WizardScene(
    'molecule-wizard',
    (ctx) => {
        ctx.reply('نام مولکول را وارد کنید:');
        ctx.wizard.state.data = {};  // ایجاد فضای ذخیره برای داده‌ها
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.wizard.state.data.molecule_name = ctx.message.text;
        ctx.reply('تعداد اکسیژن را وارد کنید:');
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.wizard.state.data.oxygen = parseInt(ctx.message.text);
        ctx.reply('تعداد کربن را وارد کنید:');
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.wizard.state.data.carbon = parseInt(ctx.message.text);
        ctx.reply('تعداد نیتروژن را وارد کنید:');
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.wizard.state.data.nitrogen = parseInt(ctx.message.text);
        ctx.reply('تعداد هیدروژن را وارد کنید:');
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.wizard.state.data.hydrogen = parseInt(ctx.message.text);
        ctx.reply('تعداد فسفر را وارد کنید:');
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.wizard.state.data.phosphoruse = parseInt(ctx.message.text);
        ctx.reply('کلید خصوصی را وارد کنید:');
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.wizard.state.data.key = ctx.message.text;
        ctx.reply('مقدار پاداش را وارد کنید:');
        return ctx.wizard.next();
    },
    async (ctx) => {
        ctx.wizard.state.data.reward = parseInt(ctx.message.text);
        ctx.reply('در حال ارسال اطلاعات به سرور...');

        const data = {
            key: ctx.wizard.state.data.key,
            molecule_name: ctx.wizard.state.data.molecule_name,
            needed_atoms: [
                { name: 'oxygen', count: ctx.wizard.state.data.oxygen },
                { name: 'carbon', count: ctx.wizard.state.data.carbon },
                { name: 'nitrogen', count: ctx.wizard.state.data.nitrogen },
                { name: 'hydrogen', count: ctx.wizard.state.data.hydrogen },
                { name: 'phosphoruse', count: ctx.wizard.state.data.phosphoruse }
            ],
            reward: ctx.wizard.state.data.reward
        };

        axios.post('https://srv575377.hstgr.cloud:5000/create-daily-combo', data)
        .then(response => {
            ctx.reply('اطلاعات با موفقیت ارسال شد!');
        })
        .catch(error => {
            ctx.reply('خطایی در ارسال اطلاعات به وجود آمد.');
            console.error(error);
        });

        return ctx.scene.leave();
    }
);

const stage = new Scenes.Stage([moleculeWizard]);

bot.use(session());
bot.use(stage.middleware());

bot.start((ctx) => ctx.scene.enter('molecule-wizard'));

bot.launch();

console.log('Bot is running...');
