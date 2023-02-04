const invalidEndpointError = (req, res) => {
  res.status(404).send({ msg: "Not Found" });
};

const customErrorHandling = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

const psqlErrorHandling = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23505") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
};

const serverErrorHandling = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
};

module.exports = {
  customErrorHandling,
  invalidEndpointError,
  psqlErrorHandling,
  serverErrorHandling,
};
