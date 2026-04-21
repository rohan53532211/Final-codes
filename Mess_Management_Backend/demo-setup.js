const { Menu, ExtraItem, SpecialItem, Config } = require('./src/models/Index');
const sequelize = require('./src/config/db');

async function populateDemoData() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    // 1. Clear existing data (Optional - use with caution)
    // await Menu.destroy({ where: {} });
    // await ExtraItem.destroy({ where: {} });
    // await SpecialItem.destroy({ where: {} });

    // 2. Set BDMR
    const date = new Date();
    const configKey = `BDMR_${date.getFullYear()}_${date.getMonth() + 1}`;
    await Config.upsert({ key: configKey, value: '70.00' });
    console.log('BDMR set to 70.00');

    // 3. Populate Weekly Menu (Sample for all days)
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    for (const day of days) {
      await Menu.bulkCreate([
        { day, mealType: 'Breakfast', items: ['Aloo Paratha', 'Curd', 'Tea', 'Boiled Egg'] },
        { day, mealType: 'Lunch', items: ['Rice', 'Dal Tadka', 'Seasonal Veg', 'Salad', 'Roti'] },
        { day, mealType: 'Dinner', items: ['Jeera Rice', 'Matar Paneer', 'Roti', 'Gulab Jamun'] },
      ]);
    }
    console.log('Weekly Menu populated.');

    // 4. Populate Extra Items
    await ExtraItem.bulkCreate([
      { name: 'Cold Coffee', price: 35.00, mealType: 'All', stockQuantity: 50, isAvailable: true },
      { name: 'Chicken Biryani (Extra)', price: 120.00, mealType: 'Dinner', stockQuantity: 20, isAvailable: true },
      { name: 'Fruit Salad', price: 30.00, mealType: 'Breakfast', stockQuantity: 30, isAvailable: true },
      { name: 'Omelette', price: 20.00, mealType: 'Breakfast', stockQuantity: 100, isAvailable: true },
    ]);
    console.log('Extra Items populated.');

    // 5. Populate Special Items for Pre-booking
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    await SpecialItem.create({
      name: 'Special Mutton Curry',
      price: 250.00,
      meal: 'dinner',
      date: dateStr
    });
    console.log('Special Item for pre-booking created for tomorrow.');

    process.exit(0);
  } catch (error) {
    console.error('Error populating demo data:', error);
    process.exit(1);
  }
}

populateDemoData();
