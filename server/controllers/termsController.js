const TermsModel = require('../models/termsModel');

exports.checkUserTerms = async (req, res) => {
  try {
    const { id_user } = req.user; 
    const pendingTerm = await TermsModel.findPendingForUser(id_user);

    if (pendingTerm) {
      return res.json({ mustAccept: true, term: pendingTerm });
    }

    res.json({ mustAccept: false });
  } catch (err) {
    res.status(500).json({ error: "Failed to verify compliance status." });
  }
};

exports.acceptTerms = async (req, res) => {
  try {
    const { term_id, opt_in_study } = req.body;
    const { id_user } = req.user;

    await TermsModel.accept(id_user, term_id, opt_in_study);
    res.status(201).json({ message: "Consent log updated." });
  } catch (err) {
    res.status(500).json({ error: "Failed to record term acceptance." });
  }
};