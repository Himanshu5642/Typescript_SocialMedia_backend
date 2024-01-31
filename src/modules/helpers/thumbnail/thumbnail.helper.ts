// import { Request, Response } from 'express';
// const Aws = require('aws-sdk');
// const fs = require('fs');
// const ffmpeg = require('fluent-ffmpeg');
// const path = require('path')
// const ffmpegPath = require('ffmpeg-static');

// Aws.config.update({
//     accessKeyId: process.env.AWS_ACCESS_KEY,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS,
//     region: process.env.AWS_REGION,
// });

// export async function ThumbnailGenerator(videoKey: any, res:Response){
//   try {
//     const s3 = new Aws.S3();
//     const params = {
//       Bucket: 'pigeonchat',
//       Key: videoKey,
//     };
//     //  const params = {
//     //   Bucket: 'pigeonchat',
//     //   Key: "pigeon/1685077834593.mp4",
//     // };

//     const dateRandomValue = new Date().valueOf(); // different value generated each time 

//     // Download the video from S3
//     const videoFile = await s3.getObject(params).promise();
//     const videoPath = path.join(__dirname, `/${dateRandomValue}.mp4`)

//     // buffer to video and saving in videopath
//     fs.writeFileSync(videoPath, videoFile.Body);

//     const thumbnailPath = path.join(__dirname, `/${dateRandomValue}.jpg`); // Specify the desired path for the thumbnail
//     const thumbnailTime = '00:00:05'; 

//     // set the path of ffmpegPath
//     ffmpeg.setFfmpegPath(ffmpegPath);

//     // creating thumbnail 
//     const thumbnailKey: unknown = await new Promise((resolve, reject) => {
//         ffmpeg(videoPath)
//           .setStartTime(thumbnailTime)
//           .outputOptions('-frames:v 1')
//           .output(thumbnailPath)
//           .on('end', async () => {
//             console.log('Thumbnail created successfully!');
//             try {
//               // Read the thumbnail file
//               const thumbnailData = fs.readFileSync(thumbnailPath);
  
//               // Upload the thumbnail to S3
//               const uploadParams = {
//                 Bucket: 'pigeonchat', // Destination S3 bucket
//                 Key: `thumbnails/${dateRandomValue}.jpg`, // Desired key for the uploaded file in the bucket
//                 Body: thumbnailData,
//                 ACL: 'public-read', // Set the appropriate ACL for the uploaded file
//               };
//               const uploadResult = await s3.upload(uploadParams).promise();
//               console.log('Thumbnail uploaded to S3:', uploadResult.Location);
//               resolve(uploadResult.Location); // Resolve with the S3 URL of the uploaded thumbnail
//               return uploadResult.location;
//             } catch (uploadErr) {
//               console.error('Error uploading thumbnail to S3:', uploadErr);
//               reject(uploadErr); // Reject with the error
//             }
//           })
//           .on('error', (err: any) => {
//             console.error('Error creating thumbnail:', err);
//             reject(err); // Reject with the error
//           })
//           .run();
//       });
  
//       console.log('Thumbnail created successfully');
      
//       // deleting file after 5sec
//       setTimeout(() => {
//         fs.unlink(path.join(__dirname, `/${dateRandomValue}.jpg`), (err: any) => {
//           if (err) throw err;
//           console.log('file deleted')
//         })
//         fs.unlink(path.join(__dirname, `/${dateRandomValue}.mp4`), (err: any) => {
//           if (err) throw err;
//           console.log('file deleted')
//         })
//       }, 5000);

//       return thumbnailKey;
//   } catch (err) {
//     console.error('Error:', err);
//   }
// };
