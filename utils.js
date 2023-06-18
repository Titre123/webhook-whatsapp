const jwt = require('jsonwebtoken');
const axios = require('axios');
const generateTokenWithPhoneNumber = (phoneNumber) => {
	return jwt.sign({ phoneNumber }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

async function getUserByPhoneNUmber(phoneNumber) {
  let response;
  const token = generateTokenWithPhoneNumber(phoneNumber);
  try{
    response = await axios.get(`http://localhost:8000/api/users/phone/${phoneNumber}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(response.data);
    return response.data._id;
  } catch (error) {
    console.error('API request failed:', error.message);
    throw error;
  }
}


async function callApi(endpoint, verb, phoneNumber) {
  let response;
  const id = await getUserByPhoneNUmber(phoneNumber);
  const token = generateToken(id);
  try {

    switch (verb) {
      case 'post':
        response = await axios.post(`http://localhost:8000/api/${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        break;
      case 'get':
        response = await axios.get(`http://localhost:8000/api/${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        break;
      case 'put':
        response = await axios.put(`http://localhost:8000/api/${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
    }
    return response.data;
  } catch (error) {
    console.error('API request failed:', error.message);
    throw error;
  }
}

module.exports = {
  callApi
}