import app from "./app.js";
import connectToDataBase from "./config/database.js";

connectToDataBase();


app.listen(process.env.PORT, () => {
    console.log(`Server is working on port ${process.env.PORT}`);
});
