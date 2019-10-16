exports.indexOf = (arr, obj) => {
  let index = -1;
  const keys = Object.keys(obj);
  // console.log("arr", arr);
  // console.log("keys", keys);
  const result = arr.filter((doc, idx) => {
    let matched = 0;

    for (let i = keys.length - 1; i >= 0; i--) {
      console.log("doc[keys[i]]", doc[keys[i]].toString(), typeof(doc[keys[i]].toString()));
      console.log("obj[keys[i]]", obj[keys[i]], typeof(obj[keys[i]]));
      if (doc[keys[i]].toString() === obj[keys[i]]) {
        matched++;
        console.log("matched 들어오나???");
      }
    }
    if (matched === keys.length) {
      index = idx;
      // return idx;
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
    req.session.returnTo = req.path;
    // console.log("********", req.session.returnTo);
    res.redirect("/login");
  }
};