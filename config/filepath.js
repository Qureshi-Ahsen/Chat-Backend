const aws = require('aws-sdk');

const s3 = new aws.S3({
    httpOptions: {
      timeout: 30000, 
    },
  });
const bucketName = 'cyclic-alive-pig-poncho-ap-northeast-1';

const generatePresignedUrl = (key) => {
  const params = {
    Bucket: bucketName,
    Key: key,
    Expires: 3600, 
  };
  console.log('Pre-signed URL for accessing the file:');
  return s3.getSignedUrl('getObject', params);

};
module.exports=generatePresignedUrl

