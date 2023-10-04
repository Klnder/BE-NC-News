const app = require("./server");
const { port: PORT = 3000 } = process.env;

//listening
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
