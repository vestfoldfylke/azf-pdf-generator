module.exports = (data, status = 200) => {
  return {
    status,
    headers: {
      "Content-Type": "application/json"
    },
    jsonBody: {
      data,
      count: data.length
    }
  }
}
