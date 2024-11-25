
const app = require('./app');
const Port = process.env.PORT || 5060;

app.get('/api/1', (req, res)=>{
    res.send('payment is running')
})

app.listen(Port, () => {
  console.log(`Payment Service is running on port ${Port}`);
});
