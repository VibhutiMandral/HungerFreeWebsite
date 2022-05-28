const mongoose = require('mongoose');

// for the localhost
// mongoose.connect('mongodb://127.0.0.1:27017/test',{
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });


//for the hosted website
const connectionString = "mongodb+srv://hungerfree:hungerfree4@cluster0.okztt.mongodb.net";
mongoose.connect(connectionString+'/users',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

