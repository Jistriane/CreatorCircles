
// Script removido: dependência do MongoDB eliminada.
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/creatorcircles_dev';

const purchaseSchema = new mongoose.Schema({
  circleId: String,
  userId: String,
  amount: Number,
  date: { type: Date, default: Date.now }
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

async function seed() {
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await Purchase.deleteMany({});
  await Purchase.create([
    { circleId: 'dvc', userId: 'user123', amount: 10 },
    { circleId: 'dvc', userId: 'user456', amount: 5 }
  ]);
  console.log('Seed de purchases inserido com sucesso!');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Erro ao rodar seed:', err);
  process.exit(1);
});
