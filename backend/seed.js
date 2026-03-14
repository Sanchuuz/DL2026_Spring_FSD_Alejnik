const mongoose = require('mongoose');
const Meme = require('./models/Meme');
require('dotenv').config();

const memes = [
  {
    condition: 'Clear',
    imageUrl:
      'https://avatars.mds.yandex.net/i?id=5ffb777913fffa276736671b8f2e9bcd_l-5259770-images-thumbs&n=13',
    text: 'На улице солнце, локация: %CITY%. Наконец-то можно выйти из библиотеки БГУИР!',
  },
  {
    condition: 'Clouds',
    imageUrl:
      'https://i.kym-cdn.com/entries/icons/original/000/026/489/crying.jpg',
    text: '%CITY%, облачно... Совсем как мой лог ошибок после первой сборки.',
  },
  {
    condition: 'Clouds',
    imageUrl:
      'https://i.pinimg.com/736x/cf/49/bc/cf49bcf1586e19b8bf41397dc89a44c4.jpg',
    text: 'Небо над локацией %CITY% — это 50 оттенков серого. Типичный день фронтенд-разработчика.',
  },
  {
    condition: 'Rain',
    imageUrl:
      'https://masterpiecer-images.s3.yandex.net/6f8752df60bb11ee863eceda526c50ab:upscaled',
    text: 'Дождь в %CITY%? Идеальная погода, чтобы заварить кофе и дебажить до утра.',
  },
  {
    condition: 'Snow',
    imageUrl:
      'https://avatars.mds.yandex.net/i?id=ad7ce16684519d735bb43270a402b97c_l-10639058-images-thumbs&n=13',
    text: 'Winter is coming... %CITY% засыпает снегом, а я засыпаю над кодом.',
  },
  {
    condition: 'Thunderstorm',
    imageUrl: 'https://i.imgflip.com/4/3si4.jpg',
    text: 'Гроза в %CITY%! Кажется, Тор недоволен твоим последним коммитом.',
  },
  {
    condition: 'Mist',
    imageUrl: 'https://i.ytimg.com/vi/_AN2U1gFRJg/maxresdefault.jpg',
    text: 'Туман: %CITY%. Ничего не видно, прямо как в логике моего последнего метода.',
  },
  {
    condition: 'Default',
    imageUrl:
      'https://static.wikia.nocookie.net/anti-screamers/images/5/50/Mister-iskljuchitelnyj-v-realnosti.jpg/revision/latest?cb=20220117081721&path-prefix=ru',
    text: 'Погода в %CITY% такая странная, что даже у меня нет на неё мема!',
  },
];

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/weather-mood')
  .then(async () => {
    await Meme.deleteMany({});
    await Meme.insertMany(memes);
    console.log('База данных успешно наполнена мемами! 🚀');
    process.exit();
  })
  .catch((err) => console.error(err));
