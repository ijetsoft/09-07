const mongoose = require('mongoose');

// Определение схемы пользователя
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Пожалуйста, укажите имя'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Пожалуйста, укажите email'],
      unique: true, // Гарантирует уникальность в базе данных
      lowercase: true, // Автоматически переводит в нижний регистр
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Пожалуйста, укажите пароль'],
      minlength: [6, 'Пароль должен быть не менее 6 символов'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'], // Разрешенные роли
      default: 'user',
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
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);