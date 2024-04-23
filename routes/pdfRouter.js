const express = require('express');
const router = express.Router();
const { pdfDownload130, pdfDownload130a, pdfDownload131, pdfDownload485, pdfDownload765, pdfDownload864, pdfDownload1145 } = require('../controllers/pdfDownload')

router.get('/download/130/:user_id', pdfDownload130);
router.get('/download/130a/:user_id', pdfDownload130a);
router.get('/download/131/:user_id', pdfDownload131);
router.get('/download/485/:user_id', pdfDownload485);
router.get('/download/765/:user_id', pdfDownload765);
router.get('/download/864/:user_id', pdfDownload864);
router.get('/download/1145/:user_id', pdfDownload1145);

module.exports = router;