// Gerekli modüller
const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors');

// Servis hesabı dosyanı buraya ekle!
const serviceAccount = require('/etc/secrets/serviceAccountKey.json');

// Firebase Admin başlat
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Herkese bildirim gönderme endpoint'i
app.post('/send-notification', async (req, res) => {
  const { title, body } = req.body;

  // 'all' topic'ine gönder (Flutter'da herkes bu topic'e abone oldu)
  const message = {
    notification: {
      title: title || 'Bildirim',
      body: body || 'Mesajınız burada'
    },
    topic: 'all'
  };

  try {
    const response = await admin.messaging().send(message);
    res.json({ success: true, response });
  } catch (error) {
    console.error('FCM Send Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Basit test endpoint'i
app.get('/', (req, res) => {
  res.send('Bildirim API çalışıyor!');
});

// PORT'u dinle
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server çalışıyor. PORT:', PORT);
});
