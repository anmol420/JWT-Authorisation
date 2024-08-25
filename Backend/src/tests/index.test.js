import axios from "axios";

// dashboard endpoint testing
const dashboard = async (token) => {
    try {
        const response = await axios.get('http://localhost:3000/api/v1/users/dashboard', {
            headers: { Authorization: token }
        });
        console.log("Status Code: ", response.data.statusCode);
        console.log("Message: ", response.data.message);
        console.log(response.data.data.user);
    } catch (error) {
        console.log("Error: ", error);
    }
};
dashboard("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Y2I4OWFkNmNiNGI4ZDIwOTFlNjhiNSIsImlhdCI6MTcyNDYxNTI2NiwiZXhwIjoxNzI1MjIwMDY2fQ.JL0H_v9aTsFFEiucarGfu-igtzfGoBTpXwoQXC5HW7Y");

// register endpoint testing
const details = {
    username: "anand420",
    fullname: "Anmol Anand",
    email: "anand004@gmail.com",
    password: "2004"
};
const register = async (details) => {
    try {
        const response = await axios.post('http://localhost:3000/api/v1/users/register', details);
        console.log("Status Code: ", response.data.statusCode);
        console.log("Message: ", response.data.message);
        console.log(response.data.data);
    } catch (error) {
        console.log(error);
    }
};
register(details);

// login endpoint testing
const loginDetails = {
    username: "anand420",
    password: "2004"
};
const login = async (loginDetails) => {
    try {
        const response = await axios.post('http://localhost:3000/api/v1/users/login', loginDetails);
        console.log("Status Code: ", response.status);
        console.log("Message: ", response.data.message);
        console.log("Token: ", response.data.data.token);
        console.log(response.data.data.user);
    } catch (error) {
        console.log(error);
    }
};
login(loginDetails);

// logout endpoint testing -> Optional