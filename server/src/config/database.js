import mongoose from "mongoose";

// connexion à mongodb
const connectDB = async () => {
    try {

        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
        console.log(`📂 Base de données: ${conn.connection.name}`);
    } catch (error) {
        console.error(`❌ Erreur de connexion à MongoDB: ${error.message}`);
        process.exit(1);
    }
};

// Gérer les événements de connexion
mongoose.connection.on("connected", () => {
    console.log("🔌 Mongoose connecté à MongoDB");
});

mongoose.connection.on("error", (err) => {
    console.error(`❌ Erreur Mongoose: ${err.message}`);
});

mongoose.connection.on("disconnected", () => {
    console.log("⚠️ Mongoose déconnecté de MongoDB");
});

// Fermer proprement la connexion quand l'app s'arrête
process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("🔒 MongoDB déconnecté à cause de l'arrêt de l'app");
    process.exit(0);
  });
  
export default connectDB;
