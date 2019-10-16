const playGame = (req, res) => {
  res.render('gamepage.ejs', { user: req.user });
};

module.exports.playGame = playGame;