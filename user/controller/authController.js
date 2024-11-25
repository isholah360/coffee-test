const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const connectRabbitMQ = require("../../utils/rabbitmq");



const sendMessageToNotificationQueue = async (msg) => {
  try {
    const { connection, channel } = await connectRabbitMQ(); 

    const queue = "auth_queue"; 
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(msg)); 
    console.log("Notification message sent to queue:", msg);

  
    setTimeout(() => {
      channel.close();
      connection.close();
    }, 500); 
  } catch (err) {
    console.error("Failed to send message to notification queue:", err);
  }
};


const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
   
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
   
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

   
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

  
    const notificationMessage = JSON.stringify({
      event: "user_registered", 
      message: {
        email: newUser.email,
        username: newUser.username,
        message: "New user registered!",
      },
    });

    newUser.password = undefined; 

    
    await sendMessageToNotificationQueue(notificationMessage);

  
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      maxAge: 3600 * 1000, 
      sameSite: "None", 
    });

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    next(error);
  }
};


const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }


    const token = jwt.sign(
      { id: user._id, email: user.email, },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    
    const notificationMessage = JSON.stringify({
      event: "user_logged_in", 
      message: {
        email: user.email,
        username: user.username,
        message: "User logged in successfully!",
      },
    });

 
    res.cookie("token", token, {
      httpOnly: true,
     
      secure: false, 
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000 
    });

    res.json({ message: "Login successful", user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
