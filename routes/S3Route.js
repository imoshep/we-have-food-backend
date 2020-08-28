const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddle");
const aws = 'aws-sdk'
aws.config.region ="eu-central-1";
const S3_BUCKET = process.env.S3_BUCKET_NAME;

// router.get("/website/images/deault-food-image.jpeg", async (req, res) => {

// });

router.get("/", auth, (req, res) => {
    const s3 = new aws.S3();
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Expires: 60, 
        ContentType: fileType,
        ACL: "public-read"
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if(err) {
            console.log(err);
            return res.status(500).send(err);
        }
        const returnData = {
            signedRequest: data,
            url: `http://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
        };
        res.write(JSON.stringify(returnData));
        res.end();
    })
});

module.exports = router;