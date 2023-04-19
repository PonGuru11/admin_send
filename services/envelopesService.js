const axios = require('axios');
const EnvelopeDAO = require('../dao/envelopeDAO');

exports.createEnvelope = async (documentUrl, email, name) => {
  
  const response = await axios.get(documentUrl, { responseType: 'arraybuffer' });
  const documentBase64 = Buffer.from(response.data, 'binary').toString('base64');

  const payload = {
    documents: [
      {
        documentBase64,
        documentId: "1",
        fileExtension: 'pdf',
        name
      }
    ],
    emailSubject: 'Sign the Document',
    recipients: {
      signers: [
        {
          email,
          name,
          recipientId: "1"
        }
      ]
    },
    status: 'created'
  };

  // Send the request to DocuSign API
  const envelopeResponse = await axios.post(
    EnvelopeDAO.getEnvelopeApiUrl(),
    payload,
    { headers: EnvelopeDAO.getEnvelopeApiHeaders() }
  );

  return envelopeResponse.data;
};

