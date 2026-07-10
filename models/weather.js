const mongoose = require('mongoose');

// Определение схемы погоды
const WeatherSchema = new mongoose.Schema(
  {
    temperature: {
      type: Number,
      required: [true, 'Пожалуйста, укажите температуру'],
    },
    city: {
      type: String,
      required: [true, 'Пожалуйста, укажите город'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Пожалуйста, укажите дату'],
    },
  },
  {
    // Автоматически добавляет поля createdAt и updatedAt
    timestamps: true,
  }
);

// ВАЖНО ДЛЯ VERCEL: Проверяем, существует ли уже модель в кэше mongoose.
// В бессерверной среде файлы могут импортироваться повторно,
// и без этой проверки возникнет ошибка "OverwriteModelError".
module.exports = mongoose.models.Weather || mongoose.model('Weather', WeatherSchema);
