//Agregar comando "snapshot" que del lado del controlador 
// ejecute un comando o código tal que se saque una foto con la webcam 
// y la envíe al bot
//TIP: se puede usar el ejemplo de fswebcam  

// Documentación modulo telegraf: https://telegraf.js.org/

// TOKEN=6675328202:AAGt0_HCO2-GXsRayGJSuLhXGI5SqDT_Wto node app.mjs

import "dotenv/config";
import {Telegraf} from 'telegraf'
import {exec} from 'child_process'

console.log('Token: '+process.env.TOKEN)

const bot = new Telegraf(process.env.TOKEN)

bot.command('start', ctx => {
    console.log(ctx.from)
    bot.telegram.sendMessage(ctx.chat.id,"Hola, los comandos disponibles son: /fotos\n/snapshot")
})

bot.command('fotos', ctx => {
    console.log(ctx.from)
    const message='Seleccione la imagen'
    bot.telegram.sendMessage(ctx.chat.id, message, {
    reply_markup: {
        inline_keyboard: [[
            {
                text: "linux",
                callback_data: 'linux'
            },
            {
                text: "nodejs",
                callback_data: 'nodejs'
            }
        ]]
    }    
    })
})

bot.action('linux', ctx=>{
    bot.telegram.sendPhoto(ctx.chat.id, {
        source: "images/linux.jpg"
    })
})
bot.action('nodejs', ctx=>{
    bot.telegram.sendPhoto(ctx.chat.id, {
        source: "images/nodejs.jpg"
    })
})

bot.command("snapshot", async (ctx) => {
    try {
      await takePhoto();
      await ctx.replyWithPhoto({ source: "./images/foto.jpg" });
    } catch (error) {
      console.error(`Error: ${error.message}`);
      ctx.reply("Error al tomar la foto.");
    }
  });
  
  async function takePhoto() {
    return new Promise((resolve, reject) => {
      exec("fswebcam -r 640x480 ./images/foto.jpg", (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

bot.launch()