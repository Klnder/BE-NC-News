const app = require("./server");
const port = 3000;

//listening
app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
