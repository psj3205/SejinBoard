exports.indexOf = (arr, obj) => {
  let index = -1;
  const keys = Object.keys(obj);

  const result = arr.filter((doc, idx) => {
    let = matched = 0;

    for (let i = keys.length - 1; i >= 0; i--) {
      if (doc[keys[i]] === obj[keys[i]]) {
        matched++;

        if (matched === keys.length) {
          index = idx;
          return idx;
        }
      }
    }
  });
  return index;
};

exports.isLoggedin = function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  }
  else {
    req.flash("errors", { login: "Please login first" });
    res.redirect("/login");
  }
};