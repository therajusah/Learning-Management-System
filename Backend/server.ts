import app from './app';
import connectToDB from './config/dbConnection';

const PORT = process.env.PORT || 5001;


connectToDB();

app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`);
});
